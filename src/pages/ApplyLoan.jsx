import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRupeeSign, FaPercent, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";

const ApplyLoan = () => {
  const { ngoId } = useParams();
  const navigate = useNavigate();

  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  // ---------------- FETCH NGO DETAILS ---------------- //
  const fetchNgo = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/ngo/${ngoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) setNgo(data.ngo);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching NGO details:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgo();
  }, []);

  // ---------------- FORM SUBMIT ---------------- //
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!amount || amount <= 0) newErrors.amount = "Enter valid loan amount";
    else if (amount > ngo.maxLoan)
      newErrors.amount = `Amount cannot exceed ₹${ngo.maxLoan}`;

    if (!purpose.trim()) newErrors.purpose = "Purpose is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/loan/apply", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          ngoId,
          amount,
          purpose
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Loan Request Submitted 🎉");
        navigate("/loans"); // redirect to loan list page
      } else {
        toast.error(data.message || "Failed to apply loan");
      }

    } catch (err) {
      console.error("Loan apply error:", err);
      toast.error("Server error. Try again.");
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!ngo) return <p className="text-center py-10">NGO not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow border border-green-100">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Apply for Loan</h1>
        <p className="text-gray-500">NGO: {ngo.name}</p>

        {/* NGO LOAN DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 p-5 bg-gray-100 rounded-xl">
          
          <div className="flex items-center gap-2">
            <FaPercent className="text-green-700 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Interest Rate</p>
              <p className="font-bold">{ngo.interestRate}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-green-700 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Max Eligible Amount</p>
              <p className="font-bold">₹{ngo.maxLoan}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaClock className="text-green-700 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Processing Time</p>
              <p className="font-bold">{ngo.processingTime} days</p>
            </div>
          </div>

        </div>

        {/* CRITERIA */}
        <div className="mt-6">
          <p className="font-semibold text-gray-700">Eligibility Criteria</p>
          <p className="text-gray-500 bg-gray-50 p-3 mt-1 rounded-lg border">
            {ngo.loanCriteria}
          </p>
        </div>

        {/* APPLY FORM */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          <div>
            <label className="text-sm font-medium text-gray-600">Loan Amount (₹)</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg mt-1 bg-gray-50"
              placeholder="Enter loan amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Purpose</label>
            <textarea
              className="w-full p-3 border rounded-lg mt-1 bg-gray-50"
              placeholder="Explain why you need the loan..."
              rows="4"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            ></textarea>
            {errors.purpose && (
              <p className="text-red-600 text-sm mt-1">{errors.purpose}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition"
          >
            Submit Loan Request
          </button>
        </form>

      </div>
    </div>
  );
};

export default ApplyLoan;
