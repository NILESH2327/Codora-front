import {
    TrendingUp,
    SlidersHorizontal,
    Download,
    Printer,
    RotateCcw,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const MarketTrends = () => {
 const locationData = {
  Kerala: {
    Pathanamthitta: ["Kuttoor", "Mallappally  VFPCK", "Mezhuveli  VFPCK"],
    Thiruvananthapuram: ["Kovilnada  VFPCK", "Neyyatinkara", "PAPPANCHANI VFPCK", "Parassala"],
    Wayanad: ["Pulpally"],
    Alappuzha: ["Chengannur", "Harippad"],
    Ernakulam: ["Aluva", "Angamaly", "Broadway market", "Perumbavoor", "Piravam", "POTHANIKKADU VFPCK", "Thrippunithura"],
    Idukki: ["Kamakshi VFPCK"],
    Kannur: ["Payyannur", "Thalasserry"],
    Kasargod: ["Kasargod"],
    Kottayam: ["Athirampuzha", "AYMANAM VFPCK", "Kuruppanthura", "Pampady"],
    "Kozhikode(Calicut)": ["Kallachi", "Mukkom", "Palayam", "Vengeri(Kozhikode)"]
  }
}


    const [state, setState] = useState("Kerala");
    const [district, setDistrict] = useState("");
    const [market, setMarket] = useState("");
    const [commodity, setCommodity] = useState("");

    const [marketPrices, setMarketPrices] = useState([]);
    const [offset, setOffset] = useState(0);

    const states = Object.keys(locationData);
    const districts = state ? Object.keys(locationData[state]) : [];
    const markets = state && district ? locationData[state][district] : [];

    const API_KEY =
        "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
    const BASE_URL =
        "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

    const buildApiUrl = () => {
        let url = `${BASE_URL}?api-key=${API_KEY}&format=json&limit=1000&offset=${offset}`;
        if (state) url += `&filters[state.keyword]=${state}`;
        if (district) url += `&filters[district]=${district}`;
        if (market) url += `&filters[market]=${market}`;
        if (commodity) url += `&filters[commodity]=${commodity}`;
        return url;
    };

    const fetchMarketPrices = async () => {
        try {
            const response = await fetch(buildApiUrl());
            const data = await response.json();
            setMarketPrices(data.records || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMarketPrices();
    }, [offset]);

    const uniqueCommodities = Array.from(
        new Set(marketPrices.map((r) => r.commodity))
    ).sort();

    const handleReset = () => {
        setDistrict("");
        setMarket("");
        setCommodity("");
        setOffset(0);
        fetchMarketPrices();
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(marketPrices, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "market_prices.json";
        a.click();
    };

    return (
         <div className="p-0">

          {/* TOP BACKGROUND SECTION */}
        <div
          className="bg-cover bg-center bg-no-repeat relative overflow-hidden w-full"
          style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2021/09/18/02/27/vietnam-6634082_1280.jpg')",
         }}
        >
        {/* Blur overlay */}
          <div className="flex justify-between items-center mb-4 relative z-10">
               <h2 className="text-3xl font-bold text-white flex items-center gap-2">
               <TrendingUp className="text-green-600 w-7 h-7" />
                 Market Prices Dashboard
           </h2>

          <div className="flex gap-3">
            <button
                onClick={handlePrint}
                className="p-3 rounded-xl border shadow bg-white/90 backdrop-blur-sm hover:bg-gray-50"
            >
                 <Printer />
            </button>

            <button
                  onClick={handleDownload}
                  className="p-3 rounded-xl border shadow bg-white/90 backdrop-blur-sm hover:bg-gray-50"
            >
                <Download />
        </button>
        </div>
      </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
             

            {/* FILTER BAR — EXACTLY LIKE YOUR SCREENSHOT */}
            <div className="bg-white shadow rounded-xl p-4 flex justify-between items-baseline-last mb-6 flex-wrap gap-4">
                <div className=" flex flex-wrap gap-4 items-center">
                    {/* STATE */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">State</label>
                        <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="border px-4 py-2 rounded-lg shadow-sm"
                        >
                            {states.map((s) => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* DISTRICT */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">District</label>
                        <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="border px-4 py-2 rounded-lg shadow-sm"
                        >
                            <option value="">All Districts</option>
                            {districts.map((d) => (
                                <option key={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    {/* MARKET */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Market</label>
                        <select
                            value={market}
                            onChange={(e) => setMarket(e.target.value)}
                            className="border px-4 py-2 rounded-lg shadow-sm"
                        >
                            <option value="">All Markets</option>
                            {markets.map((m) => (
                                <option key={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    {/* COMMODITY */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Commodity</label>
                        <select
                            value={commodity}
                            onChange={(e) => setCommodity(e.target.value)}
                            className="border px-4 py-2 rounded-lg shadow-sm"
                        >
                            <option value="">All Commodities</option>
                            {uniqueCommodities.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                </div>


                {/* GO BUTTON */}
                <div className="flex gap-4">

                    <button
                        onClick={fetchMarketPrices}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 flex items-center gap-2"
                    >
                        ⚡ Go
                    </button>

                    {/* RESET */}
                    <button
                        onClick={handleReset}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg shadow flex items-center gap-2 hover:bg-gray-300"
                    >
                        <RotateCcw /> Reset
                    </button>
                </div>
            </div>
          </div>
        </div>

            {/* Current Selection */}
            <div className="mt-6 text-gray-600">
                <strong>{state}</strong> /{" "}
                {district || "All Districts"}
            </div>

            {/* TABLE */}
            <div className="mt-4 bg-white rounded-xl shadow border overflow-x-auto m-10">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#1d778b] text-white text-left">
                            <th className="py-3 px-4">Commodity</th>
                            <th className="py-3 px-4">Variety</th>
                            <th className="py-3 px-4">Price (₹/Quintal)</th>
                            <th className="py-3 px-4">Market</th>
                            <th className="py-3 px-4">District</th>
                            <th className="py-3 px-4">State</th>
                        </tr>
                    </thead>

                    <tbody>
                        {marketPrices.length ? (
                            marketPrices.map((item, idx) => (
                                <tr
                                    key={idx}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="py-3 px-4">{item.commodity}</td>
                                    <td className="py-3 px-4">{item.variety}</td>
                                    <td className="py-3 px-4">{item.modal_price}</td>
                                    <td className="py-3 px-4">{item.market}</td>
                                    <td className="py-3 px-4">{item.district}</td>
                                    <td className="py-3 px-4">{item.state}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-6 text-gray-600"
                                >
                                    No Data Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 m-6">
                <button
                    disabled={offset === 0}
                    onClick={() => setOffset(offset - 10)}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300"
                >
                    Previous
                </button>

                <span className="font-medium">
                    Page {offset / 10 + 1}
                </span>

                <button
                    onClick={() => setOffset(offset + 10)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MarketTrends;