import React, { useEffect, useState, useRef } from "react";
import {
  TrendingUp,
  Download,
  Printer,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const MarketTrends = () => {
  // static location data
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
  };

  const { t } = useLanguage();

  const [selectedState, setSelectedState] = useState("Kerala");
  const [district, setDistrict] = useState("");
  const [market, setMarket] = useState("");
  const [commodity, setCommodity] = useState("");

  const [marketPrices, setMarketPrices] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);

  const states = Object.keys(locationData);
  const districts = selectedState ? Object.keys(locationData[selectedState]) : [];
  const markets = selectedState && district ? locationData[selectedState][district] : [];

  // Use env var in production. fallback kept for dev convenience.
  const API_KEY = import.meta.env.VITE_DATA_GOV_API_KEY || "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
  const BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

  const buildApiUrl = () => {
    const params = new URLSearchParams({
      "api-key": API_KEY,
      format: "json",
      limit: "1000", // you page using offset here
      offset: String(offset)
    });

    if (selectedState) params.append("filters[state.keyword]", selectedState);
    if (district) params.append("filters[district]", district);
    if (market) params.append("filters[market]", market);
    if (commodity) params.append("filters[commodity]", commodity);

    return `${BASE_URL}?${params.toString()}`;
  };

  const fetchMarketPrices = async () => {
    setLoading(true);
    try {
      const url = buildApiUrl();
      const response = await fetch(url);
      const data = await response.json();
      setMarketPrices(data.records || []);
    } catch (err) {
      console.error("Market fetch error:", err);
      setMarketPrices([]);
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount and whenever filters or offset change
  useEffect(() => {
    // debounce quick filter changes (250ms)
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchMarketPrices();
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, district, market, commodity, offset]);

  // reset offset to 0 when filters change (keeps pagination consistent)
  useEffect(() => {
    setOffset(0);
  }, [selectedState, district, market, commodity]);

  const uniqueCommodities = Array.from(
    new Set(marketPrices.map((r) => r.commodity).filter(Boolean))
  ).sort();

  const handleReset = () => {
    setDistrict("");
    setMarket("");
    setCommodity("");
    setOffset(0);
    // fetchMarketPrices will be triggered by effect
  };

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(marketPrices, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "market_prices.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="text-green-600 w-7 h-7" />
          {t("market.title")}
        </h2>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="p-3 rounded-xl border shadow bg-white hover:bg-gray-50"
            title={t("market.print")}
          >
            <Printer />
          </button>
          <button
            onClick={handleDownload}
            className="p-3 rounded-xl border shadow bg-white hover:bg-gray-50"
            title={t("market.download")}
          >
            <Download />
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white shadow rounded-xl p-4 flex justify-between items-baseline-last mb-6 flex-wrap gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* STATE */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">{t("filters.state")}</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="border px-4 py-2 rounded-lg shadow-sm"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* DISTRICT */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">{t("filters.district")}</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="border px-4 py-2 rounded-lg shadow-sm"
            >
              <option value="">{t("filters.allDistricts")}</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* MARKET */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">{t("filters.market")}</label>
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="border px-4 py-2 rounded-lg shadow-sm"
            >
              <option value="">{t("filters.allMarkets")}</option>
              {markets.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* COMMODITY */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">{t("filters.commodity")}</label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="border px-4 py-2 rounded-lg shadow-sm"
            >
              <option value="">{t("filters.allCommodities")}</option>
              {uniqueCommodities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* GO / RESET */}
        <div className="flex gap-4">
          <button
            onClick={fetchMarketPrices}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 flex items-center gap-2"
          >
            ⚡ {t("actions.go")}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg shadow flex items-center gap-2 hover:bg-gray-300"
          >
            <RotateCcw /> {t("actions.reset")}
          </button>
        </div>
      </div>

      {/* Current Selection */}
      <div className="mt-6 text-gray-600">
        <strong>{selectedState}</strong> / {district || t("filters.allDistricts")}
      </div>

      {/* TABLE */}
      <div className="mt-4 bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1d778b] text-white text-left">
              <th className="py-3 px-4">{t("table.commodity")}</th>
              <th className="py-3 px-4">{t("table.variety")}</th>
              <th className="py-3 px-4">{t("table.price")}</th>
              <th className="py-3 px-4">{t("table.market")}</th>
              <th className="py-3 px-4">{t("table.district")}</th>
              <th className="py-3 px-4">{t("table.state")}</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-600">
                  {t("messages.loading")}
                </td>
              </tr>
            ) : marketPrices.length ? (
              marketPrices.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition">
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
                <td colSpan="6" className="text-center py-6 text-gray-600">
                  {t("messages.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={offset === 0}
          onClick={() => setOffset(Math.max(0, offset - 10))}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300"
        >
          {t("pagination.prev")}
        </button>

        <span className="font-medium">
          {t("pagination.page")} {Math.floor(offset / 10) + 1}
        </span>

        <button
          onClick={() => setOffset(offset + 10)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t("pagination.next")}
        </button>
      </div>
    </div>
  );
};

export default MarketTrends;
