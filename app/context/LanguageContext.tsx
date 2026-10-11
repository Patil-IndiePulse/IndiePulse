'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Comprehensive Dictionary for Indian and Global Languages across the Platform
const translations: Record<string, Record<string, string>> = {
  'मराठी (Marathi)': {
    'Discover': 'शोधा',
    'Community': 'समुदाय',
    'Leaderboard': 'लिडरबोर्ड',
    'Quests': 'क्वेस्ट्स',
    'Login': 'लॉगिन',
    'Get Started': 'सुरू करा',
    'My Profile': 'माझे प्रोफाइल',
    'Publish Game': 'गेम प्रकाशित करा',
    'CREATE POST': 'पोस्ट तयार करा',
    'Explore Community Feed': 'कम्युनिटी फीड तपासा',
    'Join the Quests': 'क्वेस्ट्समध्ये सहभागी व्हा',
    'Trending Indie Games': 'ट्रेंडिंग इंडी गेम्स',
    'Search games, projects, creators...': 'गेम्स, प्रोजेक्ट्स, क्रिएटर्स शोधा...',
    'Language & Region': 'भाषा आणि प्रदेश',
    'Settings and activity': 'सेटिंग्ज आणि ॲक्टिव्हिटी',
    'Back': 'मागे जा',
    'Save Preferences': 'प्राधान्ये सेव्ह करा',
  },
  'ಕನ್ನಡ (Kannada)': {
    'Discover': 'ಅನ್ವೇಷಿಸಿ',
    'Community': 'ಸಮುದಾಯ',
    'Leaderboard': 'ಲೀಡರ್‌ಬೋರ್ಡ್',
    'Quests': 'ಕ್ವೆಸ್ಟ್‌ಗಳು',
    'Login': 'ಲಾಗಿನ್',
    'Get Started': 'ಪ್ರಾರಂಭಿಸಿ',
    'My Profile': 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    'Publish Game': 'ಆಟವನ್ನು ಪ್ರಕಟಿಸಿ',
    'CREATE POST': 'ಪೋಸ್ಟ್ ರಚಿಸಿ',
    'Explore Community Feed': 'ಸಮುದಾಯ ಫೀಡ್ ಅನ್ನು ಅನ್ವೇಷಿಸಿ',
    'Join the Quests': 'ಕ್ವೆಸ್ಟ್‌ಗಳನ್ನು ಸೇರಿ',
    'Trending Indie Games': 'ಜನಪ್ರಿಯ ಇಂಡಿ ಆಟಗಳು',
    'Search games, projects, creators...': 'ಆಟಗಳು, ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು, ಸೃಷ್ಟಿಕರ್ತರನ್ನು ಹುಡುಕಿ...',
    'Language & Region': 'ಭಾಷೆ ಮತ್ತು ಪ್ರದೇಶ',
    'Settings and activity': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಚಟುವಟಿಕೆ',
    'Back': 'ಹಿಂದಕ್ಕೆ',
    'Save Preferences': 'ಆದ್ಯತೆಗಳನ್ನು ಉಳಿಸಿ',
  },
  'हिन्दी (Hindi)': {
    'Discover': 'खोजें',
    'Community': 'समुदाय',
    'Leaderboard': 'लीडरबोर्ड',
    'Quests': 'क्वेस्ट्स',
    'Login': 'लॉगिन',
    'Get Started': 'शुरू करें',
    'My Profile': 'मेरी प्रोफाइल',
    'Publish Game': 'गेम पब्लिश करें',
    'CREATE POST': 'पोस्ट बनाएं',
    'Explore Community Feed': 'कम्युनिटी फीड देखें',
    'Join the Quests': 'क्वेस्ट्स में शामिल हों',
    'Trending Indie Games': 'ट्रेंडिंग इंडी गेम्स',
    'Search games, projects, creators...': 'गेम्स, प्रोजेक्ट्स, क्रिएटर्स खोजें...',
    'Language & Region': 'भाषा और क्षेत्र',
    'Settings and activity': 'सेटिंग्स और गतिविधि',
    'Back': 'वापस',
    'Save Preferences': 'प्राथमिकताएं सहेजें',
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'English (US)',
  setLanguage: () => {},
  t: (text) => text,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState('English (US)');

  useEffect(() => {
    const savedLang = localStorage.getItem('platform_language');
    if (savedLang) {
      setLanguageState(savedLang);
    }

    const handleStorageChange = () => {
      const updatedLang = localStorage.getItem('platform_language');
      if (updatedLang) {
        setLanguageState(updatedLang);
      }
    };

    window.addEventListener('platform-settings-changed', handleStorageChange);
    return () => window.removeEventListener('platform-settings-changed', handleStorageChange);
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('platform_language', lang);
    window.dispatchEvent(new Event('platform-settings-changed'));
  };

  const t = (text: string) => {
    if (translations[language] && translations[language][text]) {
      return translations[language][text];
    }
    return text; // Default fallback to original text if translation is missing
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);