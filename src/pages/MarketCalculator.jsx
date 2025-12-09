import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Loader2,
  TrendingUp,
  Map as MapIcon,
  Truck,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  MinusCircle,
  Scale,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
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
const API_KEY =
  "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
const BASE_URL =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

const VEHICLES = [
  { id: "ace", name: "Small Pickup (Tata Ace)", rate: 20, capacity: 10 }, // Cap in Quintals
  { id: "407", name: "Medium Truck (407)", rate: 35, capacity: 30 },
  { id: "lorry", name: "Heavy Truck (Lorry)", rate: 55, capacity: 100 },
];

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
  { id: "Vegetable", name: "Vegetables (General)" },
];

// --- COORDINATES ---
export const MARKET_COORDINATES = {
  Nedumangad: { lat: 8.6024, lng: 76.9968 },
  Palakkad: { lat: 10.7867, lng: 76.6548 },
  Thodupuzha: { lat: 9.8959, lng: 76.7184 },
  Kozhikode: { lat: 11.2588, lng: 75.7804 },
  Ernakulam: { lat: 9.9816, lng: 76.2999 },
  Kottayam: { lat: 9.5916, lng: 76.5222 },
  Thrissur: { lat: 10.5276, lng: 76.2144 },
  Manjeri: { lat: 11.1198, lng: 76.1215 },
  Kalpetta: { lat: 11.6103, lng: 76.0827 },
  Kannur: { lat: 11.8745, lng: 75.3704 },
  Kasaragod: { lat: 12.5102, lng: 74.9852 },
  Chalakkudy: { lat: 10.307, lng: 76.334 },
  Alappuzha: { lat: 9.4981, lng: 76.3388 },
  Kollam: { lat: 8.8932, lng: 76.6141 },
  Tirur: { lat: 10.9172, lng: 75.9221 },
  Payyannur: { lat: 12.1001, lng: 75.204 },
  Taliparamba: { lat: 12.0494, lng: 75.3579 },
  "Sulthan Bathery": { lat: 11.6629, lng: 76.257 },
  Mananthavady: { lat: 11.8027, lng: 76.0044 },
  Kondotty: { lat: 11.1456, lng: 75.9629 },
  Perinthalmanna: { lat: 10.9754, lng: 76.2268 },
  Vatakara: { lat: 11.6103, lng: 75.5917 },
  Koyilandy: { lat: 11.4398, lng: 75.6967 },
  Thalassery: { lat: 11.7491, lng: 75.489 },
  Iritty: { lat: 11.9806, lng: 75.6706 },
  Muvattupuzha: { lat: 9.9894, lng: 76.579 },
  Perumbavoor: { lat: 10.1136, lng: 76.4786 },
  Aluva: { lat: 10.1076, lng: 76.3516 },
  Kothamangalam: { lat: 10.0638, lng: 76.6279 },
  "North Paravur": { lat: 10.1473, lng: 76.2307 },
  Angamaly: { lat: 10.196, lng: 76.386 },
};

const DISTRICT_COORDINATES = {
  Thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
  Kollam: { lat: 8.8932, lng: 76.6141 },
  Pathanamthitta: { lat: 9.2648, lng: 76.787 },
  Alappuzha: { lat: 9.4981, lng: 76.3388 },
  Kottayam: { lat: 9.5916, lng: 76.5222 },
  Idukki: { lat: 9.85, lng: 76.9667 },
  Ernakulam: { lat: 9.9816, lng: 76.2999 },
  Thrissur: { lat: 10.5276, lng: 76.2144 },
  Palakkad: { lat: 10.7867, lng: 76.6548 },
  Palakad: { lat: 10.7867, lng: 76.6548 },
  Malappuram: { lat: 11.051, lng: 76.0711 },
  Kozhikode: { lat: 11.2588, lng: 75.7804 },
  Wayanad: { lat: 11.6052, lng: 76.0828 },
  Kannur: { lat: 11.8745, lng: 75.3704 },
  Kasaragod: { lat: 12.5102, lng: 74.9852 },
};

// --- helper: pick vehicle by quantity ---
const pickVehicleForQuantity = (qty) => {
  if (!qty || qty <= 0) return VEHICLES[0];
  const sorted = [...VEHICLES].sort((a, b) => a.capacity - b.capacity);
  return sorted.find((v) => v.capacity >= qty) || sorted[sorted.length - 1];
};

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
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);
  const [quantity, setQuantity] = useState(10); // Default 10 Quintals
  const [isRoundTrip, setIsRoundTrip] = useState(true);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);

  // --- LOGIC ---
  const handleNewLocation = async (lat, lng) => {
    setLoading(true);
    setStatusMsg("Locating...");
    setUserLocation({ lat, lng });
    setError("");
    setResults([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setAddressInput(
        data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      );
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
      setStatusMsg("Checking GPS...");
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          handleNewLocation(pos.coords.latitude, pos.coords.longitude),
        () => {
          setError("GPS Permission Denied");
          setLoading(false);
          setStatusMsg("");
        }
      );
    } else {
      setError("GPS not supported");
    }
  };

  const fetchAndAnalyze = async () => {
    if (!userLocation) {
      setError("Please set your location first.");
      return;
    }
    if (quantity <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    setLoading(true);
    setStatusMsg("Fetching Market Prices...");
    setError("");
    setResults([]);

    try {
      const apiUrl = `${BASE_URL}?api-key=${API_KEY}&format=json&limit=200&filters[state.keyword]=Kerala&filters[commodity]=${encodeURIComponent(
        selectedCrop
      )}`;
      const response = await fetch(apiUrl);
      const jsonData = await response.json();

      if (!jsonData.records || jsonData.records.length === 0) {
        setError(`No market is buying ${selectedCrop} today.`);
        setLoading(false);
        setStatusMsg("");
        return;
      }

      const activeMarkets = [];
      const processedNames = new Set();

      jsonData.records.forEach((record) => {
        const rawName = record.market;
        const districtName = record.district;
        let coords =
          MARKET_COORDINATES[rawName] ||
          MARKET_COORDINATES[`${rawName} APMC`] ||
          MARKET_COORDINATES[rawName.replace(" APMC", "")];

        let isApproximate = false;
        if (!coords && DISTRICT_COORDINATES[districtName]) {
          coords = DISTRICT_COORDINATES[districtName];
          isApproximate = true;
        }

        if (coords && !processedNames.has(rawName)) {
          activeMarkets.push({
            name: rawName,
            lat: coords.lat,
            lng: coords.lng,
            price: parseFloat(record.modal_price),
            district: districtName,
            isApproximate: isApproximate,
          });
          processedNames.add(rawName);
        }
      });

      if (activeMarkets.length === 0) {
        setError("Markets found, but no location data available.");
        setLoading(false);
        setStatusMsg("");
        return;
      }

      setStatusMsg(
        `Calculating profits for ${activeMarkets.length} markets...`
      );

      const destinations = activeMarkets
        .map((m) => `${m.lng},${m.lat}`)
        .join(";");
      const source = `${userLocation.lng},${userLocation.lat}`;

      const osrmRes = await fetch(
        `https://router.project-osrm.org/table/v1/driving/${source};${destinations}?sources=0`
      );
      const osrmData = await osrmRes.json();
      if (osrmData.code !== "Ok") throw new Error("Route calculation failed");

      const travelTimes = osrmData.durations[0].slice(1);
      const processedResults = activeMarkets.map((market, index) => {
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
        const distanceKm = parseFloat((R * c * 1.2).toFixed(1));

        // 1. Total Revenue = Price per Qtl * Quantity
        const totalRevenue = market.price * quantity;

        // 2. Transport Cost
        const oneWayCost = distanceKm * selectedVehicle.rate;
        const totalTransportCost = Math.round(
          isRoundTrip ? oneWayCost * 2 : oneWayCost
        );

        // 3. Net Profit
        const netProfit = totalRevenue - totalTransportCost;

        return {
          ...market,
          distance: distanceKm,
          duration: Math.round(travelTimes[index] / 60),
          totalRevenue,
          totalTransportCost,
          netProfit,
        };
      });

      processedResults.sort((a, b) => b.netProfit - a.netProfit);
      setResults(processedResults);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center font-sans">
      {/* Header */}
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
          <TrendingUp className="w-8 h-8" />
          Market Profit Calculator
        </h1>
        <p className="text-gray-600">
          Real-time prices from Govt Mandis + Accurate Transport Costs
        </p>
      </div>

      {/* Input Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="space-y-5">
          {/* 1. What & How Much */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Crop
              </label>
              <select
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500 outline-none"
                value={selectedCrop}
                onChange={(e) => {
                  setSelectedCrop(e.target.value);
                  setResults([]);
                }}
              >
                {COMMODITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Quantity (Quintals)
              </label>
              <div className="relative mt-1">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="1"
                  className="w-full pl-10 pr-3 p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500 outline-none"
                  value={quantity}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    setQuantity(q);
                    setSelectedVehicle(pickVehicleForQuantity(q));
                    setResults([]);
                  }}
                />
              </div>
            </div>
          </div>

          {/* 2. Where */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              Your Location
            </label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700"
                placeholder="Click GPS or Map Button"
                value={addressInput}
                readOnly
              />
              <button
                onClick={handleGetCurrentLocation}
                className="p-3 bg-green-100 text-green-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-green-200"
              >
                <Navigation className="w-5 h-5" /> GPS
              </button>
              <button
                onClick={() => setShowMap(!showMap)}
                className={`p-3 rounded-xl font-semibold flex items-center gap-2 border ${
                  showMap
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-white border-gray-200 text-gray-600"
                }`}
              >
                <MapIcon className="w-5 h-5" /> Map
              </button>
            </div>
            {showMap && (
              <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 mt-3 shadow-inner relative">
                <MapContainer
                  center={[10.5, 76.2]}
                  zoom={7}
                  style={{ height: "100%", width: "100%" }}
                >
                  <LocationPickerMap
                    onLocationSelect={handleNewLocation}
                    selectedPos={userLocation}
                  />
                </MapContainer>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm pointer-events-none">
                  Click map to set location
                </div>
              </div>
            )}
          </div>

          {/* 3. Vehicle */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              Vehicle
            </label>
            <div className="flex gap-2 mt-1">
              <select
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl"
                value={selectedVehicle.id}
                onChange={(e) => {
                  setSelectedVehicle(
                    VEHICLES.find((v) => v.id === e.target.value)
                  );
                  setResults([]);
                }}
              >
                {VEHICLES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center px-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={isRoundTrip}
                    onChange={(e) => {
                      setIsRoundTrip(e.target.checked);
                      setResults([]);
                    }}
                    className="w-5 h-5 text-green-600 rounded"
                  />
                  Return Trip
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={fetchAndAnalyze}
            disabled={!userLocation || loading}
            className="w-full py-4 mt-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Calculate Total Profit"
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          {statusMsg && (
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-sm text-center flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> {statusMsg}
            </div>
          )}
        </div>
      </div>

      {/* --- RESULTS --- */}
      {results.length > 0 && (
        <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-20">
          {/* WINNER CARD */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-green-500">
            <div className="bg-green-600 p-4 text-white text-center">
              <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> Highest Profit
              </h2>
            </div>

            <div className="p-6 text-center">
              <h3 className="text-3xl font-extrabold text-gray-800">
                {results[0].name}
              </h3>
              <p className="text-gray-500">
                {results[0].distance} km • {results[0].duration} mins
              </p>
              {results[0].isApproximate && (
                <div className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  ⚠ Location estimated
                </div>
              )}

              {/* MATH VISUALIZATION (UPDATED) */}
              <div className="mt-6 bg-green-50 rounded-xl p-4 border border-green-100 max-w-sm mx-auto text-left">
                <div className="flex justify-between items-center mb-1 text-gray-600">
                  <span className="text-xs">Market Price</span>
                  <span className="font-semibold">
                    ₹{results[0].price} / qtl
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2 text-gray-800 font-bold">
                  <span>x {quantity} Quintals</span>
                  <span>₹{results[0].totalRevenue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center mb-3 text-red-500">
                  <span className="flex items-center gap-1">
                    <MinusCircle className="w-4 h-4" /> Truck Rent
                  </span>
                  <span className="font-semibold">
                    - ₹{results[0].totalTransportCost.toLocaleString()}
                  </span>
                </div>

                <div className="h-px bg-green-200 mb-3"></div>

                <div className="flex justify-between items-center text-green-800">
                  <span className="font-bold uppercase text-sm">
                    Total Profit
                  </span>
                  <span className="text-3xl font-extrabold">
                    ₹{results[0].netProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* OTHER OPTIONS */}
          <div>
            <h4 className="text-center text-gray-500 font-medium mb-4 uppercase text-xs tracking-wider">
              Other Markets
            </h4>
            <div className="space-y-3">
              {results.slice(1).map((mandi) => (
                <div
                  key={mandi.name}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-bold text-gray-800">
                      {mandi.name}
                    </h5>
                    <div className="text-xs text-gray-500 mt-1 flex gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {mandi.distance} km
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        Rate: ₹{mandi.price}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total Profit</p>
                    <p className="font-bold text-lg text-gray-600">
                      ₹{mandi.netProfit.toLocaleString()}
                    </p>
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