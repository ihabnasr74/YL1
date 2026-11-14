import React from 'react';
import {
  InterpolatedEnvironment,
  smoothstep,
  withAlpha,
} from '../utils/scrollMath';

const DUBAI_CITY_CENTER_SKYLINE =
  '/assets/aistudio/dubai-city-center-skyline-united-arab-emirates_57a077cb.jpg';

interface DubaiSkylineParallaxProps {
  env: InterpolatedEnvironment;
  continuousIndex: number;
  mouseX: number;
  mouseY: number;
}

export const DubaiSkylineParallax: React.FC<DubaiSkylineParallaxProps> = ({
  env,
  continuousIndex,
  mouseX,
  mouseY,
}) => {
  // Multi-layer parallax offsets driven by continuous scroll index + subtle mouse movement
  const bgTranslateX = env.skylinePanX - mouseX * 16;
  const bgTranslateY = env.skylinePanY - mouseY * 10;

  const foregroundMistX = (continuousIndex - 3.0) * -48 - mouseX * 36;

  // 0 at opening Hero stage (pure black background with moving, color-shifting blooms),
  // 1 when showcasing the flavors over the darkened, flavor-tinted Dubai City Center Skyline
  const skylineReveal = smoothstep(0.08, 0.88, env.heroProgress);
  const heroBlackOpacity = 1 - skylineReveal;
  const focusBoxOpacity = Math.max(
    0,
    Math.min(1, (env.heroProgress - 0.1) / 0.78)
  );

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none bg-black z-0"
      aria-hidden="true"
    >
      {/* SHOWCASE STAGE BACKDROP: Darkened & Flavor-Reactive Dubai City Center Skyline over Water */}
      <div
        data-testid="dubai-skyline-showcase-layer"
        className="absolute inset-0 will-change-transform bg-[#02040a]"
        style={{
          opacity: skylineReveal,
          visibility: skylineReveal > 0.002 ? 'visible' : 'hidden',
        }}
      >
        {/* Dynamic Darkened & Flavor-Reactive Sky/Water Color-Grade Base ("تتغير الوانها حسب النكهه المعروضه واجعلها مظلمه قليلا") */}
        <div
          data-testid="dubai-skyline-flavor-color-grade"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              ${withAlpha(env.skyTint, 0.88)} 0%,
              ${withAlpha(env.primaryColor, 0.68)} 38%,
              ${withAlpha(env.secondaryColor, 0.58)} 72%,
              #02040a 100%
            )`,
          }}
        />

        {/* Attached Dubai City Center Skyline Image with Semi-Transparent Darkened Blend Over Flavor Gradient */}
        <div
          className="absolute inset-[-8%] will-change-transform"
          style={{
            transform: `translate3d(${bgTranslateX.toFixed(1)}px, ${bgTranslateY.toFixed(1)}px, 0) scale(${env.skylineScale.toFixed(3)})`,
          }}
        >
          <img
            data-testid="dubai-skyline-bg-img"
            src={DUBAI_CITY_CENTER_SKYLINE}
            alt="Dubai City Center Skyline"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-48"
          />
        </div>

        {/* Subtle Radial Aura & Shisha Vapor Halo Behind Active Flavor Jar */}
        <div
          data-testid="shisha-smoke-stage-layer"
          className="absolute left-[50%] lg:left-[67.5%] top-[46%] lg:top-[55.5%] -translate-x-1/2 -translate-y-1/2 w-[54vw] max-w-[680px] aspect-square rounded-full opacity-75 will-change-transform"
          style={{
            background: `radial-gradient(circle, rgba(255, 255, 255, 0.24) 0%, ${withAlpha(env.primaryColor, 0.58)} 26%, ${withAlpha(env.ambientGlow, 0.34)} 52%, transparent 72%)`,
            transform: `translate3d(${-mouseX * 20}px, ${-mouseY * 20}px, 0) scale(${
              1 + Math.sin(continuousIndex * Math.PI) * 0.1
            })`,
          }}
        />

        {/* Drifting Parallax Vapor Plumes Over the Water Reflection */}
        <div
          className="absolute inset-x-[-20%] bottom-[4%] h-[36vh] opacity-55 will-change-transform"
          style={{
            transform: `translate3d(${foregroundMistX.toFixed(1)}px, ${(-mouseY * 14).toFixed(1)}px, 0)`,
            background: `radial-gradient(ellipse 35% 40% at 34% 60%, rgba(255, 255, 255, 0.16) 0%, ${withAlpha(env.secondaryColor, 0.45)} 35%, transparent 70%),
                         radial-gradient(ellipse 40% 45% at 66% 55%, rgba(255, 255, 255, 0.18) 0%, ${withAlpha(env.primaryColor, 0.45)} 35%, transparent 70%)`,
          }}
        />

        {/* FLAVOR-COLORED TRANSLUCENT FOCUS BOX WITH SMOOTH FLOWING GLOWING OUTLINE
            - Dynamically transforms to the active flavor's color while remaining transparent
            - Features a smooth, continuous glowing outline traveling around the perimeter in the flavor's color
            - Positioned behind the moving flavor particles (z-15) and behind the product tub & text (z-20) */}
        {focusBoxOpacity > 0.01 && (
          <div
            data-testid="showcase-focus-backdrop"
            className="
              absolute left-1/2 -translate-x-1/2 -translate-y-1/2
              top-[49%] w-[94vw] max-w-[600px] h-[76vh] rounded-[34px]
              lg:top-[52%] lg:w-[92vw] lg:max-w-[1380px] lg:h-[74vh] lg:min-h-[520px] lg:max-h-[680px] lg:rounded-[38px]
              pointer-events-none select-none will-change-transform
            "
            style={{
              opacity: focusBoxOpacity,
              background: `
                radial-gradient(ellipse 85% 75% at 65% 50%, ${withAlpha(env.primaryColor, 0.24)} 0%, transparent 72%),
                linear-gradient(135deg,
                  ${withAlpha(env.primaryColor, 0.28)} 0%,
                  ${withAlpha(env.ambientGlow, 0.36)} 50%,
                  ${withAlpha(env.secondaryColor, 0.24)} 100%
                ),
                rgba(3, 5, 14, 0.44)
              `,
              boxShadow: `0 24px 64px rgba(0, 0, 0, 0.46), 0 0 55px ${withAlpha(env.primaryColor, 0.28)}, inset 0 0 42px ${withAlpha(env.primaryColor, 0.18)}`,
              transform: `translate3d(${mouseX * -6}px, ${mouseY * -5}px, 0)`,
            }}
          >
            {/* Continuous Smoothly Flowing Luminous Outline Around the Box Perimeter */}
            <svg
              data-testid="showcase-focus-outline-svg"
              className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
            >
              {/* Base Subtle Perimeter Track in Flavor Color */}
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="36"
                ry="36"
                fill="none"
                stroke={env.primaryColor}
                strokeOpacity="0.38"
                strokeWidth="1.5"
              />

              {/* Outer Soft Luminous Halo Stream Flowing Around the Box */}
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="36"
                ry="36"
                pathLength="1000"
                fill="none"
                stroke={env.primaryColor}
                strokeOpacity="0.52"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="240 260 240 260"
                className="animate-border-flow"
              />

              {/* Mid Vibrant Flavor-Colored Stream Flowing Around the Box */}
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="36"
                ry="36"
                pathLength="1000"
                fill="none"
                stroke={env.secondaryColor}
                strokeOpacity="0.96"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="220 280 220 280"
                className="animate-border-flow"
              />

              {/* Bright Leading Energy Core Flowing Smoothly Around the Box */}
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="36"
                ry="36"
                pathLength="1000"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.92"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="70 430 70 430"
                className="animate-border-flow"
              />
            </svg>
          </div>
        )}
      </div>

      {/* OPENING HERO STAGE BACKDROP:
          Pitch-Black Background (#000000) with Animated, Color-Shifting & Moving Saturated Blooms
          Positioned EXACTLY Behind the Full Width of the Ya Layl Logo and Behind "اكتشف نكهات يالليل" */}
      {heroBlackOpacity > 0.005 && (
        <div
          data-testid="hero-ghostly-black-backdrop"
          className="absolute inset-0 bg-black overflow-hidden"
          style={{
            opacity: heroBlackOpacity,
          }}
        >
          {/* 1. Full-Width Animated Moving & Color-Shifting Auras Directly Behind the Enlarged Ya Layl Logo (top ~ 33%) */}
          <div
            data-testid="hero-logo-color-aura"
            className="absolute left-1/2 top-[33%] -translate-x-1/2 -translate-y-1/2 w-[98vw] max-w-[1280px] h-[660px] pointer-events-none"
            style={{
              transform: `translate3d(${-mouseX * 22}px, ${-mouseY * 16}px, 0)`,
            }}
          >
            {/* Wave A Behind Logo: Drifting Crimson-Magenta & Amber Glow */}
            <div
              className="absolute inset-0 animate-hero-orb-a"
              style={{
                background: `
                  radial-gradient(ellipse 36% 42% at 34% 50%, rgba(255, 10, 84, 0.78) 0%, rgba(168, 85, 247, 0.42) 28%, rgba(168, 85, 247, 0.14) 52%, rgba(168, 85, 247, 0.03) 72%, transparent 88%),
                  radial-gradient(ellipse 32% 38% at 54% 48%, rgba(245, 158, 11, 0.46) 0%, rgba(245, 158, 11, 0.18) 34%, rgba(245, 158, 11, 0.04) 60%, transparent 82%)
                `,
              }}
            />

            {/* Wave B Behind Logo: Counter-Drifting Electric Cyan & Emerald Glow */}
            <div
              className="absolute inset-0 animate-hero-orb-b"
              style={{
                background: `
                  radial-gradient(ellipse 36% 42% at 66% 50%, rgba(0, 229, 255, 0.74) 0%, rgba(16, 185, 129, 0.38) 28%, rgba(16, 185, 129, 0.12) 52%, rgba(16, 185, 129, 0.03) 72%, transparent 88%),
                  radial-gradient(ellipse 36% 40% at 46% 52%, rgba(168, 85, 247, 0.60) 0%, rgba(168, 85, 247, 0.24) 32%, rgba(168, 85, 247, 0.06) 58%, transparent 82%)
                `,
              }}
            />

            {/* Wave C Behind Logo: Pulsing Center Core Behind "YA LAYL" */}
            <div
              className="absolute inset-0 animate-hero-orb-c"
              style={{
                background: `
                  radial-gradient(ellipse 42% 40% at 50% 50%, rgba(236, 72, 153, 0.56) 0%, rgba(56, 189, 248, 0.28) 30%, rgba(56, 189, 248, 0.08) 56%, transparent 84%)
                `,
              }}
            />
          </div>

          {/* 2. Animated Moving & Color-Shifting Auras Directly Behind "اكتشف نكهات يالليل / DISCOVER YA LAYL FLAVORS" (top ~ 67%) */}
          <div
            data-testid="hero-callout-color-aura"
            className="absolute left-1/2 top-[63%] sm:top-[66%] lg:top-[68%] -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-[980px] h-[460px] pointer-events-none"
            style={{
              transform: `translate3d(${mouseX * 18}px, ${mouseY * 14}px, 0)`,
            }}
          >
            {/* Wave A Behind Callout: Drifting Crimson-Violet Glow */}
            <div
              className="absolute inset-0 animate-hero-orb-b"
              style={{
                background: `
                  radial-gradient(ellipse 36% 40% at 40% 50%, rgba(255, 10, 84, 0.76) 0%, rgba(168, 85, 247, 0.38) 28%, rgba(168, 85, 247, 0.12) 52%, rgba(168, 85, 247, 0.02) 72%, transparent 88%)
                `,
              }}
            />

            {/* Wave B Behind Callout: Counter-Drifting Cyan-Emerald Glow */}
            <div
              className="absolute inset-0 animate-hero-orb-a"
              style={{
                background: `
                  radial-gradient(ellipse 36% 40% at 60% 50%, rgba(0, 229, 255, 0.74) 0%, rgba(16, 185, 129, 0.36) 28%, rgba(16, 185, 129, 0.12) 52%, rgba(16, 185, 129, 0.02) 72%, transparent 88%)
                `,
              }}
            />

            {/* Wave C Behind Callout: Pulsing Golden-Rose Center Core */}
            <div
              className="absolute inset-0 animate-hero-orb-c"
              style={{
                background: `
                  radial-gradient(ellipse 40% 40% at 50% 50%, rgba(245, 158, 11, 0.58) 0%, rgba(255, 10, 84, 0.28) 30%, rgba(255, 10, 84, 0.08) 56%, transparent 84%)
                `,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
