import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Microscope,
  Bug,
  BarChart,
  MapPin,
  CalendarDays,
  Sparkles,
  ScrollText,
  ShoppingCart,
  UserRound,
  Sprout,
  PlusCircle,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const FEATURES = (t) => [
  {
    to: "/upload",
    icon: <Microscope className="h-8 w-8 text-emerald-300" />,
    titleKey: "features.detectCrop.title",
    textKey: "features.detectCrop.text",
  },
  {
    to: "/pest-detection",
    icon: <Bug className="h-8 w-8 text-lime-300" />,
    titleKey: "features.pestDetection.title",
    textKey: "features.pestDetection.text",
  },
  {
    to: "/market-trends",
    icon: <BarChart className="h-8 w-8 text-amber-300" />,
    titleKey: "features.marketTrends.title",
    textKey: "features.marketTrends.text",
  },
  {
    to: "/market-place",
    icon: <MapPin className="h-8 w-8 text-teal-300" />,
    titleKey: "features.nearestMarketplace.title",
    textKey: "features.nearestMarketplace.text",
  },
  {
    to: "/soil-scanner",
    icon: <Microscope className="h-8 w-8 text-green-200" />,
    titleKey: "features.soilScanner.title",
    textKey: "features.soilScanner.text",
  },
  {
    to: "/fertilizer-guidance",
    icon: <Microscope className="h-8 w-8 text-emerald-200" />,
    titleKey: "features.fertilizerGuidance.title",
    textKey: "features.fertilizerGuidance.text",
  },
  {
    to: "/crop-calender",
    icon: <CalendarDays className="h-8 w-8 text-lime-200" />,
    titleKey: "features.cropCalendar.title",
    textKey: "features.cropCalendar.text",
  },
  {
    to: "/nearby-service",
    icon: <MapPin className="h-8 w-8 text-teal-200" />,
    titleKey: "features.nearbyServices.title",
    textKey: "features.nearbyServices.text",
  },
  {
    to: "/schemes",
    icon: <ScrollText className="h-8 w-8 text-amber-300" />,
    titleKey: "features.schemes.title",
    textKey: "features.schemes.text",
  },
  {
    to: "/knowledge-engine",
    icon: <Sparkles className="h-8 w-8 text-emerald-300" />,
    titleKey: "features.knowledgeEngine.title",
    textKey: "features.knowledgeEngine.text",
  },
  {
    to: "/market-place/create-requirement",
    icon: <ShoppingCart className="h-8 w-8 text-emerald-300" />,
    titleKey: "features.createBuySell.title",
    textKey: "features.createBuySell.text",
  },
  {
    to: "/farmer-profile",
    icon: <UserRound className="h-8 w-8 text-teal-200" />,
    titleKey: "features.updateProfile.title",
    textKey: "features.updateProfile.text",
  },
  // New entries added here
  {
    to: "/farms",
    icon: <MapPin className="h-8 w-8 text-blue-400" />,
    title: "Show All Farms",
    text: "View a list and map of all registered farms.",
  },
  {
    to: "/farms/add",
    icon: <PlusCircle className="h-8 w-8 text-green-400" />,
    title: "Add New Farm",
    text: "Register a new farm with location and details.",
  },
];

const ViewTools = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const { t } = useLanguage();
  const features = FEATURES(t);



  return (
    <section className="w-full bg-emerald-950 text-white py-10 shadow-sm border border-emerald-900">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-wide text-emerald-50">
          {t("tools.title")}
        </h2>
        <p className="mt-2 text-sm text-emerald-200/80">
          {t("tools.subtitle")}
        </p>
      </div>

      {/* Icon grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {features.map((item) => (
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

      {/* Bottom CTA (optional) */}
      <div className="mt-10 flex justify-center">
        {/* If you want a CTA later, use t('tools.cta') */}
      </div>
    </section>
  );
};

export default ViewTools;
