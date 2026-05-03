import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Star } from "lucide-react";

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
    <section className="overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[#8B1538]">
            Testimonials
          </p>

          <h2
            style={{ fontFamily: "Cormorant Garamond, serif" }}
            className="text-4xl text-[#1a1a1a] md:text-6xl"
          >
            What Our <span className="italic text-[#8B1538]">Guests Say</span>
          </h2>
        </div>

        <div className="overflow-hidden">
          <div ref={sliderRef} className="flex gap-8">
            {[...reviews, ...reviews].map((item, i) => (
              <div
                key={i}
                className="min-w-[320px] border border-[#E6D4B9] bg-white p-6 shadow-[0_18px_40px_rgba(87,49,27,0.08)]"
              >
                <div className="mb-5 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 object-cover ring-1 ring-[#E6D4B9]"
                  />
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">{item.name}</p>
                    <p className="text-xs uppercase tracking-wider text-[#8B1538]">
                      {item.role}
                    </p>
                  </div>
                </div>

                <div className="mb-4 flex gap-1 text-[#D6A64A]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill="currentColor" />
                  ))}
                </div>

                <p
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                  className="text-lg italic leading-8 text-[#2D1B1E]"
                >
                  "{item.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
