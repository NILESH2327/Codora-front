import React, { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import SchemeHeader from "../components/Schemes/Header";
import SchemeSidebar from "../components/Schemes/Sidebar";
import { getJSON } from "../api";

const Schemes = () => {
  // UI/filters
  const [selectedFilter, setSelectedFilter] = useState("");      // e.g. department
  const [selectedCategories, setSelectedCategories] = useState([]); // e.g. crops or custom tags
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [search, setSearch] = useState("");

  // data + pagination
  const [schemes, setSchemes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 9; // 3 columns * 3 rows

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Build query object that matches your controller's buildFilters()
  const fetchSchemes = async () => {
    try {
      setLoading(true);

      const query = {
        page,
        limit,
      };

      if (stateFilter) query.state = stateFilter;
      if (districtFilter) query.district = districtFilter;
      if (selectedFilter) query.department = selectedFilter;
      if (search) query.search = search;

      // Example: if you map selectedCategories → crops filter
      if (selectedCategories.length > 0) {
        // backend expects a single crop string; you can choose first or change controller
        query.crop = selectedCategories[0];
      }

      const res = await getJSON("/schemes", query);
      // expecting { success, page, totalPages, results }
      setSchemes(res.results || res.data?.results || []);
      setTotalPages(res.totalPages || res.data?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching schemes:", err);
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, stateFilter, districtFilter, selectedFilter, selectedCategories, search]);
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SchemeHeader
        search={search}
        setSearch={setSearch}
        onSearchSubmit={() => setPage(1)}
      />

      <div className="flex">
        {/* Sidebar - pass setters so it can update filters */}
        <SchemeSidebar
          selectedFilter={selectedFilter}
          setSelectedFilter={(val) => {
            setSelectedFilter(val);
            setPage(1);
          }}
          toggleCategory={toggleCategory}
          selectedCategories={selectedCategories}
          stateFilter={stateFilter}
          setStateFilter={(val) => {
            setStateFilter(val);
            setPage(1);
          }}
          districtFilter={districtFilter}
          setDistrictFilter={(val) => {
            setDistrictFilter(val);
            setPage(1);
          }}
        />

        {/* Schemes Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-green-700">
              Available Government Schemes
            </h2>
            {loading && (
              <span className="text-xs text-gray-500">Loading...</span>
            )}
          </div>

          {schemes.length === 0 && !loading ? (
            <p className="text-sm text-gray-500">
              No schemes found. Try changing filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {schemes.map((scheme) => (
               <Link
  to={`${scheme._id}`}
  key={scheme._id}
  className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col h-full"
>
  <div className="flex items-center gap-2 mb-2">
    <BadgeCheck className="text-green-600" size={18} />
    <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2">
      {scheme.name}
    </h3>
  </div>

  <p className="text-xs md:text-sm text-gray-600 mb-1">
    <span className="font-semibold">Department:</span> {scheme.department}
  </p>

  {scheme.eligibility?.state && (
    <p className="text-xs md:text-sm text-gray-600 mb-1">
      <span className="font-semibold">State:</span> {scheme.eligibility.state}
    </p>
  )}

  <p className="text-xs md:text-sm text-gray-700 mb-2 line-clamp-3">
    {scheme.description}
  </p>

  {scheme.benefits && (
    <p className="text-sm text-green-700 font-medium">
      Benefit: {scheme.benefits}
    </p>
  )}

  {/* Push the button to the bottom */}
  <button className="mt-auto w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition">
    View Details
  </button>
</Link>

              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6 text-sm">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Prev
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Schemes;
