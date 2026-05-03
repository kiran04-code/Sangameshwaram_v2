import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

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
    quote:
      "A premium, modern atmosphere that maintains traditional roots. Truly a hidden gem.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
  },
];

const Testimonials = () => {
  const scrollRef = useRef(null);

  const { scrollXProgress } = useScroll({
    container: scrollRef,
  });

  const scaleX = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
  });

  const diamondPosition = useTransform(scrollXProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-20 bg-[#F8EFE3] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.4em] text-[#8B1538] mb-3">
            Testimonials
          </p>

          <h2
            style={{ fontFamily: "Cormorant Garamond, serif" }}
            className="text-4xl md:text-6xl text-[#1a1a1a]"
          >
            What Our <span className="italic text-[#8B1538]">Guests Say</span>
          </h2>
        </div>

        {/* SCROLL CARDS */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x"
        >
          {reviews.map((item) => (
            <motion.div
              key={item.id}
              className="min-w-[320px] md:min-w-[420px] snap-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white p-8 shadow-md flex flex-col gap-6">

                {/* USER */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#8B1538] uppercase tracking-wider">
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* QUOTE */}
                <p
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                  className="text-xl italic text-[#2D1B1E] leading-relaxed"
                >
                  “{item.quote}”
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CLEAN PROGRESS BAR */}
        <div className="relative mt-6 h-[2px] bg-[#D6A64A]/30">
          <motion.div
            className="absolute left-0 top-0 h-full bg-[#8B1538]"
            style={{ scaleX, width: "100%", originX: 0 }}
          />

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#8B1538] rotate-45"
            style={{ left: diamondPosition }}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;