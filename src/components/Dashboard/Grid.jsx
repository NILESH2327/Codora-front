
import { Microscope, Bug, BarChart, MapPin } from "lucide-react";
import React from 'react';



import { Link, useNavigate } from 'react-router-dom';



function CardContent({ icon, title, text }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-3">
                {icon}
                <h2 className="font-bold text-lg">{title}</h2>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">{text}</p>
        </div>
    );
}

const Grid = () => {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

            {/* --- Row 1 --- */}
            <Link
                to="/upload"
                className="md:col-span-2 bg-teal-400/90 hover:bg-teal-400 text-white rounded-xl p-6 shadow-md transition transform hover:scale-[1.01]"
            >
                <CardContent
                    icon={<Microscope className="h-8 w-8" />}
                    title="Detect Crop Disease"
                    text="Upload a crop image and get instant diagnosis + treatment suggestions."
                />
            </Link>

            <Link
                to="/market-trends"
                className="md:col-span-2 bg-amber-300/90 hover:bg-amber-300 rounded-xl p-6 shadow-md transition transform hover:scale-[1.01]"
            >
                <CardContent
                    icon={<BarChart className="h-8 w-8" />}
                    title="Market Trends"
                    text="Understand commodity price trends for smart selling."
                />
            </Link>

            {/* --- Row 2 --- */}
            <Link
                to="/pest-detection"
                className="md:col-span-1 bg-amber-400/90 hover:bg-amber-400 rounded-xl p-6 shadow-md transition transform hover:scale-[1.01]"
            >
                <CardContent
                    icon={<Bug className="h-8 w-8" />}
                    title="Pest Detection"
                    text="Identify harmful pests from crop images instantly."
                />
            </Link>

            <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-md border transition transform hover:scale-[1.01]">
                <CardContent
                    icon={<Microscope className="h-8 w-8 text-gray-700" />}
                    title="AI Advisory"
                    text="Get AI-recommended crop planning, fertilizers, irrigation tips, and more."
                />
            </div>

            <Link
                to="/market-place"
                className="md:col-span-1 bg-red-400/90 hover:bg-red-400 text-white rounded-xl p-6 shadow-md transition transform hover:scale-[1.01]"
            >
                <CardContent
                    icon={<MapPin className="h-8 w-8" />}
                    title="Nearest Marketplace"
                    text="Find verified buyers & sellers instantly near your location."
                />
            </Link>

            {/* --- Row 3 --- */}
          <Link
                to="/soil-scanner"
                className="md:col-span-2 bg-red-500/90 hover:bg-red-500 text-white rounded-xl p-6 shadow-md transition transform hover:scale-[1.01]"
>
                <CardContent
                icon={<Bug className="h-8 w-8" />}
                title="Soil Health Scanner"
                text="Analyze soil condition and nutrient deficiencies using AI."
                />
         </Link>


            <Link
                 to="/fertilizer-guidance"
                 className="md:col-span-1 bg-teal-400/90 hover:bg-teal-400 text-white rounded-xl p-6 shadow-md transition transform hover:scale-[1.01]"
>
                 <CardContent
                 icon={<Microscope className="h-8 w-8" />}
                 title="Fertilizer Guidance"
                 text="Smart suggestions for right fertilizer quantity & timing."
                />
           </Link>

             <Link
                 to="/nearby-service"
                 className="md:col-span-1 bg-amber-400/90 hover:bg-amber-400 rounded-xl p-6 shadow-md transition transform hover:scale-[1.01]">
                <CardContent
                    icon={<MapPin className="h-8 w-8" />}
                    title="Nearby Agri Services"
                    text="Locate agri shops, labs, tractor rentals near you."
                />
           </Link>
        </div>
    )
}

export default Grid