import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Loader2,
  TrendingUp,
  Map as MapIcon,
  Truck,
  Sprout,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- CONFIGURATION ---

// 1. API Config
const API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"; // Use the key you provided
const BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

// 2. Transport Cost (₹ per km for a small truck)
const TRANSPORT_COST_PER_KM = 40;

// 3. Commodity Dropdown (Must match API spelling exactly)
const COMMODITIES = [
  { id: "Coconut", name: "Coconut" },
  { id: "Banana", name: "Banana" },
  { id: "Black pepper", name: "Black Pepper" },
  { id: "Arecanut", name: "Arecanut" },
  { id: "Ginger", name: "Ginger" },
  { id: "Rubber", name: "Rubber" },
  { id: "Cardamom", name: "Cardamom" },
  { id: "Pineapple", name: "Pineapple" },
  { id: "Tapioca", name: "Tapioca" },
];

// 4. Coordinate Lookup (Mapping API Market Names to Lat/Lng)
// This bridges the gap since the API doesn't provide location data.
const MARKET_COORDINATES = {
  "Nedumangad APMC": { lat: 8.6024, lng: 76.9968 },
  "Palakkad APMC": { lat: 10.7867, lng: 76.6548 },
  "Thodupuzha APMC": { lat: 9.8959, lng: 76.7184 },
  "Vatakara APMC": { lat: 11.6103, lng: 75.5917 },
  "Kozhikode APMC": { lat: 11.2588, lng: 75.7804 },
  "Chalakkudy APMC": { lat: 10.307, lng: 76.334 },
  "Alappuzha APMC": { lat: 9.4981, lng: 76.3388 },
  "Ernakulam APMC": { lat: 9.9816, lng: 76.2999 },
  "Kottayam APMC": { lat: 9.5916, lng: 76.5222 },
  "Thrissur APMC": { lat: 10.5276, lng: 76.2144 },
  "Kollam APMC": { lat: 8.8932, lng: 76.6141 },
  "Manjeri APMC": { lat: 11.1198, lng: 76.1215 },
  "Tirur APMC": { lat: 10.9172, lng: 75.9221 },
  "Kasaragod APMC": { lat: 12.5102, lng: 74.9852 },
  "Kalpetta APMC": { lat: 11.6103, lng: 76.0827 },
  "Kannur APMC": { lat: 11.8745, lng: 75.3704 },
  "Payyannur APMC": { lat: 12.1001, lng: 75.204 },
  "Taliparamba APMC": { lat: 12.0494, lng: 75.3579 },
  "Sulthan Bathery APMC": { lat: 11.6629, lng: 76.257 },
  "Mananthavady APMC": { lat: 11.8027, lng: 76.0044 },
  "Kondotty APMC": { lat: 11.1456, lng: 75.9629 },
  "Perinthalmanna APMC": { lat: 10.9754, lng: 76.2268 },
};

// --- COMPONENTS ---

const LocationPickerMap = ({ onLocationSelect, selectedPos }) => {
  const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      if (lat && lng) map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
  };
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return (
    <>
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {selectedPos && (
        <>
          <Marker position={[selectedPos.lat, selectedPos.lng]} />
          <RecenterMap lat={selectedPos.lat} lng={selectedPos.lng} />
        </>
      )}
    </>
  );
};

const FindMandi = () => {
  const [addressInput, setAddressInput] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("Banana");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [userRole, setUserRole] = useState("seller");

  // Geocoding & Location Handlers
  const handleNewLocation = async (lat, lng) => {
    setLoading(true);
    setStatusMsg("Updating location...");
    setUserLocation({ lat, lng });
    setError("");
    setResults([]); // Clear old results
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setAddressInput(data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } catch (err) {
      setAddressInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setStatusMsg("Getting GPS signal...");
      navigator.geolocation.getCurrentPosition(
        pos => handleNewLocation(pos.coords.latitude, pos.coords.longitude),
        () => {
          setError("Geolocation failed. Please allow access.");
          setLoading(false);
        }
      );
    } else {
      setError("Browser not supported.");
    }
  };

  // --- CORE LOGIC: API + OSRM ---
  const fetchAndAnalyze = async () => {
    if (!userLocation) {
      setError("Please set your location first.");
      return;
    }
    setLoading(true);
    setStatusMsg("Fetching live prices from Govt API...");
    setError("");
    setResults([]);

    try {
      // 1. Fetch Live Data from Data.gov.in
      const apiUrl = `${BASE_URL}?api-key=${API_KEY}&format=json&limit=100&filters[state.keyword]=Kerala&filters[commodity]=${encodeURIComponent(
        selectedCrop
      )}`;

      const response = await fetch(apiUrl);
      const jsonData = await response.json();

      if (!jsonData.records || jsonData.records.length === 0) {
        setError(`No live market data found for ${selectedCrop} in Kerala today.`);
        setLoading(false);
        return;
      }

      // 2. Filter & Map to Coordinates
      const activeMarkets = [];
      const processedNames = new Set(); // To avoid duplicate markets

      jsonData.records.forEach(record => {
        // The API often returns market names like "Palakkad" or "Palakkad APMC".
        // We try to match them to our coordinate DB.

        // Normalizing name: "Palakkad" -> "Palakkad APMC" if needed for lookup
        let marketName = record.market;
        if (!marketName.includes("APMC")) marketName += " APMC";

        // Check if we have coords for this market
        const coords = MARKET_COORDINATES[marketName];

        if (coords && !processedNames.has(marketName)) {
          activeMarkets.push({
            name: marketName,
            lat: coords.lat,
            lng: coords.lng,
            price: parseFloat(record.modal_price), // Taking Modal Price
            min_price: parseFloat(record.min_price),
            max_price: parseFloat(record.max_price),
            district: record.district,
            date: record.arrival_date,
          });
          processedNames.add(marketName);
        }
      });

      if (activeMarkets.length === 0) {
        setError(
          `Markets found in API, but location coordinates are missing in our database. (Found: ${jsonData.records
            .map(r => r.market)
            .join(", ")})`
        );
        setLoading(false);
        return;
      }

      setStatusMsg(`Found ${activeMarkets.length} markets. Calculating logistics...`);

      // 3. OSRM Distance Matrix
      const destinations = activeMarkets.map(m => `${m.lng},${m.lat}`).join(";");
      const source = `${userLocation.lng},${userLocation.lat}`;
      const osrmUrl = `https://router.project-osrm.org/table/v1/driving/${source};${destinations}?sources=0`;

      const osrmRes = await fetch(osrmUrl);
      const osrmData = await osrmRes.json();

      if (osrmData.code !== "Ok") throw new Error("Logistics calculation failed");

      const travelTimes = osrmData.durations[0].slice(1); // Skip first (0) which is source-source

      // 4. Final Analytics
      const processedResults = activeMarkets.map((market, index) => {
        const durationSeconds = travelTimes[index];
        const durationMins = Math.round(durationSeconds / 60);

        // Estimate distance (Speed ~40km/h avg in Kerala traffic) or Haversine fallback
        // Using Haversine for consistent distance display
        const R = 6371;
        const dLat = ((market.lat - userLocation.lat) * Math.PI) / 180;
        const dLon = ((market.lng - userLocation.lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLocation.lat * Math.PI) / 180) *
            Math.cos((market.lat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = (R * c * 1.2).toFixed(1);

        const transportCost = Math.round(distanceKm * TRANSPORT_COST_PER_KM);

        // Net Value Calculation
        let netValue = 0;
        if (userRole === "seller") {
          netValue = market.price - transportCost; // Profit = Price - Cost
        } else {
          netValue = -1 * (market.price + transportCost); // Cost = Price + Transport (Logic: Closer to 0 is better for buyer, but we sort desc)
        }

        return {
          ...market,
          distance: parseFloat(distanceKm),
          duration: durationMins,
          transportCost,
          netValue,
          tags: [],
        };
      });

      // 5. Ranking & Tagging
      processedResults.sort((a, b) => b.netValue - a.netValue);

      if (processedResults.length > 0) processedResults[0].tags.push("Best Profit");

      const sortedByDist = [...processedResults].sort((a, b) => a.distance - b.distance);
      if (sortedByDist[0])
        processedResults.find(p => p.name === sortedByDist[0].name).tags.push("Nearest");

      const sortedByPrice = [...processedResults].sort((a, b) =>
        userRole === "seller" ? b.price - a.price : a.price - b.price
      );
      if (sortedByPrice[0])
        processedResults.find(p => p.name === sortedByPrice[0].name).tags.push("Best Rate");

      setResults(processedResults);
    } catch (err) {
      console.error(err);
      setError("System Error: " + err.message);
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl bg-green-700 rounded-2xl shadow-lg p-6 text-white mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              Smart Mandi Finder
            </h1>
            <p className="text-green-100 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live Government Data Integration
            </p>
          </div>

          <div className="bg-green-800 p-1 rounded-lg flex">
            <button
              onClick={() => {
                setUserRole("seller");
                setResults([]);
              }}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                userRole === "seller"
                  ? "bg-white text-green-800 shadow"
                  : "text-green-300 hover:text-white"
              }`}
            >
              Selling
            </button>
            <button
              onClick={() => {
                setUserRole("buyer");
                setResults([]);
              }}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                userRole === "buyer"
                  ? "bg-white text-green-800 shadow"
                  : "text-green-300 hover:text-white"
              }`}
            >
              Buying
            </button>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mb-8 space-y-4 border border-gray-100">
        {/* Crop Select */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Select Commodity
          </label>
          <div className="relative">
            <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCrop}
              onChange={e => {
                setSelectedCrop(e.target.value);
                setResults([]);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white appearance-none"
            >
              {COMMODITIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Select */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={addressInput}
              onChange={e => setAddressInput(e.target.value)}
              placeholder="Set your location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <button
            onClick={handleGetCurrentLocation}
            className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 text-gray-700 border border-gray-200"
            title="Use GPS"
          >
            <Navigation className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowMap(!showMap)}
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              showMap
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            <MapIcon className="w-6 h-6" />
            <span className="hidden md:inline">{showMap ? "Hide Map" : "Map"}</span>
          </button>
          <button
            onClick={fetchAndAnalyze}
            disabled={!userLocation || loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[160px] justify-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Find Best Mandi"}
          </button>
        </div>

        {/* Map View */}
        {showMap && (
          <div className="h-72 w-full rounded-xl overflow-hidden border border-gray-200 mt-4 shadow-inner">
            <MapContainer center={[10.5, 76.2]} zoom={7} style={{ height: "100%", width: "100%" }}>
              <LocationPickerMap onLocationSelect={handleNewLocation} selectedPos={userLocation} />
            </MapContainer>
          </div>
        )}

        {/* Status / Error Messages */}
        {statusMsg && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" /> {statusMsg}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
      </div>

      {/* --- RESULTS SECTION --- */}
      {results.length > 0 && (
        <div className="w-full max-w-4xl space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
          {/* Top Recommendation */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-yellow-400 text-green-900 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                Recommended Market
              </span>
              <div className="flex justify-between items-start mt-4">
                <div>
                  <h2 className="text-3xl font-bold">{results[0].name}</h2>
                  <p className="text-green-100 text-sm mt-1 opacity-90">
                    {results[0].district} District • {results[0].date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-200 text-xs uppercase">
                    Est. Net {userRole === "seller" ? "Profit" : "Cost"}
                  </p>
                  <p className="text-4xl font-bold">₹{Math.abs(results[0].netValue)}</p>
                  <p className="text-xs text-green-200">per Quintal</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 bg-white/10 rounded-xl p-4 mt-6 backdrop-blur-sm">
                <div>
                  <p className="text-green-200 text-xs uppercase mb-1">Live Price</p>
                  <p className="text-xl font-bold">₹{results[0].price}</p>
                </div>
                <div>
                  <p className="text-green-200 text-xs uppercase mb-1">Logistics Cost</p>
                  <p className="text-xl font-bold">₹{results[0].transportCost}</p>
                </div>
                <div>
                  <p className="text-green-200 text-xs uppercase mb-1">Distance</p>
                  <p className="text-xl font-bold">{results[0].distance} km</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 flex justify-between">
              <span>Other Markets</span>
              <span className="text-xs font-normal text-gray-500">Sorted by profitability</span>
            </div>
            <div className="divide-y divide-gray-100">
              {results.slice(1).map(mandi => (
                <div
                  key={mandi.name}
                  className="p-4 hover:bg-gray-50 transition-colors flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{mandi.name}</h4>
                      {mandi.tags.map(tag => (
                        <span
                          key={tag}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            tag.includes("Nearest")
                              ? "bg-blue-100 text-blue-700"
                              : tag.includes("Rate")
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex gap-4">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" /> {mandi.duration} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <MapIcon className="w-3 h-3" /> {mandi.distance} km
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="text-xs text-gray-400">Price/Qtl</p>
                      <p className="font-semibold text-gray-900">₹{mandi.price}</p>
                    </div>
                    <div className="min-w-[80px]">
                      <p className="text-xs text-gray-400">Net Return</p>
                      <p
                        className={`text-lg font-bold ${
                          userRole === "seller" ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        ₹{Math.abs(mandi.netValue)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindMandi;