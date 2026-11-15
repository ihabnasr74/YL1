import React from 'react';
import { FlavorItem, ParticleMotif } from '../data/flavors';
import { InterpolatedEnvironment, clamp } from '../utils/scrollMath';

interface FlavorParticlesProps {
  flavors: FlavorItem[];
  continuousIndex: number;
  env: InterpolatedEnvironment;
  mouseX: number;
  mouseY: number;
  isMobile: boolean;
}

interface IngredientSpec {
  id: number;
  angleDeg: number;
  radiusX: number;
  radiusY: number;
  size: number;
  depthFactor: number; // < 1 behind jar, > 1 foreground orbit
  variant: 'primary' | 'secondary';
  baseRotate: number;
  spinFactor: number;
}

// Balanced 12-element multi-depth 3D halo framing the active product tub (8 on mobile for 60fps)
const INGREDIENT_ORBIT: IngredientSpec[] = [
  // Inner-mid ring directly framing the jar
  { id: 1, angleDeg: -135, radiusX: 225, radiusY: 165, size: 92, depthFactor: 1.35, variant: 'primary', baseRotate: -16, spinFactor: 95 },
  { id: 2, angleDeg: -45, radiusX: 230, radiusY: 165, size: 88, depthFactor: 1.28, variant: 'secondary', baseRotate: 22, spinFactor: -85 },
  { id: 3, angleDeg: 138, radiusX: 235, radiusY: 165, size: 94, depthFactor: 1.42, variant: 'secondary', baseRotate: 14, spinFactor: 110 },
  { id: 4, angleDeg: 42, radiusX: 225, radiusY: 165, size: 92, depthFactor: 1.38, variant: 'primary', baseRotate: -26, spinFactor: -105 },
  // Close halo directly behind the jar edges
  { id: 5, angleDeg: -95, radiusX: 175, radiusY: 225, size: 78, depthFactor: 0.88, variant: 'primary', baseRotate: 8, spinFactor: 65 },
  { id: 6, angleDeg: 95, radiusX: 185, radiusY: 220, size: 76, depthFactor: 0.9, variant: 'secondary', baseRotate: -12, spinFactor: -70 },
  { id: 7, angleDeg: -172, radiusX: 215, radiusY: 120, size: 82, depthFactor: 1.15, variant: 'secondary', baseRotate: 18, spinFactor: 80 },
  { id: 8, angleDeg: 8, radiusX: 215, radiusY: 120, size: 84, depthFactor: 1.18, variant: 'primary', baseRotate: -20, spinFactor: -85 },
  // Outer dynamic orbit
  { id: 9, angleDeg: -118, radiusX: 325, radiusY: 265, size: 106, depthFactor: 1.65, variant: 'primary', baseRotate: 32, spinFactor: 130 },
  { id: 10, angleDeg: -62, radiusX: 330, radiusY: 260, size: 102, depthFactor: 1.6, variant: 'secondary', baseRotate: -36, spinFactor: -125 },
  { id: 11, angleDeg: 120, radiusX: 320, radiusY: 265, size: 72, depthFactor: 0.76, variant: 'primary', baseRotate: 42, spinFactor: 55 },
  { id: 12, angleDeg: 62, radiusX: 325, radiusY: 260, size: 74, depthFactor: 0.78, variant: 'secondary', baseRotate: -48, spinFactor: -60 },
  // Extra kinetic accents around upper & lower wings
  { id: 13, angleDeg: -154, radiusX: 295, radiusY: 195, size: 70, depthFactor: 0.92, variant: 'primary', baseRotate: -14, spinFactor: 75 },
  { id: 14, angleDeg: -22, radiusX: 295, radiusY: 195, size: 72, depthFactor: 0.94, variant: 'secondary', baseRotate: 25, spinFactor: -78 },
  { id: 15, angleDeg: 158, radiusX: 285, radiusY: 205, size: 68, depthFactor: 1.22, variant: 'secondary', baseRotate: -28, spinFactor: 90 },
  { id: 16, angleDeg: 24, radiusX: 290, radiusY: 205, size: 70, depthFactor: 1.25, variant: 'primary', baseRotate: 19, spinFactor: -92 },
];

function renderIceCubeSvg(uid: string, tint = '#7dd3fc') {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id={`ice-cube-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="50%" stopColor={tint} stopOpacity="0.68" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.52" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="54" r="40" fill="#000000" fillOpacity="0.28" />
      <polygon
        points="50,10 86,28 86,70 50,88 14,70 14,28"
        fill={`url(#ice-cube-${uid})`}
        stroke="#e0f2fe"
        strokeWidth="2.4"
      />
      <polygon
        points="50,10 86,28 50,46 14,28"
        fill="#ffffff"
        fillOpacity="0.78"
      />
      <polygon
        points="50,46 86,28 86,70 50,88"
        fill="#38bdf8"
        fillOpacity="0.42"
      />
      <path
        d="M26,34 L46,44 L46,76"
        stroke="#ffffff"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Renders rich, 3D-shaded cinematic SVG artwork matching each flavor's real ingredients
 */
function renderCinematicIngredient(
  motif: ParticleMotif,
  variant: 'primary' | 'secondary',
  uid: string
) {
  switch (motif) {
    case 'frosty-lemon':
      if (variant === 'primary') {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <circle cx="50" cy="54" r="40" fill="#000000" fillOpacity="0.32" />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="#facc15"
              stroke="#fef08a"
              strokeWidth="3"
            />
            <circle cx="50" cy="50" r="32" fill="#fef9c3" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <path
                key={deg}
                d="M50,50 L43,22 A28,28 0 0,1 57,22 Z"
                fill="#eab308"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="5" fill="#fef9c3" />
          </svg>
        );
      }
      return renderIceCubeSvg(uid, '#bae6fd');

    case 'frosty-mango':
      if (variant === 'primary') {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <radialGradient id={`mango-${uid}`} cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="56" r="37" fill="#000000" fillOpacity="0.32" />
            <circle
              cx="50"
              cy="52"
              r="35"
              fill="#9f1239"
              stroke="#fda4af"
              strokeWidth="2.5"
            />
            <circle cx="50" cy="52" r="29" fill="#fff1f2" />
            <circle cx="50" cy="52" r="24" fill={`url(#mango-${uid})`} />
            {[
              [42, 44],
              [56, 43],
              [48, 52],
              [39, 55],
              [59, 54],
              [46, 61],
              [54, 60],
            ].map(([sx, sy], i) => (
              <ellipse
                key={i}
                cx={sx}
                cy={sy}
                rx="2.6"
                ry="3.6"
                fill="#451a03"
                stroke="#fef08a"
                strokeWidth="0.8"
              />
            ))}
          </svg>
        );
      }
      return renderIceCubeSvg(uid, '#7dd3fc');

    case 'lychee-ice':
      if (variant === 'primary') {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <circle cx="50" cy="56" r="36" fill="#000000" fillOpacity="0.32" />
            <circle
              cx="50"
              cy="52"
              r="34"
              fill="#e11d48"
              stroke="#fda4af"
              strokeWidth="2.5"
              strokeDasharray="6 3"
            />
            <path
              d="M22,52 A28,25 0 1,1 78,52 Q50,68 22,52 Z"
              fill="#fff1f2"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <ellipse cx="50" cy="48" rx="10" ry="7" fill="#881337" />
            <ellipse cx="44" cy="38" rx="9" ry="4.5" fill="#ffffff" />
          </svg>
        );
      }
      return renderIceCubeSvg(uid, '#fecdd3');

    case 'double-apple':
      if (variant === 'primary') {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <radialGradient id={`red-apple-${uid}`} cx="35%" cy="30%" r="68%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="45%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="58" r="34" fill="#000000" fillOpacity="0.32" />
            <path
              d="M48,24 Q50,10 58,12"
              stroke="#78350f"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M52,20 C64,10 78,14 74,26 C64,28 56,24 52,20 Z"
              fill="#22c55e"
              stroke="#86efac"
              strokeWidth="1.5"
            />
            <path
              d="M50,26 C34,20 16,32 18,54 C20,76 36,88 48,84 C50,83 50,83 52,84 C64,88 80,76 82,54 C84,32 66,20 50,26 Z"
              fill={`url(#red-apple-${uid})`}
              stroke="#fecaca"
              strokeWidth="1.5"
            />
            <ellipse
              cx="34"
              cy="42"
              rx="7"
              ry="12"
              fill="#ffffff"
              fillOpacity="0.55"
              transform="rotate(-20 34 42)"
            />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id={`grn-apple-${uid}`} cx="35%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#ecfccb" />
              <stop offset="48%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#15803d" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="58" r="34" fill="#000000" fillOpacity="0.32" />
          <path
            d="M48,24 Q50,10 58,12"
            stroke="#78350f"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M50,26 C34,20 16,32 18,54 C20,76 36,88 48,84 C50,83 50,83 52,84 C64,88 80,76 82,54 C84,32 66,20 50,26 Z"
            fill={`url(#grn-apple-${uid})`}
            stroke="#d9f99d"
            strokeWidth="1.5"
          />
          <ellipse
            cx="34"
            cy="42"
            rx="7"
            ry="12"
            fill="#ffffff"
            fillOpacity="0.6"
            transform="rotate(-20 34 42)"
          />
        </svg>
      );

    case 'eskandarani-apple':
      if (variant === 'primary') {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <radialGradient id={`esk-apple-${uid}`} cx="35%" cy="30%" r="68%">
                <stop offset="0%" stopColor="#f7fee7" />
                <stop offset="48%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#365314" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="58" r="34" fill="#000000" fillOpacity="0.32" />
            <path
              d="M48,24 Q50,10 58,12"
              stroke="#78350f"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M52,20 C64,10 80,14 76,26 C64,28 56,24 52,20 Z"
              fill="#4d7c0f"
              stroke="#bef264"
              strokeWidth="1.5"
            />
            <path
              d="M50,26 C34,20 16,32 18,54 C20,76 36,88 48,84 C50,83 50,83 52,84 C64,88 80,76 82,54 C84,32 66,20 50,26 Z"
              fill={`url(#esk-apple-${uid})`}
              stroke="#d9f99d"
              strokeWidth="1.5"
            />
            <ellipse
              cx="34"
              cy="42"
              rx="7"
              ry="12"
              fill="#ffffff"
              fillOpacity="0.6"
              transform="rotate(-20 34 42)"
            />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path
            d="M16,42 A36,34 0 0,0 84,42 Z"
            fill="#65a30d"
            stroke="#bef264"
            strokeWidth="2.5"
          />
          <path d="M21,42 A31,29 0 0,0 79,42 Z" fill="#fefce8" />
          <circle cx="46" cy="52" r="2.6" fill="#451a03" />
          <circle cx="54" cy="52" r="2.6" fill="#451a03" />
        </svg>
      );

    case 'mint-leaf':
      if (variant === 'primary') {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`mint-p-${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="55%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
            </defs>
            <path
              d="M18,80 C14,42 44,14 84,14 C82,54 54,82 18,80 Z"
              fill={`url(#mint-p-${uid})`}
              stroke="#a7f3d0"
              strokeWidth="2.2"
            />
            <path
              d="M18,80 Q50,48 82,16 M38,60 L28,40 M56,44 L46,24 M44,58 L66,64"
              stroke="#ecfdf5"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path
            d="M24,74 C22,42 48,20 78,22 C76,52 52,76 24,74 Z"
            fill="#34d399"
            fillOpacity="0.88"
            stroke="#d1fae5"
            strokeWidth="2"
          />
          <path
            d="M26,72 Q52,48 76,24"
            stroke="#ffffff"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'red-kiss':
    default:
      if (variant === 'primary') {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`kiss-${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="45%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
            </defs>
            <path
              d="M12,50 C24,32 38,30 50,40 C62,30 76,32 88,50 C72,48 60,52 50,52 C40,52 28,48 12,50 Z"
              fill={`url(#kiss-${uid})`}
              stroke="#fecdd3"
              strokeWidth="1.8"
            />
            <path
              d="M12,50 C28,74 72,74 88,50 C70,54 30,54 12,50 Z"
              fill={`url(#kiss-${uid})`}
              stroke="#fecdd3"
              strokeWidth="1.8"
            />
            <path
              d="M32,58 Q50,65 68,58"
              stroke="#ffffff"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeOpacity="0.75"
            />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id={`petal-${uid}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
          </defs>
          <path
            d="M50,14 C76,14 86,42 74,66 C64,84 36,84 26,66 C14,42 24,14 50,14 Z"
            fill={`url(#petal-${uid})`}
            stroke="#fecdd3"
            strokeWidth="2"
          />
          <ellipse
            cx="38"
            cy="36"
            rx="8"
            ry="14"
            fill="#ffffff"
            fillOpacity="0.45"
            transform="rotate(-18 38 36)"
          />
        </svg>
      );
  }
}

export const FlavorParticles: React.FC<FlavorParticlesProps> = ({
  flavors,
  continuousIndex,
  env,
  mouseX,
  mouseY,
  isMobile,
}) => {
  if (env.heroProgress <= 0.05) return null;

  const activePulse = Math.max(0, continuousIndex) * 90;
  const orbitItems = isMobile
    ? INGREDIENT_ORBIT.slice(0, 8)
    : INGREDIENT_ORBIT.slice(0, 12);
  const cullThreshold = isMobile ? 0.78 : 0.92;
  const mx = isMobile ? 0 : mouseX;
  const my = isMobile ? 0 : mouseY;

  return (
    <div
      data-testid="flavor-particles-layer"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-15"
      aria-hidden="true"
    >
      {flavors.map((flavor, flavorIdx) => {
        const delta = flavorIdx - Math.max(0, continuousIndex);
        const absDelta = Math.abs(delta);
        if (absDelta > cullThreshold) return null;

        const clusterOpacity =
          clamp(1 - Math.pow(absDelta / 0.85, 1.4), 0, 1) * env.heroProgress;
        const radialBurst = 1 + absDelta * 0.45 + (1 - env.heroProgress) * 0.3;
        const verticalDrift = delta * 220;

        return (
          <div
            key={flavor.id}
            className="absolute left-1/2 top-[33.5%] lg:left-[67.5%] lg:top-[55.5%] -translate-x-1/2 -translate-y-1/2 scale-[0.54] sm:scale-[0.76] lg:scale-100 flex items-center justify-center"
            style={{
              opacity: clusterOpacity,
            }}
          >
            {/* Dynamic Moving Aura Ring & Pulsing Light Halo Directly Behind Product Tub */}
            <div
              className="absolute w-[280px] h-[280px] sm:w-[390px] sm:h-[390px] lg:w-[540px] lg:h-[540px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${flavor.primaryColor}58 0%, ${flavor.secondaryColor}2c 48%, transparent 72%)`,
                transform: isMobile
                  ? undefined
                  : `translate3d(${-mx * 24}px, ${-my * 18}px, 0)`,
              }}
            />

            {/* Rotating Dashed Energy Ring Behind Tub */}
            <div
              className="absolute w-[250px] h-[250px] sm:w-[340px] sm:h-[340px] lg:w-[460px] lg:h-[460px] rounded-full"
              style={{
                border: `1.5px dashed ${flavor.secondaryColor}88`,
                boxShadow: isMobile
                  ? 'none'
                  : `0 0 28px ${flavor.primaryColor}48, inset 0 0 20px ${flavor.primaryColor}28`,
                transform: `translate3d(${-mx * 18}px, ${-my * 14}px, 0) rotate(${
                  activePulse + flavorIdx * 45
                }deg)`,
              }}
            />

            {/* Multi-Depth Floating & Spinning Ingredients */}
            {orbitItems.map((spec) => {
              const rad = (spec.angleDeg * Math.PI) / 180;
              const spiralAngle =
                rad + delta * 0.65 * (spec.id % 2 === 0 ? 1 : -1);

              const x =
                Math.cos(spiralAngle) * spec.radiusX * radialBurst -
                mx * 42 * spec.depthFactor;
              const y =
                Math.sin(spiralAngle) * spec.radiusY * radialBurst +
                verticalDrift * spec.depthFactor -
                my * 32 * spec.depthFactor;

              const depthScale = clamp(
                0.72 + (spec.depthFactor - 0.75) * 0.45 - absDelta * 0.18,
                0.55,
                1.35
              );

              const rotationZ =
                spec.baseRotate +
                (continuousIndex - flavorIdx) * spec.spinFactor;

              return (
                <div
                  key={spec.id}
                  className="absolute will-change-transform"
                  style={{
                    width: `${spec.size}px`,
                    height: `${spec.size}px`,
                    transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(
                      1
                    )}px, 0) scale(${depthScale.toFixed(
                      2
                    )}) rotate(${rotationZ.toFixed(1)}deg)`,
                  }}
                >
                  <div
                    className={`w-full h-full ${
                      spec.id % 2 === 0 ? 'animate-float-a' : 'animate-float-b'
                    }`}
                    style={{
                      animationDelay: `${spec.id * -0.4}s`,
                    }}
                  >
                    {renderCinematicIngredient(
                      flavor.motif,
                      spec.variant,
                      `${flavor.id}-${spec.id}`
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
