import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaHandHoldingUsd,
} from "react-icons/fa";
import NgoSidebar from "../components/NgoSidebar";

const NgoDashboard = () => {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState(null);
  const [recentLoans, setRecentLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------------
  // FETCH STATS + RECENT LOANS
  // ------------------------
  const fetchDashboardData = async () => {
    try {
      const [statsRes, recentRes] = await Promise.all([
        fetch("http://localhost:5000/api/ngo/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/ngo/dashboard/recent", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const recentData = await recentRes.json();
      console.log("Dashboard Stats:", statsData);
        console.log("Recent Loans:", recentData);

      if (statsData.success) setStats(statsData.stats);
      if (recentData.success) setRecentLoans(recentData.loans);

    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    if (status === "approved") return "text-green-600 bg-green-100";
    if (status === "pending") return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex">
      <NgoSidebar />
      <div className="flex-1">
        <div className="min-h-screen bg-gray-50 p-6">

          <div className="max-w-7xl mx-auto">

            {/* TITLE */}
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2 mb-6">
              <FaChartLine className="text-green-600" /> NGO Dashboard
            </h1>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              <div className="p-6 bg-white rounded-2xl shadow border border-green-100 flex flex-col">
                <FaHandHoldingUsd className="text-green-600 text-3xl mb-3" />
                <span className="text-gray-500 text-sm">Total Disbursed</span>
                <span className="text-xl font-bold text-gray-800">
                  ₹{stats.totalDisbursed.toLocaleString()}
                </span>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow border border-green-100">
                <FaUsers className="text-blue-600 text-3xl mb-3" />
                <span className="text-gray-500 text-sm">Total Farmers</span>
                <span className="text-xl font-bold text-gray-800">
                  {stats.totalFarmers}
                </span>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow border border-green-100">
                <FaCheckCircle className="text-green-600 text-3xl mb-3" />
                <span className="text-gray-500 text-sm">Approved Loans</span>
                <span className="text-xl font-bold text-gray-800">
                  {stats.approved}
                </span>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow border border-green-100">
                <FaClock className="text-yellow-500 text-3xl mb-3" />
                <span className="text-gray-500 text-sm">Pending Requests</span>
                <span className="text-xl font-bold text-gray-800">
                  {stats.pending}
                </span>
              </div>
            </div>

            {/* ANALYTICS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

              {/* RECENT LOAN REQUESTS */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow border border-green-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Recent Loan Requests
                </h2>

                {recentLoans.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No loan requests found.</p>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-600 border-b">
                        <th className="pb-2">Farmer</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Purpose</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentLoans.map((loan) => (
                        <tr key={loan._id} className="border-b last:border-none">
                          <td className="py-3 font-semibold">{loan.farmerName}</td>
                          <td className="py-3">₹{loan.amount.toLocaleString()}</td>
                          <td className="py-3">{loan.purpose}</td>
                          <td className="py-3">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                                loan.status
                              )}`}
                            >
                              {loan.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

              </div>

              {/* LOAN TREND (Placeholder Graph) */}
              <div className="bg-white rounded-2xl shadow border border-green-100 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Loan Activity Trend
                </h2>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    <span>Chart Coming Soon</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default NgoDashboard;
