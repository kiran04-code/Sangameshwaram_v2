import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Clock3, HeartHandshake, MapPin, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import Header from '../components/Header';

const highlights = [
  {
    icon: UtensilsCrossed,
    title: 'Freshly Prepared',
    description: 'Breakfast, cafe mains, and beverages made to order with care throughout the day.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Ingredients',
    description: 'We focus on clean ingredients, balanced flavors, and reliable taste in every plate.',
  },
  {
    icon: HeartHandshake,
    title: 'Warm Hospitality',
    description: 'The experience is designed to feel familiar, welcoming, and easy for every guest.',
  },
  {
    icon: Clock3,
    title: 'Fast Service',
    description: 'From quick snacks to full meals, we keep service smooth for dine-in and takeaway.',
  },
];

const storyPoints = [
  'Built for everyday cafe ,cravings with a warm Pune neighborhood feel.',
  'A menu that blends breakfast comfort, filling mains, and refreshing drinks.',
  'Focused on consistent taste, clean presentation, and a polished customer experience.',
];

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #FFF8F5 0%, #FFF2E8 100%)' }}
    >
      <Header />

      <section className="relative overflow-hidden bg-[#8B1538] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,166,74,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-white">
            <span className="inline-flex rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#FFE8B0]">
              About Sangameshwar Cafe
            </span>
            <h1
              className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              A neighborhood cafe experience shaped by comfort, flavor, and care.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
              Sangameshwar Cafe brings together satisfying meals, refreshing drinks, and a
              warm dine-in atmosphere for guests who want reliable quality with a polished
              brand experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate('/menu')}
                className="rounded-2xl bg-[#F3C316] px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#40191D] shadow-[0_18px_34px_rgba(37,19,22,0.22)] transition-transform hover:-translate-y-0.5"
              >
                Explore Menu
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white/16"
              >
                Visit Us
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-3 backdrop-blur-sm sm:translate-y-8">
              <img
                src="/home_html/images/restaurant.jpg"
                alt="Sangameshwar Cafe interior"
                className="h-[300px] w-full rounded-[22px] object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
              <img
                src="/home_html/images/ambiance.png"
                alt="Cafe dining experience"
                className="h-[300px] w-full rounded-[22px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-[#E8D5C6] bg-white/90 p-7 shadow-[0_20px_50px_rgba(81,43,50,0.08)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8B1538] text-[#F3C316]">
                    <Icon size={26} />
                  </div>
                  <h2
                    className="mt-5 text-2xl font-semibold text-[#5F0F27]"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#6C5554]">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] bg-white p-8 shadow-[0_28px_80px_rgba(81,43,50,0.09)] sm:p-10">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#A47442]">
              Our Story
            </span>
            <h2
              className="mt-3 text-4xl font-bold text-[#5F0F27] sm:text-5xl"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Created to make every cafe visit feel easy, premium, and memorable.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#6C5554]">
              Sangameshwar Cafe is built around the idea that great food should feel both
              comforting and well-crafted. From a quick breakfast stop to a relaxed meal with
              friends, the goal is the same: deliver taste, service, and atmosphere people want
              to come back to.
            </p>

            <div className="mt-8 space-y-4">
              {storyPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <Award className="mt-1 shrink-0 text-[#D6A64A]" size={18} />
                  <p className="text-sm leading-7 text-[#6C5554]">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-[#8B1538] p-8 text-white shadow-[0_28px_80px_rgba(81,43,50,0.18)] sm:p-10">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFE8B0]">
              Visit Details
            </span>
            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-[#F3C316]">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Location</h3>
                  <p className="mt-2 text-sm leading-7 text-white/82">
                    C L, Magic Business Hub, Cups And Coasters, beside Yashodhan Society,
                    near VIIT College, Kondhwa Budruk, Pune, Maharashtra 411048
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-[#F3C316]">
                  <Clock3 size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Opening Hours</h3>
                  <p className="mt-2 text-sm leading-7 text-white/82">
                    Daily: 10:00 AM to 11:00 PM
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="mt-8 rounded-2xl bg-[#F3C316] px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#40191D] shadow-[0_18px_34px_rgba(37,19,22,0.22)] transition-transform hover:-translate-y-0.5"
            >
              Contact Cafe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
