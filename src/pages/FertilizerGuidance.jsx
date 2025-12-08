import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";


/* ------------------- Axios Instance ------------------- */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

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
  /* Scroll to top */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const {t} = useLanguage();

  const { language } = useLanguage();
  const lang = language === "ml" ? "ml" : "en";

  /* ------------------- STATES ------------------- */
  const [fertilizerData, setFertilizerData] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");
  const [weather, setWeather] = useState("all");

  const [isGenerating, setIsGenerating] = useState(false);
  const fontLoadedRef = useRef(false);

  /* ------------------- FETCH DATA FROM BACKEND ------------------- */
  useEffect(() => {
   API.get("/fertilizer/all")
  .then((res) => {
    const mapped = {};

    res.data.forEach((item) => {

      // Auto-detect NPK priority
      let priorityTag = "all";
      const npk = item.npk.toLowerCase();
      if (npk.includes("n")) priorityTag = "high-n";
      if (npk.includes("p")) priorityTag = "high-p";
      if (npk.includes("k")) priorityTag = "high-k";

      // Auto-detect Weather Category
      let weatherTag = "all";
      const w = item.weather.toLowerCase();

      if (w.includes("rain") || w.includes("rainfall"))
        weatherTag = "rain-sensitive";
      if (w.includes("water") || w.includes("waterlogging"))
        weatherTag = "waterlogging-sensitive";
      if (w.includes("moist") || w.includes("humidity"))
        weatherTag = "moisture-sensitive";

      mapped[item.crop] = {
        en: {
          name: item.crop,
          npk: item.npk,
          weather: item.weather,
          key: item.key,
        },
        ml: {
          name: item.crop,   // Replace with Malayalam name later
          npk: item.npk,
          weather: item.weather,
          key: item.key,
        },

        category: item.category || "general",
        priority: priorityTag,
        weatherTag: weatherTag,
      };
    });

    setFertilizerData(mapped);
  })
  .catch((err) => console.error("Backend fetch error:", err));

  }, []);

  /* ------------------- FILTER LOGIC ------------------- */
  const cropKeys = Object.keys(fertilizerData);

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

      if (lang === "ml" && !fontLoadedRef.current) {
        try {
          const base64Font = await fetchFontAsBase64(
            "https://cdn.jsdelivr.net/gh/google/fonts/ofl/notosansmalayalam/NotoSansMalayalam-Regular.ttf"
          );

          doc.addFileToVFS("NotoSansMalayalam-Regular.ttf", base64Font);
          doc.addFont(
            "NotoSansMalayalam-Regular.ttf",
            "NotoMalayalam",
            "normal"
          );

          fontLoadedRef.current = true;
        } catch (e) {
          console.error("Malayalam font loading failed:", e);
          // continue; fallback to default font
        }
      }

      const pdfFont =
        lang === "ml" && fontLoadedRef.current ? "NotoMalayalam" : "helvetica";

      doc.setFont(pdfFont);

      // Title
      doc.setFontSize(20);
      const title =
        lang === "ml" ? "വളം മാർഗ്ഗനിർദ്ദേശങ്ങൾ" : "Fertilizer Guidance";
      doc.text(title, margin, cursorY);
      cursorY += 28;

      // Subtitle
      doc.setFontSize(11);
      const subtitle = t("fertilizerGuideSubtitle");
      const subtitleLines = doc.splitTextToSize(subtitle, maxWidth);
      doc.text(subtitleLines, margin, cursorY);
      cursorY += subtitleLines.length * 14 + 10;

      // Divider
      doc.setDrawColor(180);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 16;

      // Content
      doc.setFontSize(12);

      for (let key of filteredCrops) {
        const crop = fertilizerData[key][lang];

        if (cursorY > pageHeight - 100) {
          doc.addPage();
          doc.setFont(pdfFont);
          cursorY = margin;
        }

        doc.setFontSize(14);
        doc.text(crop.name, margin, cursorY);
        cursorY += 22;

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

        doc.setDrawColor(230);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 16;
      }

      const fileName =
        lang === "ml" ? "fertilizer_guide_ml.pdf" : "fertilizer_guide_en.pdf";
      doc.save(fileName);
    } catch (err) {
      console.error("PDF error:", err);
      toast.error(t("pdfFailed"));
    }

    setIsGenerating(false);
  }

  /* ------------------- UI ------------------- */
  return (
    <div
      className="w-full flex justify-center py-10 px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2021/09/18/02/27/vietnam-6634082_1280.jpg')",
      }}
    >
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl text-white font-semibold text-center mb-8">
          {t("fertilizerGuideTitle")}
        </h1>

        {/* SEARCH + FILTERS */}
        <div className="bg-white rounded-xl border shadow p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder={
                lang === "ml" ? "വിളയുടെ പേര് തിരയുക…" : "Search crop…"
              }
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
              <option value="all">
                {lang === "ml" ? "എല്ലാ വിഭാഗങ്ങൾ" : "All Categories"}
              </option>
              <option value="cereal">
                {lang === "ml" ? "ധാന്യങ്ങൾ" : "Cereals"}
              </option>
              <option value="plantation">
                {lang === "ml" ? "തോട്ടവിളകൾ" : "Plantation"}
              </option>
              <option value="spice">
                {lang === "ml" ? "മസാല" : "Spices"}
              </option>
              <option value="vegetable">
                {lang === "ml" ? "പച്ചക്കറികൾ" : "Vegetables"}
              </option>
            </select>

            {/* Priority */}
            <select
              className="px-4 py-3 rounded-xl border bg-gray-50 shadow-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="all">
                {lang === "ml" ? "എല്ലാ NPK" : "All NPK"}
              </option>
              <option value="high-n">
                {lang === "ml" ? "ഉയർന്ന N" : "High Nitrogen"}
              </option>
              <option value="high-p">
                {lang === "ml" ? "ഉയർന്ന P" : "High Phosphorus"}
              </option>
              <option value="high-k">
                {lang === "ml" ? "ഉയർന്ന K" : "High Potassium"}
              </option>
            </select>

            {/* Weather */}
            <select
              className="px-4 py-3 rounded-xl border bg-gray-50 shadow-sm"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
            >
              <option value="all">
                {lang === "ml" ? "എല്ലാം" : "All Weather"}
              </option>
              <option value="rain-sensitive">
                {lang === "ml" ? "മഴ-സെൻസിറ്റീവ്" : "Rain Sensitive"}
              </option>
              <option value="waterlogging-sensitive">
                {lang === "ml" ? "വെള്ളക്കെട്ട്" : "Waterlogging Sensitive"}
              </option>
              <option value="moisture-sensitive">
                {lang === "ml" ? "നനവ്" : "Moisture Sensitive"}
              </option>
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
                    <h2 className="text-xl font-semibold mb-2">
                      {crop.name}
                    </h2>
                    <p>
                      <b>NPK:</b> {crop.npk}
                    </p>
                    <p>
                      <b>{lang === "ml" ? "കാലാവസ്ഥ:" : "Weather:"}</b>{" "}
                      {crop.weather}
                    </p>
                    <p>
                      <b>{t("keyTakeawayLabel")}</b> {crop.key}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center col-span-2">
                {lang === "ml"
                  ? "ഒന്നും കണ്ടെത്താനായില്ല."
                  : "No matching crops found."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* --- PDF Button --- */}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v12m0 0l4-4m-4 4l-4-4m14 9H2"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
