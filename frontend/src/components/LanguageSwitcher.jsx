import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'hi', label: 'हि', name: 'हिन्दी' },
    { code: 'mr', label: 'मर', name: 'मराठी' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language);

  return (
    <div className="relative" data-testid="language-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-xs sm:text-sm transition-all"
      >
        <Globe size={16} className="sm:size-18" />
        <span className="hidden xs:inline">{currentLang?.label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border-2 border-[#8B1538] rounded-lg shadow-lg z-50 min-w-max">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full px-4 py-2 text-left text-sm font-semibold transition-all first:rounded-t-lg last:rounded-b-lg ${
                i18n.language === lang.code
                  ? 'bg-[#8B1538] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              data-testid={`lang-${lang.code}`}
            >
              {lang.label} - {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
