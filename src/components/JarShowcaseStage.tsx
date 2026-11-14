import React from 'react';
import { FlavorItem } from '../data/flavors';
import {
  InterpolatedEnvironment,
  computeJarTransform,
  computeTextRevealState,
  lerp,
} from '../utils/scrollMath';

interface JarShowcaseStageProps {
  flavors: FlavorItem[];
  continuousIndex: number;
  activeIndex: number;
  env: InterpolatedEnvironment;
  mouseX: number;
  mouseY: number;
  isMobile: boolean;
  onSelectFlavor: (index: number) => void;
}

export const JarShowcaseStage: React.FC<JarShowcaseStageProps> = ({
  flavors,
  continuousIndex,
  activeIndex,
  env,
  mouseX,
  mouseY,
  isMobile,
  onSelectFlavor,
}) => {
  const orbitalRotation = Math.max(0, continuousIndex) * 135;
  const showcaseFactor = env.heroProgress;

  // Moved slightly to the right on Desktop (from 63.5% to 67.5%) as requested
  const desktopStageLeft = isMobile ? 50 : 67.5;
  const desktopStageTop = isMobile
    ? lerp(44, 33.5, showcaseFactor)
    : 55.5;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
      style={{ perspective: '1400px' }}
    >
      {/* 3D Revolving Turntable & Isometric Pedestal Stage */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center will-change-transform"
        style={{
          zIndex: 20,
          left: `${desktopStageLeft}%`,
          top: `${desktopStageTop}%`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 3D Isometric Obsidian & Neon Turntable Pedestal Under Active Jar */}
        {showcaseFactor > 0.05 && (
          <div
            className="absolute w-[220px] h-[220px] sm:w-[310px] sm:h-[310px] lg:w-[490px] lg:h-[490px] rounded-full pointer-events-none will-change-transform"
            style={{
              border: `1.5px solid ${env.secondaryColor}`,
              opacity: showcaseFactor * 0.35,
              boxShadow: `0 0 55px ${env.primaryColor}, inset 0 0 30px ${env.primaryColor}44`,
              transform: `translate3d(${-mouseX * 12}px, ${
                -mouseY * 12 + (isMobile ? 76 : 148)
              }px, -110px) rotateX(76deg) rotateZ(${orbitalRotation}deg) scale(${
                0.7 + showcaseFactor * 0.3
              })`,
            }}
          />
        )}

        {/* Inner Counter-Rotating Diamond Compass Ring on Pedestal */}
        {showcaseFactor > 0.05 && (
          <div
            className="absolute w-[165px] h-[165px] sm:w-[235px] sm:h-[235px] lg:w-[370px] lg:h-[370px] rounded-full pointer-events-none will-change-transform"
            style={{
              border: `2px dashed ${env.primaryColor}`,
              opacity: showcaseFactor * 0.42,
              transform: `translate3d(${-mouseX * 16}px, ${
                -mouseY * 16 + (isMobile ? 80 : 154)
              }px, -80px) rotateX(76deg) rotateZ(${-orbitalRotation * 1.4}deg) scale(${
                0.7 + showcaseFactor * 0.3
              })`,
            }}
          />
        )}

        {/* Glowing Water Caustic Base */}
        {showcaseFactor > 0.05 && (
          <div
            className="absolute w-[180px] sm:w-[250px] lg:w-[410px] h-[52px] lg:h-[88px] rounded-full pointer-events-none will-change-transform"
            style={{
              background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${env.secondaryColor}88 0%, ${env.primaryColor}55 45%, transparent 74%)`,
              opacity: showcaseFactor * 0.72,
              transform: `translate3d(${mouseX * 10}px, ${
                (isMobile ? 86 : 168) + mouseY * 8
              }px, -50px)`,
            }}
          />
        )}

        {/* Render Flavor Jars in Showcase Stage (Hidden in Hero Stage -1) */}
        {flavors.map((flavor, idx) => {
          const t = computeJarTransform(
            idx,
            continuousIndex,
            mouseX,
            mouseY,
            isMobile,
            flavors.length
          );
          if (!t.isVisible) return null;

          const isCurrent =
            continuousIndex >= -0.35 && idx === activeIndex;

          return (
            <div
              key={flavor.id}
              data-testid={`flavor-jar-card-${idx}`}
              data-active={isCurrent ? 'true' : 'false'}
              onClick={() => onSelectFlavor(idx)}
              className={`absolute flex flex-col items-center justify-center will-change-transform ${
                isCurrent
                  ? 'pointer-events-auto cursor-grab active:cursor-grabbing'
                  : 'pointer-events-auto cursor-pointer'
              }`}
              style={{
                zIndex: t.zIndex,
                opacity: t.opacity,
                transform: `translate3d(${t.translateX.toFixed(1)}px, ${t.translateY.toFixed(
                  1
                )}px, ${t.translateZ.toFixed(1)}px) scale(${t.scale.toFixed(
                  3
                )}) rotateX(${t.rotateX.toFixed(2)}deg) rotateY(${t.rotateY.toFixed(
                  2
                )}deg) rotateZ(${t.rotateZ.toFixed(2)}deg)`,
              }}
            >
              {/* Soft Radial Backlight Behind Jar */}
              <div
                className="absolute w-[230px] h-[230px] lg:w-[400px] lg:h-[400px] rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${flavor.primaryColor}88 0%, ${flavor.secondaryColor}38 38%, transparent 70%)`,
                  opacity: isCurrent ? 0.85 : 0.25,
                }}
              />

              {/* Main Product Jar Image */}
              <div
                data-testid={
                  idx === activeIndex ? 'active-product-jar-box' : undefined
                }
                className="relative w-[132px] sm:w-[175px] md:w-[210px] lg:w-[315px] xl:w-[345px] aspect-[3/4] flex items-center justify-center select-none"
              >
                {/* Grounded Contact Shadow Under Tub */}
                <div
                  className="
                    absolute bottom-[-6%] left-1/2 -translate-x-1/2
                    w-[82%] h-[18%] rounded-full pointer-events-none
                  "
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 48%, transparent 76%)',
                  }}
                />
                <img
                  src={flavor.image}
                  alt={flavor.altLabel}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="relative w-full h-full object-contain"
                />
              </div>

              {/* Water Mirror Reflection Below Jar (Desktop Only) */}
              {isCurrent && !isMobile && (
                <div
                  className="w-[245px] h-[72px] overflow-hidden pointer-events-none select-none -mt-2 opacity-28"
                  style={{
                    transform: 'scaleY(-1)',
                    maskImage:
                      'radial-gradient(ellipse 55% 75% at 50% 10%, rgba(0,0,0,0.75) 0%, transparent 78%)',
                    WebkitMaskImage:
                      'radial-gradient(ellipse 55% 75% at 50% 10%, rgba(0,0,0,0.75) 0%, transparent 78%)',
                  }}
                  aria-hidden="true"
                >
                  <img
                    src={flavor.image}
                    alt=""
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="w-full h-[225px] object-contain object-bottom"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bilingual Flavor Name & Short Description Stage:
          Arabic flavor name and description placed DIRECTLY underneath the English title and description */}
      {flavors.map((flavor, idx) => {
        const textState = computeTextRevealState(idx, continuousIndex);
        if (!textState.isVisible) return null;

        const isCurrentCopy = idx === activeIndex;

        return (
          <div
            key={`copy-${flavor.id}`}
            data-testid={`flavor-copy-${idx}`}
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 110,
              opacity: textState.opacity,
            }}
          >
            {/* DESKTOP LAYOUT (lg+):
                Unified Left Editorial Stack where the Arabic Flavor Name & Description sit DIRECTLY underneath
                the English Flavor Name & Description along the same alignment rail */}
            <div className="hidden lg:flex w-[90vw] max-w-[1320px] h-full mx-auto items-center justify-start pt-[4vh] px-10 xl:px-14">
              <div
                className="relative pl-7 max-w-[520px] xl:max-w-[560px] will-change-transform flex flex-col items-start text-left"
                style={{
                  transform: `translate3d(${mouseX * -12}px, ${
                    textState.translateY
                  }px, 0) scale(${textState.scale.toFixed(3)})`,
                }}
              >
                {/* Glowing Architectural Vertical Accent Rail */}
                <div
                  className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full"
                  style={{
                    background: `linear-gradient(180deg, ${flavor.primaryColor}, ${flavor.secondaryColor}, transparent)`,
                    boxShadow: `0 0 18px ${flavor.primaryColor}`,
                  }}
                />

                {/* Top Editorial Index & Progress Bar */}
                <div className="flex items-center gap-3.5 mb-2.5">
                  <span className="text-sm font-bold tracking-[0.25em] text-white/90 tabular-nums">
                    {String(idx + 1).padStart(2, '0')} /{' '}
                    {String(flavors.length).padStart(2, '0')}
                  </span>
                  <div className="h-[2px] w-20 bg-white/15 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${((idx + 1) / flavors.length) * 100}%`,
                        backgroundColor: flavor.primaryColor,
                        boxShadow: `0 0 10px ${flavor.primaryColor}`,
                      }}
                    />
                  </div>
                </div>

                {/* Upper Block: English Title & Description */}
                <div
                  data-testid={isCurrentCopy ? 'desktop-en-copy' : undefined}
                  className="text-left w-full"
                >
                  <h1
                    className="text-3xl lg:text-[38px] xl:text-[44px] font-bold tracking-wider text-white leading-tight"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      textShadow: `0 4px 24px rgba(0,0,0,0.95), 0 0 28px ${flavor.primaryColor}88`,
                    }}
                  >
                    {flavor.nameEn}
                  </h1>

                  <p
                    className="mt-1.5 text-base lg:text-[17px] xl:text-[18.5px] text-slate-100/95 leading-relaxed font-medium max-w-[42ch]"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      textShadow: '0 2px 16px rgba(0,0,0,0.95)',
                    }}
                  >
                    {flavor.descriptionEn}
                  </p>
                </div>

                {/* Glowing Diamond Divider Directly Under English */}
                <div className="flex items-center gap-3 my-3">
                  <div
                    className="w-2 h-2 rotate-45 shrink-0"
                    style={{
                      backgroundColor: flavor.secondaryColor,
                      boxShadow: `0 0 10px ${flavor.primaryColor}`,
                    }}
                  />
                  <div
                    className="h-[1.5px] w-40 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${flavor.primaryColor}, ${flavor.secondaryColor}88, transparent)`,
                    }}
                  />
                </div>

                {/* Lower Block: Arabic Flavor Name & Description DIRECTLY Beneath English */}
                <div
                  data-testid={isCurrentCopy ? 'desktop-ar-copy' : undefined}
                  className="flex flex-col items-start text-left w-full"
                >
                  <h2
                    dir="rtl"
                    className="text-3xl lg:text-[38px] xl:text-[44px] font-extrabold text-white leading-snug text-left"
                    style={{
                      fontFamily: "'Cairo', sans-serif",
                      textShadow: `0 4px 24px rgba(0,0,0,0.95), 0 0 28px ${flavor.primaryColor}88`,
                    }}
                  >
                    {flavor.nameAr}
                  </h2>

                  <p
                    dir="rtl"
                    className="mt-1 text-lg lg:text-[18.5px] xl:text-[20px] text-slate-100/95 leading-relaxed font-semibold max-w-[40ch] text-left"
                    style={{
                      fontFamily: "'Cairo', sans-serif",
                      textShadow: '0 2px 16px rgba(0,0,0,0.95)',
                    }}
                  >
                    {flavor.descriptionAr}
                  </p>
                </div>
              </div>
            </div>

            {/* MOBILE & TABLET LAYOUT (< lg):
                Arabic Title & Description placed DIRECTLY underneath English Title & Description */}
            <div className="lg:hidden w-full h-full relative">
              <div
                className="absolute top-[54%] inset-x-4 flex flex-col items-center text-center px-3"
                style={{
                  transform: `translate3d(0, ${
                    textState.translateY * 0.25
                  }px, 0) scale(${textState.scale.toFixed(3)})`,
                }}
              >
                {/* English Title & Description */}
                <div
                  data-testid={isCurrentCopy ? 'mobile-en-copy' : undefined}
                  className="flex flex-col items-center text-center"
                >
                  <h2
                    className="text-lg sm:text-2xl font-bold tracking-wide text-white leading-tight"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      textShadow: `0 3px 18px rgba(0,0,0,0.98), 0 0 24px ${flavor.primaryColor}`,
                    }}
                  >
                    {flavor.nameEn}
                  </h2>

                  <p
                    className="mt-1 text-[13px] sm:text-[14.5px] text-slate-100 leading-snug font-medium max-w-[36ch]"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      textShadow:
                        '0 2px 12px rgba(0,0,0,0.98), 0 0 16px rgba(0,0,0,0.9)',
                    }}
                  >
                    {flavor.descriptionEn}
                  </p>
                </div>

                {/* Subtle Divider */}
                <div
                  className="h-[2px] w-16 my-1.5 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${flavor.primaryColor}, ${flavor.secondaryColor}, transparent)`,
                    boxShadow: `0 0 10px ${flavor.primaryColor}`,
                  }}
                />

                {/* Arabic Title & Description DIRECTLY Under English */}
                <div
                  dir="rtl"
                  data-testid={isCurrentCopy ? 'mobile-ar-copy' : undefined}
                  className="flex flex-col items-center text-center"
                >
                  <h2
                    className="text-xl sm:text-2xl font-extrabold text-white leading-tight"
                    style={{
                      fontFamily: "'Cairo', sans-serif",
                      textShadow: `0 3px 18px rgba(0,0,0,0.98), 0 0 24px ${flavor.primaryColor}`,
                    }}
                  >
                    {flavor.nameAr}
                  </h2>

                  <p
                    className="mt-0.5 text-[14px] sm:text-[15.5px] text-slate-100 leading-snug font-semibold max-w-[36ch]"
                    style={{
                      fontFamily: "'Cairo', sans-serif",
                      textShadow:
                        '0 2px 12px rgba(0,0,0,0.98), 0 0 16px rgba(0,0,0,0.9)',
                    }}
                  >
                    {flavor.descriptionAr}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
