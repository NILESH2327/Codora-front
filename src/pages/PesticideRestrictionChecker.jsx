import React, { useState, useEffect } from 'react';
import { Search, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function PesticideRestrictionChecker() {
  const bgUrl = '/farm-bg.jpg';

  const [query, setQuery] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [allPesticides, setAllPesticides] = useState([]);   // FIXED

  const suggestions = []; // You can add later


    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);
  // 👉 Load all pesticides from backend
  useEffect(() => {
    async function loadAll() {
      try {
        const res = await fetch("http://localhost:5000/api/pesticides");
        const data = await res.json();
        setAllPesticides(data);
      } catch (err) {
        console.error("Failed to load pesticides list:", err);
      }
    }
    loadAll();
  }, []);

  // 👉 Fetch single pesticide by name
  async function lookupPesticideAPI(name) {
    if (!name) return null;

    try {
      const res = await fetch(
        `http://localhost:5000/api/pesticides/${encodeURIComponent(name)}`
      );

      if (!res.ok) {
        return {
          name,
          status: "Unknown",
          alternatives: ["Not found in database"]
        };
      }

      return await res.json();
    } catch (err) {
      return {
        name,
        status: "Error",
        alternatives: ["Server not responding"]
      };
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    const r = await lookupPesticideAPI(query.trim());
    setResult(r);
  }

  function StatusBadge({ status }) {
    if (!status) return null;

    const s = status.toLowerCase();
    if (s === 'banned')
      return <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/60 text-red-300 text-sm"><AlertCircle size={16}/> BANNED</span>;
    if (s === 'restricted')
      return <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-900/50 text-yellow-300 text-sm"><AlertCircle size={16}/> RESTRICTED</span>;
    if (s === 'allowed')
      return <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/50 text-green-300 text-sm"><CheckCircle size={16}/> ALLOWED</span>;

    return <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/40 text-slate-200 text-sm">{status.toUpperCase()}</span>;
  }

  return (
   
     <div
  className="min-h-screen bg-cover bg-center bg-no-repeat py-8 relative"
  style={{
    backgroundImage:
      "url('https://cdn.pixabay.com/photo/2021/09/18/02/27/vietnam-6634082_1280.jpg')",
  }}
>
  {/* Soft overlay for readability */}
  <div className="absolute inset-0 bg-white/50 backdrop-blur-[3px]"></div>
  <div className="relative max-w-4xl mx-auto px-2">
    
    <div className="min-h-screen" 
         style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="backdrop-brightness-50 bg-[rgba(2,48,33,0.62)] min-h-screen p-6 ">
        <div className="max-w-6xl mx-auto text-center text-white py-12">
          <h1 className="text-3xl font-extrabold">Pesticide Restriction Checker</h1>
          <p className="mt-2 text-slate-200 max-w-2xl mx-auto">
            Scan or type a pesticide name to check whether it's allowed, restricted, or banned in Kerala.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* SEARCH FORM */}
          <form onSubmit={handleSearch} className="md:col-span-2 bg-[#072d23]/60 p-6 rounded-2xl shadow-lg">
            <label className="block text-sm text-slate-200 mb-2">Search pesticide</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setResult(null); }}
                  placeholder="Type pesticide name"
                  className="w-full rounded-lg px-4 py-3 bg-[#062b22]/40 border border-slate-700 placeholder-slate-300 text-white"
                />
                <button type="submit"
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-md flex items-center gap-2">
                  <Search size={16}/>
                  <span className="text-sm">Check</span>
                </button>
              </div>
            </div>
          </form>

          {/* RESULT + SHOW ALL */}
          <div className="bg-[#072d23]/60 p-6 rounded-2xl shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Result</h3>
              <button onClick={() => setShowAll(s => !s)}
                      className="px-3 py-2 rounded bg-slate-800/40 text-sm text-slate-200">
                {showAll ? "Hide list" : "Show list"}
              </button>
            </div>

            {/* RESULT DISPLAY */}
            {!result && (
              <div className="text-slate-300">No result yet.</div>
            )}

            {result && (
              <div className="mt-2 bg-[#062e27]/40 p-4 rounded-lg border border-slate-700">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-bold">{result.name}</h4>
                    <StatusBadge status={result.status}/>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="font-semibold text-slate-200">Safer alternatives</h5>
                  <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.alternatives?.map((alt, i) => (
                      <li key={i} className="text-sm text-slate-300 bg-slate-800/20 px-3 py-2 rounded">{alt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* SHOW ALL LIST — DYNAMIC */}
            {showAll && (
              <div className="mt-4">
                <h5 className="text-slate-200 font-semibold mb-2">All Pesticides</h5>

                <ul className="space-y-2 max-h-48 overflow-auto">
                  {allPesticides.length === 0 && (
                    <li className="text-slate-300 text-sm">Loading...</li>
                  )}

                  {allPesticides.map((p) => (
                    <li key={p._id} className="flex items-center justify-between bg-slate-800/20 px-3 py-2 rounded">
                      <div className="text-sm text-slate-200">{p.name}</div>
                      <div className="text-sm text-slate-300">{p.status}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
