import React, { useEffect, useState } from "react";
import { Award, FileText } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../lib/actions/authActions";
import { toast } from "react-toastify";

import AddActivity from "../components/AddActivity";
import axios from "axios";

// COMPONENTS
import WeatherCard from "../components/WeatherCard";
import Grid from "../components/Dashboard/Grid";
import { getJSON, postJSON } from "../api";
import CropCalendar from "../components/TasksComponent";

const Dashboard = () => {
  const [cropTips, setCropTips] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const [tasks, setTasks] = useState([
    { id: 1, text: "Check paddy field for pest signs", done: false },
    { id: 2, text: "Irrigate banana plot (2 hrs)", done: true },
    { id: 3, text: "Visit nearby mandi for price info", done: false },
  ]);
  const [newTask, setNewTask] = useState("");

  const { t } = useLanguage();
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
  });

  // Fetch Market & Schemes
  const fetchData = async () => {
    try {
       const res = await getJSON('/tasks/today');
       console.log(res);
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

  // Auth check + load everything
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    if (!isAuthenticated()) {
      toast.error(t("pleaseLogin"));
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
        <p className="text-gray-600">{t("loadingWeather")}</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-red-500">{t("weatherFailed")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 pb-8">
      {/* TITLE */}
      <div
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between min-h-96 gap-3 overflow-hidden shadow relative bg-cover bg-center"
        style={{ backgroundImage: "url(/bg10.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative flex flex-col gap-8 w-full text-center py-8 px-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            {t("farmerDashboard")}
          </h1>

          <p className="text-sm text-white drop-shadow">
            {t("dashboardSubtitle")}
          </p>

          <AddActivity />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
           <WeatherCard Weather={weather} setWeather={setWeather} />
          </div>

          {/* RIGHT */}
          <div className="space-y-8 mb-8">
            {/* TODAY PLANNER */}
            
            <CropCalendar/>
          </div>
        </div>
      </div>

      <Grid />
    </div>
  );
};

export default Dashboard;
