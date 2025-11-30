import React, { useEffect, useState } from 'react';
import {
  Cloud, Thermometer, Droplets, Wind, Microscope, Bug,
  Award, FileText
} from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import { getweekday } from '../lib/actions/weather';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/actions/authActions';
import { toast } from 'react-toastify';

import AddActivity from '../components/AddActivity';
import { postJSON } from '../api';
import axios from 'axios';

// YOUR COMPONENTS
import MarketTrends from '../components/MarketTrends';
import WeatherCard from '../components/WeatherCard';
import Grid from '../components/Dashboard/Grid';

const Dashboard = () => {
  const [cropTips, setcropTips] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [Weather, setWeather] = useState(null);

  const { t } = useLanguage();
  const navigate = useNavigate();
  const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE });

  // Fetch Market & Schemes
  const fetchData = async () => {
    try {
      const [mres, sres] = await Promise.all([
        api.get("/market/all"),
        api.get("/scheme/all"),
      ]);
      if (mres.data.success) setMarketPrices(mres.data.data);
      if (sres.data.success) setSchemes(sres.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch Crop Tips
  const getTips = async () => {
    const tips = await postJSON('/advisory/generate-advisory', {});
    setcropTips(tips.advisories || []);
  };

  // Authentication + Load tips & data
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login First");
      navigate('/login');
    }
    getTips();
    fetchData();
  }, []);

  // Fetch Weather
  useEffect(() => {
    const loadWeather = async () => {
      try {
        const url =
          `https://api.weatherapi.com/v1/forecast.json?key=748c922b6b124c14ad305356252111&q=Kerala&days=4&aqi=no&alerts=no`;

        const response = await fetch(url);
        const data = await response.json();

        data.current.temp_c = Math.ceil(data.current.temp_c);
        data.current.feelslike_c = Math.ceil(data.current.feelslike_c);
        data.current.humidity = Math.ceil(data.current.humidity);
        data.current.wind_kph = Math.ceil(data.current.wind_kph);

        setWeather(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadWeather();
  }, []);

  if (!Weather) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-600">Your personalized farming insights and recommendations</p>
        </div>

        {/* ADD ACTIVITY */}
        <div className="mb-8">
          <AddActivity />
        </div>

        {/* GRID MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* YOUR OLD WEATHER CARD */}
            <WeatherCard Weather={Weather} setWeather={setWeather} />
            <Grid />

            {/* NEW WEATHER UI BELOW (from GitHub) */}
            {/* <div className="bg-white rounded-xl shadow-lg p-6"> */}
              {/* <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Cloud className="h-6 w-6 text-blue-600 mr-2" />
                {t('weatherForecast')}
              </h2> */}

              {/* CURRENT WEATHER */}
              {/* <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg">{Weather.location.name}, {Weather.location.country}</h3>
                    <p className="text-blue-100">{Weather.current.condition.text}</p>
                  </div>
                  <div className="text-4xl font-bold">{Weather.current.temp_c}°C</div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-blue-400">
                  <div className="flex items-center gap-2"><Thermometer size={16} />Feels {Weather.current.feelslike_c}°C</div>
                  <div className="flex items-center gap-2"><Droplets size={16} />{Weather.current.hidity}% Humidity</div>
                  <div className="flex items-center gap-2"><Wind size={16} />{Weather.current.wind_kph} km/h</div>
                </div>
              </div> */}

              {/* FORECAST */}
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Weather.forecast.forecastday.map((day, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-xl text-center shadow-sm">
                    <p className="font-semibold">{getweekday(day.date)}</p>
                    <img src={day.day.condition.icon} className="w-12 mx-auto" />
                    <p className="text-sm text-gray-600 mt-1">{day.day.condition.text}</p>
                    <p className="mt-1"><b>{day.day.maxtemp_c}°</b> / {day.day.mintemp_c}°</p>
                  </div>
                ))}
              </div> */}
            </div>

            {/* MAIN TOOLS */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Link to="/upload" className="bg-green-50 rounded-xl p-6 shadow hover:scale-[1.02] transition">
                <div className="flex items-center text-xl font-semibold mb-2">
                  <Microscope className="mr-2 text-emerald-700" /> Detect Crop Disease
                </div>
                <p className="text-gray-600 text-sm">Upload plant images & detect diseases instantly.</p>
              </Link>

              <Link to="/pest-detection" className="bg-green-100 rounded-xl p-6 shadow hover:scale-[1.02] transition">
                <div className="flex items-center text-xl font-semibold mb-2">
                  <Bug className="mr-2 text-lime-700" /> Pest Detection
                </div>
                <p className="text-gray-600 text-sm">Identify pests and get management advice.</p>
              </Link>

              <Link to="/market-trends" className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-md hover:scale-[1.02] transition">
                <div className="text-xl font-semibold text-green-800 mb-2">Market Trends</div>
                <p className="text-gray-700 text-sm">Get latest market prices and insights.</p>
              </Link>

              <Link to="/crop-calendar" className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-md hover:scale-[1.02] transition">
                <div className="text-xl font-semibold text-yellow-800 mb-2">📅 Crop Calendar</div>
                <p className="text-gray-700 text-sm">Month-wise farming tasks, operations & crop stages.</p>
              </Link>

            </div> */}
          {/* </div> */}

          {/* RIGHT SIDE */}
          <div className="space-y-8">

            {/* TIPS */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold flex items-center">
                <Award className="mr-2 text-yellow-600" /> Tips
              </h2>

              <div className="space-y-3 mt-4">
                {cropTips.length ? cropTips.map((tip, i) => (
                  <div key={i} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm">{tip}</p>
                  </div>
                )) : <p>Loading...</p>}
              </div>
            </div>

            {/* SCHEMES */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold flex items-center">
                <FileText className="mr-2 text-blue-600" /> Schemes
              </h2>

              <div className="space-y-4 mt-4">
                {schemes.length ? schemes.map((scheme, i) => (
                  <div key={i} className="border p-4 rounded-lg hover:border-blue-300">
                    <h3 className="font-semibold">{scheme.title}</h3>
                    <p className="text-sm text-gray-600">{scheme.description}</p>
                  </div>
                )) : <p>Loading...</p>}
              </div>
            </div>

            {/* FARMER PROFILE */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold flex items-center">
                <FileText className="mr-2 text-green-600" /> Farmer Profile
              </h2>
              <p className="text-sm text-gray-600 mb-4">Update crop & soil details</p>

              <Link
                to="/farmer-profile"
                className="block text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
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
