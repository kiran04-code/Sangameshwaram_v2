import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock3, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import Header from '../components/Header';

const contactCards = [
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 90490 41488',
    href: 'tel:+919049041488',
    description: 'Reach the cafe directly for orders, timings, and quick assistance.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: 'Chat with Sangameshwar Cafe',
    href: 'https://wa.me/919049041488',
    description: 'Great for a fast enquiry, takeaway coordination, or location help.',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@sangameshwarcafe.com',
    href: 'mailto:hello@sangameshwarcafe.com',
    description: 'Use email for business enquiries, partnerships, and detailed requests.',
  },
];

const ContactPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #FFF8F5 0%, #FFF2E8 100%)' }}
    >
      <Header />

      <section className="relative overflow-hidden bg-[#8B1538] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,166,74,0.2),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="text-white">
              <span className="inline-flex rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#FFE8B0]">
                Contact Sangameshwar Cafe
              </span>
              <h1
                className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Connect with us for orders, visits, and everyday cafe enquiries.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
                Whether you want to dine in, pick up an order, or just ask what is fresh today,
                we have made it easy to reach the cafe.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="tel:+919049041488"
                  className="rounded-2xl bg-[#F3C316] px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#40191D] shadow-[0_18px_34px_rgba(37,19,22,0.22)] transition-transform hover:-translate-y-0.5"
                >
                  Call Now
                </a>
                <a
                  href="https://wa.me/919049041488"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white/16"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
              <img
                src="/home_html/images/restaurant.jpg"
                alt="Sangameshwar Cafe"
                className="h-[340px] w-full rounded-[26px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-3">
          {contactCards.map((card) => {
            const Icon = card.icon;

            return (
              <a
                key={card.title}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'noreferrer' : undefined}
                className="rounded-[28px] border border-[#E8D5C6] bg-white p-7 shadow-[0_20px_50px_rgba(81,43,50,0.08)] transition-transform hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8B1538] text-[#F3C316]">
                  <Icon size={26} />
                </div>
                <h2
                  className="mt-5 text-2xl font-semibold text-[#5F0F27]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {card.title}
                </h2>
                <p className="mt-2 text-sm font-semibold text-[#2D1B1E]">{card.value}</p>
                <p className="mt-3 text-sm leading-7 text-[#6C5554]">{card.description}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] bg-white p-8 shadow-[0_28px_80px_rgba(81,43,50,0.09)] sm:p-10">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#A47442]">
              Cafe Details
            </span>

            <div className="mt-8 space-y-7">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#8B1538]/8 text-[#8B1538]">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2D1B1E]">Address</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6C5554]">
                    C L, Magic Business Hub, Cups And Coasters, beside Yashodhan Society,
                    near VIIT College, Kondhwa Budruk, Pune, Maharashtra 411048
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#8B1538]/8 text-[#8B1538]">
                  <Clock3 size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2D1B1E]">Opening Hours</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6C5554]">Daily: 10:00 AM to 11:00 PM</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#8B1538]/8 text-[#8B1538]">
                  <Send size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2D1B1E]">Best Way to Order</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6C5554]">
                    For the fastest response, call or message on WhatsApp before pickup or arrival.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-[#8B1538] p-8 text-white shadow-[0_28px_80px_rgba(81,43,50,0.18)] sm:p-10">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFE8B0]">
              Quick Actions
            </span>
            <h2
              className="mt-3 text-4xl font-bold text-white"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Ready to order or plan your visit?
            </h2>
            <p className="mt-5 text-base leading-8 text-white/82">
              Jump straight to the menu, check what is available, and contact the cafe whenever
              you need help.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate('/menu')}
                className="rounded-2xl bg-[#F3C316] px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#40191D] shadow-[0_18px_34px_rgba(37,19,22,0.22)] transition-transform hover:-translate-y-0.5"
              >
                View Menu
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white/16"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
