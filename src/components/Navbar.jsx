import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sprout, Menu, X, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { logout } from "../lib/actions/authActions";

const Navbar = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: t("Home"), show: !isAuthenticated },
    { path: "/dashboard", label: t("dashboard"), show: true },
    { path: "/Activity", label: t("My Activity"), show: true },
    { path: "/tools", label: t("Tools"), show: true },
    {
      path: "/farmer-profile",
      label: t("Profile"),
      show: isAuthenticated,
    },
  ];

  const LanguageButton = () => (
    <button
      onClick={() => setLanguage(language === "en" ? "ml" : "en")}
      className="flex items-center space-x-1 px-3 py-2 rounded-md 
                 text-sm font-medium text-gray-600 hover:text-green-600 
                 hover:bg-green-50 transition"
    >
      <Globe className="h-4 w-4" />
      <span>{language === "en" ? "മലയാളം" : "English"}</span>
    </button>
  );

  const NavLink = ({ item }) => (
    <Link
      to={item.path}
      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
        isActive(item.path)
          ? "bg-green-100 text-green-700"
          : "text-gray-600 hover:text-green-600 hover:bg-green-50"
      }`}
    >
      {item.label}
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-700 transition">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition">
              {t("Krishi Sakhi")}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">

            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <NavLink key={item.path} item={item} />
              ))}

            <LanguageButton />

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-green-600 hover:text-green-700 font-medium"
              >
                {t("Logout")}
              </button>
            ) : (
              <Link
                to="/twilio-invite"
                className="px-4 py-2 text-green-600 hover:text-green-700 font-medium"
              >
                {t("login")}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 transition"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-3 pb-4 space-y-2">
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                    isActive(item.path)
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

            <LanguageButton />

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-green-600 hover:text-green-700 font-medium"
              >
                {t("Logout")}
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-green-600 hover:text-green-700 font-medium"
              >
                {t("login")}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
