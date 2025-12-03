import React from "react";
import { Microscope, Bug, BarChart, MapPin, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
// import { useLanguage } from "../contexts/LanguageContext";

const FEATURES = [
  {
    to: "/upload",
    icon: <Microscope className="h-8 w-8 text-emerald-300" />,
    titleKey: "feature_detectCropDisease_title",
    textKey: "feature_detectCropDisease_text",
  },
  {
    to: "/pest-detection",
    icon: <Bug className="h-8 w-8 text-lime-300" />,
    titleKey: "feature_pestDetection_title",
    textKey: "feature_pestDetection_text",
  },
  {
    to: "/market-trends",
    icon: <BarChart className="h-8 w-8 text-amber-300" />,
    titleKey: "feature_marketTrends_title",
    textKey: "feature_marketTrends_text",
  },
  {
    to: "/market-place",
    icon: <MapPin className="h-8 w-8 text-teal-300" />,
    titleKey: "feature_nearestMarketplace_title",
    textKey: "feature_nearestMarketplace_text",
  },
  {
    to: "/soil-scanner",
    icon: <Microscope className="h-8 w-8 text-green-200" />,
    titleKey: "feature_soilScanner_title",
    textKey: "feature_soilScanner_text",
  },
  {
    to: "/fertilizer-guidance",
    icon: <Microscope className="h-8 w-8 text-emerald-200" />,
    titleKey: "feature_fertilizerGuidance_title",
    textKey: "feature_fertilizerGuidance_text",
  },
  {
    to: "/crop-calender",
    icon: <CalendarDays className="h-8 w-8 text-lime-200" />,
    titleKey: "feature_smartCropCalendar_title",
    textKey: "feature_smartCropCalendar_text",
  },
  {
    to: "/nearby-service",
    icon: <MapPin className="h-8 w-8 text-teal-200" />,
    titleKey: "feature_nearbyServices_title",
    textKey: "feature_nearbyServices_text",
  },
];

const Grid = () => {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-emerald-950 text-white py-10 shadow-sm border border-emerald-900">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-wide text-emerald-50">
          {t("toolsServicesTitle")}
        </h2>
        <p className="mt-2 text-sm text-emerald-200/80">
          {t("toolsServicesSubtitle")}
        </p>
      </div>

      {/* Icon grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {FEATURES.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center text-center gap-3 group"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900 border border-emerald-700 group-hover:border-emerald-300 transition-colors">
              {item.icon}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-emerald-50 group-hover:text-emerald-200 transition-colors">
                {t(item.titleKey)}
              </h3>
              <p className="mt-1 text-[11px] text-emerald-200/80 leading-snug">
                {t(item.textKey)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 flex justify-center">
        <Link
          to="/tools"
          className="px-6 py-2 rounded-full border border-emerald-300 text-sm font-semibold text-emerald-50 hover:bg-emerald-500/10 transition-colors"
        >
          {t("viewAllTools")}
        </Link>
      </div>
    </section>
  );
};

export default Grid;
