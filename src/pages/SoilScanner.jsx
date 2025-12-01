import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SoilScanner() {
  const [form, setForm] = useState({
    N: 100,
    P: 20,
    K: 150,
    pH: 6.5,
    moisture: 20,
    ec: 0.6,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  }

  async function submitJSON(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-green-600">
        Soil Health Scanner
      </h2>

      {/* Form Card */}
      <form
        onSubmit={submitJSON}
        className="bg-white p-6 rounded-xl shadow-md border"
      >
        <h3 className="text-xl font-semibold mb-4">Enter Soil Parameters</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Nitrogen (N)", name: "N" },
            { label: "Phosphorus (P)", name: "P" },
            { label: "Potassium (K)", name: "K" },
            { label: "pH", name: "pH", step: "0.1" },
            { label: "Moisture (%)", name: "moisture" },
            { label: "Electrical Conductivity (EC dS/m)", name: "ec", step: "0.1" },
          ].map((field) => (
            <div key={field.name}>
              <label className="font-medium">{field.label}</label>
              <input
                name={field.name}
                type="number"
                step={field.step || "1"}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-green-300"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin h-5 w-5" />}
          {loading ? "Analyzing..." : "Analyze Soil"}
        </button>
      </form>

      {/* Result Card */}
      {result && (
        <div className="mt-6 bg-white border p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold text-blue-600">
            Result: {result.prediction}
          </h3>

          <p className="mt-2 text-gray-600">
            <strong>Confidence:</strong>{" "}
            {result.confidence
              ? (result.confidence * 100).toFixed(1) + "%"
              : "n/a"}
          </p>

          <div className="mt-4">
            <strong className="text-lg">Symptoms:</strong>
            <ul className="list-disc ml-5 text-gray-700">
              {Array.isArray(result.symptoms) &&
                result.symptoms.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div className="mt-4">
            <strong className="text-lg">Recommended Actions:</strong>
            <ul className="list-disc ml-5 text-gray-700">
              {Array.isArray(result.recommended_actions) &&
                result.recommended_actions.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          <details className="mt-4 cursor-pointer">
            <summary className="font-semibold">Input Values</summary>
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto text-sm">
              {JSON.stringify(result.input, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
