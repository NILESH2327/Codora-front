import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cloud, TrendingUp, Shield, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Cloud, title: 'Weather Intelligence', description: "Real-time weather forecasts and alerts tailored for Kerala's climate" },
    { icon: TrendingUp, title: 'Market Insights', description: 'Live market prices and trends to maximize your profits' },
    { icon: Shield, title: 'Disease Detection', description: 'AI-powered crop disease identification and treatment recommendations' },
    { icon: Users, title: 'Expert Support', description: '24/7 AI assistant for all your farming questions' },
  ];

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              {/* Get Started -> Register */}
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('getStarted')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              {/* Login */}
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 border-2 border-green-600 text-green-600 text-lg font-semibold rounded-xl hover:bg-green-600 hover:text-white transition-all duration-200"
              >
                {t('login')}
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Smart Farming Solutions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for Kerala's agricultural landscape
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">

                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farming?
          </h2>

          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Kerala farmers using AI to improve yields and profits.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

        </div>
      </section>

    </div>
  );
};

export default HomePage;
