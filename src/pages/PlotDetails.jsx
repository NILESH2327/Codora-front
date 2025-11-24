import React from "react";
import { useLocation } from "react-router-dom";
import { Calendar, Leaf, Sprout, CheckCircle } from "lucide-react";

const PlotDetails = () => {
  const { state: plot } = useLocation();

  const calculateHarvestDate = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 120);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-green-50 pb-10">
        <div className="w-full h-[250px] overflow-hidden mb-10">

      <img
        src={plot.image}
        alt="crop"
        className="w-full h-full object-cover shadow-lg "
        />
        </div>

      <div className="bg-white mx-6 -mt-8 p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-green-700 flex items-center gap-3">
          <Leaf size={26} /> {plot.plotName}
        </h2>

        <div className="mt-6 space-y-4">

          <div className="flex items-center bg-green-100 p-4 rounded-xl gap-3">
            <Sprout size={22} className="text-green-700" />
            <p className="text-lg">
              <strong>Crop Name:</strong> {plot.cropName}
            </p>
          </div>

          <div className="flex items-center bg-green-100 p-4 rounded-xl gap-3">
            <Calendar size={22} />
            <p className="text-lg">
              <strong>Sowing Date:</strong> {plot.sowingDate}
            </p>
          </div>

          <div className="flex items-center bg-green-100 p-4 rounded-xl gap-3">
            <CheckCircle size={22} className="text-green-600" />
            <p className="text-lg">
              <strong>Expected Harvest:</strong> {calculateHarvestDate(plot.sowingDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotDetails;
