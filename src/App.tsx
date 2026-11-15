import { useEffect, useRef, useState, useCallback } from 'react';
import { FLAVORS } from './data/flavors';
import {
  computeContinuousFlavorIndex,
  computeEnvironmentState,
  computeHeroProgress,
  getActiveFlavorIndex,
  getActiveScrollSection,
  clamp,
} from './utils/scrollMath';
import { DubaiSkylineParallax } from './components/DubaiSkylineParallax';
import { SmokeTransitionEffect } from './components/SmokeTransitionEffect';
import { FlavorParticles } from './components/FlavorParticles';
import { JarShowcaseStage } from './components/JarShowcaseStage';
import { ScreenFreezeEffect } from './components/ScreenFreezeEffect';
import { ScrollControls } from './components/ScrollControls';

export default function App() {
  const [continuousIndex, setContinuousIndex] = useState<number>(-1);
  const [logoHeroProgress, setLogoHeroProgress] = useState<number>(0);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  const targetIndexRef = useRef<number>(-1);
  const currentIndexRef = useRef<number>(-1);
  const currentLogoProgressRef = useRef<number>(0);
  const lastViewportHeightRef = useRef<number>(
    typeof window !== 'undefined' ? window.innerHeight : 900
  );
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const wheelCooldownRef = useRef<number>(0);

  // Scroll to any section index [0 = Hero Stage, 1..7 = Flavors 0..6]
  const scrollToSection = useCallback((sectionIndex: number) => {
    const clampedSection = clamp(sectionIndex, 0, FLAVORS.length);
    targetIndexRef.current = clampedSection - 1;
    window.scrollTo({
      top: clampedSection * window.innerHeight,
      behavior: 'auto',
    });
  }, []);

  // Scroll directly to a specific flavor [0..6]
  const scrollToFlavor = useCallback(
    (flavorIndex: number) => {
      const clampedFlavor = clamp(flavorIndex, 0, FLAVORS.length - 1);
      scrollToSection(clampedFlavor + 1);
    },
    [scrollToSection]
  );

  // Scroll back to the top Hero Stage
  const scrollToHero = useCallback(() => {
    scrollToSection(0);
  }, [scrollToSection]);

  useEffect(() => {
    const handleScroll = () => {
      targetIndexRef.current = computeContinuousFlavorIndex(
        window.scrollY,
        window.innerHeight,
        FLAVORS.length
      );
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      const newVh = window.innerHeight;
      if (newVh > 0 && newVh !== lastViewportHeightRef.current) {
        const activeSection = getActiveScrollSection(
          targetIndexRef.current,
          FLAVORS.length
        );
        lastViewportHeightRef.current = newVh;
        window.scrollTo({
          top: activeSection * newVh,
          behavior: 'auto',
        });
        targetIndexRef.current = activeSection - 1;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Preload product tub images cleanly on mount to eliminate mobile mid-scroll decode hitches
    const preloaded: HTMLImageElement[] = [];
    const preloadTimer = window.setTimeout(() => {
      FLAVORS.forEach((f) => {
        const img = new Image();
        img.src = f.image;
        img.decode?.().catch(() => {});
        preloaded.push(img);
      });
    }, 150);

    return () => {
      window.clearTimeout(preloadTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Crisp wheel step + continuous scroll support across Hero (0) and Flavors (1..7)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 12) return;
      const now = performance.now();
      if (now - wheelCooldownRef.current < 560) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      wheelCooldownRef.current = now;
      const currentSection = getActiveScrollSection(
        targetIndexRef.current,
        FLAVORS.length
      );
      const direction = e.deltaY > 0 ? 1 : -1;
      scrollToSection(currentSection + direction);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scrollToSection]);

  // Keyboard navigation (ArrowDown / ArrowUp / PageDown / PageUp)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentSection = getActiveScrollSection(
        targetIndexRef.current,
        FLAVORS.length
      );
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToSection(currentSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSection(currentSection - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToSection]);

  // Interactive mouse parallax tracking (disabled on mobile viewports for smooth touch scrolling)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      const nx = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      const ny = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      targetMouseRef.current = { x: clamp(nx, -1, 1), y: clamp(ny, -1, 1) };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Frame-rate-independent damping loop with dedicated slower ("بطئ حبتين") logo flight
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const mobileMode = window.innerWidth < 1024;
      const idxAlpha = 1 - Math.exp(-dt * (mobileMode ? 11.5 : 8.0));
      const logoAlpha = 1 - Math.exp(-dt * (mobileMode ? 6.2 : 4.4));
      const mouseAlpha = 1 - Math.exp(-dt * 8.0);

      const idxDiff = targetIndexRef.current - currentIndexRef.current;
      const targetLogoProgress = computeHeroProgress(targetIndexRef.current);
      const logoDiff = targetLogoProgress - currentLogoProgressRef.current;

      let shouldUpdateIdx = false;
      let shouldUpdateLogo = false;

      if (Math.abs(idxDiff) > 0.006) {
        currentIndexRef.current += idxDiff * idxAlpha;
        shouldUpdateIdx = true;
      } else if (currentIndexRef.current !== targetIndexRef.current) {
        currentIndexRef.current = targetIndexRef.current;
        shouldUpdateIdx = true;
      }

      if (Math.abs(logoDiff) > 0.005) {
        currentLogoProgressRef.current += logoDiff * logoAlpha;
        shouldUpdateLogo = true;
      } else if (currentLogoProgressRef.current !== targetLogoProgress) {
        currentLogoProgressRef.current = targetLogoProgress;
        shouldUpdateLogo = true;
      }

      if (!mobileMode) {
        const mxDiff = targetMouseRef.current.x - currentMouseRef.current.x;
        const myDiff = targetMouseRef.current.y - currentMouseRef.current.y;
        if (Math.abs(mxDiff) > 0.004 || Math.abs(myDiff) > 0.004) {
          currentMouseRef.current = {
            x: currentMouseRef.current.x + mxDiff * mouseAlpha,
            y: currentMouseRef.current.y + myDiff * mouseAlpha,
          };
          setMouseOffset({ ...currentMouseRef.current });
        }
      }

      if (shouldUpdateIdx) {
        setContinuousIndex(currentIndexRef.current);
      }

      if (shouldUpdateLogo) {
        setLogoHeroProgress(currentLogoProgressRef.current);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const activeIndex = getActiveFlavorIndex(continuousIndex, FLAVORS.length);
  const env = computeEnvironmentState(continuousIndex, FLAVORS);

  return (
    <main
      data-testid="parallax-showcase-main"
      data-active-flavor-index={activeIndex}
      data-active-flavor-id={FLAVORS[activeIndex]?.id}
      data-hero-progress={env.heroProgress.toFixed(2)}
      className="relative w-full select-none"
    >
      {/* Fixed Multi-Layer Darkened & Flavor-Reactive Dubai Skyline Parallax Backdrop */}
      <DubaiSkylineParallax
        env={env}
        continuousIndex={Math.max(0, continuousIndex)}
        mouseX={mouseOffset.x}
        mouseY={mouseOffset.y}
        isMobile={isMobile}
      />

      {/* Moving Shisha Smoke & Vapor Billows During Flavor Transitions */}
      <SmokeTransitionEffect
        env={env}
        continuousIndex={continuousIndex}
        activeIndex={activeIndex}
        mouseX={mouseOffset.x}
        mouseY={mouseOffset.y}
      />

      {/* Fixed Multi-Depth Parallax Floating Flavor Particles */}
      <FlavorParticles
        flavors={FLAVORS}
        continuousIndex={continuousIndex}
        env={env}
        mouseX={mouseOffset.x}
        mouseY={mouseOffset.y}
        isMobile={isMobile}
      />

      {/* Fixed 3D Orbital Flavor Jar & Unified Bilingual Copy Stage */}
      <JarShowcaseStage
        flavors={FLAVORS}
        continuousIndex={continuousIndex}
        activeIndex={activeIndex}
        env={env}
        mouseX={mouseOffset.x}
        mouseY={mouseOffset.y}
        isMobile={isMobile}
        onSelectFlavor={scrollToFlavor}
      />

      {/* Realistic Cinematic Screen-Freezing Overlay & Continuous Falling Snow for Ice Flavors */}
      <ScreenFreezeEffect
        env={env}
        activeIndex={activeIndex}
        mouseX={mouseOffset.x}
        mouseY={mouseOffset.y}
        isMobile={isMobile}
      />

      {/* Slow 3D Parallax-Morphing Brand Logo, Progress Dots & Dynamic Flavor-Colored Icon Badge */}
      <ScrollControls
        flavors={FLAVORS}
        continuousIndex={continuousIndex}
        logoHeroProgress={logoHeroProgress}
        activeIndex={activeIndex}
        env={env}
        isMobile={isMobile}
        mouseX={mouseOffset.x}
        mouseY={mouseOffset.y}
        onSelectFlavor={scrollToFlavor}
        onScrollToHero={scrollToHero}
      />

      {/* Scroll Sections Driving the Parallax Timeline */}
      <div className="relative z-0 w-full">
        {/* Section 0: Opening Hero Stage */}
        <section
          data-testid="scroll-section-hero"
          aria-label="Ya Layl Molasses Collection"
          className="w-full h-screen snap-start snap-always"
        />

        {/* Sections 1..7: Individual Flavor Showcases (Alternating Regular & Ice) */}
        {FLAVORS.map((flavor, idx) => (
          <section
            key={flavor.id}
            data-testid={`scroll-section-${idx}`}
            aria-label={flavor.altLabel}
            className="w-full h-screen snap-start snap-always"
          />
        ))}
      </div>
    </main>
  );
}
