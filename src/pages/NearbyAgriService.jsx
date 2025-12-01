import React, { useState, useEffect } from "react";
import {
  MapPin,
  Tractor,
  FlaskConical,
  Store,
  Loader2,
  Navigation,
  Sparkles
} from "lucide-react";

export default function NearbyAgriServices() {
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState("all");
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distanceLimit, setDistanceLimit] = useState(10);

  // Load Google Maps Script
  useEffect(() => {
    if (!document.getElementById("google-maps-script")) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places`;
      document.body.appendChild(script);
    }
  }, []);

  // Detect location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Please enable location to continue.")
    );
  }, []);

  const fetchServices = async () => {
    if (!location) return;

    setLoading(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/services?lat=${location.lat}&lng=${location.lng}&category=${category}`
    );

    const data = await res.json();
    setServices(data);
    setLoading(false);
  };

  // Apply distance filter
  useEffect(() => {
    const filteredList = services.filter(
      (s) => s.distance <= distanceLimit
    );

    setFiltered(filteredList);
  }, [distanceLimit, services]);

  // Suggestion logic
  const getSuggestions = () => {
    if (filtered.length === 0) return [];

    const nearest = filtered[0];

    const mostCommonCategory = filtered.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const topCategory = Object.keys(mostCommonCategory).sort(
      (a, b) => mostCommonCategory[b] - mostCommonCategory[a]
    )[0];

    return [
      {
        title: "Nearest Service",
        text: nearest.name,
      },
      {
        title: "Most Common Nearby",
        text: topCategory.toUpperCase(),
      },
      {
        title: "Total Matches",
        text: filtered.length + " services",
      },
    ];
  };

  const openInMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  const categoryOptions = [
    { value: "all", label: "All", icon: Store },
    { value: "shop", label: "Agri Shops", icon: Store },
    { value: "lab", label: "Soil Labs", icon: FlaskConical },
    { value: "tractor", label: "Tractor Rentals", icon: Tractor },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-3">
        Nearby Agri Services 🌍
      </h1>
      <p className="text-gray-600 mb-6">
        Find shops, labs, and rentals near your current location.
      </p>

      {/* Category Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {categoryOptions.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              className={`p-4 rounded-xl shadow-md border text-center transition ${
                category === cat.value
                  ? "bg-green-600 text-white border-green-700"
                  : "bg-white hover:bg-green-50"
              }`}
              onClick={() => setCategory(cat.value)}
            >
              <Icon className="mx-auto mb-2" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Distance Filter */}
      <div className="mb-6">
        <label className="font-semibold">Distance Limit: </label>
        <select
          className="ml-3 p-2 border rounded-lg"
          value={distanceLimit}
          onChange={(e) => setDistanceLimit(Number(e.target.value))}
        >
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={20}>20 km</option>
          <option value={50}>50 km</option>
        </select>
      </div>

      {/* Search Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={fetchServices}
          className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl flex items-center gap-2 shadow-lg"
        >
          {loading ? <Loader2 className="animate-spin" /> : null}
          {loading ? "Searching..." : "Find Nearby Services"}
        </button>
      </div>

      {/* Smart Suggestions */}
      {filtered.length > 0 && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
          <h3 className="font-bold flex items-center gap-2 text-green-700 mb-2">
            <Sparkles /> Smart Suggestions
          </h3>
          {getSuggestions().map((s, i) => (
            <p key={i} className="text-gray-700">
              <b>{s.title}:</b> {s.text}
            </p>
          ))}
        </div>
      )}

      {/* Google Map */}
      {location && (
        <div className="w-full h-72 mb-6 rounded-xl overflow-hidden border shadow">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/search?key=${
              import.meta.env.VITE_GOOGLE_MAPS_API_KEY
            }&q=agriculture+stores+near+${location.lat},${location.lng}`}
          ></iframe>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {filtered.map((s, i) => (
          <div
            key={i}
            className="p-5 rounded-xl shadow-md bg-white border hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="text-green-700" />
              <h2 className="text-xl font-semibold">{s.name}</h2>
            </div>

            <p className="text-gray-700">
              <b>Category:</b> {s.category}
            </p>

            <p className="text-gray-700">
              <b>Address:</b> {s.address}
            </p>

            <p className="text-gray-700">
              <b>Distance:</b> {s.distance.toFixed(2)} km away
            </p>

            <button
              onClick={() => openInMaps(s.lat, s.lng)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
            >
              <Navigation size={18} />
              Open in Google Maps
            </button>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No services found in this range.
          </p>
        )}
      </div>
    </div>
  );
}
