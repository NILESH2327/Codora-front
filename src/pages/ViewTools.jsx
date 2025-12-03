import React, { useEffect } from "react";
import { Microscope, Bug, BarChart, MapPin, CalendarDays, Sparkles, ScrollText, ShoppingCart, UserRound, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
const FEATURES = [
  {
    to: "/upload",
    icon: <Microscope className="h-8 w-8 text-emerald-300" />,
    title: "Detect Crop Disease",
    text: "Upload crop images and get instant diagnosis.",
  },
  {
    to: "/pest-detection",
    icon: <Bug className="h-8 w-8 text-lime-300" />,
    title: "Pest Detection",
    text: "Identify harmful pests from crop images.",
  },
  {
    to: "/market-trends",
    icon: <BarChart className="h-8 w-8 text-amber-300" />,
    title: "Market Trends",
    text: "View commodity prices and trends.",
  },
  {
    to: "/market-place",
    icon: <MapPin className="h-8 w-8 text-teal-300" />,
    title: "Nearest Marketplace",
    text: "Find buyers and sellers near you.",
  },
  {
    to: "/soil-scanner",
    icon: <Microscope className="h-8 w-8 text-green-200" />,
    title: "Soil Health Scanner",
    text: "Analyze soil nutrients using AI.",
  },
  {
    to: "/fertilizer-guidance",
    icon: <Microscope className="h-8 w-8 text-emerald-200" />,
    title: "Fertilizer Guidance",
    text: "Get smart fertilizer recommendations.",
  },
  {
    to: "/crop-calender",
    icon: <CalendarDays className="h-8 w-8 text-lime-200" />,
    title: "Smart Crop Calendar",
    text: "Plan sowing and harvesting schedules.",
  },
  {
    to: "/nearby-service",
    icon: <MapPin className="h-8 w-8 text-teal-200" />,
    title: "Nearby Agri Services",
    text: "Locate shops, labs and rentals.",
  },
  {
    to: "/schemes",
    icon: <ScrollText className="h-8 w-8 text-amber-300" />,
    title: "Schemes",
    text: "Browse government support programs.",
  },
  {
    to: "/knowledge-engine",
    icon: <Sparkles className="h-8 w-8 text-emerald-300" />,
    title: "Knowledge Engine",
    text: "Ask agronomy questions and get answers.",
  },
  {
    to: "/market-place/create-requirement",
    icon: <ShoppingCart className="h-8 w-8 text-emerald-300" />,
    title: "Create / Buy / Sell",
    text: "Create listings and manage buy/sell orders.",
  },
  {
    to: "/farmer-profile",
    icon: <UserRound className="h-8 w-8 text-teal-200" />,
    title: "Update Profile",
    text: "Edit your farm, crop and contact details.",
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



const ViewTools= () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
      }, []);
  return (
    <section className="w-full bg-emerald-950 text-white py-10 shadow-sm border border-emerald-900">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-wide text-emerald-50">
          TOOLS &amp; SERVICES
        </h2>
        <p className="mt-2 text-sm text-emerald-200/80">
          Explore different tools to support your farming decisions.
        </p>
      </div>

      {/* Icon grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
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
                {item.title}
              </h3>
              <p className="mt-1 text-[11px] text-emerald-200/80 leading-snug">
                {item.text}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 flex justify-center">
     
      </div>
    </section>
  );
};

export default ViewTools;
