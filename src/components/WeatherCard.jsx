import React, { useState, useEffect } from "react";
import { getWeatherData, reverseGeoLookup } from "../lib/actions/weather";

import {
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  LocateFixed,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

import { useLanguage } from "../contexts/LanguageContext";

// ---------------------------------------
// DYNAMIC FARMER RECOMMENDATION FUNCTION
// ---------------------------------------
const getFarmerRecommendations = ({ temp, humidity, wind, condition, rainChance }) => {
  const tips = [];

  if (temp >= 35) {
    tips.push("High heat today — irrigate early morning or late evening.");
    tips.push("Mulching helps retain soil moisture.");
  } else if (temp <= 20) {
    tips.push("Cool temperature — ideal for sowing leafy vegetables.");
  }

  if (humidity >= 70) {
    tips.push("High humidity may increase fungal diseases — monitor leaves.");
    tips.push("Avoid fertilizer spraying during high humidity.");
  } else if (humidity <= 40) {
    tips.push("Dry air — increase irrigation frequency slightly.");
  }

  if (rainChance >= 60 || condition.includes("rain")) {
    tips.push("Rain expected — avoid irrigation today.");
    tips.push("Protect stored grains & seeds from moisture.");
  } else if (rainChance <= 20) {
    tips.push("Low chance of rain — irrigation may be needed.");
  }

  if (wind >= 20) {
    tips.push("Strong winds expected — support weak crops using stakes.");
    tips.push("Avoid pesticide spraying during high wind.");
  }

  if (condition.toLowerCase().includes("mist") || condition.toLowerCase().includes("fog")) {
    tips.push("Misty conditions — fungal issues may increase.");
  }

  if (tips.length === 0) {
    tips.push("Weather looks normal — continue regular farm practices.");
  }

  return tips;
};

const WeatherCard = ({ Weather, setWeather }) => {
  const { t } = useLanguage();
  const [location, setLocation] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const searchLocation = async (loc) => {
    if (!loc.trim()) return;
    const res = await getWeatherData(loc);
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
        const { latitude, longitude } = pos.coords;
        const geo = await reverseGeoLookup(latitude, longitude); // You must have this API
        const detectedCity = geo?.location?.name;

        if (detectedCity) {
          setLocation(detectedCity);
          searchLocation(detectedCity);
        }
      },
      () => alert(t("unable_to_detect_location"))
    );
  };

  const getweekday = (date) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "short" });

  // REGENERATE RECOMMENDATIONS WHEN WEATHER CHANGES
  useEffect(() => {
    if (Weather) {
      const rec = getFarmerRecommendations({
        temp: Weather.current.temp_c,
        humidity: Weather.current.humidity,
        wind: Weather.current.wind_kph,
        condition: Weather.current.condition.text,
        rainChance: Weather.forecast.forecastday[0]?.day?.daily_chance_of_rain || 0,
      });

      setRecommendations(rec);
    }
  }, [Weather]);

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

          <button
            type="button"
            onClick={detectLocation}
            className="self-end sm:self-auto w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-blue-100 hover:bg-blue-200 transition"
          >
            <LocateFixed className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg px-4 py-3 sm:p-6 text-white mb-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-400">
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

      {/* Forecast */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {Weather.forecast.forecastday.map((day, index) => (
          <div
            key={index}
            className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <p className="font-semibold text-xs sm:text-sm text-gray-900 mb-2">
              {getweekday(day.date)}
            </p>

            <img
              src={day.day.condition.icon}
              className="w-10 h-10 mx-auto mb-2"
              alt={day.day.condition.text}
            />

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

      {/* Farmer Recommendations */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2">
          🌾 Farmer’s Recommendation
        </h3>

        <ul className="mt-3 text-gray-700 space-y-2">
          {recommendations.map((tip, index) => (
            <li key={index}>• {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeatherCard;
