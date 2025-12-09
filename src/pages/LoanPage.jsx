import React, { useEffect, useState } from "react";
import { FaUser, FaRupeeSign, FaInfoCircle, FaSeedling } from "react-icons/fa";
import { toast } from "react-toastify";
import NgoSidebar from "../components/NgoSidebar";

const LoanRequests = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // --------------------- FETCH LOAN REQUESTS --------------------- //
  const fetchLoans = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ngo/requests", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      console.log("Loan requests fetched:", data);

      if (data.success) {
        setLoans(data.requests);
      } else {
        toast.error(data.message || "Failed to fetch requests");
      }
    } catch (error) {
      toast.error("Server error loading loan requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // --------------------- UPDATE STATUS (APPROVE) --------------------- //
  const approveLoan = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/loan/approve/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Loan approved!");
        fetchLoans(); // refresh data
      } else {
        toast.error("Failed to approve");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  // --------------------- UPDATE STATUS (DECLINE) --------------------- //
  const declineLoan = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/loan/decline/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Loan declined");
        fetchLoans(); // refresh data
      } else {
        toast.error("Failed to decline");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  // --------------------- STATUS BADGES --------------------- //
  const getStatusBadge = (status) => {
    if (status === "approved")
      return <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-semibold">Approved</span>;
    if (status === "declined")
      return <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full font-semibold">Declined</span>;
    return <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full font-semibold">Pending</span>;
  };

  if (loading) {
    return (
      <div className="flex">
        <NgoSidebar />
        <div className="flex-1 p-10 text-center text-lg text-gray-700">
          Loading loan requests...
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <NgoSidebar />

      <div className="flex-1">
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">

            <h1 className="text-3xl font-extrabold mb-6 text-gray-800 flex items-center gap-2">
              <FaSeedling className="text-green-600" /> Loan Requests
            </h1>

            {loans.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No loan requests found.</p>
            ) : (
              <div className="space-y-5">
                {loans.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">

                      {/* Left Section */}
                      <div className="space-y-1">
                        <p className="flex items-center gap-2 text-lg font-bold text-gray-800">
                          <FaUser className="text-green-600" />
                          {req.farmerName}
                        </p>

                        <p className="flex items-center gap-2 text-gray-700">
                          <FaRupeeSign />
                          <span className="font-medium">Amount:</span> ₹{req.amount}
                        </p>

                        <p className="flex items-center gap-2 text-gray-700">
                          <FaInfoCircle />
                          <span className="font-medium">Purpose:</span> {req.purpose}
                        </p>

                        <p className="mt-1">{getStatusBadge(req.status)}</p>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col gap-2">

                        <button
                          onClick={() => approveLoan(req._id)}
                          disabled={req.status !== "pending"}
                          className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                            req.status !== "pending"
                              ? "bg-green-300 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => declineLoan(req._id)}
                          disabled={req.status !== "pending"}
                          className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                            req.status !== "pending"
                              ? "bg-red-300 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          Decline
                        </button>

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanRequests;
