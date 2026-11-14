import { FlavorItem } from '../data/flavors';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / Math.max(edge1 - edge0, 0.0001), 0, 1);
  return t * t * (3 - 2 * t);
}

export function smootherstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / Math.max(edge1 - edge0, 0.0001), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Given scrollTop, viewportHeight, and totalFlavors:
 * - Section 0 (scrollTop = 0) is the Hero Ensemble Stage: returns -1
 * - Section 1 (scrollTop = 1 * vh) is Flavor 0: returns 0
 * - Section N (scrollTop = N * vh) is Flavor N-1: returns N-1
 * Range is [-1, totalFlavors - 1].
 */
export function computeContinuousFlavorIndex(
  scrollTop: number,
  viewportHeight: number,
  totalFlavors: number
): number {
  if (viewportHeight <= 0 || totalFlavors <= 0) return -1;
  const rawSection = scrollTop / viewportHeight;
  return clamp(rawSection - 1, -1, totalFlavors - 1);
}

/**
 * Returns 0 when at the Hero Ensemble Stage (continuousIndex = -1),
 * and smoothly progresses to 1 when reaching the first single-flavor showcase (continuousIndex >= 0).
 */
export function computeHeroProgress(continuousIndex: number): number {
  return clamp(continuousIndex + 1, 0, 1);
}

/**
 * Returns the nearest discrete flavor index [0, totalFlavors - 1]
 */
export function getActiveFlavorIndex(
  continuousIndex: number,
  totalFlavors: number
): number {
  if (totalFlavors <= 1) return 0;
  if (continuousIndex < 0) return 0;
  return clamp(Math.round(continuousIndex), 0, totalFlavors - 1);
}

/**
 * Returns the nearest discrete scroll section [0, totalFlavors]
 * where 0 = Hero Ensemble Stage, and 1..totalFlavors = Flavors 0..totalFlavors-1
 */
export function getActiveScrollSection(
  continuousIndex: number,
  totalFlavors: number
): number {
  return clamp(Math.round(continuousIndex + 1), 0, totalFlavors);
}

/**
 * Computes the moving shisha smoke intensity [0, 1]:
 * - 0 at the opening Hero stage (-1)
 * - Surges up to 1.0 when transitioning from one flavor to another (mid-scroll or via smokeBurst)
 * - Settles to a gentle 0.24 ambient shisha vapor drift when resting on a flavor
 */
export function computeTransitionSmokeIntensity(
  continuousIndex: number,
  smokeBurst = 0
): number {
  const heroProgress = computeHeroProgress(continuousIndex);
  if (heroProgress <= 0.04) return 0;

  let scrollWave = 0;
  if (continuousIndex < 0) {
    scrollWave = Math.sin(heroProgress * Math.PI);
  } else {
    const frac = continuousIndex - Math.floor(continuousIndex);
    scrollWave = Math.sin(frac * Math.PI);
  }

  const baseAmbient = heroProgress * 0.24;
  const activeSurge = Math.max(scrollWave, clamp(smokeBurst, 0, 1));
  return clamp(baseAmbient + activeSurge * 0.76, 0, 1);
}

/**
 * Parses a #RRGGBB hex string into [r, g, b]
 */
export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return [0, 0, 0];
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Linearly interpolates between two #RRGGBB hex colors
 */
export function interpolateHexColor(
  hexA: string,
  hexB: string,
  t: number
): string {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const factor = clamp(t, 0, 1);
  const r = Math.round(lerp(r1, r2, factor));
  const g = Math.round(lerp(g1, g2, factor));
  const b = Math.round(lerp(b1, b2, factor));
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Converts an `rgb(r, g, b)` or `#RRGGBB` color string into a native `rgba(r, g, b, alpha)` string
 */
export function withAlpha(color: string, alpha: number): string {
  const a = clamp(alpha, 0, 1);
  const trimmed = color.trim();
  if (trimmed.startsWith('#')) {
    const [r, g, b] = hexToRgb(trimmed);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  const match = trimmed.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (match) {
    return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${a})`;
  }
  return `rgba(255, 255, 255, ${a})`;
}

export interface InterpolatedEnvironment {
  primaryColor: string;
  secondaryColor: string;
  ambientGlow: string;
  skyTint: string;
  waterReflection: string;
  iceTint: string;
  freezeIntensity: number;
  skylinePanX: number;
  skylinePanY: number;
  skylineScale: number;
  progressGlobal: number;
  heroProgress: number;
}

/**
 * Smoothly interpolates environment colors, freeze intensity, and Dubai Marina skyline parallax coordinates
 * across both the Hero Ensemble Stage (continuousIndex in [-1, 0]) and the Flavor Showcase Stage ([0, count-1]).
 */
export function computeEnvironmentState(
  continuousIndex: number,
  flavors: FlavorItem[]
): InterpolatedEnvironment {
  const count = flavors.length;
  const heroProgress = computeHeroProgress(continuousIndex);

  if (count === 0) {
    return {
      primaryColor: 'rgb(244, 63, 94)',
      secondaryColor: 'rgb(253, 164, 175)',
      ambientGlow: 'rgb(190, 18, 60)',
      skyTint: 'rgb(15, 23, 42)',
      waterReflection: 'rgb(251, 113, 133)',
      iceTint: 'rgb(224, 242, 254)',
      freezeIntensity: 0,
      skylinePanX: 0,
      skylinePanY: 0,
      skylineScale: 1.06,
      progressGlobal: 0,
      heroProgress,
    };
  }

  if (continuousIndex < 0) {
    const first = flavors[0];
    const smoothHero = smootherstep(0, 1, heroProgress);

    return {
      primaryColor: interpolateHexColor('#e11d48', first.primaryColor, smoothHero),
      secondaryColor: interpolateHexColor('#38bdf8', first.secondaryColor, smoothHero),
      ambientGlow: interpolateHexColor('#4c1d95', first.ambientGlow, smoothHero),
      skyTint: interpolateHexColor('#020205', first.skyTint, smoothHero),
      waterReflection: interpolateHexColor('#8b5cf6', first.waterReflection, smoothHero),
      iceTint: first.iceTint,
      freezeIntensity: lerp(0, first.iceIntensity, smoothHero),
      skylinePanX: lerp(0, first.skylinePanX, smoothHero),
      skylinePanY: lerp(-20, first.skylinePanY, smoothHero),
      skylineScale: lerp(1.14, first.skylineScale, smoothHero),
      progressGlobal: 0,
      heroProgress,
    };
  }

  const clamped = clamp(continuousIndex, 0, count - 1);
  const lowerIdx = Math.floor(clamped);
  const upperIdx = Math.min(lowerIdx + 1, count - 1);
  const localT = clamped - lowerIdx;
  const smoothT = localT * localT * (3 - 2 * localT);

  const a = flavors[lowerIdx];
  const b = flavors[upperIdx];

  return {
    primaryColor: interpolateHexColor(a.primaryColor, b.primaryColor, smoothT),
    secondaryColor: interpolateHexColor(a.secondaryColor, b.secondaryColor, smoothT),
    ambientGlow: interpolateHexColor(a.ambientGlow, b.ambientGlow, smoothT),
    skyTint: interpolateHexColor(a.skyTint, b.skyTint, smoothT),
    waterReflection: interpolateHexColor(
      a.waterReflection,
      b.waterReflection,
      smoothT
    ),
    iceTint: interpolateHexColor(a.iceTint, b.iceTint, smoothT),
    freezeIntensity: lerp(a.iceIntensity, b.iceIntensity, smoothT),
    skylinePanX: lerp(a.skylinePanX, b.skylinePanX, smoothT),
    skylinePanY: lerp(a.skylinePanY, b.skylinePanY, smoothT),
    skylineScale: lerp(a.skylineScale, b.skylineScale, smoothT),
    progressGlobal: count > 1 ? clamped / (count - 1) : 0,
    heroProgress: 1,
  };
}

export interface LogoMorphState {
  leftPercent: number;
  topPercent: number;
  scale: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  parallaxX: number;
  parallaxY: number;
  haloOpacity: number;
}

/**
 * Computes the slow, graceful 3D flight of the Ya Layl Molasses logo:
 * - At Hero Stage (logoHeroProgress = 0):
 *   Enlarged, commanding center presence (left: 50%, top: ~34%, scale: 1.32)
 * - During transition (0 < logoHeroProgress < 1):
 *   Glides smoothly upward in 3D space with a graceful perspective tilt
 * - When docked in the Flavor Showcase (logoHeroProgress = 1):
 *   Top-center of the screen (left: 50%, top: 7.5% on desktop / 6.5% on mobile)
 */
export function computeLogoMorphState(
  logoHeroProgress: number,
  isMobile: boolean,
  mouseTiltX = 0,
  mouseTiltY = 0
): LogoMorphState {
  const rawT = clamp(logoHeroProgress, 0, 1);
  const t = smootherstep(0, 1, rawT);
  const flightEnvelope = Math.sin(rawT * Math.PI);

  const swoopArcX = Math.sin(rawT * Math.PI) * (isMobile ? 1.5 : 2.5);
  const levitationArcY = -Math.sin(rawT * Math.PI) * 3.5;

  const startLeft = 50;
  const endLeft = 50;

  const startTop = isMobile ? 33.0 : 34.0;
  const endTop = isMobile ? 6.5 : 7.5;

  const startScale = isMobile ? 1.24 : 1.32;
  const endScale = isMobile ? 0.34 : 0.28;
  const scalePulse = flightEnvelope * 0.05;

  const heroFactor = 1 - t;

  return {
    leftPercent: clamp(lerp(startLeft, endLeft, t) + swoopArcX, 9.0, 91.0),
    topPercent: lerp(startTop, endTop, t) + levitationArcY,
    scale: lerp(startScale, endScale, t) + scalePulse,
    rotateX: flightEnvelope * 16 - mouseTiltY * 8 * heroFactor,
    rotateY:
      (!isMobile ? -flightEnvelope * 18 : flightEnvelope * 12) +
      mouseTiltX * 10 * heroFactor,
    rotateZ: !isMobile ? -flightEnvelope * 3 : 0,
    parallaxX: mouseTiltX * 22 * heroFactor,
    parallaxY: mouseTiltY * 14 * heroFactor,
    haloOpacity: heroFactor * 0.85 + flightEnvelope * 0.15,
  };
}

export interface JarTransformState {
  translateX: number;
  translateY: number;
  translateZ: number;
  scale: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  opacity: number;
  blurPx: number;
  zIndex: number;
  isVisible: boolean;
}

/**
 * Computes the 3D Orbital Ferris-Wheel & Axial Spin transform for each flavor jar
 * during the Single-Flavor Showcase stage (showcaseIndex >= 0).
 */
function computeShowcaseOnlyJarTransform(
  itemIndex: number,
  showcaseIndex: number,
  mouseTiltX = 0,
  mouseTiltY = 0,
  isMobile = false
): JarTransformState {
  const delta = itemIndex - showcaseIndex;
  const absDelta = Math.abs(delta);
  const maxVisibleDelta = 0.96;

  if (absDelta > maxVisibleDelta) {
    return {
      translateX: isMobile ? (delta > 0 ? 340 : -340) : (delta > 0 ? 360 : 280),
      translateY: isMobile ? 90 : delta > 0 ? 360 : -320,
      translateZ: -700,
      scale: 0.24,
      rotateX: delta > 0 ? 25 : -25,
      rotateY: delta > 0 ? -90 : 90,
      rotateZ: delta > 0 ? 18 : -18,
      opacity: 0,
      blurPx: 18,
      zIndex: 0,
      isVisible: false,
    };
  }

  const sign = delta >= 0 ? 1 : -1;
  const curvedDelta = sign * Math.pow(absDelta, 0.86);
  const transitionWave = Math.sin(clamp(absDelta, 0, 1) * Math.PI);

  // On Desktop, neighboring jars arc outward to the right-hand depth tunnel (+X, +/-Y, -Z)
  // so the Left Editorial Stage stays 100% open and unobstructed!
  const translateX = isMobile
    ? curvedDelta * 235
    : Math.abs(curvedDelta) * 195 +
      transitionWave * 55 +
      mouseTiltX * (1 - clamp(absDelta, 0, 1)) * 18;

  const translateY = isMobile
    ? Math.abs(curvedDelta) * 32
    : curvedDelta * 225 +
      mouseTiltY * (1 - clamp(absDelta, 0, 1)) * 14;

  const translateZ = isMobile
    ? -absDelta * 290 - transitionWave * 60
    : -absDelta * 380 - transitionWave * 95;

  const scale = clamp(
    1 - absDelta * (isMobile ? 0.5 : 0.46) + (absDelta < 0.35 ? 0 : -0.04),
    0.26,
    1
  );

  // 3D Axial Turntable Spin + Wave Pitch
  const rotateY =
    -curvedDelta * (isMobile ? 64 : 78) +
    mouseTiltX * (1 - clamp(absDelta, 0, 1)) * 12;
  const rotateX = isMobile
    ? transitionWave * 10
    : -delta * 18 +
      transitionWave * 14 -
      mouseTiltY * (1 - clamp(absDelta, 0, 1)) * 10;
  const rotateZ = curvedDelta * (isMobile ? 8 : 12);

  const opacityFadeRange = 0.92;
  const opacity = clamp(1 - Math.pow(absDelta / opacityFadeRange, 1.45), 0, 1);
  const blurPx =
    absDelta < 0.08 ? 0 : Math.min(18, Math.pow(absDelta, 1.35) * 9);
  const zIndex = Math.round(100 - absDelta * 40);

  return {
    translateX,
    translateY,
    translateZ,
    scale,
    rotateX,
    rotateY,
    rotateZ,
    opacity,
    blurPx,
    zIndex,
    isVisible: opacity > 0.01,
  };
}

/**
 * Computes the transform for each flavor jar:
 * - At the opening Hero stage (continuousIndex = -1, heroProgress = 0):
 *   All product jars are completely hidden (opacity = 0, isVisible = false) as requested.
 * - As the user scrolls from Hero (-1) into the Showcase (0..7):
 *   The jars smoothly emerge in 3D alongside the Dubai skyline backdrop.
 */
export function computeJarTransform(
  itemIndex: number,
  continuousIndex: number,
  mouseTiltX = 0,
  mouseTiltY = 0,
  isMobile = false,
  _totalFlavors = 8
): JarTransformState {
  if (continuousIndex >= 0) {
    return computeShowcaseOnlyJarTransform(
      itemIndex,
      continuousIndex,
      mouseTiltX,
      mouseTiltY,
      isMobile
    );
  }

  // Hero-to-Showcase transition (continuousIndex in [-1, 0])
  const heroProgress = computeHeroProgress(continuousIndex);
  const revealT = smoothstep(0.18, 0.96, heroProgress);

  if (revealT <= 0.01) {
    return {
      translateX: 0,
      translateY: 120,
      translateZ: -420,
      scale: 0.45,
      rotateX: 18,
      rotateY: -35,
      rotateZ: 0,
      opacity: 0,
      blurPx: 16,
      zIndex: 0,
      isVisible: false,
    };
  }

  const showcaseTarget = computeShowcaseOnlyJarTransform(
    itemIndex,
    0,
    mouseTiltX,
    mouseTiltY,
    isMobile
  );

  if (!showcaseTarget.isVisible) {
    return showcaseTarget;
  }

  const entranceOffset = 1 - revealT;
  const opacity = showcaseTarget.opacity * revealT;

  return {
    translateX: showcaseTarget.translateX + entranceOffset * (isMobile ? 0 : 90),
    translateY: showcaseTarget.translateY + entranceOffset * 110,
    translateZ: showcaseTarget.translateZ - entranceOffset * 260,
    scale: showcaseTarget.scale * lerp(0.68, 1, revealT),
    rotateX: showcaseTarget.rotateX + entranceOffset * 16,
    rotateY: showcaseTarget.rotateY - entranceOffset * 38,
    rotateZ: showcaseTarget.rotateZ,
    opacity,
    blurPx: showcaseTarget.blurPx + entranceOffset * 10,
    zIndex: showcaseTarget.zIndex,
    isVisible: opacity > 0.01,
  };
}

export interface TextRevealState {
  translateY: number;
  scale: number;
  opacity: number;
  blurPx: number;
  isVisible: boolean;
}

/**
 * Computes smooth cinematic entrance/exit motion for the bilingual flavor titles
 * and short descriptions.
 */
export function computeTextRevealState(
  itemIndex: number,
  continuousIndex: number
): TextRevealState {
  if (continuousIndex < 0) {
    if (itemIndex !== 0) {
      return {
        translateY: 50,
        scale: 0.92,
        opacity: 0,
        blurPx: 12,
        isVisible: false,
      };
    }
    const heroReveal = smoothstep(
      0.38,
      0.95,
      computeHeroProgress(continuousIndex)
    );
    return {
      translateY: (1 - heroReveal) * 36,
      scale: lerp(0.92, 1, heroReveal),
      opacity: heroReveal,
      blurPx: (1 - heroReveal) * 8,
      isVisible: heroReveal > 0.01,
    };
  }

  const delta = itemIndex - continuousIndex;
  const absDelta = Math.abs(delta);

  if (absDelta > 0.95) {
    return {
      translateY: delta > 0 ? 50 : -50,
      scale: 0.92,
      opacity: 0,
      blurPx: 12,
      isVisible: false,
    };
  }

  const translateY = delta * 52;
  const scale = clamp(1 - absDelta * 0.1, 0.88, 1);
  const opacity = clamp(1 - Math.pow(absDelta / 0.88, 1.45), 0, 1);
  const blurPx = absDelta < 0.06 ? 0 : Math.min(10, absDelta * 12);

  return {
    translateY,
    scale,
    opacity,
    blurPx,
    isVisible: opacity > 0.01,
  };
}
