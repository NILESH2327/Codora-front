import React, { useEffect, useState } from 'react';
import { Cloud, Thermometer, Droplets, Wind, TrendingUp, TrendingDown, Award, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getweekday } from '../lib/actions/weather';

const Dashboard = () => {
  const { t } = useLanguage();
  const [Weather, setWeather] = useState();

  useEffect(() => {
    const getWeatherData = async (location) => {
      const apiKey = import.meta.env.WEATHER_API_KEY;
      const url = `http://api.weatherapi.com/v1/forecast.json?key=748c922b6b124c14ad305356252111&q=${location}&days=4&aqi=no&alerts=no`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        if (data) {
          // Ceil current
          data.current.temp_c = Math.ceil(data.current.temp_c);
          data.current.feelslike_c = Math.ceil(data.current.feelslike_c);
          data.current.humidity = Math.ceil(data.current.humidity);
          data.current.wind_kph = Math.ceil(data.current.wind_kph);

          // Ceil forecast temps
          data.forecast.forecastday = data.forecast.forecastday.map(day => ({
            ...day,
            day: {
              ...day.day,
              maxtemp_c: Math.ceil(day.day.maxtemp_c),
              mintemp_c: Math.ceil(day.day.mintemp_c),
            },
          }));

          setWeather(data);
        }

        console.log("Weather Data:", data);
        return data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
      }
    };

    getWeatherData("Jhansi").then(data => setWeather(data));
  }, []);

  const marketPrices = [
    { crop: 'Rice', price: '₹2,850', change: '+5.2%', trend: 'up' },
    { crop: 'Coconut', price: '₹35', change: '-2.1%', trend: 'down' },
    { crop: 'Pepper', price: '₹650', change: '+8.7%', trend: 'up' },
    { crop: 'Cardamom', price: '₹1,200', change: '+3.4%', trend: 'up' },
    { crop: 'Rubber', price: '₹185', change: '-1.8%', trend: 'down' },
  ];

  const cropTips = [
    'Optimal time for rice transplanting is approaching based on weather patterns',
    'Consider applying organic fertilizer to coconut trees this week',
    'Monitor pepper plants for signs of quick wilt disease',
    'Harvest cardamom when pods are 3/4 mature for best quality',
  ];

  const schemes = [
    {
      title: 'PM-KISAN Scheme',
      description: 'Direct income support of ₹6,000 per year to farmer families',
      eligibility: 'All landholding farmers',
      amount: '₹6,000/year',
    },
    {
      title: 'Soil Health Card',
      description: 'Free soil testing and nutrient management recommendations',
      eligibility: 'All farmers',
      amount: 'Free',
    },
    {
      title: 'Crop Insurance',
      description: 'Protection against crop loss due to natural calamities',
      eligibility: 'Enrolled farmers',
      amount: 'Subsidized premium',
    },
  ];

  if (!Weather) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Dashboard</h1>
          <p className="text-gray-600">Your personalized farming insights and recommendations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Cloud className="h-6 w-6 text-blue-600 mr-2" />
                {t('weatherForecast')}
              </h2>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{Weather.location.name}, {Weather.location.country}</h3>
                    <p className="text-blue-100">{Weather.current.condition.text}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{Weather.current.temp_c}°C</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-400">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4" />
                    <span className="text-sm">Feels like {Weather.current.feelslike_c}°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4" />
                    <span className="text-sm">{Weather.current.humidity}% Humidity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4" />
                    <span className="text-sm">{Weather.current.wind_kph} km/h</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center items-center">
                {Weather.forecast.forecastday.map((day, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">{getweekday(day.date)}</p>
                    <div className="text-2xl mb-2 w-fit mx-auto">
                      <img src={day.day.condition.icon} alt="" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{day.day.condition.text}</p>
                    <div className="text-sm">
                      <span className="font-semibold">{day.day.maxtemp_c}°</span>
                      <span className="text-gray-500 ml-1">{day.day.mintemp_c}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                {t('marketPrices')}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Crop</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Price/Quintal</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketPrices.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{item.crop}</td>
                        <td className="py-3 px-4 text-gray-700">{item.price}</td>
                        <td className="py-3 px-4">
                          <span className={`flex items-center ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {item.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 text-yellow-600 mr-2" />
                {t('cropTips')}
              </h2>

              <div className="space-y-3">
                {cropTips.map((tip, index) => (
                  <div key={index} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                {t('govSchemes')}
              </h2>

              <div className="space-y-4">
                {schemes.map((scheme, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2">{scheme.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Eligibility: {scheme.eligibility}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">{scheme.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
