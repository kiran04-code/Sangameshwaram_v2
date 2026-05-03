import React, { useRef, useLayoutEffect } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

const foodItems = [
  {
    name: "Paneer Butter Masala",
    img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80",
  },
  {
    name: "North Indian Thali",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80",
  },
  {
    name: "Naan & Curry",
    img: "https://plus.unsplash.com/premium_photo-1694141253763-209b4c8f8ace?w=500&auto=format&fit=crop&q=60",
  },
];

const HotelAboutSection = () => {
  const sectionRef = useRef(null);
  const leftBlockRef = useRef(null);
  const rightBlockRef = useRef(null);
  const personImgRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const revealItems = gsap.utils.toArray(".reveal-item", sectionRef.current);
      const observerTarget = sectionRef.current;

      gsap.set(revealItems, {
        opacity: 0,
        y: 30,
      });

      gsap.set(personImgRef.current, {
        opacity: 0,
        x: 40,
      });

      const tl = gsap.timeline({
        paused: true,
      });

      tl.to(revealItems, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
      })
        .to(personImgRef.current, {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
        }, "-=0.8");

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }

          tl.play();
          observer.disconnect();
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      if (observerTarget) {
        observer.observe(observerTarget);
      }

      return () => {
        observer.disconnect();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-full overflow-hidden bg-white px-6 py-10 md:mt-90 md:px-16 md:py-24 lg:px-32"
    >
      {/* Subtle texture for a professional feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

      <div className="relative z-10 mx-auto max-w-screen-2xl grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* LEFT BLOCK: Content & Food Gallery */}
        <div ref={leftBlockRef} className="lg:col-span-7 space-y-10">
          <div className="reveal-item">
            <div className="flex items-center gap-3 mb-4">
              <span
                style={{ fontFamily: "Cormorant Garamond, serif" }}
                className="text-[28px] italic leading-none text-[#5f6476] md:text-[34px]"
              >
                North Indian Heritage
              </span>
            </div>
            <h2
              style={{ fontFamily: "Cormorant Garamond, serif" }}
              className="text-[28px] md:text-[62px]  leading-[0.95] text-[#1a1a1a] font-medium"
            >
              Tradition on a
              <span className=" text-[#8d1238] "> Plate.</span> <br />
              Taste from the Heart.
            </h2>
          </div>

          <div className="reveal-item">
            <p className="max-w-xl text-[17px] leading-relaxed text-gray-500 font-light border-l border-gray-100 ">
              Sangameshwar Cafe brings authentic North Indian flavours with rich
              spices, fresh ingredients, and warm hospitality.
            </p>
          </div>

          {/* SIMPLIFIED FOOD CARDS: No Borders, cleaner shadows */}
          <div className="reveal-item mt-12 grid grid-cols-3 gap-6 max-w-2xl">
            {foodItems.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="overflow-hidden  aspect-[4/5] shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <p className="mt-4 text-center text-[12px] font-medium tracking-tight text-gray-400 group-hover:text-[#8d1238] transition-colors">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT BLOCK: Character & Signature */}
        <div className="lg:col-span-5 relative md:mt-60 bg- flex flex-col justify-center h-full  pt-20 lg:pt-0">
          <div ref={rightBlockRef} className="relative bg-white z-20 ">
            <div className="reveal-item">
              <p
                style={{ fontFamily: "Cormorant Garamond, serif" }}
                className="text-[34px] md:text-[42px] italic leading-tight text-[#8d1238]"
              >
                "Serving tradition with every smile."
              </p>
              <p className="mt-6 text-[15px] leading-relaxed text-gray-400 font-light max-w-xs">
                Every dish reflects heritage, taste, and warmth, bringing the essence of North India to your plate.
              </p>
            </div>

            <div className="reveal-item">
              <button className="group flex items-center gap-4 text-[12px] uppercase tracking-widest font-bold text-[#111]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white transition-all duration-500 group-hover:bg-[#8d1238] group-hover:border-[#8d1238] group-hover:text-white">
                  <ArrowRight size={18} />
                </span>
                About Us
              </button>
            </div>

            {/* Signature Floating Badge */}
            <div className="reveal-item mt-10 inline-flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">
              <img
                src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&q=80"
                alt="Food"
                className="h-14 w-14 rounded-xl object-cover"
              />
              <p className="text-[13px] font-medium text-[#1a1a1a]">
                Fresh Indian <br />
                <span className="text-gray-400 font-light">Specials Daily</span>
              </p>
            </div>
          </div>

          {/* THE CHARACTER: Integrated with a fade-out */}
          <div className="absolute right-[-60px] md:bottom-[60px] bottom-[90px] w-full max-w-[450px] opacity-90">
            <img
              ref={personImgRef}
              src="/edited-photo.png"
              alt="Staff"
              className="h-full w-full object-contain pointer-events-none select-none drop-shadow-2xl"
            />
            {/* Fade bottom gradient to hide cut-off edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HotelAboutSection;
