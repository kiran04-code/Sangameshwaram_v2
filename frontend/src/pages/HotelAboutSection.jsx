import React from "react";
import { ArrowRight } from "lucide-react";

const ProfessionalAbout = () => {
  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-20 md:mt-10 md:px-16 lg:px-28">
      {/* BG CREST TEXT */}
      <h1 className="pointer-events-none absolute -top-12 right-0 font-serif text-[130px] font-bold leading-none text-[#c03c6473] md:text-[230px] lg:text-[310px]">
        CREST
      </h1>

   

      <div className="relative z-10 mx-auto grid min-h-[78vh] max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* LEFT */}
        <div className="pt-6">
          <p className="mb-8 text-[13px] font-black uppercase tracking-[0.42em] text-[#8d1238]">
            THE STORY
          </p>

          <h2 className="font-serif text-[48px] font-bold leading-[1.12] text-[#071022] md:text-[67px] lg:text-[70px]">
            Enjoy Every{" "}
            <span className="italic text-[#9b173f]">Moment</span>{" "}
            <span className="italic text-[#f0c21a]">Breakfast</span>, Hearty
            <span className="text-[#f0c21a]"> Mains</span>{" "}
            <span className="text-[#9b173f]">& Drinks</span>
          </h2>

          <div className="mt-14 grid max-w-[880px] grid-cols-1 gap-8 md:grid-cols-[140px_1fr]">
            <div className="hidden font-serif text-[170px] leading-none text-[#071022]/6 md:block">
              &
            </div>

            <div>
              <p className="max-w-[590px] text-[18px] leading-[1.38] text-black">
                At Hotel Crest, we don’t just serve meals; we curate sensory
                journeys that honor the rich Sangameshwar heritage while
                embracing modern luxury. Explore a legacy defined by.
              </p>

              <div className="mt-8 flex flex-col items-start gap-7 xl:flex-row xl:items-center">
                <p className="max-w-[280px] text-[18px] leading-[1.35] text-black">
                  Explore a legacy defined by taste and service.
                  <br />
                  I nuncity.
                </p>

                <button className="group flex h-[108px] w-full max-w-[430px] items-center justify-between rounded-full bg-[#890020] px-12 text-white shadow-[0_22px_45px_rgba(137,0,32,0.22)]">
                  <div className="text-left">
                    <p className="text-[15px] font-medium leading-none">
                      ABOUT US
                    </p>
                    <p className="mt-2 text-[13px] font-black uppercase leading-none">
                      Discover Our Legacy
                    </p>
                  </div>

                  <ArrowRight className="h-14 w-14 stroke-[1.7] transition-transform duration-300 group-hover:translate-x-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center lg:justify-end">
          <img
            src="/edited-photo.png"
            alt="Hotel Crest Staff"
            className="relative z-10 h-[400px] w-auto object-contain drop-shadow-[0_30px_35px_rgba(0,0,0,0.16)] md:h-[620px] lg:h-[680px]"
          />
          <div className="absolute bottom-8 left-1/2 h-12 w-[330px] -translate-x-1/2 rounded-full bg-black/10 blur-2xl" />
        </div>
      </div>
    </section>
  );
};

export default ProfessionalAbout;