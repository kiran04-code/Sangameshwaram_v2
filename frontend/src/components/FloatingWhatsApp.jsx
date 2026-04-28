import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp = () => {
  const handleWhatsAppClick = () => {
    const message = `Hi! I'd like to know more about Foodie's Corner menu and offers.`;
    window.open(`https://wa.me/919049041488?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      data-testid="floating-whatsapp"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} />
    </button>
  );
};

export default FloatingWhatsApp;
