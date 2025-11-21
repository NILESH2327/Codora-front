import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    upload: "Upload",
    chatbot: "Chatbot",
    login: "Login",
    getStarted: "Get Started",

    // Homepage
    heroTitle: "AI-Powered Farming Assistant for Kerala",
    heroSubtitle:
      "Empowering Kerala farmers with smart technology for better crops, weather insights, and market intelligence",

    // Dashboard
    weatherForecast: "Weather Forecast",
    cropTips: "Personalized Crop Tips",
    marketPrices: "Market Prices",
    govSchemes: "Government Schemes",

    // Upload
    uploadTitle: "Crop Disease Detection",
    uploadSubtitle:
      "Upload an image of your crop or leaf for AI-powered disease analysis",

    // Chatbot
    chatTitle: "Ask Your Farming Questions",
    chatSubtitle:
      "Get instant answers about farming, crops, and agriculture",

    // Footer
    about: "About",
    contact: "Contact",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },

  ml: {
    // Navigation
    home: "ഹോം",
    dashboard: "ഡാഷ്‌ബോർഡ്",
    upload: "അപ്‌ലോഡ്",
    chatbot: "ചാറ്റ്ബോട്ട്",
    login: "ലോഗിൻ",
    getStarted: "ആരംഭിക്കുക",

    // Homepage
    heroTitle: "കേരള കർഷകർക്കായി AI-പവർഡ് ഫാർമിംഗ് അസിസ്റ്റന്റ്",
    heroSubtitle:
      "മികച്ച വിളകൾ, കാലാവസ്ഥാ വിവരങ്ങൾ, വിപണി വിവരങ്ങൾ എന്നിവയ്ക്കായി കേരള കർഷകരെ സ്മാർട്ട് സാങ്കേതികവിദ്യ ഉപയോഗിച്ച് ശാക്തീകരിക്കുന്നു",

    // Dashboard
    weatherForecast: "കാലാവസ്ഥാ പ്രവചനം",
    cropTips: "വ്യക്തിഗത വിള നുറുങ്ങുകൾ",
    marketPrices: "വിപണി വിലകൾ",
    govSchemes: "സർക്കാർ പദ്ധതികൾ",

    // Upload
    uploadTitle: "വിള രോഗ കണ്ടെത്തൽ",
    uploadSubtitle:
      "AI-പവർഡ് രോഗ വിശകലനത്തിനായി നിങ്ങളുടെ വിളയുടെയോ ഇലയുടെയോ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക",

    // Chatbot
    chatTitle: "നിങ്ങളുടെ കൃഷി ചോദ്യങ്ങൾ ചോദിക്കുക",
    chatSubtitle:
      "കൃഷി, വിളകൾ, കാർഷികത എന്നിവയെക്കുറിച്ച് തൽക്ഷണ ഉത്തരങ്ങൾ നേടുക",

    // Footer
    about: "കുറിച്ച്",
    contact: "ബന്ധപ്പെടുക",
    privacy: "സ്വകാര്യതാ നയം",
    terms: "സേവന നിബന്ധനകൾ",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
