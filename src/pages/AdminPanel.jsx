import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [marketPrices, setMarketPrices] = useState([]);
  const [schemes, setSchemes] = useState([]);

  const [mpCrop, setMpCrop] = useState("");
  const [mpMarket, setMpMarket] = useState("");
  const [mpPrice, setMpPrice] = useState("");

  const [schemeName, setSchemeName] = useState("");
  const [schemeCrops, setSchemeCrops] = useState("");
  const [schemeDeadline, setSchemeDeadline] = useState("");
  const [schemeDescription, setSchemeDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Edit states
  const [editingMarket, setEditingMarket] = useState(null); // market obj
  const [editingScheme, setEditingScheme] = useState(null); // scheme obj

  const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE }); // change baseURL if needed

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [mres, sres] = await Promise.all([
        api.get("/market/all"),
        api.get("/scheme/all"),
      ]);
      if (mres.data.success) setMarketPrices(mres.data.data);
      if (sres.data.success) setSchemes(sres.data.data);
    } catch (e) {
      setError(e.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- MARKET ACTIONS ---------- */
  const addMarketPrice = async () => {
    if (!mpCrop || !mpMarket || !mpPrice) return alert("Fill all fields");
    try {
      await api.post("/market/add", { crop: mpCrop, market: mpMarket, price: Number(mpPrice) });
      setMpCrop("");
      setMpMarket("");
      setMpPrice("");
      fetchData();
    } catch (e) {
      alert("Failed to add market price");
    }
  };

  const startEditMarket = (m) => {
    setEditingMarket(m);
    setMpCrop(m.crop);
    setMpMarket(m.market);
    setMpPrice(m.price);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveEditMarket = async () => {
    if (!editingMarket) return;
    try {
      await api.get(`/market/${editingMarket._id}`, { crop: mpCrop, market: mpMarket, price: Number(mpPrice) });
      setEditingMarket(null);
      setMpCrop("");
      setMpMarket("");
      setMpPrice("");
      fetchData();
    } catch (e) {
      alert("Failed to save market price");
    }
  };

  const cancelEditMarket = () => {
    setEditingMarket(null);
    setMpCrop("");
    setMpMarket("");
    setMpPrice("");
  };

  const deleteMarket = async (id) => {
    if (!confirm("Delete this market price?")) return;
    try {
      await api.get(`/market/${id}`);
      fetchData();
    } catch (e) {
      alert("Failed to delete");
    }
  };

  /* ---------- SCHEME ACTIONS ---------- */
  const addScheme = async () => {
    if (!schemeName || !schemeCrops || !schemeDeadline) return alert("Fill all fields");
    try {
      const cropsArray = schemeCrops.split(",").map((c) => c.trim()).filter(Boolean);
      await api.post("/scheme/add", {
        name: schemeName,
        crops: cropsArray,
        deadline: schemeDeadline,
        description: schemeDescription,
      });
      setSchemeName("");
      setSchemeCrops("");
      setSchemeDeadline("");
      setSchemeDescription("");
      fetchData();
    } catch (e) {
      alert("Failed to add scheme");
    }
  };

  const startEditScheme = (s) => {
    setEditingScheme(s);
    setSchemeName(s.name);
    setSchemeCrops((s.crops || []).join(", "));
    setSchemeDeadline(s.deadline ? new Date(s.deadline).toISOString().slice(0, 10) : "");
    setSchemeDescription(s.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveEditScheme = async () => {
    if (!editingScheme) return;
    try {
      const cropsArray = schemeCrops.split(",").map((c) => c.trim()).filter(Boolean);
      await api.get(`/scheme/${editingScheme._id}`, {
        name: schemeName,
        crops: cropsArray,
        deadline: schemeDeadline,
        description: schemeDescription,
      });
      setEditingScheme(null);
      setSchemeName("");
      setSchemeCrops("");
      setSchemeDeadline("");
      setSchemeDescription("");
      fetchData();
    } catch (e) {
      alert("Failed to save scheme");
    }
  };

  const cancelEditScheme = () => {
    setEditingScheme(null);
    setSchemeName("");
    setSchemeCrops("");
    setSchemeDeadline("");
    setSchemeDescription("");
  };

  const deleteScheme = async (id) => {
    if (!confirm("Delete this scheme?")) return;
    try {
      await api.get(`/scheme/${id}`);
      fetchData();
    } catch (e) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="w-11/12 mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {loading && <div className="mb-4 text-sm text-gray-600">Loading...</div>}
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Market Price Section */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">{editingMarket ? "Edit Market Price" : "Add Market Price"}</h2>

          <label className="block mb-1">Crop Name</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={mpCrop}
            onChange={(e) => setMpCrop(e.target.value)}
            type="text"
          />

          <label className="block mb-1">Market</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={mpMarket}
            onChange={(e) => setMpMarket(e.target.value)}
            type="text"
          />

          <label className="block mb-1">Price (₹)</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={mpPrice}
            onChange={(e) => setMpPrice(e.target.value)}
            type="number"
          />

          <div className="flex gap-2">
            {editingMarket ? (
              <>
                <button onClick={saveEditMarket} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                <button onClick={cancelEditMarket} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              </>
            ) : (
              <button onClick={addMarketPrice} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Market Price</button>
            )}
          </div>
        </div>

        {/* Scheme Section */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">{editingScheme ? "Edit Scheme" : "Add Scheme"}</h2>

          <label className="block mb-1">Scheme Name</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={schemeName}
            onChange={(e) => setSchemeName(e.target.value)}
            type="text"
          />

          <label className="block mb-1">Eligible Crops (comma separated)</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={schemeCrops}
            onChange={(e) => setSchemeCrops(e.target.value)}
            type="text"
            placeholder="comma separated"
          />

          <label className="block mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded mb-3"
            value={schemeDescription}
            onChange={(e) => setSchemeDescription(e.target.value)}
            placeholder="Enter scheme details"
          ></textarea>

          <label className="block mb-1">Deadline</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={schemeDeadline}
            onChange={(e) => setSchemeDeadline(e.target.value)}
            type="date"
          />

          <div className="flex gap-2">
            {editingScheme ? (
              <>
                <button onClick={saveEditScheme} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                <button onClick={cancelEditScheme} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              </>
            ) : (
              <button onClick={addScheme} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Scheme</button>
            )}
          </div>
        </div>
      </div>

      {/* Market Price List */}
      <h2 className="text-2xl font-semibold mb-3">Market Price List</h2>
      <table className="w-full bg-white border rounded shadow mb-10">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Crop</th>
            <th className="p-2 border">Market</th>
            <th className="p-2 border">Price (₹)</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {marketPrices.map((m) => (
            <tr key={m._id || m.date}>
              <td className="p-2 border">{m.crop}</td>
              <td className="p-2 border">{m.market}</td>
              <td className="p-2 border">{m.price}</td>
              <td className="p-2 border">{new Date(m.date).toLocaleDateString()}</td>
              <td className="p-2 border">
                <div className="flex gap-2">
                  <button onClick={() => startEditMarket(m)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                  <button onClick={() => deleteMarket(m._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Scheme List */}
      <h2 className="text-2xl font-semibold mb-3">Scheme List</h2>
      <table className="w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Scheme Name</th>
            <th className="p-2 border">Eligible Crops</th>
            <th className="p-2 border">Deadline</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schemes.map((s) => (
            <tr key={s._id || s.createdAt}>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{(s.crops || []).join(", ")}</td>
              <td className="p-2 border">{s.deadline ? new Date(s.deadline).toLocaleDateString() : "-"}</td>
              <td className="p-2 border">{s.description}</td>
              <td className="p-2 border">
                <div className="flex gap-2">
                  <button onClick={() => startEditScheme(s)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                  <button onClick={() => deleteScheme(s._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

