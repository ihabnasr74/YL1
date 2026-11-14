import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { FlavorItem, ParticleMotif } from '../data/flavors';
import {
  InterpolatedEnvironment,
  computeLogoMorphState,
  smoothstep,
} from '../utils/scrollMath';

interface ScrollControlsProps {
  flavors: FlavorItem[];
  continuousIndex: number;
  logoHeroProgress: number;
  activeIndex: number;
  env: InterpolatedEnvironment;
  isMobile: boolean;
  mouseX: number;
  mouseY: number;
  onSelectFlavor: (index: number) => void;
  onScrollToHero: () => void;
}

/**
 * Renders a custom-crafted SVG icon inside the bottom badge circle
 * matching the exact shape/ingredient of each realistic flavor tub.
 */
function renderFlavorBadgeIcon(motif: ParticleMotif) {
  switch (motif) {
    case 'frosty-lemon':
      return (
        <svg
          data-motif="frosty-lemon"
          viewBox="0 0 36 36"
          className="w-5 h-5 sm:w-6 sm:h-6 overflow-visible"
        >
          <circle
            cx="18"
            cy="18"
            r="11.5"
            fill="#fef08a"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <circle cx="18" cy="18" r="8" fill="#facc15" />
          <line x1="18" y1="8" x2="18" y2="28" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="8" y1="18" x2="28" y2="18" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      );

    case 'frosty-mango':
      return (
        <svg
          data-motif="frosty-mango"
          viewBox="0 0 36 36"
          className="w-5 h-5 sm:w-6 sm:h-6 overflow-visible"
        >
          <circle
            cx="18"
            cy="18"
            r="11.5"
            fill="#fda4af"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <circle cx="18" cy="18" r="8.5" fill="#fbbf24" />
          <circle cx="15" cy="16" r="1.3" fill="#78350f" />
          <circle cx="21" cy="16" r="1.3" fill="#78350f" />
          <circle cx="18" cy="21" r="1.3" fill="#78350f" />
        </svg>
      );

    case 'lychee-ice':
      return (
        <svg
          data-motif="lychee-ice"
          viewBox="0 0 36 36"
          className="w-5 h-5 sm:w-6 sm:h-6 overflow-visible"
        >
          <circle
            cx="18"
            cy="19"
            r="11.5"
            fill="#fda4af"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="3 2"
          />
          <ellipse cx="18" cy="18" rx="8" ry="6.5" fill="#ffffff" />
          <ellipse cx="18" cy="17.5" rx="3" ry="2" fill="#881337" />
        </svg>
      );

    case 'double-apple':
      return (
        <svg
          data-motif="double-apple"
          viewBox="0 0 36 36"
          className="w-5 h-5 sm:w-6 sm:h-6 overflow-visible"
        >
          <circle
            cx="14"
            cy="19"
            r="8.5"
            fill="#4ade80"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <circle
            cx="22"
            cy="20"
            r="8.5"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <path d="M18,7 Q20,3 24,5" stroke="#ffffff" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'eskandarani-apple':
      return (
        <svg
          data-motif="eskandarani-apple"
          viewBox="0 0 36 36"
          className="w-5 h-5 sm:w-6 sm:h-6 overflow-visible"
        >
          <path d="M18,6 C22,3 27,5 25,10 C22,11 19,9 18,6 Z" fill="#ecfccb" />
          <circle
            cx="18"
            cy="20"
            r="10.5"
            fill="#bef264"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <ellipse cx="14" cy="17" rx="2.5" ry="4" fill="#ffffff" fillOpacity="0.7" />
        </svg>
      );

    case 'mint-leaf':
      return (
        <svg
          data-motif="mint-leaf"
          viewBox="0 0 36 36"
          className="w-5 h-5 sm:w-6 sm:h-6 overflow-visible"
        >
          <path
            d="M8,26 C7,12 17,5 29,6 C28,20 19,27 8,26 Z"
            fill="#a7f3d0"
            stroke="#ffffff"
            strokeWidth="1.8"
          />
          <path
            d="M9,25 Q18,16 27,7"
            stroke="#065f46"
            strokeWidth="1.8"
            fill="none"
          />
        </svg>
      );

    case 'red-kiss':
    default:
      return (
        <svg
          data-motif="red-kiss"
          viewBox="0 0 36 36"
          className="w-5 h-5 sm:w-6 sm:h-6 overflow-visible"
        >
          <path
            d="M5,18 C10,11 15,11 18,15 C21,11 26,11 31,18 C24,18 12,18 5,18 Z"
            fill="#ffffff"
          />
          <path
            d="M5,18 C11,27 25,27 31,18 C24,20 12,20 5,18 Z"
            fill="#fecdd3"
          />
        </svg>
      );
  }
}

export const ScrollControls: React.FC<ScrollControlsProps> = ({
  flavors,
  continuousIndex,
  logoHeroProgress,
  activeIndex,
  env,
  isMobile,
  mouseX,
  mouseY,
  onSelectFlavor,
  onScrollToHero,
}) => {
  const canGoPrev = continuousIndex > -0.5;
  const canGoNext = activeIndex < flavors.length - 1 || continuousIndex < -0.2;
  const activeFlavor = flavors[activeIndex] || flavors[0];

  const logoState = computeLogoMorphState(
    logoHeroProgress,
    isMobile,
    mouseX,
    mouseY
  );

  const badgeReveal = smoothstep(0.28, 0.92, env.heroProgress);
  const heroPromptOpacity = 1 - smoothstep(0.04, 0.52, env.heroProgress);

  return (
    <>
      {/* Unified Ya Layl Molasses Brand Logo:
          - Massively Enlarged at Center-Top in Hero Stage with High-Contrast Saturated Color Glow
          - Slow, graceful 3D S-curve flight down to Bottom-Left on Desktop & Bottom-Center on Mobile */}
      <button
        type="button"
        data-testid="ya-layl-logo-btn"
        data-hero-progress={logoHeroProgress.toFixed(2)}
        aria-label="Ya Layl Molasses Brand Logo"
        onClick={() => {
          if (env.heroProgress > 0.5) {
            onScrollToHero();
          } else {
            onSelectFlavor(0);
          }
        }}
        className="fixed z-30 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-lg cursor-pointer will-change-transform"
        style={{
          left: `${logoState.leftPercent}%`,
          top: `${logoState.topPercent}%`,
          transform: `translate3d(calc(-50% + ${logoState.parallaxX.toFixed(
            1
          )}px), calc(-50% + ${logoState.parallaxY.toFixed(
            1
          )}px), 0) perspective(1000px) rotateX(${logoState.rotateX.toFixed(
            2
          )}deg) rotateY(${logoState.rotateY.toFixed(
            2
          )}deg) rotateZ(${logoState.rotateZ.toFixed(
            2
          )}deg) scale(${logoState.scale.toFixed(3)})`,
        }}
      >
        <img
          src="/assets/aistudio/ya_layl_molasses_logo_nobg.png"
          alt="يا ليل معسّل YA LAYL MOLASSES"
          referrerPolicy="no-referrer"
          draggable={false}
          className="relative w-[255px] sm:w-[490px] lg:w-[680px] h-auto object-contain select-none transition-transform duration-300 group-hover:scale-[1.03]"
          style={{
            filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.92))',
          }}
        />
      </button>

      {/* Bilingual Hero Callout Beneath Enlarged Logo ("اكتشف نكهات يالليل" / "DISCOVER YA LAYL FLAVORS")
          with High-Contrast Saturated Color Glow over Pitch-Black Canvas */}
      {heroPromptOpacity > 0.01 && (
        <div
          data-testid="hero-discover-callout"
          className="fixed inset-x-4 top-[58%] sm:top-[64%] lg:top-[66%] z-30 flex flex-col items-center text-center pointer-events-none select-none will-change-transform"
          style={{
            opacity: heroPromptOpacity,
            transform: `translate3d(${mouseX * -14}px, ${
              (1 - heroPromptOpacity) * -28 + mouseY * -10
            }px, 0) scale(${0.94 + heroPromptOpacity * 0.06})`,
          }}
        >
          <button
            type="button"
            data-testid="hero-discover-btn"
            onClick={() => onSelectFlavor(0)}
            className="pointer-events-auto relative group flex flex-col items-center gap-2.5 sm:gap-3.5 px-4 sm:px-6 py-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          >

            {/* Arabic Callout */}
            <h1
              dir="rtl"
              data-testid="hero-discover-ar"
              className="relative text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-normal leading-tight whitespace-nowrap"
              style={{
                fontFamily: "'Cairo', sans-serif",
                textShadow:
                  '0 4px 20px rgba(0,0,0,0.98), 0 0 28px rgba(255, 10, 84, 0.75), 0 0 48px rgba(0, 229, 255, 0.55)',
              }}
            >
              اكتشف نكهات يالليل
            </h1>

            {/* Saturated Luminous Divider Line */}
            <div className="relative flex items-center justify-center gap-3 w-52 sm:w-72">
              <span
                className="h-[2px] flex-1 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #ff0a54, #00e5ff)',
                  boxShadow: '0 0 12px #ff0a54',
                }}
              />
              <span
                className="w-2.5 h-2.5 rotate-45 shrink-0"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: '0 0 14px #ff0a54, 0 0 22px #00e5ff',
                }}
              />
              <span
                className="h-[2px] flex-1 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, #00e5ff, #a855f7, transparent)',
                  boxShadow: '0 0 12px #00e5ff',
                }}
              />
            </div>

            {/* English Callout */}
            <p
              data-testid="hero-discover-en"
              className="relative text-[13px] sm:text-xl lg:text-2xl font-bold tracking-[0.16em] sm:tracking-[0.24em] text-white uppercase whitespace-nowrap"
              style={{
                fontFamily: "'Cinzel', serif",
                textShadow:
                  '0 4px 18px rgba(0,0,0,0.98), 0 0 24px rgba(0, 229, 255, 0.75), 0 0 42px rgba(255, 10, 84, 0.5)',
              }}
            >
              DISCOVER YA LAYL FLAVORS
            </p>
          </button>

          {/* Scroll Down Chevron Button */}
          <button
            type="button"
            data-testid="hero-scroll-down-btn"
            aria-label="Scroll to first flavor"
            onClick={() => onSelectFlavor(0)}
            className="pointer-events-auto mt-4 sm:mt-6 w-12 h-12 rounded-2xl rotate-45 flex items-center justify-center bg-black/85 backdrop-blur-md text-white border border-white/30 hover:scale-110 transition-transform duration-300 cursor-pointer"
            style={{
              boxShadow:
                '0 0 28px rgba(255, 10, 84, 0.65), 0 0 44px rgba(0, 229, 255, 0.45)',
            }}
          >
            <ChevronDown className="w-5 h-5 -rotate-45 animate-bounce" />
          </button>
        </div>
      )}

      {/* Redesigned Right-Side Architectural Timeline Track */}
      <nav
        aria-label="Flavors navigation"
        className="fixed right-2.5 sm:right-6 top-[35%] lg:top-1/2 -translate-y-1/2 z-30 flex flex-col items-center py-2.5 px-1 rounded-full bg-slate-950/35 backdrop-blur-md border border-white/10 gap-1 sm:gap-1.5"
      >
        {/* Hero Intro Indicator */}
        <button
          type="button"
          data-testid="flavor-dot-hero"
          aria-label="Ya Layl Collection Overview"
          onClick={onScrollToHero}
          className="group relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer"
        >
          <span
            className="transition-all duration-300 rotate-45"
            style={{
              width: env.heroProgress < 0.5 ? '9px' : '5px',
              height: env.heroProgress < 0.5 ? '9px' : '5px',
              backgroundColor:
                env.heroProgress < 0.5 ? '#ff0a54' : 'rgba(255,255,255,0.35)',
              boxShadow:
                env.heroProgress < 0.5 ? '0 0 12px #ff0a54' : 'none',
            }}
          />
        </button>

        {flavors.map((flavor, idx) => {
          const isActive = env.heroProgress >= 0.5 && idx === activeIndex;
          return (
            <button
              key={flavor.id}
              type="button"
              data-testid={`flavor-dot-${idx}`}
              aria-label={flavor.altLabel}
              aria-current={isActive ? 'step' : undefined}
              onClick={() => onSelectFlavor(idx)}
              className="group relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer"
            >
              {/* Hover Miniature Jar Preview */}
              <span
                className="pointer-events-none absolute right-9 w-12 h-12 rounded-xl p-1.5 bg-slate-950/90 backdrop-blur-md border border-white/15 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-200 shadow-xl"
                aria-hidden="true"
              >
                <img
                  src={flavor.image}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </span>

              <span
                className="transition-all duration-300 rounded-full"
                style={{
                  width: isActive ? '8px' : '5px',
                  height: isActive ? '20px' : '5px',
                  backgroundColor: isActive
                    ? flavor.primaryColor
                    : 'rgba(255,255,255,0.3)',
                  boxShadow: isActive
                    ? `0 0 14px ${flavor.primaryColor}`
                    : 'none',
                }}
              />
            </button>
          );
        })}
      </nav>

      {/* Redesigned Architectural Obsidian-Glass Bottom Flavor Dock */}
      <div
        className="fixed bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-2 sm:gap-3 w-[calc(100vw-20px)] sm:w-auto max-w-[96vw] transition-opacity duration-200"
        style={{
          opacity: badgeReveal,
          transform: `translate3d(0, ${(1 - badgeReveal) * 24}px, 0)`,
          pointerEvents: badgeReveal > 0.25 ? 'auto' : 'none',
        }}
      >
        {/* Previous Flavor Button */}
        <button
          type="button"
          aria-label="Previous flavor"
          disabled={!canGoPrev}
          onClick={() => {
            if (activeIndex > 0) {
              onSelectFlavor(activeIndex - 1);
            } else {
              onScrollToHero();
            }
          }}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center bg-slate-950/85 backdrop-blur-xl text-white hover:scale-105 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{
            border: `1.5px solid ${activeFlavor.primaryColor}88`,
            boxShadow: `0 0 18px ${activeFlavor.primaryColor}44`,
          }}
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Dynamic Flavor-Colored Icon & Bilingual Name Dock */}
        <button
          type="button"
          data-testid="bottom-flavor-badge"
          aria-label={`Current flavor: ${activeFlavor.nameAr} - ${activeFlavor.nameEn}`}
          onClick={() => onSelectFlavor((activeIndex + 1) % flavors.length)}
          className="group relative flex items-center gap-2.5 sm:gap-4 pl-2 pr-3.5 sm:pl-2.5 sm:pr-6 py-1.5 sm:py-2 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer min-w-0 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{
            background: `linear-gradient(135deg, rgba(2, 6, 23, 0.92) 0%, ${activeFlavor.primaryColor}38 55%, rgba(2, 6, 23, 0.94) 100%)`,
            border: `1.5px solid ${activeFlavor.primaryColor}`,
            boxShadow: `0 10px 34px rgba(0,0,0,0.82), 0 0 28px ${activeFlavor.primaryColor}66, inset 0 1px 0 ${activeFlavor.secondaryColor}66`,
          }}
        >
          {/* Flavor-Specific Shape Inside Circle */}
          <span
            key={activeFlavor.motif}
            data-testid="bottom-flavor-icon"
            data-flavor-motif={activeFlavor.motif}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-12"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${activeFlavor.secondaryColor}66 0%, ${activeFlavor.primaryColor} 55%, ${activeFlavor.ambientGlow} 100%)`,
              boxShadow: `0 0 18px ${activeFlavor.primaryColor}, inset 0 0 8px #ffffff66`,
              border: `1.5px solid ${activeFlavor.secondaryColor}`,
            }}
          >
            {renderFlavorBadgeIcon(activeFlavor.motif)}
          </span>

          {/* Bilingual Flavor Name (Arabic & English) */}
          <span className="flex items-center gap-2 sm:gap-3 whitespace-nowrap overflow-hidden">
            <span
              dir="rtl"
              className="text-[13px] sm:text-base md:text-lg font-extrabold text-white tracking-normal"
              style={{
                fontFamily: "'Cairo', sans-serif",
                textShadow: `0 0 14px ${activeFlavor.primaryColor}`,
              }}
            >
              {activeFlavor.nameAr}
            </span>

            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rotate-45 shrink-0"
              style={{
                backgroundColor: activeFlavor.secondaryColor,
                boxShadow: `0 0 8px ${activeFlavor.secondaryColor}`,
              }}
            />

            <span
              className="text-[11px] sm:text-sm md:text-base font-bold text-white/95 tracking-wider"
              style={{
                fontFamily: "'Cinzel', serif",
                textShadow: `0 0 14px ${activeFlavor.primaryColor}`,
              }}
            >
              {activeFlavor.nameEn}
            </span>
          </span>
        </button>

        {/* Next Flavor Button */}
        <button
          type="button"
          aria-label="Next flavor"
          disabled={!canGoNext}
          onClick={() => {
            if (continuousIndex < -0.2) {
              onSelectFlavor(0);
            } else if (activeIndex < flavors.length - 1) {
              onSelectFlavor(activeIndex + 1);
            }
          }}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center bg-slate-950/85 backdrop-blur-xl text-white hover:scale-105 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{
            border: `1.5px solid ${activeFlavor.primaryColor}88`,
            boxShadow: `0 0 18px ${activeFlavor.primaryColor}44`,
          }}
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </>
  );
};
