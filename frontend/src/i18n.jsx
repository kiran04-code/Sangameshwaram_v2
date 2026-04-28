import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Common
      "restaurant_name": "The Sangameshwaram Cafe",
      "tagline": "Premium Dining Experience",
      "order_now": "Order Now",
      "view_menu": "View Menu",
      "add_to_cart": "Add to Cart",
      "cart": "Cart",
      "checkout": "Checkout",
      "total": "Total",
      "subtotal": "Subtotal",
      
      // Navigation
      "home": "Home",
      "menu": "Menu",
      "about": "About",
      "contact": "Contact",
      
      // Admin
      "admin_dashboard": "Admin Dashboard",
      "orders": "Orders",
      "analytics": "Analytics",
      "inventory": "Inventory",
      "vendors": "Vendors",
      "settings": "Settings",
      "logout": "Logout",
      
      // Waiter
      "waiter_dashboard": "Waiter Dashboard",
      "tables": "Tables",
      "mark_delivered": "Mark Delivered",
      "mark_paid": "Mark Paid",
      "add_items": "Add Items",
      
      // Stock Manager
      "stock_dashboard": "Stock Manager",
      "ingredients": "Ingredients",
      "low_stock_alerts": "Low Stock Alerts",
      "add_stock": "Add Stock",
      "remove_stock": "Remove Stock",
      
      // Kitchen
      "kitchen_display": "Kitchen Display",
      "currently_preparing": "Currently Preparing",
      "ready_for_pickup": "Ready for Pickup",
      
      // Order Status
      "new": "New",
      "preparing": "Preparing",
      "ready": "Ready",
      "delivered": "Delivered",
      "paid": "Paid",
      "completed": "Completed",
      
      // Categories
      "beverages": "Beverages",
      "milkshake": "Milkshakes",
      "pizza": "Pizza",
      "burgers": "Burgers"
    }
  },
  hi: {
    translation: {
      // Common
      "restaurant_name": "द संगमेश्वरम कॅफे",
      "tagline": "प्रीमियम भोजन अनुभव",
      "order_now": "अभी ऑर्डर करें",
      "view_menu": "मेन्यू देखें",
      "add_to_cart": "कार्ट में जोड़ें",
      "cart": "कार्ट",
      "checkout": "भुगतान करें",
      "total": "कुल",
      "subtotal": "उप-योग",
      
      // Navigation
      "home": "होम",
      "menu": "मेन्यू",
      "about": "हमारे बारे में",
      "contact": "संपर्क",
      
      // Admin
      "admin_dashboard": "एडमिन डैशबोर्ड",
      "orders": "ऑर्डर",
      "analytics": "विश्लेषण",
      "inventory": "इन्वेंटरी",
      "vendors": "विक्रेता",
      "settings": "सेटिंग्स",
      "logout": "लॉग आउट",
      
      // Waiter
      "waiter_dashboard": "वेटर डैशबोर्ड",
      "tables": "टेबल",
      "mark_delivered": "डिलीवर किया गया",
      "mark_paid": "भुगतान किया गया",
      "add_items": "आइटम जोड़ें",
      
      // Stock Manager
      "stock_dashboard": "स्टॉक मैनेजर",
      "ingredients": "सामग्री",
      "low_stock_alerts": "कम स्टॉक अलर्ट",
      "add_stock": "स्टॉक जोड़ें",
      "remove_stock": "स्टॉक हटाएं",
      
      // Kitchen
      "kitchen_display": "किचन डिस्प्ले",
      "currently_preparing": "तैयारी में",
      "ready_for_pickup": "पिकअप के लिए तैयार",
      
      // Order Status
      "new": "नया",
      "preparing": "तैयारी में",
      "ready": "तैयार",
      "delivered": "डिलीवर किया गया",
      "paid": "भुगतान किया गया",
      "completed": "पूर्ण",
      
      // Categories
      "beverages": "पेय पदार्थ",
      "milkshake": "मिल्कशेक",
      "pizza": "पिज्जा",
      "burgers": "बर्गर"
    }
  },
  mr: {
    translation: {
      // Common
      "restaurant_name": "द संगमेश्वरम कॅफे",
      "tagline": "प्रीमियम जेवणाचा अनुभव",
      "order_now": "आता ऑर्डर करा",
      "view_menu": "मेनू पहा",
      "add_to_cart": "कार्टमध्ये जोडा",
      "cart": "कार्ट",
      "checkout": "चेकआउट",
      "total": "एकूण",
      "subtotal": "उप-एकूण",
      
      // Navigation
      "home": "होम",
      "menu": "मेनू",
      "about": "आमच्याबद्दल",
      "contact": "संपर्क",
      
      // Admin
      "admin_dashboard": "अ‍ॅडमिन डॅशबोर्ड",
      "orders": "ऑर्डर",
      "analytics": "विश्लेषण",
      "inventory": "इन्व्हेंटरी",
      "vendors": "विक्रेते",
      "settings": "सेटिंग्ज",
      "logout": "लॉग आउट",
      
      // Waiter
      "waiter_dashboard": "वेटर डॅशबोर्ड",
      "tables": "टेबल",
      "mark_delivered": "डिलिव्हर केले",
      "mark_paid": "पेमेंट झाले",
      "add_items": "आयटम जोडा",
      
      // Stock Manager
      "stock_dashboard": "स्टॉक मॅनेजर",
      "ingredients": "साहित्य",
      "low_stock_alerts": "कमी स्टॉक अलर्ट",
      "add_stock": "स्टॉक जोडा",
      "remove_stock": "स्टॉक काढा",
      
      // Kitchen
      "kitchen_display": "किचन डिस्प्ले",
      "currently_preparing": "तयारीत",
      "ready_for_pickup": "पिकअपसाठी तयार",
      
      // Order Status
      "new": "नवीन",
      "preparing": "तयारीत",
      "ready": "तयार",
      "delivered": "डिलिव्हर केले",
      "paid": "पेमेंट झाले",
      "completed": "पूर्ण",
      
      // Categories
      "beverages": "पेय",
      "milkshake": "मिल्कशेक",
      "pizza": "पिझ्झा",
      "burgers": "बर्गर"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
