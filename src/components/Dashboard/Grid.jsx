import { Microscope, Bug, BarChart, MapPin, CalendarDays } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function CardContent({ icon, title, text }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-2">
                {icon}
                <h2 className="font-semibold text-base text-gray-900">{title}</h2>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">{text}</p>
        </div>
    );
}

const Grid = () => {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Row 1 */}
            <Link
                to="/upload"
                className="md:col-span-2 bg-gradient-to-r from-emerald-300 to-emerald-500 text-white rounded-2xl p-5 shadow-md border border-emerald-500/60 transition transform hover:scale-[1.01]"
            >
                <CardContent
                    icon={<Microscope className="h-7 w-7" />}
                    title="Detect Crop Disease"
                    text="Upload a crop image and get instant diagnosis with treatment suggestions."
                />
            </Link>

            <Link
                to="/market-trends"
                className="md:col-span-2 bg-gradient-to-r from-emerald-300 to-emerald-500 text-white rounded-2xl p-5 shadow-md border border-emerald-500/60 transition transform hover:scale-[1.01]"
            >
                <CardContent
                    icon={<BarChart className="h-7 w-7" />}
                    title="Market Trends"
                    text="Understand commodity price trends for smarter selling decisions."
                />
            </Link>

            {/* Row 2 */}
            <Link
                to="/pest-detection"
                className="md:col-span-2 bg-gradient-to-r from-emerald-300 to-emerald-500 text-white rounded-2xl p-5 shadow-md border border-emerald-500/60 transition transform hover:scale-[1.01]"
            >
                <CardContent
                    icon={<Bug className="h-7 w-7" />}
                    title="Pest Detection"
                    text="Identify harmful pests from crop images instantly."
                />
            </Link>

            <div 
                className="md:col-span-2 bg-gradient-to-r from-emerald-300 to-emerald-500 text-white rounded-2xl p-5 shadow-md border border-emerald-500/60 transition transform hover:scale-[1.01]"
            >
                <CardContent
                    icon={<Microscope className="h-7 w-7 text-emerald-600" />}
                    title="AI Advisory"
                    text="Get AI-recommended crop planning, fertilizer use, and irrigation tips."
                />
            </div>

            <Link
                to="/market-place"
                className="md:col-span-2 bg-gradient-to-r from-emerald-300 to-emerald-500 text-white rounded-2xl p-5 shadow-md border border-emerald-500/60 transition transform hover:scale-[1.01]"
            >
                <CardContent
                    icon={<MapPin className="h-7 w-7" />}
                    title="Nearest Marketplace"
                    text="Find verified buyers and sellers near your location."
                />
            </Link>

            <Link
                to="/soil-scanner"
                className="md:col-span-2 bg-gradient-to-r from-emerald-300 to-emerald-500 text-white rounded-2xl p-5 shadow-md border border-emerald-500/60 transition transform hover:scale-[1.01]"
            >
                <CardContent
                    icon={<Bug className="h-8 w-8" />}
                    title="Soil Health Scanner"
                    text="Analyze soil condition and nutrient deficiencies using AI."
                />
            </Link>


            <Link
                to="/fertilizer-guidance"
                className="md:col-span-2 bg-gradient-to-r from-emerald-300 to-emerald-500 text-white rounded-2xl p-5 shadow-md border border-emerald-500/60 transition transform hover:scale-[1.01]"
            >
                <CardContent
                    icon={<Microscope className="h-8 w-8" />}
                    title="Fertilizer Guidance"
                    text="Smart suggestions for right fertilizer quantity & timing."
                />
            </Link>

            <Link
                to="/nearby-service"
                className="md:col-span-2 bg-gradient-to-r from-emerald-300 to-emerald-500 text-white rounded-2xl p-5 shadow-md border border-emerald-500/60 transition transform hover:scale-[1.01]"
                >
                <CardContent
                    icon={<MapPin className="h-8 w-8" />}
                    title="Nearby Agri Services"
                    text="Locate agri shops, labs, tractor rentals near you."
                />
            </Link>
            <Link
                to="/crop-calendar"
                className="md:col-span-2 bg-gradient-to-r from-emerald-300 to-emerald-500 text-white rounded-2xl p-5 shadow-md border border-emerald-500/60 transition transform hover:scale-[1.01]"
                >
                <CardContent
                    icon={<MapPin className="h-8 w-8" />}
                    title="Crop Calendar"
                    text="“Month-wise guide showing crop stages, field operations, and weather precautions."
                />
            </Link>
        </div>
    )
}

export default Grid
