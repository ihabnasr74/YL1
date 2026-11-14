import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  lerp,
  computeContinuousFlavorIndex,
  computeHeroProgress,
  computeLogoMorphState,
  getActiveFlavorIndex,
  getActiveScrollSection,
  computeTransitionSmokeIntensity,
  interpolateHexColor,
  computeEnvironmentState,
  computeJarTransform,
  computeTextRevealState,
} from './scrollMath';
import { FLAVORS } from '../data/flavors';

test('FLAVORS strictly alternate between Regular (non-ice) and Ice flavors', () => {
  assert.equal(FLAVORS.length, 7);
  for (let i = 0; i < FLAVORS.length; i++) {
    const expectedIce = i % 2 === 1;
    assert.equal(
      FLAVORS[i].hasIce,
      expectedIce,
      `Flavor at index ${i} (${FLAVORS[i].id}) should have hasIce=${expectedIce}`
    );
  }
});

test('computeContinuousFlavorIndex maps section 0 to Hero (-1) and sections 1..7 to flavors 0..6', () => {
  assert.equal(computeContinuousFlavorIndex(0, 900, 7), -1);
  assert.equal(computeContinuousFlavorIndex(450, 900, 7), -0.5);
  assert.equal(computeContinuousFlavorIndex(900, 900, 7), 0);
  assert.equal(computeContinuousFlavorIndex(1800, 900, 7), 1);
  assert.equal(computeContinuousFlavorIndex(99999, 900, 7), 6);
  assert.equal(computeContinuousFlavorIndex(-200, 900, 7), -1);
});

test('computeHeroProgress, getActiveScrollSection, and computeTransitionSmokeIntensity track stages accurately', () => {
  assert.equal(computeHeroProgress(-1), 0);
  assert.equal(computeHeroProgress(-0.5), 0.5);
  assert.equal(computeHeroProgress(0), 1);
  assert.equal(computeHeroProgress(3), 1);

  assert.equal(getActiveScrollSection(-1, 7), 0);
  assert.equal(getActiveScrollSection(-0.2, 7), 1);
  assert.equal(getActiveScrollSection(0, 7), 1);
  assert.equal(getActiveScrollSection(6, 7), 7);

  assert.equal(getActiveFlavorIndex(-1, 7), 0);
  assert.equal(getActiveFlavorIndex(0.2, 7), 0);
  assert.equal(getActiveFlavorIndex(0.51, 7), 1);
  assert.equal(getActiveFlavorIndex(6.9, 7), 6);

  // Smoke intensity is 0 at Hero (-1), gentle ambient (0.24) when settled on flavor, and 1.0 mid-transition
  assert.equal(computeTransitionSmokeIntensity(-1, 0), 0);
  assert.ok(Math.abs(computeTransitionSmokeIntensity(1, 0) - 0.24) < 0.01);
  assert.equal(computeTransitionSmokeIntensity(1.5, 0), 1);
  assert.equal(computeTransitionSmokeIntensity(2, 1), 1);
});

test('computeLogoMorphState transitions from enlarged center Hero logo to top-center on desktop and mobile with 3D flight', () => {
  const heroDesktop = computeLogoMorphState(0, false);
  assert.equal(heroDesktop.leftPercent, 50);
  assert.ok(heroDesktop.topPercent >= 30 && heroDesktop.topPercent <= 38);
  assert.ok(heroDesktop.scale >= 1.3);

  const midFlightDesktop = computeLogoMorphState(0.5, false);
  assert.ok(Math.abs(midFlightDesktop.rotateY) > 10);
  assert.ok(Math.abs(midFlightDesktop.rotateX) > 5);

  const dockedDesktop = computeLogoMorphState(1, false);
  assert.equal(dockedDesktop.leftPercent, 50);
  assert.ok(dockedDesktop.topPercent < 12);
  assert.ok(dockedDesktop.scale < 0.36);

  const dockedMobile = computeLogoMorphState(1, true);
  assert.equal(dockedMobile.leftPercent, 50);
  assert.ok(dockedMobile.topPercent < 12);
  assert.ok(dockedMobile.scale < 0.38);
});

test('interpolateHexColor blends colors accurately at endpoints and midpoint', () => {
  assert.equal(interpolateHexColor('#000000', '#ffffff', 0), 'rgb(0, 0, 0)');
  assert.equal(interpolateHexColor('#000000', '#ffffff', 1), 'rgb(255, 255, 255)');
  assert.equal(interpolateHexColor('#000000', '#fe0000', 0.5), 'rgb(127, 0, 0)');
});

test('computeEnvironmentState interpolates skyline parallax, colors, and alternating freezeIntensity', () => {
  const heroEnv = computeEnvironmentState(-1, FLAVORS);
  assert.equal(heroEnv.heroProgress, 0);
  assert.equal(heroEnv.freezeIntensity, 0);

  // Index 0 is Super Double Apple (non-ice)
  const doubleAppleEnv = computeEnvironmentState(0, FLAVORS);
  assert.equal(doubleAppleEnv.skylinePanX, FLAVORS[0].skylinePanX);
  assert.equal(doubleAppleEnv.freezeIntensity, 0);
  assert.equal(doubleAppleEnv.heroProgress, 1);

  // Index 1 is Frosty Lemon (ice)
  const frostyLemonEnv = computeEnvironmentState(1, FLAVORS);
  assert.ok(frostyLemonEnv.freezeIntensity > 0.9);

  // Index 2 is Eskandarani Apple (non-ice)
  const eskandaraniEnv = computeEnvironmentState(2, FLAVORS);
  assert.equal(eskandaraniEnv.freezeIntensity, 0);

  // Index 3 is Frosty Mango Passion (ice)
  const frostyMangoEnv = computeEnvironmentState(3, FLAVORS);
  assert.ok(frostyMangoEnv.freezeIntensity > 0.9);

  const endEnv = computeEnvironmentState(FLAVORS.length - 1, FLAVORS);
  assert.equal(endEnv.progressGlobal, 1);
  assert.equal(endEnv.freezeIntensity, 0);
});

test('computeJarTransform hides all jars at opening Hero stage (-1) and reveals active jar centered in Showcase stage', () => {
  const heroJars = FLAVORS.map((_, idx) =>
    computeJarTransform(idx, -1, 0, 0, false, FLAVORS.length)
  );
  for (let i = 0; i < heroJars.length; i++) {
    assert.equal(heroJars[i].isVisible, false);
    assert.equal(heroJars[i].opacity, 0);
  }

  // Mid-transition (-0.4), first jar is emerging
  const emergingFirstJar = computeJarTransform(0, -0.4, 0, 0, false, FLAVORS.length);
  assert.equal(emergingFirstJar.isVisible, true);
  assert.ok(emergingFirstJar.opacity > 0.2 && emergingFirstJar.opacity < 1);

  // At Single-Flavor Showcase (continuousIndex = 2), active jar is centered at scale 1
  const active = computeJarTransform(2, 2, 0, 0, false);
  assert.equal(active.scale, 1);
  assert.equal(active.opacity, 1);
  assert.equal(active.blurPx, 0);
  assert.equal(active.translateX, 0);
  assert.equal(active.translateY, 0);
  assert.equal(active.isVisible, true);

  const nextJarMobile = computeJarTransform(2.5, 2, 0, 0, true);
  assert.ok(Math.abs(nextJarMobile.translateY) < 40);
  assert.ok(nextJarMobile.translateX > 80);

  const farJar = computeJarTransform(6, 2, 0, 0, false);
  assert.equal(farJar.isVisible, false);
  assert.equal(farJar.opacity, 0);

  assert.equal(clamp(15, 0, 10), 10);
  assert.equal(lerp(10, 20, 0.5), 15);
});

test('computeTextRevealState hides single-flavor copy at Hero stage (-1) and reveals active flavor copy sharply in Showcase', () => {
  const heroCopy = computeTextRevealState(0, -1);
  assert.equal(heroCopy.isVisible, false);
  assert.equal(heroCopy.opacity, 0);

  const activeCopy = computeTextRevealState(1, 1);
  assert.equal(activeCopy.opacity, 1);
  assert.equal(activeCopy.blurPx, 0);
  assert.equal(activeCopy.translateY, 0);
  assert.equal(activeCopy.isVisible, true);

  const hiddenCopy = computeTextRevealState(4, 1);
  assert.equal(hiddenCopy.isVisible, false);
  assert.equal(hiddenCopy.opacity, 0);
});
