import React from 'react';
import { MapPin, Search, ChevronRight, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section 
      className="relative min-h-[90vh] overflow-hidden bg-[#2A0B14]"
      data-testid="hero-section"
    >
      {/* --- BACKGROUND VIDEO LAYER --- */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-40"
        >
          {/* Use a high-quality stock video of steam, pouring tea, or slow-motion cooking */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-steam-rising-from-a-hot-dish-43332-large.mp4" type="video/mp4" />
        </video>
        {/* Deep Maroon Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B1538]/80 via-[#2A0B14]/90 to-[#2A0B14]" />
      </div>

      {/* --- TRADITIONAL ORNAMENTAL BORDERS --- */}
      <div className="pointer-events-none absolute inset-0 z-10 border-[12px] border-double border-[#D6A64A]/20 m-4" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
        <div className="h-1 w-64 bg-gradient-to-r from-transparent via-[#D6A64A] to-transparent" />
      </div>

      <div className="relative z-30 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="flex flex-col items-center text-center">
          
          {/* Royal Badge */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-[1px] w-8 bg-[#D6A64A]" />
            <span className="font-serif text-xs font-bold uppercase tracking-[0.4em] text-[#D6A64A] sm:text-sm">
              The Heritage of Sangameshwar
            </span>
            <div className="h-[1px] w-8 bg-[#D6A64A]" />
          </div>

          {/* Heading with Flourish */}
          <h1 
            className="max-w-5xl text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-8xl"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            A Taste of <span className="italic text-[#D6A64A]">Tradition</span>,<br />
            Served with <span className="font-light italic">Honor</span>.
          </h1>

          <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-[#FFF0D7]/70 sm:text-xl">
            Experience the finest breakfast, hearty mains, and refreshing drinks in Pune’s most beloved 
            traditional cafe setting.
          </p>

          {/* Heritage Action Buttons */}
          <div className="mt-12 flex flex-col items-center gap-8 sm:flex-row">
            <button
              onClick={() => navigate('/contact')}
              className="group relative flex items-center gap-4 border border-[#D6A64A] bg-transparent px-8 py-4 transition-all hover:bg-[#D6A64A]"
            >
              <MapPin size={20} className="text-[#D6A64A] group-hover:text-[#8B1538]" />
              <div className="text-left">
                <span className="block font-serif text-sm font-bold uppercase tracking-wider text-[#D6A64A] group-hover:text-[#8B1538]">
                  Find Us
                </span>
                <span className="block text-[10px] text-white/60 group-hover:text-[#8B1538]/80">Kondhwa Budruk, Pune</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/menu')}
              className="group flex items-center gap-4 border border-white/20 bg-white/5 px-8 py-4 backdrop-blur-sm transition-all hover:border-[#D6A64A]"
            >
              <Search size={20} className="text-[#D6A64A]" />
              <span className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                Discover the Menu
              </span>
            </button>
          </div>

          {/* --- ARCHED CATEGORY SELECTOR --- */}
          <div className="mt-24 grid w-full grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { title: "The Burger Room", path: 'BURGERS', img: "/home_html/images/categories/BURGERS.jpg" },
              { title: "Legacy Mains", path: 'PAV BHAJI & PULAV', img: "/home_html/images/categories/PAV_BHAJI_PULAV.jpg" },
              { title: "Royal Nectars", path: 'BEVERAGES', img: "/home_html/images/categories/MILKSHAKE.jpg" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="group cursor-pointer"
                onClick={() => navigate('/menu', { state: { category: item.path } })}
              >
                <div className="relative mx-auto mb-6 h-64 w-full max-w-[240px] overflow-hidden rounded-t-full border-4 border-[#D6A64A]/40 transition-all group-hover:border-[#D6A64A]">
                  <img 
                    src={item.img} 
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt={item.title} 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent" />
                </div>
                <h3 className="font-serif text-xl font-bold tracking-widest text-[#D6A64A]">
                  {item.title}
                </h3>
                <div className="mx-auto mt-2 h-[1px] w-12 bg-[#D6A64A]/40 transition-all group-hover:w-24" />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Flourish */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg className="relative block h-[60px] w-full" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-1.42,1200,13.47V0Z" className="fill-[#FFF0D7]"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;