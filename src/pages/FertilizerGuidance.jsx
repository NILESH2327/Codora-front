import { useState, useRef, useEffect } from "react";
import fertilizerData from "../data/fertilizerData";
import { useLanguage } from "../contexts/LanguageContext";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";

/* ------------------- Load font from CDN ------------------- */
async function fetchFontAsBase64(url) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();

  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

export default function FertilizerGuidance() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const { language, t } = useLanguage();
  const lang = language === "ml" ? "ml" : "en";

  const cropKeys = Object.keys(fertilizerData);

  /* ------------------- Filters & Search ------------------- */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");
  const [weather, setWeather] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);

  /* ------------------- Filtering Logic ------------------- */
  const filteredCrops = cropKeys.filter((crop) => {
    const entry = fertilizerData[crop];

    const nameEn = entry.en.name.toLowerCase();
    const nameMl = entry.ml.name.toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch = nameEn.includes(q) || nameMl.includes(q);
    const matchesCategory = category === "all" || entry.category === category;
    const matchesPriority = priority === "all" || entry.priority === priority;
    const matchesWeather = weather === "all" || entry.weatherTag === weather;

    return matchesSearch && matchesCategory && matchesPriority && matchesWeather;
  });

  /* ------------------- PDF Generation ------------------- */
  const fontLoadedRef = useRef(false);

  async function generatePDF() {
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        unit: "pt",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const maxWidth = pageWidth - margin * 2;
      let cursorY = margin;

      /* Load Malayalam font via CDN only ONCE */
      if (lang === "ml" && !fontLoadedRef.current) {
        try {
          const base64Font = await fetchFontAsBase64(
            "https://cdn.jsdelivr.net/gh/google/fonts/ofl/notosansmalayalam/NotoSansMalayalam-Regular.ttf"
          );

          doc.addFileToVFS("NotoSansMalayalam-Regular.ttf", base64Font);
          doc.addFont("NotoSansMalayalam-Regular.ttf", "NotoMalayalam", "normal");

          fontLoadedRef.current = true;
        } catch (e) {
          console.error("Malayalam font loading failed:", e);
          // continue; fallback to default font
        }
      }

      const pdfFont = lang === "ml" && fontLoadedRef.current ? "NotoMalayalam" : "helvetica";
      doc.setFont(pdfFont);

      /* ----------- Page Title ----------- */
      doc.setFontSize(20);
      const title = t("fertilizerGuideTitle");
      doc.text(title, margin, cursorY);
      cursorY += 28;

      /* Subtitle */
      doc.setFontSize(11);
      const subtitle = t("fertilizerGuideSubtitle");
      const subtitleLines = doc.splitTextToSize(subtitle, maxWidth);
      doc.text(subtitleLines, margin, cursorY);
      cursorY += subtitleLines.length * 14 + 10;

      /* Divider */
      doc.setDrawColor(180);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 16;

      /* ----------- Crop Entries ----------- */
      doc.setFontSize(11);

      for (let key of filteredCrops) {
        const crop = fertilizerData[key][lang];

        // Page break
        if (cursorY > pageHeight - 100) {
          doc.addPage();
          doc.setFont(pdfFont);
          cursorY = margin;
        }

        /* Crop title */
        doc.setFontSize(14);
        doc.text(crop.name, margin, cursorY);
        cursorY += 20;

        doc.setFontSize(11);

        /* NPK */
        const npkText = `${t("NPKLabel")} ${crop.npk}`;
        const npkLines = doc.splitTextToSize(npkText, maxWidth);
        doc.text(npkLines, margin, cursorY);
        cursorY += npkLines.length * 14 + 6;

        /* Weather */
        const weatherLabel = t("weatherPrecautionLabel");
        const weatherText = `${weatherLabel} ${crop.weather}`;
        const weatherLines = doc.splitTextToSize(weatherText, maxWidth);
        doc.text(weatherLines, margin, cursorY);
        cursorY += weatherLines.length * 14 + 6;

        /* Key takeaway */
        const keyLabel = t("keyTakeawayLabel");
        const keyText = `${keyLabel} ${crop.key}`;
        const keyLines = doc.splitTextToSize(keyText, maxWidth);
        doc.text(keyLines, margin, cursorY);
        cursorY += keyLines.length * 14 + 14;

        /* Divider */
        doc.setDrawColor(230);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 16;
      }

      const fileName = lang === "ml" ? "fertilizer_guide_ml.pdf" : "fertilizer_guide_en.pdf";
      doc.save(fileName);
    } catch (err) {
      console.error("PDF error:", err);
      toast.error(t("pdfFailed"));
    }

    setIsGenerating(false);
  }

  /* ------------------- UI ------------------- */
  return (
    <div className="w-full flex justify-center py-10 px-4">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-semibold text-center mb-8">
          {t("fertilizerGuideTitle")}
        </h1>

        {/* SEARCH + FILTERS */}
        <div className="bg-white rounded-xl border shadow p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="px-4 py-3 rounded-xl border bg-gray-50 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Category */}
            <select
              className="px-4 py-3 rounded-xl border bg-gray-50 shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">{t("allCategories")}</option>
              <option value="cereal">{t("cereals")}</option>
              <option value="plantation">{t("plantation")}</option>
              <option value="spice">{t("spices")}</option>
              <option value="vegetable">{t("vegetables")}</option>
            </select>

            {/* Priority */}
            <select
              className="px-4 py-3 rounded-xl border bg-gray-50 shadow-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="all">{t("allNPK")}</option>
              <option value="high-n">{t("highN")}</option>
              <option value="high-p">{t("highP")}</option>
              <option value="high-k">{t("highK")}</option>
            </select>

            {/* Weather */}
            <select
              className="px-4 py-3 rounded-xl border bg-gray-50 shadow-sm"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
            >
              <option value="all">{t("allWeather")}</option>
              <option value="rain-sensitive">{t("rainSensitive")}</option>
              <option value="waterlogging-sensitive">{t("waterloggingSensitive")}</option>
              <option value="moisture-sensitive">{t("moistureSensitive")}</option>
            </select>
          </div>
        </div>

        {/* Crop Cards */}
        <div className="bg-white rounded-xl border shadow p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCrops.length ? (
              filteredCrops.map((key) => {
                const crop = fertilizerData[key][lang];
                return (
                  <div
                    key={key}
                    className="p-5 border rounded-xl bg-gray-50 shadow-sm hover:bg-gray-100"
                  >
                    <h2 className="text-xl font-semibold mb-2">{crop.name}</h2>

                    <p><b>{t("NPKLabel")}</b> {crop.npk}</p>
                    <p>
                      <b>{t("weatherPrecautionLabel")}</b> {crop.weather}
                    </p>
                    <p>
                      <b>{t("keyTakeawayLabel")}</b> {crop.key}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center col-span-2">
                {t("noMatchingCrops")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Floating PDF Button ---------- */}
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        title={t("generatePDF")}
        aria-label={t("generatePDF")}
        className="fixed bottom-6 left-6 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center"
      >
        {isGenerating ? (
          <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full"></div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 3v12m0 0l4-4m-4 4l-4-4m14 9H2" />
          </svg>
        )}
      </button>
    </div>
  );
}
