import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const reviews = [
  {
    id: 1,
    name: "Arjun Malhotra",
    role: "Business Traveler",
    quote:
      "The Sangameshwar thali isn't just a meal; it's a deep dive into authentic heritage.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Food Critic",
    quote: "A premium, modern atmosphere that maintains traditional roots.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Rohit Deshmukh",
    role: "Regular Guest",
    quote: "Simple, warm and full of flavour. Feels like home.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
  },
];

export default function Testimonials() {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;

    slider.innerHTML += slider.innerHTML;

    const totalWidth = slider.scrollWidth / 2;

    const animation = gsap.to(slider, {
      x: -totalWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
    });

    const pauseAnimation = () => animation.pause();
    const resumeAnimation = () => animation.resume();

    slider.addEventListener("mouseenter", pauseAnimation);
    slider.addEventListener("mouseleave", resumeAnimation);

    return () => {
      slider.removeEventListener("mouseenter", pauseAnimation);
      slider.removeEventListener("mouseleave", resumeAnimation);
      animation.kill();
    };
  }, []);

  return (
    <section className="overflow-hidden bg-[#FAF7F2] py-24 lg:py-32 font-sans">

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* --- SHARP & MINIMAL HEADER --- */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-[#8B1538]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#8B1538]">
                Authentic Craft
              </span>
            </div>
            
            <h2 className="font-serif text-5xl lg:text-7xl leading-[1.1] text-[#1A1516]">
              Food made <span className="text-[#8B1538]">slowly,</span>
              <span className="block mt-2">served with heart.</span>
            </h2>
          </div>

          <button
            className="group flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1516] self-start md:self-end border-b border-black/10 pb-2 hover:border-[#8B1538]"
          >
            Explore Full Edit
            <span className="w-6 h-px bg-[#D6A64A] transition-all group-hover:w-10" />
          </button>
        </header>

        {/* --- SLIDER GRID --- */}
        <div className="overflow-hidden">
          <div ref={sliderRef} className="flex gap-10 py-6">
            {[...reviews, ...reviews].map((item, i) => (
              <article 
                key={i} 
                className="relative group min-w-[340px] bg-white p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col gap-6 border border-black/5"
              >
                
                {/* Header: Symmetrical metadata structure */}
                <div className="flex justify-between items-start gap-4 pb-6 border-b border-black/5">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 object-cover border border-black/5 shrink-0" 
                    />
                    <div>
                      <p className="font-serif text-lg text-[#1A1516]">{item.name}</p>
                      <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#8B1538]">
                        {item.role}
                      </p>
                    </div>
                  </div>
                  {/* Reduced Rating: Minimalist text notation */}
                  <span className="shrink-0 text-[10px] font-bold text-[#D6A64A] tracking-widest font-sans">
                     5.0 ★
                  </span>
                </div>

                {/* Content: High Contrast Typography */}
                <p 
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                  className="flex-1 text-lg italic leading-relaxed text-[#2D1B1E] font-light max-w-sm"
                >
                  "{item.quote}"
                </p>

                {/* Simplified sharp button */}
                <button className="relative w-full flex items-center justify-center gap-3 bg-[#1A1516] group-hover:bg-[#8B1538] py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white transition-colors duration-500">
                  Read Full Chronicle
                  <span className="w-6 h-px bg-[#D6A64A] transition-all group-hover:w-10" />
                </button>
                
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
