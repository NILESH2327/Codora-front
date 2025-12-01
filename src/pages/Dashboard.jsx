import React, { useEffect, useState } from "react";
import { Award, FileText } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../lib/actions/authActions";
import { toast } from "react-toastify";

import AddActivity from "../components/AddActivity";
import axios from "axios";

// YOUR COMPONENTS
import WeatherCard from "../components/WeatherCard";
import Grid from "../components/Dashboard/Grid";
import { postJSON } from "../api";

const Dashboard = () => {
  const [cropTips, setCropTips] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const { t } = useLanguage();
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
  });

  // Fetch Market & Schemes
  const fetchData = async () => {
    try {
      const [mres, sres] = await Promise.all([
        api.get("/market/all"),
        api.get("/scheme/all"),
      ]);

      if (mres.data.success) setMarketPrices(mres.data.data);
      if (sres.data.success) setSchemes(sres.data.data);
    } catch (err) {
      console.error("Market/Schemes error:", err);
    }
  };

  // AI Crop Tips
  const getTips = async () => {
    try {
      const tips = await postJSON("/advisory/generate-advisory", {});
      setCropTips(tips?.advisories || []);
    } catch (err) {
      console.error("AI Tips error:", err);
    }
  };

  // Weather Fetch
  const loadWeather = async () => {
    try {
      const key = import.meta.env.VITE_WEATHER_API_KEY;
      const url = `https://api.weatherapi.com/v1/forecast.json?key=748c922b6b124c14ad305356252111&q=Kerala&days=4&aqi=no&alerts=no`;

      const response = await fetch(url);
      const data = await response.json();

      if (data?.current) {
        data.current.temp_c = Math.ceil(data.current.temp_c);
        data.current.feelslike_c = Math.ceil(data.current.feelslike_c);
        data.current.humidity = Math.ceil(data.current.humidity);
        data.current.wind_kph = Math.ceil(data.current.wind_kph);
      }

      setWeather(data);
    } catch (error) {
      console.log("Weather error:", error);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Auth Check + Initial Data Load
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    getTips();
    fetchData();
    loadWeather();
  }, []);

  if (loadingWeather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-gray-600">Loading weather...</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-red-500">Failed to load weather data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-green-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* TITLE */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Farmer Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Your personalized farming insights and recommendations
            </p>
          </div>
        </div>

        {/* ADD ACTIVITY */}
        <div className="mb-8">
          <div className="bg-white/90 rounded-2xl shadow-md border border-green-100">
            <AddActivity />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            <WeatherCard Weather={weather} setWeather={setWeather} />
            <Grid />
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">
            {/* TIPS */}
            <div className="bg-white rounded-2xl shadow-md border border-yellow-100 p-6">
              <h2 className="text-lg font-bold flex items-center text-gray-900">
                <Award className="mr-2 text-yellow-500" /> Tips
              </h2>
              <div className="space-y-3 mt-4">
                {cropTips.length ? (
                  cropTips.map((tip, i) => (
                    <div
                      key={i}
                      className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded"
                    >
                      <p className="text-sm text-gray-800">{tip}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Loading tips...</p>
                )}
              </div>
            </div>

            {/* SCHEMES */}
            <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
              <h2 className="text-lg font-bold flex items-center text-gray-900">
                <FileText className="mr-2 text-blue-600" /> Schemes
              </h2>
              <div className="space-y-4 mt-4 max-h-72 overflow-y-auto pr-1">
                {schemes.length ? (
                  schemes.map((scheme, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 p-4 rounded-lg hover:border-blue-300 hover:bg-blue-50/40 transition"
                    >
                      <h3 className="font-semibold text-sm text-gray-900">
                        {scheme.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {scheme.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Loading schemes...</p>
                )}
              </div>
            </div>

            {/* FARMER PROFILE */}
            <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6">
              <h2 className="text-lg font-bold flex items-center text-gray-900">
                <FileText className="mr-2 text-green-600" /> Farmer Profile
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Update crop &amp; soil details
              </p>

              <Link
                to="/farmer-profile"
                className="block text-center bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Go to Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
