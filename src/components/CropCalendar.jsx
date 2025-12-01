import React, { useState } from "react";
import cropCalendar from "../data/cropData.jsx";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";

/* Malayalam localisation */
const mlMonths = [
  "ജനുവരി", "ഫെബ്രുവരി", "മാർച്ച്", "ഏപ്രിൽ", "മേയ്", "ജൂൺ",
  "ജൂലൈ", "ഓഗസ്റ്റ്", "സെപ്റ്റംബർ", "ഒക്ടോബർ", "നവംബർ", "ഡിസംബർ"
];

const mlWeekdays = ["ഞായർ", "തിങ്കൾ", "ചൊവ്വ", "ബുധൻ", "വ്യാഴം", "വെള്ളി", "ശനി"];
const enWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthsEN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function CropCalendar() {
  const crops = Object.keys(cropCalendar); // paddy, coconut, etc.
  const [selectedCrop, setSelectedCrop] = useState(crops[0]); // default = paddy
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openSection, setOpenSection] = useState("takeaways");
  const [lang, setLang] = useState("en");

  const currentMonthEN = monthsEN[currentIndex];
  const currentMonthML = mlMonths[currentIndex];

  const data = cropCalendar[selectedCrop][currentMonthEN];

  /* Month Navigation */
  const prevMonth = () =>
    setCurrentIndex((prev) => (prev === 0 ? monthsEN.length - 1 : prev - 1));

  const nextMonth = () =>
    setCurrentIndex((prev) => (prev === monthsEN.length - 1 ? 0 : prev + 1));

  /* Date Calcs */
  const getFirstDay = (year, month) => new Date(year, month, 1).getDay();
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  return (
    <div className="min-h-screen bg-[#E8F7FF] pb-20 pt-4">

      {/* Header Banner */}
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src="https://cdn.pixabay.com/photo/2023/09/18/09/10/vietnam-8259984_1280.jpg"
          alt="banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Kerala Crop Calendar
          </h1>
        </div>
      </div>

      {/* Subtext */}
      <div className="text-center px-4 max-w-5xl mx-auto mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Kerala Crop Calendar – Plan Smart, Farm Better
        </h2>
        <p className="text-gray-600 mt-2">
          A monthly guide to help farmers schedule operations efficiently,
          improve yield and prevent crop loss.
        </p>
      </div>

      {/* Language Toggle */}
      <div className="text-center mb-4">
        <button
          onClick={() => setLang(lang === "en" ? "ml" : "en")}
          className="px-4 py-2 rounded-lg bg-white border shadow hover:bg-gray-50"
        >
          {lang === "en" ? "മലയാളം" : "English"}
        </button>
      </div>

      {/* -------- Crop Dropdown -------- */}
      <div className="text-center my-4">
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="px-4 py-2 rounded-lg border shadow bg-white"
        >
          {crops.map((c) => (
            <option key={c} value={c} className="capitalize">
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto px-4 mt-8">

        {/* LEFT: CALENDAR */}
        <div className="bg-white border shadow-xl rounded-2xl p-6">

          <div className="flex items-center justify-between bg-green-700 text-white px-5 py-3 rounded-xl">
            <button onClick={prevMonth}>
              <ChevronLeft size={28} />
            </button>

            <h2 className="text-xl font-semibold">
              {lang === "ml" ? currentMonthML : currentMonthEN} 2026
            </h2>

            <button onClick={nextMonth}>
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-700 mt-5">
            {(lang === "ml" ? mlWeekdays : enWeekdays).map((d) => (
              <div key={d} className="py-2 text-[14px]">{d}</div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-7 gap-2 mt-2 text-center">
            {[...Array(getFirstDay(2026, currentIndex))].map((_, i) => (
              <div key={i}></div>
            ))}
            {[...Array(getDaysInMonth(2026, currentIndex))].map((_, i) => (
              <div
                key={i}
                className="py-3 rounded-md border shadow-sm bg-white text-gray-700 hover:bg-green-100 cursor-pointer transition"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="bg-white border shadow-xl rounded-2xl p-6">

          {/* Crop Stage */}
          <div className="bg-green-50 border-l-4 border-green-700 p-4 rounded-md">
            <h3 className="text-xl font-bold text-green-800">
              {lang === "ml" ? "വിളയുടെ ഘട്ടം" : "Crop Stage"}
            </h3>
            <p className="mt-2 text-gray-700">
              {lang === "ml" ? data.cropStage_ml : data.cropStage}
            </p>
          </div>

          {/* Operations */}
          <div className="mt-6 border rounded-md">
            <button
              onClick={() => setOpenSection("operations")}
              className="w-full flex justify-between px-4 py-3 font-semibold text-gray-800"
            >
              {lang === "ml" ? "പ്രവർത്തനങ്ങൾ" : "Operations"}
              {openSection === "operations" ? <ChevronUp /> : <ChevronDown />}
            </button>

            {openSection === "operations" && (
              <div className="px-5 pb-4 text-gray-700">
                <ul className="list-disc pl-5 space-y-2">
                  {(lang === "ml" ? data.operations_ml : data.operations).map(
                    (v, i) => <li key={i}>{v}</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Weather Precautions */}
          <div className="mt-4 border rounded-md">
            <button
              onClick={() => setOpenSection("weather")}
              className="w-full flex justify-between px-4 py-3 font-semibold text-gray-800"
            >
              {lang === "ml" ? "കാലാവസ്ഥാ മുൻകരുതലുകൾ" : "Weather Precautions"}
              {openSection === "weather" ? <ChevronUp /> : <ChevronDown />}
            </button>

            {openSection === "weather" && (
              <div className="px-5 pb-4 text-gray-700">
                <ul className="list-disc pl-5 space-y-2">
                  {(lang === "ml" ? data.weatherPrecautions_ml : data.weatherPrecautions)
                    .map((v, i) => <li key={i}>{v}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Key Takeaways */}
          <div className="mt-4 border rounded-md bg-green-50">
            <button
              onClick={() => setOpenSection("takeaways")}
              className="w-full flex justify-between px-4 py-3 text-green-700 font-bold"
            >
              {lang === "ml" ? "മുഖ്യ കാര്യങ്ങൾ" : "Key Takeaways"}
              {openSection === "takeaways" ? <ChevronUp /> : <ChevronDown />}
            </button>

            {openSection === "takeaways" && (
              <div className="px-5 pb-4 text-gray-800">
                <ul className="list-disc pl-5 space-y-2">
                  {(lang === "ml" ? data.keyTakeaways_ml : data.keyTakeaways)
                    .map((v, i) => <li key={i}>{v}</li>)}
                </ul>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
