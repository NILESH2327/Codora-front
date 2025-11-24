import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api/knowledge";

const Knowledge = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [openIndex, setOpenIndex] = useState(null); 

  // Load initial data
  useEffect(() => {
    fetch(`${API_BASE}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "", crop: "all" }),
    })
      .then((res) => res.json())
      .then((data) => data.success && setResults(data.data))
      .catch(() => {});
  }, []);

  // Live suggestions
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: search, crop: "all" }),
        });
        const data = await res.json();
        if (data.success) setSuggestions(data.data.slice(0, 5));
      } catch {}
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: search,
          crop: selectedCrop,
        }),
      });

      const data = await res.json();

      if (data.success && data.data.length > 0) {
        setResults(data.data);
      } else {
        setResults([]);
        setError("No advice found.");
      }
    } catch {
      setError("Backend not reachable.");
    }

    setLoading(false);
  };

  const handleSuggestionClick = (q) => {
    setSearch(q);
    setSuggestions([]);
  };

  const uniqueCrops = Array.from(new Set(results.map((r) => r.crop))).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-3">Knowledge Engine</h1>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-4 flex-col md:flex-row">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full p-3 border rounded-xl"
              placeholder="Search by crop or question..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {suggestions.length > 0 && (
              <div className="absolute w-full bg-white border shadow rounded mt-1 z-20">
                {suggestions.map((s) => (
                  <div
                    key={s._id}
                    className="px-3 py-2 hover:bg-green-50 cursor-pointer"
                    onClick={() => handleSuggestionClick(s.question)}
                  >
                    {s.question}
                  </div>
                ))}
              </div>
            )}
          </div>

          <select
            className="p-3 border rounded-xl md:w-48"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            <option value="all">All crops</option>
            {uniqueCrops.map((crop) => (
              <option key={crop}>{crop}</option>
            ))}
          </select>

          <button className="p-3 bg-green-600 text-white rounded-xl md:w-32">
            Search
          </button>
        </form>

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Results */}
        <div className="flex flex-col gap-4">

          {results.slice(0,5).map((item, index) => (
            <div
              key={item._id}
              className="p-4 bg-white rounded-xl border shadow cursor-pointer"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <h2 className="font-semibold flex justify-between items-center text-lg">
                {item.question}
                <span className="text-green-600">
                  {openIndex === index ? "▲" : "▼"}
                </span>
              </h2>

              {openIndex === index && (
                <>
                  <p className="mt-2 text-gray-700">{item.answer}</p>

                  <div className="mt-2 flex gap-2 flex-wrap text-xs">
                    <span className="px-2 py-1 bg-green-100 rounded">{item.crop}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Stage: {item.stage}</span>
                    {item.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-green-50 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Knowledge;
