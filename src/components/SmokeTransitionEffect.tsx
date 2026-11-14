import React from 'react';
import {
  InterpolatedEnvironment,
  computeTransitionSmokeIntensity,
  clamp,
  withAlpha,
} from '../utils/scrollMath';

interface SmokeTransitionEffectProps {
  env: InterpolatedEnvironment;
  continuousIndex: number;
  activeIndex: number;
  mouseX: number;
  mouseY: number;
}

export const SmokeTransitionEffect: React.FC<SmokeTransitionEffectProps> = ({
  env,
  continuousIndex,
  mouseX,
  mouseY,
}) => {
  const smokeIntensity = computeTransitionSmokeIntensity(continuousIndex, 0);

  if (smokeIntensity <= 0.02) {
    return null;
  }

  // Surge component: 0 when settled on a flavor, up to 1.0 when transitioning between flavors
  const transitionSurge = clamp((smokeIntensity - 0.24) / 0.76, 0, 1);
  if (transitionSurge <= 0.02) {
    return null;
  }

  const phase = Math.max(0, continuousIndex) * Math.PI * 2;
  const horizontalSweep = Math.sin(phase) * 110;
  const counterSweep = Math.cos(phase) * 85;
  const verticalBillow = -transitionSurge * 54;

  const pStrong = withAlpha(env.primaryColor, 0.54);
  const pFaint = withAlpha(env.primaryColor, 0.16);
  const sStrong = withAlpha(env.secondaryColor, 0.48);

  return (
    <div
      data-testid="shisha-smoke-transition-surge"
      data-smoke-intensity={smokeIntensity.toFixed(2)}
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-22"
      style={{
        opacity: clamp(transitionSurge * 0.95, 0, 1),
      }}
      aria-hidden="true"
    >
      {/* Primary Billowing Shisha Smoke Cloud Sweeping Across the Stage */}
      <div
        className="absolute left-[62%] top-[55%] -translate-x-1/2 -translate-y-1/2 w-[780px] h-[520px] will-change-transform"
        style={{
          transform: `translate3d(${(horizontalSweep - mouseX * 18).toFixed(1)}px, ${(verticalBillow - mouseY * 12).toFixed(1)}px, 0) scale(${(0.92 + transitionSurge * 0.24).toFixed(3)})`,
          background: `
            radial-gradient(ellipse 44% 44% at 58% 48%, rgba(255, 255, 255, 0.56) 0%, ${pStrong} 34%, ${pFaint} 56%, transparent 74%),
            radial-gradient(ellipse 42% 40% at 36% 54%, rgba(255, 255, 255, 0.46) 0%, ${sStrong} 36%, transparent 72%),
            radial-gradient(ellipse 46% 36% at 52% 66%, rgba(255, 255, 255, 0.48) 0%, ${pStrong} 38%, transparent 74%)
          `,
        }}
      />

      {/* Counter-Swirling Vapor Plume */}
      <div
        className="absolute left-[44%] top-[52%] -translate-x-1/2 -translate-y-1/2 w-[640px] h-[440px] will-change-transform"
        style={{
          transform: `translate3d(${(-counterSweep + mouseX * 14).toFixed(1)}px, ${(verticalBillow * 0.7 + mouseY * 10).toFixed(1)}px, 0)`,
          background: `
            radial-gradient(ellipse 46% 44% at 50% 50%, rgba(255, 255, 255, 0.44) 0%, ${sStrong} 36%, transparent 72%)
          `,
        }}
      />
    </div>
  );
};
