import React from "react";
import { ChefHat, Sparkles, Award, ArrowRight } from "lucide-react";

const HeritageChefSection = ({ navigate }) => {
  return (
    <section className="relative overflow-hidden bg-[#FFFBF2] py-24 lg:py-32" data-testid="chef-section">
      {/* Decorative Mandala Background Watermark */}
      <div className="absolute left-[-10%] top-[-10%] w-[40%] aspect-square opacity-[0.03] pointer-events-none rotate-12">
        <svg viewBox="0 0 100 100" fill="#8B1538">
          <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-20 lg:grid-cols-2">

          {/* Left Side: Imperial Content */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-[#D6A64A]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#8B1538]">
                The Royal Khansama
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-[#1A1516] sm:text-7xl font-serif leading-[1.1]">
              Crafted With Soul, <br />
              <span className="italic text-[#8B1538] font-serif">Served With Legacy</span>
            </h2>

            <p className="mt-8 text-lg font-serif italic leading-relaxed text-[#6D6163]">
              "In the palace of Sangameshwar, cooking is not just an art—it is a sacred tradition passed down through generations of master culinary craftsmen."
            </p>

            <div className="mt-12 space-y-4">
              {[
                { icon: <ChefHat size={18} />, text: "Traditional recipes curated for the modern connoisseur." },
                { icon: <Sparkles size={18} />, text: "Ingredients sourced from the heart of local harvest." },
                { icon: <Award size={18} />, text: "A decade of upholding imperial standards of taste." }
              ].map((feature, i) => (
                <div key={i} className="group flex items-center gap-6 p-4 border-l-2 border-[#D6A64A]/20 transition-all hover:border-[#8B1538] hover:bg-white/50">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D6A64A] text-[#8B1538] group-hover:bg-[#8B1538] group-hover:text-[#F5D38B] transition-all duration-500">
                    {feature.icon}
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#2A2022] opacity-80">{feature.text}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate('/about')}
              className="mt-12 group relative inline-flex items-center gap-4 bg-[#8B1538] px-10 py-5 text-[12px] font-bold uppercase tracking-[0.3em] text-[#F5D38B] transition-all hover:bg-[#1A1516] border border-[#D6A64A]/30 shadow-2xl"
            >
              Our Imperial Story
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#F5D38B]/40" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#F5D38B]/40" />
            </button>
          </div>

          {/* Right Side: The Heritage Triptych (Arched Gallery) */}
          <div className="relative">
            <div className="grid grid-cols-12 gap-4 items-end">
              {/* Main Large Portrait (Jharokha Style) */}
              <div className="col-span-7 relative">
                <div className="overflow-hidden rounded-t-full border-[8px] border-white shadow-2xl">
                  <img
                    src="/home_html/images/mainchef1.jpg"
                    alt="Master Chef"
                    className="h-[550px] w-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                {/* Gold Frame Corner Accent */}
                <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-[#D6A64A] opacity-60 pointer-events-none" />
              </div>

              {/* Stacked Heritage Details */}
              <div className="col-span-5 space-y-4">
                <div className="overflow-hidden rounded-t-full border-[6px] border-white shadow-xl">
                  <img
                    src="/home_html/images/mainchef2.jpg"
                    alt="Traditional Cooking"
                    className="h-[240px] w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-b-full border-[6px] border-white shadow-xl">
                  <img
                    src="/home_html/images/mainchef3.jpg"
                    alt="Authentic Spices"
                    className="h-[240px] w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Imperial Seal Stat Card */}
            <div className="absolute -bottom-8 -left-8 bg-[#1A1516] p-8 border-2 border-[#D6A64A] shadow-2xl flex flex-col items-center justify-center">
                <div className="text-[#D6A64A] text-[10px] font-bold uppercase tracking-[0.5em] mb-2">Since</div>
                <div className="text-5xl font-serif text-[#F5D38B]">2016</div>
                <div className="h-[1px] w-full bg-[#D6A64A]/30 my-3" />
                <div className="text-[9px] font-bold uppercase tracking-widest text-white text-center opacity-80">
                  Culinary <br /> Excellence
                </div>
                {/* Small Seal detail */}
                <div className="absolute -top-3 -right-3 h-10 w-10 bg-[#8B1538] rounded-full flex items-center justify-center border border-[#D6A64A]">
                    <Award size={16} className="text-[#F5D38B]" />
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


export default HeritageChefSection