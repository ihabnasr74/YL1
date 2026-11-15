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
  isMobile: boolean;
}

export const DubaiSkylineParallax: React.FC<DubaiSkylineParallaxProps> = ({
  env,
  continuousIndex,
  mouseX,
  mouseY,
  isMobile,
}) => {
  // Multi-layer parallax offsets driven by continuous scroll index + subtle mouse movement
  const bgTranslateX = env.skylinePanX - (isMobile ? 0 : mouseX * 16);
  const bgTranslateY = env.skylinePanY - (isMobile ? 0 : mouseY * 10);

  const foregroundMistX =
    (continuousIndex - 3.0) * -42 - (isMobile ? 0 : mouseX * 32);

  // 0 at opening Hero stage (full-screen darkened multi-color fusion centered on logo & callout),
  // 1 when showcasing the flavors over the darkened, flavor-tinted Dubai City Center Skyline
  const skylineReveal = smoothstep(0.08, 0.88, env.heroProgress);
  const heroBlackOpacity = 1 - skylineReveal;
  const focusBoxOpacity = Math.max(
    0,
    Math.min(1, (env.heroProgress - 0.1) / 0.78)
  );

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none bg-[#020308] z-0"
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
        {/* Dynamic Darkened & Flavor-Reactive Sky/Water Color-Grade Base */}
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
            decoding="async"
            className="w-full h-full object-cover object-center opacity-48"
          />
        </div>

        {/* Subtle Radial Aura & Shisha Vapor Halo Behind Active Flavor Jar */}
        <div
          data-testid="shisha-smoke-stage-layer"
          className="absolute left-[50%] lg:left-[67.5%] top-[40%] lg:top-[55.5%] -translate-x-1/2 -translate-y-1/2 w-[78vw] lg:w-[54vw] max-w-[660px] aspect-square rounded-full opacity-72 will-change-transform"
          style={{
            background: `radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, ${withAlpha(env.primaryColor, 0.56)} 26%, ${withAlpha(env.ambientGlow, 0.32)} 52%, transparent 72%)`,
            transform: isMobile
              ? undefined
              : `translate3d(${-mouseX * 18}px, ${-mouseY * 18}px, 0)`,
          }}
        />

        {/* Drifting Parallax Vapor Plumes Over the Water Reflection */}
        <div
          className="absolute inset-x-[-20%] bottom-[4%] h-[34vh] opacity-50 will-change-transform"
          style={{
            transform: `translate3d(${foregroundMistX.toFixed(1)}px, 0, 0)`,
            background: `radial-gradient(ellipse 35% 40% at 34% 60%, rgba(255, 255, 255, 0.14) 0%, ${withAlpha(env.secondaryColor, 0.42)} 35%, transparent 70%),
                         radial-gradient(ellipse 40% 45% at 66% 55%, rgba(255, 255, 255, 0.16) 0%, ${withAlpha(env.primaryColor, 0.42)} 35%, transparent 70%)`,
          }}
        />

        {/* FLAVOR-COLORED TRANSLUCENT FOCUS BOX WITH GPU-COMPOSITED SMOOTH FLOWING OUTLINE
            - Dynamically transforms to the active flavor's color while remaining transparent
            - Uses GPU-composited rotating conic-gradient mask so mobile phones maintain 60fps */}
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
                radial-gradient(ellipse 85% 75% at 65% 50%, ${withAlpha(env.primaryColor, 0.22)} 0%, transparent 72%),
                linear-gradient(135deg,
                  ${withAlpha(env.primaryColor, 0.26)} 0%,
                  ${withAlpha(env.ambientGlow, 0.34)} 50%,
                  ${withAlpha(env.secondaryColor, 0.22)} 100%
                ),
                rgba(3, 5, 14, 0.44)
              `,
              boxShadow: isMobile
                ? `0 14px 34px rgba(0, 0, 0, 0.48), 0 0 28px ${withAlpha(env.primaryColor, 0.22)}`
                : `0 24px 64px rgba(0, 0, 0, 0.46), 0 0 52px ${withAlpha(env.primaryColor, 0.26)}, inset 0 0 38px ${withAlpha(env.primaryColor, 0.16)}`,
              transform: isMobile
                ? undefined
                : `translate3d(${mouseX * -6}px, ${mouseY * -5}px, 0)`,
            }}
          >
            {/* Base Subtle Perimeter Border Track */}
            <div
              className="absolute inset-0 rounded-[34px] lg:rounded-[38px] pointer-events-none"
              style={{
                border: `1.5px solid ${withAlpha(env.primaryColor, 0.38)}`,
              }}
            />

            {/* Smooth Clockwise Flowing Luminous Outline Around the Rounded Box Perimeter (Ultra-Lightweight) */}
            <div
              data-testid="showcase-focus-outline-svg"
              className="absolute inset-0 rounded-[34px] lg:rounded-[38px] overflow-hidden pointer-events-none"
            >
              {/* Top Edge Luminous Beam */}
              <div className="absolute top-0 inset-x-0 h-[2.5px] overflow-hidden">
                <div
                  className="h-full w-[42%] rounded-full animate-beam-top will-change-transform"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${env.primaryColor} 30%, ${env.secondaryColor} 65%, #ffffff 85%, ${env.secondaryColor} 95%, transparent 100%)`,
                  }}
                />
              </div>

              {/* Right Edge Luminous Beam */}
              <div className="absolute right-0 inset-y-0 w-[2.5px] overflow-hidden">
                <div
                  className="w-full h-[42%] rounded-full animate-beam-right will-change-transform"
                  style={{
                    background: `linear-gradient(180deg, transparent 0%, ${env.primaryColor} 30%, ${env.secondaryColor} 65%, #ffffff 85%, ${env.secondaryColor} 95%, transparent 100%)`,
                  }}
                />
              </div>

              {/* Bottom Edge Luminous Beam */}
              <div className="absolute bottom-0 inset-x-0 h-[2.5px] overflow-hidden">
                <div
                  className="h-full w-[42%] rounded-full animate-beam-bottom will-change-transform"
                  style={{
                    background: `linear-gradient(270deg, transparent 0%, ${env.primaryColor} 30%, ${env.secondaryColor} 65%, #ffffff 85%, ${env.secondaryColor} 95%, transparent 100%)`,
                  }}
                />
              </div>

              {/* Left Edge Luminous Beam */}
              <div className="absolute left-0 inset-y-0 w-[2.5px] overflow-hidden">
                <div
                  className="w-full h-[42%] rounded-full animate-beam-left will-change-transform"
                  style={{
                    background: `linear-gradient(0deg, transparent 0%, ${env.primaryColor} 30%, ${env.secondaryColor} 65%, #ffffff 85%, ${env.secondaryColor} 95%, transparent 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OPENING HERO STAGE BACKDROP:
          Full-Viewport Darkened Color Fusion ("الخلفية كاملة ألوان بنفس الشكل ولكن داكنة قليلاً إلى الأسود")
          with brighter luminous focus centered behind the Ya Layl Logo & "اكتشف نكهات يالليل" */}
      {heroBlackOpacity > 0.005 && (
        <div
          data-testid="hero-ghostly-black-backdrop"
          className="absolute inset-0 bg-[#020307] overflow-hidden"
          style={{
            opacity: heroBlackOpacity,
          }}
        >
          {/* Full-Screen Darkened Multi-Color Fusion Canvas (same fused palette darkened seamlessly toward black) */}
          <div
            data-testid="hero-full-color-fusion-bg"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 68% 58% at 22% 24%, rgba(255, 10, 84, 0.24) 0%, rgba(168, 85, 247, 0.14) 44%, transparent 78%),
                radial-gradient(ellipse 68% 58% at 78% 26%, rgba(0, 229, 255, 0.22) 0%, rgba(16, 185, 129, 0.12) 44%, transparent 78%),
                radial-gradient(ellipse 62% 52% at 24% 78%, rgba(168, 85, 247, 0.20) 0%, rgba(255, 10, 84, 0.10) 46%, transparent 78%),
                radial-gradient(ellipse 62% 52% at 76% 78%, rgba(16, 185, 129, 0.18) 0%, rgba(0, 229, 255, 0.10) 46%, transparent 78%),
                radial-gradient(ellipse 80% 65% at 50% 50%, rgba(245, 158, 11, 0.12) 0%, rgba(168, 85, 247, 0.10) 48%, rgba(2, 3, 7, 0.88) 100%)
              `,
            }}
          />

          {/* Subtle Moving Drifting Fused Color Layer A (Transform-Only for 60fps Mobile Smoothness) */}
          <div
            data-testid="hero-logo-color-aura"
            className="absolute inset-[-6%] pointer-events-none animate-hero-orb-a will-change-transform"
            style={{
              background: `
                radial-gradient(ellipse 36% 26% at 36% 35%, rgba(255, 10, 84, 0.52) 0%, rgba(168, 85, 247, 0.24) 38%, transparent 72%),
                radial-gradient(ellipse 30% 24% at 56% 33%, rgba(245, 158, 11, 0.34) 0%, transparent 68%),
                radial-gradient(ellipse 30% 18% at 44% 66%, rgba(255, 10, 84, 0.48) 0%, rgba(168, 85, 247, 0.20) 40%, transparent 72%)
              `,
            }}
          />

          {/* Subtle Counter-Drifting Fused Color Layer B Focusing on Logo & Callout */}
          <div
            data-testid="hero-callout-color-aura"
            className="absolute inset-[-6%] pointer-events-none animate-hero-orb-b will-change-transform"
            style={{
              background: `
                radial-gradient(ellipse 36% 26% at 64% 35%, rgba(0, 229, 255, 0.50) 0%, rgba(16, 185, 129, 0.22) 38%, transparent 72%),
                radial-gradient(ellipse 32% 24% at 48% 36%, rgba(168, 85, 247, 0.42) 0%, transparent 68%),
                radial-gradient(ellipse 30% 18% at 56% 66%, rgba(0, 229, 255, 0.46) 0%, rgba(245, 158, 11, 0.20) 40%, transparent 72%)
              `,
            }}
          />

          {/* Outer Edge Darkening Vignette to Keep Focus Tightly on Center Logo & "اكتشف نكهات يالليل" */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 68% 62% at 50% 48%, transparent 25%, rgba(2, 3, 8, 0.58) 72%, rgba(0, 0, 0, 0.86) 100%)',
            }}
          />
        </div>
      )}
    </div>
  );
};
