import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sprout, Menu, X, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: "/", label: t("home") },
    { path: "/dashboard", label: t("dashboard") },
    { path: "/upload", label: t("upload") },
    { path: "/chatbot", label: t("chatbot") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-700 transition-colors">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
              KeralaFarm AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === "en" ? "ml" : "en")}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{language === "en" ? "മലയാളം" : "English"}</span>
            </button>
            <button className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors">
              {t("login")}
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              {t("getStarted")}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={() => setLanguage(language === "en" ? "ml" : "en")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors w-full"
                >
                  <Globe className="h-5 w-5" />
                  <span>{language === "en" ? "മലയാളം" : "English"}</span>
                </button>

                <button className="w-full mt-2 px-3 py-2 text-green-600 hover:text-green-700 font-medium transition-colors text-left">
                  {t("login")}
                </button>

                <button className="w-full mt-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  {t("getStarted")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
