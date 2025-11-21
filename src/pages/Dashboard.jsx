import React from 'react';
import { Cloud, Thermometer, Droplets, Wind, TrendingUp, TrendingDown, Award, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();

  const weatherData = {
    current: { temp: 28, humidity: 75, windSpeed: 12, condition: 'Partly Cloudy' },
    forecast: [
      { day: 'Today', high: 32, low: 24, condition: 'Sunny', icon: '☀️' },
      { day: 'Tomorrow', high: 30, low: 23, condition: 'Cloudy', icon: '☁️' },
      { day: 'Wed', high: 29, low: 22, condition: 'Rain', icon: '🌧️' },
      { day: 'Thu', high: 31, low: 25, condition: 'Sunny', icon: '☀️' },
    ],
  };

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
                    <h3 className="text-lg font-semibold mb-1">Kochi, Kerala</h3>
                    <p className="text-blue-100">{weatherData.current.condition}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{weatherData.current.temp}°C</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-400">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4" />
                    <span className="text-sm">Feels like 30°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4" />
                    <span className="text-sm">{weatherData.current.humidity}% Humidity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4" />
                    <span className="text-sm">{weatherData.current.windSpeed} km/h</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">{day.day}</p>
                    <div className="text-2xl mb-2">{day.icon}</div>
                    <p className="text-sm text-gray-600 mb-1">{day.condition}</p>
                    <div className="text-sm">
                      <span className="font-semibold">{day.high}°</span>
                      <span className="text-gray-500 ml-1">{day.low}°</span>
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
