import { useState } from "react";
import { postJSON } from "../api";
import { Sprout, CalendarDays, Leaf } from "lucide-react";

export default function AddCropForm() {
  const [form, setForm] = useState({
    cropName: "",
    variety: "",
    sowingDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await postJSON("/farmer/add-crop", form);
      console.log(res);
      setMessage("🌾 Crop added successfully! Calendar generated.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add crop.");
    }

    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('./bgAddCrop.jpg')",
      }}
    >
      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black/40" /> */}

      {/* Form container */}
      <div className="relative w-full max-w-md bg-yellow/20 backdrop-blur-xl p-8 shadow-2xl rounded-2xl border border-white/30">
        <h2 className="text-3xl font-bold text-white text-center mb-6 flex items-center justify-center gap-2">
          <Leaf className="text-green-300" /> Add New Crop
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="font-medium text-white">Crop Name</label>
            <div className="flex items-center bg-white/80 rounded-lg p-2 mt-1 shadow-sm">
              <Sprout className="text-green-700 mr-2" />
              <input
                name="cropName"
                value={form.cropName}
                onChange={handleChange}
                placeholder="E.g. Paddy, Banana, Brinjal"
                className="w-full p-2 bg-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-white">Variety</label>
            <div className="flex items-center bg-white/80 rounded-lg p-2 mt-1 shadow-sm">
              <Leaf className="text-green-700 mr-2" />
              <input
                name="variety"
                value={form.variety}
                onChange={handleChange}
                placeholder="E.g. Jyothi, Robusta"
                className="w-full p-2 bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-white">Sowing Date</label>
            <div className="flex items-center bg-white/80 rounded-lg p-2 mt-1 shadow-sm">
              <CalendarDays className="text-green-700 mr-2" />
              <input
                type="date"
                name="sowingDate"
                value={form.sowingDate}
                onChange={handleChange}
                className="w-full p-2 bg-transparent outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-[1.02]"
          >
            {loading ? "Saving..." : "Add Crop"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center font-medium text-white text-lg drop-shadow-md">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
