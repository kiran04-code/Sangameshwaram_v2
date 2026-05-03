import React, { useRef, useLayoutEffect } from "react";
import { ChevronDown } from "lucide-react";
import { HERO_CONTENT, HOME_SECTION_IDS } from "../data/homepageContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HomeHeroSection = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const mainEyebrowRef = useRef(null);
  const scrollRef = useRef(null);
  const overlayRef = useRef(null);
  const eyebrowLineRef = useRef(null);
  const underlineRef = useRef(null);

  const columns = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const images = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
    "https://images.unsplash.com/photo-1601050633622-3d1483b49a7a?w=900&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80",
    "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=900&q=80",
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900&q=80",
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=900&q=80",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&q=80",
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, mainEyebrowRef.current, scrollRef.current], {
        opacity: 0,
        y: 40,
      });

      gsap.set(".hero-card", {
        opacity: 0,
        scale: 0.92,
        y: 60,
      });

      gsap.set(underlineRef.current, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: "left center",
      });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to(".hero-card", {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.3,
        stagger: { amount: 0.7, from: "center" },
      })
        .to(mainEyebrowRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(titleRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
        .to(underlineRef.current, { opacity: 1, scaleX: 1, duration: 0.9 }, "-=0.4")
        .to(scrollRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

      columns.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;

        const moveUp = i % 2 === 0;

        gsap.set(el, {
          yPercent: moveUp ? 0 : -50,
          force3D: true,
          willChange: "transform",
        });

        gsap.to(el, {
          yPercent: moveUp ? -50 : 0,
          duration: 55 + i * 7,
          ease: "none",
          repeat: -1,
        });
      });

      const lines = HERO_CONTENT.eyebrow;
      let index = 0;

      const changeText = () => {
        index = (index + 1) % lines.length;

        gsap.to([eyebrowLineRef.current, underlineRef.current], {
          opacity: 0,
          y: -18,
          filter: "blur(8px)",
          duration: 0.45,
          ease: "power2.in",
          onComplete: () => {
            eyebrowLineRef.current.textContent = lines[index];

            gsap.fromTo(
              eyebrowLineRef.current,
              { opacity: 0, y: 22, filter: "blur(8px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.7,
                ease: "power4.out",
              }
            );

            gsap.fromTo(
              underlineRef.current,
              {
                opacity: 0,
                y: 8,
                scaleX: 0,
                filter: "blur(4px)",
                transformOrigin: "left center",
              },
              {
                opacity: 1,
                y: 0,
                scaleX: 1,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power4.out",
              }
            );
          },
        });
      };

      const interval = setInterval(changeText, 2400);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        })
        .to(titleRef.current, { y: -120, scale: 0.86, opacity: 0, ease: "none" })
        .to(mainEyebrowRef.current, { y: -80, opacity: 0, ease: "none" }, 0)
        .to(".changing-text-box", { y: -70, opacity: 0, ease: "none" }, 0)
        .to(".image-wall", { scale: 1.22, opacity: 0.45, ease: "none" }, 0)
        .to(overlayRef.current, { opacity: 0.95, ease: "none" }, 0);

      gsap.to(scrollRef.current, {
        y: 12,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      return () => clearInterval(interval);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleScroll = () => {
    const nextSection = document.getElementById(HOME_SECTION_IDS.about);
    if (nextSection) {
      if (window.__lenis) {
        window.__lenis.scrollTo(nextSection, { offset: 0 });
        return;
      }

      window.scrollTo({
        top: nextSection.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={containerRef}
      id={HOME_SECTION_IDS.home}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div className="image-wall absolute inset-[-12%] flex gap-4 md:gap-6 px-3 md:px-8 opacity-85 rotate-[-1.5deg] scale-110">
        {columns.map((ref, colIndex) => (
          <div
            key={colIndex}
            className={`
              flex-1 overflow-hidden
              ${colIndex === 0 ? "-translate-y-16" : ""}
              ${colIndex === 1 ? "translate-y-8" : ""}
              ${colIndex === 2 ? "-translate-y-24" : ""}
              ${colIndex === 3 ? "translate-y-14" : ""}
              ${colIndex === 4 ? "-translate-y-10" : ""}
            `}
          >
            <div ref={ref} className="flex flex-col gap-4 md:gap-6">
              {[...images, ...images].map((img, i) => (
                <div
                  key={`${colIndex}-${i}`}
                  className={`
                    hero-card w-full overflow-hidden bg-white/10
                    shadow-[0_30px_90px_rgba(0,0,0,0.75)]
                    ${i % 3 === 0 ? "aspect-[16/10]" : ""}
                    ${i % 3 === 1 ? "aspect-[4/3]" : ""}
                    ${i % 3 === 2 ? "aspect-[3/4]" : ""}
                  `}
                >
                  <img
                    src={images[(i + colIndex * 2) % images.length]}
                    alt="Cafe interior and food"
                    draggable="false"
                    className="h-full w-full object-cover brightness-[0.72] contrast-125 saturate-125"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div ref={overlayRef} className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.62)_55%,black_100%)]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <p
          ref={mainEyebrowRef}
          className="mb-4 text-[30px] sm:text-[36px] md:text-[44px] font-medium italic leading-none text-white/95"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Premium Cafe Experience
        </p>

        <h1
          ref={titleRef}
          className="max-w-[94vw] select-none text-[14vw] sm:text-[16vw] md:text-[10vw] font-black uppercase leading-[0.85] tracking-[-0.07em] text-[#d6ae50] drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] whitespace-normal break-words md:whitespace-nowrap md:break-normal"
        >
          {HERO_CONTENT.title}
        </h1>

        <div className="changing-text-box mt-7 w-full max-w-6xl overflow-hidden text-left">
          <div className="inline-block">
            <p
              ref={eyebrowLineRef}
              style={{ fontFamily: "Cormorant Garamond, serif" }}
              className="inline-block text-xs md:text-[25px] font-medium italic leading-none text-white/85 will-change-transform"
            >
              {HERO_CONTENT.eyebrow[0]}
            </p>

            <div
              ref={underlineRef}
              className="relative mt-4 h-[10px] w-full min-w-[220px] overflow-hidden"
            >
              <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full bg-gradient-to-r from-[#d6ae50] via-white/80 to-transparent shadow-[0_0_18px_rgba(214,174,80,0.75)]" />
              <span className="absolute left-0 top-0 h-[1px] w-[55%] rounded-full bg-[#d6ae50]/70" />
              <span className="absolute left-0 bottom-0 h-[1px] w-[35%] rounded-full bg-white/35" />
              <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#d6ae50] shadow-[0_0_18px_rgba(214,174,80,0.9)]" />
            </div>
          </div>
        </div>
      </div>

      <button
        ref={scrollRef}
        onClick={handleScroll}
        className="absolute bottom-9 left-1/2 z-20 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white transition hover:bg-white/20"
        aria-label="Scroll to next section"
      >
        <ChevronDown size={34} strokeWidth={1.4} />
      </button>
    </section>
  );
};

export default HomeHeroSection;
