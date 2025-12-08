import { Search, Library } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const SchemeHeader = ({ onOpenSchemes }) => {
  return (
    <header
      className="bg-cover bg-center bg-no-repeat border-b shadow-sm"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2021/09/18/02/27/vietnam-6634082_1280.jpg')",
      }}
    >
      {/* Blur overlay */}
      <div className="bg-white/60">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between gap-4">

          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Government Schemes (PM-KISAN, Subsidies, etc.)"
                className="
                  w-full pl-11 pr-4 py-3
                  bg-white/90 shadow-md border border-gray-300 
                  rounded-lg text-gray-800 placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-green-600
                "
              />
            </div>
          </div>

          {/* Right Button */}
          <Link
            to={'/SchemesEligible'}
            onClick={onOpenSchemes}
            className="
              flex items-center gap-2 
              bg-green-600 hover:bg-green-700 text-white
              px-6 py-3 rounded-lg font-medium 
              shadow-md transition-all
            "
          >
            <Library size={20} />
            Eligible Schemes
          </Link>

        </div>
      </div>
    </header>
  );
};

export default SchemeHeader;