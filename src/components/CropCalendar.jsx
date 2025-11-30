import React, { useState } from "react";
import cropCalendar from "../data/cropData.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const months = Object.keys(cropCalendar);

const CropCalendar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMonth = months[currentIndex];
  const data = cropCalendar[currentMonth];

  const prevMonth = () => {
    setCurrentIndex((prev) => (prev === 0 ? months.length - 1 : prev - 1));
  };

  const nextMonth = () => {
    setCurrentIndex((prev) => (prev === months.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-[#E8F7FF] py-10 px-4">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-800">Cashew Crop Calendar</h1>
        <p className="text-gray-600 mt-2 font-medium">
          Plan Smart, Farm Better – Month-wise Crop Operations Guide
        </p>
      </div>

      {/* CALENDAR CONTAINER */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-200">

        {/* MONTH NAVIGATION BAR */}
        <div className="flex items-center justify-between bg-green-700 text-white px-5 py-3 rounded-xl">
          <button onClick={prevMonth} className="hover:opacity-80 transition">
            <ChevronLeft size={30} />
          </button>

          <h2 className="text-2xl font-semibold tracking-wide">{currentMonth}</h2>

          <button onClick={nextMonth} className="hover:opacity-80 transition">
            <ChevronRight size={30} />
          </button>
        </div>

        {/* CROP STAGE SECTION */}
        <div className="mt-6 bg-green-50 border-l-4 border-green-600 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-green-800">🌱 Crop Stage</h3>
          <p className="text-gray-700 mt-2">{data.cropStage}</p>
        </div>

        {/* OPERATIONS SECTION */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-blue-900">🔧 Operations</h3>

          <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-2">
            {data.operations.map((op, idx) => (
              <li key={idx} className="text-sm font-medium">{op}</li>
            ))}
          </ul>
        </div>

        {/* MINI CALENDAR (KSACC STYLE) */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            📅 Monthly Calendar View
          </h3>

          <div className="grid grid-cols-7 gap-2 text-center">
            {/* WEEKDAY HEADER */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}

            {/* EMPTY CELLS FOR ALIGNMENT */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="py-4 bg-transparent"></div>
            ))}

            {/* SAMPLE DAYS (STATIC LIKE KSACC) */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((day) => (
              <div
                key={day}
                className="p-3 bg-white rounded-md shadow-sm border hover:bg-green-100 transition cursor-pointer"
              >
                {day}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CropCalendar;
 