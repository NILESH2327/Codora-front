import React from "react";
import { Link } from "react-router-dom";

const TwilioInvite = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 ">
      <div className="bg-white mb-10 mt-10 p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-green-200 flex flex-col items-center text-center">
        
        <h2 className="text-3xl font-extrabold text-green-700 mb-6">
          Subscribe to Twilio WhatsApp Alerts
        </h2>

        <p className="mb-6">
          <div className="relative group w-56 h-56 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-green-200 hover:scale-105 transition-transform duration-300">
            <img
              src="./TwilioNotification.png"
              alt="Twilio WhatsApp QR Code"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-green-700 bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
              <p className="text-white font-semibold text-center p-2">
                Scan to Subscribe
              </p>
            </div>
          </div>
        </p>

        <p className="text-gray-600 mb-6 text-lg">
          Scan the QR code and receive updates & alerts directly on WhatsApp.
        </p>

        {/* Optional Google Auth */}
        {/* <GoogleAuth /> */}

        <div className="w-full">
          <Link
            to="/login"
            className="w-full block text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-300">
            Continue
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          By continuing, you agree to receive WhatsApp updates.
        </p>
      </div>
    </div>
  );
};

export default TwilioInvite;
