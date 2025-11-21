import React from 'react';
import { Sprout, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">KeralaFarm AI</span>
            </div>

            <p className="text-gray-300 mb-4 max-w-md">
              Empowering Kerala farmers with AI-driven insights for sustainable agriculture,
              better yields, and informed decision-making.
            </p>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Kerala, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  {t('about')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Crop Calendar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Weather Alerts
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Market Updates
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@keralafarm.ai</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+91 9876543210</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 KeralaFarm AI. All rights reserved.
          </p>

          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
              {t('privacy')}
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
              {t('terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
