import React, { createContext, useContext, useState } from "react";
import en from "../data/en/translation.json"
import ml from "../data/ml/translation.json"

const LanguageContext = createContext();

const translations = {
  en: {
    ...en
  },

  ml: {...ml
    
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
