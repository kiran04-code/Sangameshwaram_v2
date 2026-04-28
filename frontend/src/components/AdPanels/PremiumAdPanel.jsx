import React, { useState, useEffect } from 'react';

/**
 * Premium Ad Panel - Elegant restaurant promotion with image background
 * Classic design with gradient overlay and centered content
 * Features carousel rotation through multiple promotions
 */
const PremiumAdPanel = ({ carouselImages = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultSlides = [
    {
      subtitle: 'The Evening Selection',
      headline: 'Uncompromising Quality',
      description: 'Savor the artisanal flavors of our signature dishes, crafted daily by executive chefs.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000',
      cta: 'Explore Full Menu'
    },
    {
      subtitle: 'Weekend Specials',
      headline: 'Premium Biryani Fest',
      description: 'Experience the finest biryani recipes with hand-selected spices and heritage cooking methods.',
      image: 'https://images.unsplash.com/photo-1505182346881-b72b27e84530?auto=format&fit=crop&q=80&w=2000',
      cta: 'Order Now'
    },
    {
      subtitle: 'Chef\'s Recommendation',
      headline: 'Culinary Masterpiece',
      description: 'Indulge in our signature fusion dishes that blend traditional and contemporary flavors.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=2000',
      cta: 'Reserve Table'
    }
  ];

  // Use carousel images if available, otherwise use defaults
  const slides = carouselImages && carouselImages.length > 0 
    ? carouselImages.map(img => ({ image: img }))
    : defaultSlides;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="flex-1 bg-black relative flex flex-col justify-center overflow-hidden w-full h-full">
      {/* Background Image - Full Cover */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {slide && slide.image ? (
          <img
            key={`bg-${currentSlide}`}
            src={slide.image}
            className="w-full h-full object-cover"
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'cover'
            }}
            alt="Ad Background"
            onError={(e) => {
              console.error('Image failed to load:', slide.image);
              console.error('Error details:', e);
            }}
            onLoad={() => console.log('✅ Image loaded successfully:', slide.image)}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-sm">
            No image available
          </div>
        )}
      </div>

      {/* Carousel Indicators Only */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-500 ${
              idx === currentSlide
                ? 'w-8 h-2 bg-[#C5A059]'
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PremiumAdPanel;
