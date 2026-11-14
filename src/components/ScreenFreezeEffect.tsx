import React from 'react';
import { InterpolatedEnvironment, clamp } from '../utils/scrollMath';

interface ScreenFreezeEffectProps {
  env: InterpolatedEnvironment;
  activeIndex: number;
  mouseX: number;
  mouseY: number;
}

interface FallingSnowCrystal {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  speed: 'a' | 'b' | 'fast';
}

interface SnowDustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  variant: 'a' | 'b' | 'fast';
}

// 20 Delicate Crystalline 6-Pointed Snowflakes Gently Falling Across the Screen
const FALLING_SNOW_CRYSTALS: FallingSnowCrystal[] = [
  { id: 1, x: 6, y: 18, size: 18, delay: 0.4, speed: 'a' },
  { id: 2, x: 14, y: 42, size: 14, delay: 2.1, speed: 'b' },
  { id: 3, x: 22, y: 26, size: 20, delay: 4.5, speed: 'fast' },
  { id: 4, x: 31, y: 64, size: 15, delay: 1.2, speed: 'a' },
  { id: 5, x: 39, y: 15, size: 17, delay: 3.6, speed: 'b' },
  { id: 6, x: 47, y: 52, size: 14, delay: 5.2, speed: 'fast' },
  { id: 7, x: 54, y: 28, size: 19, delay: 0.9, speed: 'a' },
  { id: 8, x: 62, y: 72, size: 15, delay: 2.8, speed: 'b' },
  { id: 9, x: 70, y: 36, size: 18, delay: 4.1, speed: 'fast' },
  { id: 10, x: 78, y: 19, size: 16, delay: 1.7, speed: 'a' },
  { id: 11, x: 86, y: 58, size: 20, delay: 3.3, speed: 'b' },
  { id: 12, x: 93, y: 32, size: 15, delay: 5.0, speed: 'fast' },
  { id: 13, x: 10, y: 78, size: 16, delay: 2.4, speed: 'a' },
  { id: 14, x: 26, y: 84, size: 17, delay: 6.1, speed: 'b' },
  { id: 15, x: 44, y: 82, size: 15, delay: 1.5, speed: 'a' },
  { id: 16, x: 59, y: 12, size: 16, delay: 4.8, speed: 'b' },
  { id: 17, x: 74, y: 80, size: 18, delay: 0.6, speed: 'fast' },
  { id: 18, x: 89, y: 84, size: 16, delay: 3.9, speed: 'a' },
  { id: 19, x: 18, y: 10, size: 15, delay: 5.5, speed: 'b' },
  { id: 20, x: 82, y: 44, size: 17, delay: 2.0, speed: 'fast' },
];

// 40 Continuous Falling Snow Flakes Across the Stage for Ice Flavors
const BACKGROUND_SNOW_DUST: SnowDustParticle[] = [
  { id: 1, x: 4, y: 14, size: 6.5, delay: 0.2, variant: 'a' },
  { id: 2, x: 9, y: 34, size: 5, delay: 1.4, variant: 'b' },
  { id: 3, x: 14, y: 58, size: 7, delay: 2.1, variant: 'fast' },
  { id: 4, x: 19, y: 22, size: 5.5, delay: 0.7, variant: 'b' },
  { id: 5, x: 24, y: 74, size: 6, delay: 3.2, variant: 'a' },
  { id: 6, x: 29, y: 42, size: 4.5, delay: 1.9, variant: 'b' },
  { id: 7, x: 34, y: 18, size: 7, delay: 0.5, variant: 'fast' },
  { id: 8, x: 39, y: 64, size: 5, delay: 2.7, variant: 'b' },
  { id: 9, x: 44, y: 31, size: 6, delay: 1.1, variant: 'a' },
  { id: 10, x: 49, y: 82, size: 7.5, delay: 3.6, variant: 'b' },
  { id: 11, x: 54, y: 27, size: 5, delay: 0.9, variant: 'fast' },
  { id: 12, x: 59, y: 53, size: 6.5, delay: 2.3, variant: 'b' },
  { id: 13, x: 64, y: 16, size: 5.5, delay: 1.6, variant: 'a' },
  { id: 14, x: 69, y: 68, size: 7, delay: 2.9, variant: 'b' },
  { id: 15, x: 74, y: 38, size: 4.5, delay: 0.4, variant: 'fast' },
  { id: 16, x: 79, y: 76, size: 6, delay: 2.0, variant: 'b' },
  { id: 17, x: 84, y: 24, size: 5.5, delay: 1.2, variant: 'a' },
  { id: 18, x: 89, y: 52, size: 7, delay: 3.1, variant: 'b' },
  { id: 19, x: 94, y: 19, size: 6, delay: 0.8, variant: 'fast' },
  { id: 20, x: 97, y: 66, size: 5, delay: 2.5, variant: 'b' },
  { id: 21, x: 7, y: 84, size: 6, delay: 4.1, variant: 'a' },
  { id: 22, x: 16, y: 46, size: 5, delay: 5.4, variant: 'b' },
  { id: 23, x: 22, y: 12, size: 4.5, delay: 1.0, variant: 'fast' },
  { id: 24, x: 27, y: 88, size: 5.5, delay: 4.7, variant: 'b' },
  { id: 25, x: 32, y: 50, size: 4.5, delay: 0.6, variant: 'a' },
  { id: 26, x: 37, y: 85, size: 6, delay: 2.8, variant: 'b' },
  { id: 27, x: 42, y: 10, size: 6.5, delay: 1.3, variant: 'fast' },
  { id: 28, x: 47, y: 60, size: 5.5, delay: 4.3, variant: 'b' },
  { id: 29, x: 52, y: 40, size: 6, delay: 2.4, variant: 'a' },
  { id: 30, x: 57, y: 86, size: 5.5, delay: 1.8, variant: 'b' },
  { id: 31, x: 62, y: 32, size: 6.5, delay: 4.9, variant: 'fast' },
  { id: 32, x: 67, y: 48, size: 5, delay: 2.6, variant: 'b' },
  { id: 33, x: 72, y: 14, size: 6, delay: 1.5, variant: 'a' },
  { id: 34, x: 77, y: 89, size: 6.5, delay: 3.8, variant: 'b' },
  { id: 35, x: 82, y: 62, size: 5.5, delay: 2.1, variant: 'fast' },
  { id: 36, x: 87, y: 35, size: 5, delay: 4.4, variant: 'b' },
  { id: 37, x: 92, y: 78, size: 6, delay: 3.0, variant: 'a' },
  { id: 38, x: 12, y: 26, size: 6.5, delay: 5.1, variant: 'b' },
  { id: 39, x: 56, y: 70, size: 5, delay: 1.9, variant: 'a' },
  { id: 40, x: 91, y: 44, size: 6, delay: 2.8, variant: 'b' },
];

/**
 * Renders an intensified, organic window-frost & branching ice crystal corner
 * using pure GPU-friendly SVG gradients and layered strokes.
 */
const OrganicCornerFrost: React.FC<{
  cornerId: string;
  iceTint: string;
  primaryColor: string;
  secondaryColor: string;
  mirrorX?: boolean;
  mirrorY?: boolean;
  scaleSize?: number;
}> = ({
  cornerId,
  iceTint,
  primaryColor,
  secondaryColor,
  mirrorX = false,
  mirrorY = false,
  scaleSize = 1,
}) => {
  const flipTransform = `${mirrorX ? 'scaleX(-1)' : ''} ${
    mirrorY ? 'scaleY(-1)' : ''
  } scale(${scaleSize})`;

  return (
    <svg
      viewBox="0 0 420 340"
      className="w-[52vw] max-w-[510px] h-auto overflow-visible"
      style={{
        transform: flipTransform,
        transformOrigin: 'center',
      }}
    >
      <defs>
        <radialGradient
          id={`frostSheet-${cornerId}`}
          cx="0%"
          cy="0%"
          r="98%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
          <stop offset="36%" stopColor={iceTint} stopOpacity="0.62" />
          <stop offset="70%" stopColor={secondaryColor} stopOpacity="0.28" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
        </radialGradient>

        <linearGradient
          id={`needleGrad-${cornerId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="58%" stopColor={iceTint} stopOpacity="0.82" />
          <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.18" />
        </linearGradient>
      </defs>

      {/* Deep Organic Window Frost Mist Sheet */}
      <path
        d="M0,0 L415,0 C325,38 260,76 202,128 C146,178 96,240 0,338 Z"
        fill={`url(#frostSheet-${cornerId})`}
      />

      {/* Sharp Translucent Feathered Ice Crystal Spikes & Needles */}
      <g fill={`url(#needleGrad-${cornerId})`}>
        <polygon points="0,0 335,0 268,26 180,18 122,38 0,26" />
        <polygon points="0,0 26,285 38,200 20,134 44,86" />
        <polygon points="0,0 215,56 276,122 184,90 100,58" />
        <polygon points="0,0 122,148 174,226 92,174 44,102" />
        <polygon points="42,14 174,30 228,68 146,48" />
        <polygon points="16,52 66,154 46,214 26,126" />
        <polygon points="75,38 202,86 248,144 156,106" />
        <polygon points="34,92 114,192 142,254 72,194" />
      </g>

      {/* Outer Soft Ice Halo Stroke */}
      <g
        fill="none"
        stroke={iceTint}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.45"
        strokeWidth="6"
      >
        <path
          d="M0,0 Q78,46 162,102 T285,186
             M64,38 L118,20 M64,38 L46,88
             M112,68 L172,44 M112,68 L92,126
             M168,104 L228,80 M168,104 L146,158"
        />
      </g>

      {/* Crisp White Branching Fern-Frost Dendrites (Creeping Ice Veins) */}
      <g
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Primary Diagonal Fern-Frost Branch */}
        <path
          d="M0,0 Q78,46 162,102 T285,186
             M64,38 L118,20 M64,38 L46,88
             M112,68 L172,44 M112,68 L92,126
             M168,104 L228,80 M168,104 L146,158
             M222,142 L272,122 M222,142 L198,188"
          strokeWidth="2.2"
          strokeOpacity="0.96"
        />

        {/* Upper Border Frost Branch */}
        <path
          d="M8,3 Q132,14 268,10 T390,22
             M82,9 L126,38 M168,10 L216,44 M254,10 L298,38 M322,14 L362,36
             M108,24 L142,20 M192,28 L228,24"
          strokeWidth="1.8"
          strokeOpacity="0.9"
        />

        {/* Side Border Frost Branch */}
        <path
          d="M4,10 Q16,115 12,220 T26,305
             M12,72 L46,112 M13,145 L52,184 M15,215 L46,252"
          strokeWidth="1.8"
          strokeOpacity="0.9"
        />

        {/* Delicate Hexagonal Star-Crystals at Branch Tips */}
        <g transform="translate(162, 102)" strokeWidth="1.8" strokeOpacity="0.96">
          <line x1="-13" y1="0" x2="13" y2="0" />
          <line x1="-6.5" y1="-11" x2="6.5" y2="11" />
          <line x1="-6.5" y1="11" x2="6.5" y2="-11" />
        </g>
        <g transform="translate(216, 44)" strokeWidth="1.6" strokeOpacity="0.92">
          <line x1="-11" y1="0" x2="11" y2="0" />
          <line x1="-5.5" y1="-9.5" x2="5.5" y2="9.5" />
          <line x1="-5.5" y1="9.5" x2="5.5" y2="-9.5" />
        </g>
        <g transform="translate(285, 186)" strokeWidth="1.6" strokeOpacity="0.92">
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="-5" y1="-8.6" x2="5" y2="8.6" />
          <line x1="-5" y1="8.6" x2="5" y2="-8.6" />
        </g>
      </g>
    </svg>
  );
};

export const ScreenFreezeEffect: React.FC<ScreenFreezeEffectProps> = ({
  env,
  activeIndex,
  mouseX,
  mouseY,
}) => {
  const freeze = clamp(env.freezeIntensity, 0, 1);
  // Both background snowfall and foreground corner freeze ramp in as the showcase emerges from the Hero Stage
  const showcaseFreezeOpacity =
    freeze * clamp((env.heroProgress - 0.1) / 0.82, 0, 1);

  if (showcaseFreezeOpacity <= 0.01) {
    return null;
  }

  return (
    <>
      {/* BACKGROUND LAYER (z-10, behind product jar): Silky-Smooth Falling Snowflakes Across the Screen for Ice Flavors */}
      <div
        data-testid="background-snow-dust"
        className="fixed inset-0 pointer-events-none select-none overflow-hidden z-10"
        style={{
          opacity: showcaseFreezeOpacity,
          transform: `translate3d(${-mouseX * 14}px, ${-mouseY * 10}px, 0)`,
        }}
        aria-hidden="true"
      >
        {BACKGROUND_SNOW_DUST.map((flake) => {
          const animClass =
            flake.variant === 'fast'
              ? 'animate-snow-fall-fast'
              : flake.variant === 'a'
              ? 'animate-snow-fall-a'
              : 'animate-snow-fall-b';

          return (
            <div
              key={flake.id}
              className={`absolute rounded-full ${animClass}`}
              style={{
                left: `${flake.x}%`,
                top: `${flake.y}%`,
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                backgroundColor: '#ffffff',
                boxShadow: `0 0 ${flake.size * 2.2}px #ffffff, 0 0 ${
                  flake.size * 3.8
                }px ${env.iceTint}`,
                animationDelay: `-${flake.delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* FOREGROUND LAYER (z-25): Intensified Window Frost Vignette, Top/Bottom Ice Fringes, Corner Ice Crystals & Falling Snow Crystals */}
      <div
        key={`freeze-stage-${activeIndex}`}
        data-testid="screen-freeze-overlay"
        data-freeze-intensity={showcaseFreezeOpacity.toFixed(2)}
        className="fixed inset-0 pointer-events-none select-none overflow-hidden z-25"
        style={{
          opacity: showcaseFreezeOpacity,
        }}
        aria-hidden="true"
      >
        {/* Layer 1: Intensified Frosted Window Vignette Around Screen Perimeter */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 62% 58% at 50% 46%, transparent 42%, ${env.iceTint}3d 68%, ${env.secondaryColor}66 86%, #ffffffa6 100%)`,
            boxShadow: `inset 0 0 125px ${env.primaryColor}70, inset 0 0 60px ${env.iceTint}cc, inset 0 0 22px #ffffffdd`,
          }}
        />

        {/* Layer 2: Top & Bottom Sub-Zero Cryogenic Mist Plumes */}
        <div
          className="absolute inset-x-[-8%] top-[-4%] h-[24vh] mix-blend-screen"
          style={{
            opacity: 0.76,
            background: `radial-gradient(ellipse 70% 80% at 50% 0%, #ffffff 0%, ${env.iceTint} 48%, transparent 80%)`,
          }}
        />
        <div
          className="absolute inset-x-[-8%] bottom-[-5%] h-[22vh] mix-blend-screen"
          style={{
            opacity: 0.62,
            background: `radial-gradient(ellipse 70% 75% at 55% 100%, #ffffff 0%, ${env.iceTint} 48%, transparent 80%)`,
          }}
        />

        {/* Top-Center Crystalline Icicle Fringe */}
        <svg
          viewBox="0 0 800 90"
          className="
            absolute top-0 left-1/2 -translate-x-1/2
            w-[76vw] max-w-[820px] h-auto opacity-85
          "
          preserveAspectRatio="none"
        >
          <polygon
            points="0,0 800,0 740,22 680,10 630,38 575,14 520,46 465,16 400,56 340,18 285,44 225,12 170,36 115,10 55,24"
            fill="#ffffff"
            fillOpacity="0.62"
          />
          <polygon
            points="80,0 720,0 650,16 590,30 500,12 400,40 310,14 210,28 140,12"
            fill={env.iceTint}
            fillOpacity="0.52"
          />
        </svg>

        {/* Layer 3: Corner & Edge Crystalline Frost Formations */}
        {/* Top-Left Corner Frost */}
        <div
          className="absolute top-0 left-0 will-change-transform"
          style={{
            transform: `translate3d(${-mouseX * 6}px, ${-mouseY * 6}px, 0)`,
          }}
        >
          <OrganicCornerFrost
            cornerId="tl"
            iceTint={env.iceTint}
            primaryColor={env.primaryColor}
            secondaryColor={env.secondaryColor}
          />
        </div>

        {/* Top-Right Corner Frost */}
        <div
          className="absolute top-0 right-0 will-change-transform"
          style={{
            transform: `translate3d(${-mouseX * 6}px, ${-mouseY * 6}px, 0)`,
          }}
        >
          <OrganicCornerFrost
            cornerId="tr"
            iceTint={env.iceTint}
            primaryColor={env.primaryColor}
            secondaryColor={env.secondaryColor}
            mirrorX
          />
        </div>

        {/* Bottom-Right Corner Frost */}
        <div
          className="absolute bottom-0 right-0 will-change-transform"
          style={{
            transform: `translate3d(${-mouseX * 6}px, ${-mouseY * 6}px, 0)`,
          }}
        >
          <OrganicCornerFrost
            cornerId="br"
            iceTint={env.iceTint}
            primaryColor={env.primaryColor}
            secondaryColor={env.secondaryColor}
            mirrorX
            mirrorY
          />
        </div>

        {/* Bottom-Left Rim Frost (Intensified) */}
        <div
          className="absolute bottom-0 left-0 opacity-80 will-change-transform"
          style={{
            transform: `translate3d(${-mouseX * 4}px, ${-mouseY * 4}px, 0)`,
          }}
        >
          <OrganicCornerFrost
            cornerId="bl"
            iceTint={env.iceTint}
            primaryColor={env.primaryColor}
            secondaryColor={env.secondaryColor}
            mirrorY
            scaleSize={0.76}
          />
        </div>

        {/* Layer 4: 20 Crystalline 6-Pointed Snowflakes Gently Falling Across the Screen */}
        {FALLING_SNOW_CRYSTALS.map((crystal) => {
          const animClass =
            crystal.speed === 'fast'
              ? 'animate-snow-fall-fast'
              : crystal.speed === 'a'
              ? 'animate-snow-fall-a'
              : 'animate-snow-fall-b';

          return (
            <div
              key={crystal.id}
              className={`absolute ${animClass}`}
              style={{
                left: `${crystal.x}%`,
                top: `${crystal.y}%`,
                width: `${crystal.size}px`,
                height: `${crystal.size}px`,
                animationDelay: `-${crystal.delay}s`,
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill={env.iceTint}
                  fillOpacity="0.38"
                />
                {/* 6-Branch Snowflake Crystal */}
                <g
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="3.3" y1="7" x2="20.7" y2="17" />
                  <line x1="3.3" y1="17" x2="20.7" y2="7" />
                  <circle cx="12" cy="12" r="2.2" fill="#ffffff" />
                </g>
              </svg>
            </div>
          );
        })}
      </div>
    </>
  );
};
