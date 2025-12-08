import React, { useEffect } from "react";
import { MessageCircle, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MediatorPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-8 relative"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2021/09/18/02/27/vietnam-6634082_1280.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[3px]"></div>

      <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Ask With AI
            </h1>
            <p className="text-lg text-gray-700">
              Choose which AI model you want to interact with.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* ---------- Left Block: Gemini ---------- */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center min-h-[350px]">
              <MessageCircle className="h-14 w-14 text-blue-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Ask with Gemini
              </h2>

              <button
                onClick={() => navigate("/upload")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              >
                Go to Gemini Chat
              </button>
            </div>

            {/* ---------- Right Block: Our Model ---------- */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center min-h-[350px]">
              <Brain className="h-14 w-14 text-green-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Ask with Our Model
              </h2>

              <button
                onClick={() => navigate("/uploadmodel")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-medium hover:bg-green-700 transition"
              >
                Go to Our Model Chat
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default MediatorPage;
