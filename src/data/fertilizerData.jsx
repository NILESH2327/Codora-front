const fertilizerData = {
  paddy: {
    en: {
      name: "Paddy (Rice)",
      npk: "Basal: 40-20-20 | Tillering: +20N | PI: +20N + 10K",
      weather: "Avoid urea before heavy rainfall. Prefer granular fertilizers.",
      key: "Split application improves yield and reduces nutrient loss."
    },
    ml: {
      name: "നെല്ല് (Paddy)",
      npk: "ബേസൽ: 40-20-20 | ടില്ലറിംഗ്: +20N | PI: +20N + 10K",
      weather: "കനത്തമഴയ്ക്ക് മുമ്പ് യൂറിയ ഉപയോഗിക്കരുത്. ഗ്രാനുലാർ വളം നല്ലതാണ്.",
      key: "വിഭജിച്ച വളപ്രയോഗം കൂടുതൽ വിളവ് നൽകും."
    }
  },

  banana: {
    en: {
      name: "Banana (Nendran / Robusta)",
      npk: "Total: 200N, 100P, 300K per plant (6-month split).",
      weather: "If rainfall > 20mm is expected, delay fertilizer by 2 days.",
      key: "High potassium increases bunch size and quality."
    },
    ml: {
      name: "വാഴ (Nendran / Robusta)",
      npk: "ആകെ: 200N, 100P, 300K (6 മാസം വിഭജിച്ച്).",
      weather: "20mm+ മഴയുണ്ടെങ്കിൽ വളം 2 ദിവസം നീട്ടുക.",
      key: "ഉയർന്ന പൊട്ടാഷ് നല്ല കൊത്തി രൂപീകരണത്തിന് സഹായിക്കുന്നു."
    }
  },

  coconut: {
    en: {
      name: "Coconut",
      npk: "600g N, 320g P, 1200g K per palm/year (3 splits).",
      weather: "Do not apply fertilizer during waterlogging.",
      key: "Potassium is essential for nut development."
    },
    ml: {
      name: "തേങ്ങ",
      npk: "600g N, 320g P, 1200g K (വർഷത്തിൽ 3 തവണ).",
      weather: "വെള്ളക്കെട്ടുള്ളപ്പോൾ വളം ഉപയോഗിക്കരുത്.",
      key: "പൊട്ടാഷ് നാരങ്ങയുടെ വളർച്ചയ്ക്ക് നിർണായകം."
    }
  },

  pepper: {
    en: {
      name: "Pepper",
      npk: "100g N, 40g P, 140g K per vine/year (2 splits).",
      weather: "Avoid applying fertilizer on wet vines.",
      key: "Balanced nutrients improve berry size."
    },
    ml: {
      name: "കുരുമുളക്",
      npk: "100g N, 40g P, 140g K (വർഷത്തിൽ 2 തവണ).",
      weather: "നനഞ്ഞ വള്ളികളിൽ വളം ഇടരുത്.",
      key: "സമതുലിത വളപ്രയോഗം വലിയ കുരു ലഭിക്കാൻ സഹായിക്കുന്നു."
    }
  },

  vegetables: {
    en: {
      name: "Vegetables",
      npk: "Basal: 40-40-20 | Top dressing: +20N | Fruiting: +20K",
      weather: "Reduce nitrogen during rainy weeks.",
      key: "Excess nitrogen increases pest attack."
    },
    ml: {
      name: "പച്ചക്കറികൾ",
      npk: "ബേസൽ: 40-40-20 | ടോപ്പിംഗ്: +20N | ഫലവളർച്ച: +20K",
      weather: "മഴക്കാലത്ത് നൈട്രജൻ കുറയ്ക്കുക.",
      key: "അധിക നൈട്രജൻ കീടാക്രമണം വർദ്ധിപ്പിക്കും."
    }
  }
};

export default fertilizerData;
