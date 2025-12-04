// pages/AddCropEvent.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Sprout, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import { getJSON, postJSON } from "../api"; // ✅ make sure getJSON exists
import { toast } from "react-toastify";

const AddCropEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    plotId: "",
    advice: "",
    isCompleted: false,
    type: "",
  });

  const [loading, setLoading] = useState(false);
  const [plots, setPlots] = useState([]);        // ✅ list from backend
  const [plotsLoading, setPlotsLoading] = useState(true);
  const [plotsError, setPlotsError] = useState("");

  // 🔹 Fetch plots on mount
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        setPlotsLoading(true);
        setPlotsError("");
        // adjust URL to your backend route, e.g. /plots or /farmer/plots
        const res = await getJSON("/tasks/plots");
        console.log(res)
        // assume res.plots is an array like [{id, name}, ...]
        setPlots(res || []);
      } catch (err) {
        console.error("Error loading plots", err);
        setPlotsError("Could not load plots. You can still type plot name manually.");
      } finally {
        setPlotsLoading(false);
      }
    };

    fetchPlots();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;

    try {
      setLoading(true);
      const res = await postJSON("/tasks/add", formData);
      if(res.success) toast.success("Added successfully")
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Could not save event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4fff8]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        {/* back + page title strip similar spacing to 'TOOLS & SERVICES' */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-800 hover:text-emerald-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Crop Calendar
        </button>

        {/* main card */}
        <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6 md:p-8">
          {/* header row similar to other cards */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500 text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-emerald-900">
                  Add New Crop Event
                </h1>
                <p className="text-sm text-emerald-600">
                  Schedule upcoming tasks for your fields
                </p>
              </div>
            </div>
          </div>

          {/* form body */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Event title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. 1st irrigation, Mulching, Fertilizer application"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* due date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* plot select from backend */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Sprout className="w-4 h-4 text-emerald-500" />
                  Plot / field
                </label>

                {plotsLoading ? (
                  <div className="text-xs text-gray-500 py-2">Loading plots...</div>
                ) : (
                  <select
                    name="plotId"
                    value={formData.plotId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">Select a plot</option>
                    {plots.map((plot) => (
                      <option key={plot.id || plot._id || plot.name} value={plot._id}>
                        {plot.farmName}
                      </option>
                    ))}
                  </select>
                )}

                {plotsError && (
                  <p className="mt-1 text-xs text-red-500">
                    {plotsError}
                  </p>
                )}

                {/* optional fallback manual input if you want both */}
                {/* <input ... /> */}
              </div>

              {/* type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Sprout className="w-4 h-4 text-emerald-500" />
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Irrigation, Fertilizer, Weeding"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4 text-emerald-500" />
                Advice / notes
              </label>
              <textarea
                name="advice"
                value={formData.advice}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Short instructions the farmer should follow"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="completed"
                type="checkbox"
                name="isCompleted"
                checked={formData.isCompleted}
                onChange={handleChange}
                className="h-4 w-4 text-emerald-600 border-2 border-emerald-300 rounded"
              />
              <label htmlFor="completed" className="text-sm text-gray-700">
                Mark as already completed
              </label>
            </div>

            <div className="flex justify-end pt-2 gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCropEvent;
