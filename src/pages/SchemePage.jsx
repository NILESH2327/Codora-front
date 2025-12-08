// SchemeDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getJSON } from "../api"; // Your API helper

export default function SchemeDetailPage() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Matches your controller: GET /schemes/:id
        const res = await getJSON(`/schemes/${id}`);
        
        // Controller returns { success: true, scheme: {...} }
        if (res.success) {
          setScheme(res.scheme);
        } else {
          setError("Scheme not found");
        }
      } catch (err) {
        console.error("Error fetching scheme:", err);
        setError(err.message || "Failed to load scheme");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchScheme();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-xl font-medium text-gray-800 mb-2">Scheme Not Found</h1>
          <p className="text-sm text-gray-600">{error || "The requested scheme doesn't exist."}</p>
        </div>
      </div>
    );
  }

  return (
  <div
    className="min-h-screen bg-cover bg-center bg-no-repeat relative"
    style={{
      backgroundImage:
        "url('https://cdn.pixabay.com/photo/2021/09/18/02/27/vietnam-6634082_1280.jpg')",
    }}
  >
    {/* Blur only the background, NOT the content */}
    {/* <div className="absolute inset-0 backdrop-blur-sm bg-white/30"></div> */}

     <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border  border-gray-100">
          <div className="flex items-start  justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">{scheme.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                  {scheme.department}
                </span>
                <span>{scheme.eligibility?.state || "All India"}</span>
              </div>
            </div>
            <div className="text-right">
              {/* Dynamic benefit amount - customize based on your data */}
              <div className="text-lg font-bold text-emerald-600">
                {scheme.benefits?.includes("₹") ? scheme.benefits.split("₹")[1]?.split("/")[0] || "Benefit" : "₹6,000"}
                /year
              </div>
              <div className="text-xs text-gray-500">Direct Benefit</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Main Content */}
          <div className="space-y-4">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                📄 Description
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {scheme.description || "No description available."}
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                💰 Benefits
              </h2>
              <div className="space-y-2 text-sm">
                {scheme.benefits
                  ?.split(/[.•]/)
                  .filter((b) => b.trim())
                  .map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 -m-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-5 h-5 flex items-center justify-center text-emerald-500 mt-0.5 text-xs font-medium">
                        ✓
                      </div>
                      <span className="text-gray-700">{benefit.trim()}</span>
                    </div>
                  )) || (
                  <p className="text-sm text-gray-500 italic">Benefits information not available.</p>
                )}
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                ✅ Eligibility
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900 mb-2">Basic</div>
                  <div>
                    Land: {scheme.eligibility?.minLand || 0} -{" "}
                    {scheme.eligibility?.maxLand || "No limit"} acres
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span>Irrigation:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        scheme.eligibility?.irrigationRequired
                          ? "bg-orange-100 text-orange-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {scheme.eligibility?.irrigationRequired ? "Required" : "Any"}
                    </span>
                  </div>
                  {scheme.eligibility?.incomeLimit && (
                    <div className="mt-1">
                      Income: ≤ ₹{scheme.eligibility.incomeLimit.toLocaleString()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-2">Crops</div>
                  <div className="flex flex-wrap gap-1">
                    {scheme.eligibility?.crops?.slice(0, 6).map((crop, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs"
                      >
                        {crop}
                      </span>
                    )) || <span className="text-xs text-gray-500">All crops</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Documents */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
                📋 Documents ({scheme.documents?.length || 0})
              </h3>
              <div className="space-y-2 text-xs max-h-40 overflow-y-auto">
                {scheme.documents?.length > 0 ? (
                  scheme.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      <span className="text-gray-700 truncate">{doc}</span>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic text-center py-2">
                    Documents TBD
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              {scheme.deadline && new Date(scheme.deadline) > new Date() && (
                <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100 mb-4">
                  <div className="text-lg mb-1">⏰</div>
                  <div className="text-xs font-medium text-orange-800">Deadline</div>
                  <div className="text-xs text-orange-700">
                    {new Date(scheme.deadline).toLocaleDateString("en-IN")}
                  </div>
                </div>
              )}
              
              {scheme.link ? (
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-emerald-500 text-white py-3 px-4 rounded-xl text-center font-medium text-sm hover:bg-emerald-600 transition-all mb-3 shadow-sm hover:shadow-md"
                >
                  Apply Now →
                </a>
              ) : (
                <div className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-xl text-center text-sm font-medium mb-3">
                  Application link TBD
                </div>
              )}
              
              <button className="w-full border border-emerald-200 text-emerald-600 py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors mb-2">
                📧 Share
              </button>
              
              <button className="w-full border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                💾 Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
