import React from "react";
import { ArrowRight } from "lucide-react";

const HeritageChefSection = ({ navigate }) => {
  return (
    <section className="relative bg-[#FAF7F2] py-24 lg:py-32 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          {/* --- LEFT CONTENT: MINIMALIST TEXT --- */}
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#8B1538]" />
              <span
                style={{ fontFamily: "Cormorant Garamond, serif" }}
                className="text-[28px] italic leading-none text-[#5f6476] md:text-[34px]"
              >
                Authentic Craft
              </span>
            </div>

            <h2 className="font-serif text-5xl lg:text-6xl leading-[1.1] text-[#1A1516]">
              Food made <span className="text-[#8B1538]">slowly,</span>
              <span className="block mt-2">served with heart.</span>
            </h2>

            <p className="mt-8 text-base leading-relaxed text-[#5C5452] font-light">
              We believe in the luxury of patience. Every recipe is a slow-cooked 
              tribute to Indian heritage, using hand-ground spices and 
              time-honored techniques passed through generations.
            </p>

            {/* Refined minimalist stats */}
            <div className="mt-12 flex flex-wrap gap-10 border-t border-black/5 pt-10">
              {[
                { label: "Spices", val: "Hand-Picked" },
                { label: "Process", val: "Traditional" },
                { label: "Taste", val: "Homely" }
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#8B1538]/60 mb-1">
                    {item.label}
                  </p>
                  <p className="font-serif text-lg text-[#1A1516]">{item.val}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/about")}
              className="group mt-12 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1516]"
            >
              <span className="relative">
                Our Heritage Story
                <span className="absolute -bottom-2 left-0 h-px w-full bg-[#8B1538] origin-right scale-x-0 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
            </button>
          </div>

          {/* --- RIGHT CONTENT: SHARP MASONRY GALLERY --- */}
          <div className="relative">
            <div className="flex gap-6 items-start">
              
              {/* Main Vertical Image - Zero Radius */}
              <div className="relative w-3/5 overflow-hidden shadow-2xl">
                <div className="aspect-[3/4.5]">
                  <img
                    src="/home_html/images/mainchef1.jpg"
                    alt="Chef Crafting"
                    className="h-full w-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1516]/80 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[10px] text-[#D6A64A] uppercase tracking-widest font-bold">Est. 2016</span>
                  <p className="font-serif text-2xl text-white">The Master Kitchen</p>
                </div>
              </div>

              {/* Secondary Stack - Zero Radius */}
              <div className="w-2/5 flex flex-col gap-6 mt-12">
                <div className="overflow-hidden shadow-xl">
                   <div className="aspect-[4/5]">
                    <img
                      src="/home_html/images/mainchef2.jpg"
                      alt="Spices"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="overflow-hidden shadow-xl">
                  <div className="aspect-[4/5]">
                    <img
                      src="/home_html/images/mainchef3.jpg"
                      alt="Plating"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>            
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeritageChefSection;
