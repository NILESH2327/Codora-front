import React, { useState, useEffect } from "react";
import { Plus, BadgeCheck } from "lucide-react";
import { postJSON, getJSON } from "../api";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // form modal
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    department: "",
    state: "",
    benefits: "",
  });

  // scheme list
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  // fetch schemes
  const fetchSchemes = async () => {
    try {
      setLoading(true);

      const query = { page, limit };

      const res = await getJSON("/schemes", query);

      setSchemes(res.results || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error(err);
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [page]);

  // handle Add Scheme
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await postJSON("/admin/schemes/add", form);

    if (res.success) {
      setOpenModal(false);
      setForm({
        name: "",
        description: "",
        department: "",
        state: "",
        benefits: "",
      });
      fetchSchemes();
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-64 bg-white shadow-xl p-6 border-r border-green-100">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Admin Panel</h1>

        <nav className="space-y-3">
          <button className="flex items-center gap-2 w-full p-3 rounded-xl hover:bg-green-100 text-left">
            <BadgeCheck className="w-5 h-5 text-green-700" />
            <span className="font-medium">Manage Schemes</span>
          </button>

          <Link
            to={"/admin/schemes/add"}
            className="flex items-center gap-2 w-full p-3 rounded-xl hover:bg-green-100 text-left"
          >
            <Plus className="w-5 h-5 text-green-700" />
            <span className="font-medium">Add New Scheme</span>
          </Link>
        </nav>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-green-700">
            Manage Government Schemes
          </h2>
          {loading && <span className="text-xs text-gray-500">Loading...</span>}
        </div>

        {schemes.length === 0 && !loading ? (
          <p className="text-sm text-gray-500">No schemes found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {schemes.map((scheme) => (
              <Link
                to={`/admin/schemes/${scheme._id}`}
                key={scheme._id}
                className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BadgeCheck className="text-green-600" size={18} />
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {scheme.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Department:</span>{" "}
                  {scheme.department}
                </p>

                {scheme.state && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">State:</span>{" "}
                    {scheme.state}
                  </p>
                )}

                <p className="text-sm text-gray-700 line-clamp-3">
                  {scheme.description}
                </p>

                {scheme.benefits && (
                  <p className="text-sm text-green-700 font-medium mt-2">
                    Benefit: {scheme.benefits}
                  </p>
                )}

                <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition">
                  Edit Scheme
                </button>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6 text-sm">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>

    </div>
  );
};

export default AdminDashboard;
