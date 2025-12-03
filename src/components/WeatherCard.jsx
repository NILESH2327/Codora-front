import React, { useState } from "react";
import {
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  LocateFixed,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import { getWeatherData } from "../lib/actions/weather";
import { useLanguage } from "../contexts/LanguageContext";


const WeatherCard = ({ Weather, setWeather }) => {
  const { t } = useLanguage();
  const [location, setLocation] = useState("");

  const searchLocation = async (loc) => {
    if (!loc.trim()) return;
    const res = await getWeatherData(loc);
    console.log("Searched Weather Data:", res);
    setWeather(res);
  };

  const handleSearch = () => {
    if (!location.trim()) {
      toast.error(t("enter_location_error"));
      return;
    }
    searchLocation(location);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert(t("geolocation_not_supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const detectedCity = geoData.location.name;
        setLocation(detectedCity);
        searchLocation(detectedCity);
      },
      () => alert(t("unable_to_detect_location"))
    );
  };

  const getweekday = (date) =>
    new Date(date).toLocaleDateString(
      
      { weekday: "short" }
    );

  if (!Weather) return <div>{t("loading")}</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:mb-8">
      {/* Title Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center">
          <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
          {t("weather_forecast")}
        </h2>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {/* Input + Submit */}
          <div className="relative w-full sm:w-64 md:w-80">
            <input
              type="text"
              placeholder={t("enter_location")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-4 pr-11 py-2 sm:py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-0 top-0 h-full bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r-md flex items-center justify-center transition"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Detect Location Button */}
          <button
            type="button"
            onClick={detectLocation}
            className="self-end sm:self-auto w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-blue-100 hover:bg-blue-200 transition"
          >
            <LocateFixed className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* CURRENT WEATHER */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg px-4 py-3 sm:p-6 text-white mb-4 sm:mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-1">
              {Weather.location.name}, {Weather.location.country}
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              {Weather.current.condition.text}
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-bold">
              {Weather.current.temp_c}°C
            </div>
          </div>
        </div>

        {/* Weather details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-400">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4" />
            <span className="text-xs sm:text-sm">
              {t("feels_like")} {Weather.current.feelslike_c}°C
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4" />
            <span className="text-xs sm:text-sm">
              {Weather.current.humidity}% {t("humidity")}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4" />
            <span className="text-xs sm:text-sm">
              {Weather.current.wind_kph} km/h {t("wind")}
            </span>
          </div>
        </div>
      </div>

      {/* FORECAST */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {Weather.forecast.forecastday.map((day, index) => (
          <div
            key={index}
            className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <p className="font-semibold text-xs sm:text-sm text-gray-900 mb-1 sm:mb-2">
              {getweekday(day.date)}
            </p>

            <div className="mb-1 sm:mb-2 w-fit mx-auto">
              <img
                src={day.day.condition.icon}
                alt=""
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
            </div>

            <p className="text-[11px] sm:text-sm text-gray-600 mb-1">
              {day.day.condition.text}
            </p>

            <div className="text-xs sm:text-sm">
              <span className="font-semibold">{day.day.maxtemp_c}°</span>
              <span className="text-gray-500 ml-1">{day.day.mintemp_c}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;
