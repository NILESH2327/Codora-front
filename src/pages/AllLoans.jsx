import React, { useEffect, useState } from "react";
import { FaSearch, FaRupeeSign, FaPercent, FaClock } from "react-icons/fa";

const AllNgos = () => {
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedNgo, setSelectedNgo] = useState(null);
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  // --------------------- FETCH NGOs --------------------- //
  const fetchNgos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/loan/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("NGOs fetched:", data);

      if (data.success) {
        setNgos(data.loans);
        setFilteredNgos(data.loans);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching NGOs:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  // --------------------- SEARCH FILTER --------------------- //
  useEffect(() => {
    let filtered = ngos;

    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (ngo) =>
          ngo.name.toLowerCase().includes(searchText.toLowerCase()) ||
          ngo.description.toLowerCase().includes(searchText.toLowerCase()) ||
          ngo.address.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredNgos(filtered);
  }, [searchText, ngos]);

  // --------------------- OPEN MODAL --------------------- //
  const openLoanModal = (ngo) => {
    setSelectedNgo(ngo);
    setLoanAmount("");
    setLoanPurpose("");
    setErrors({});
    setModalOpen(true);
  };

  // --------------------- APPLY LOAN --------------------- //
  const submitLoan = async () => {
    const newErrors = {};

    if (!loanAmount || loanAmount <= 0)
      newErrors.amount = "Enter valid loan amount";

    if (loanAmount > selectedNgo.maxLoan)
      newErrors.amount = `Amount exceeds NGO limit (₹${selectedNgo.maxLoan})`;

    if (!loanPurpose.trim())
      newErrors.purpose = "Purpose is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/loan/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ngoId: selectedNgo._id,
          amount: loanAmount,
          purpose: loanPurpose,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Loan request submitted!");
        setModalOpen(false);
      } else {
        alert(data.message || "Failed to submit loan");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">NGOs Offering Loans</h1>
        <p className="text-gray-500 mt-1">Choose an NGO to apply for a loan</p>
      </div>

      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow border border-green-100">

        {/* SEARCH BAR */}
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full md:w-1/3 mb-6">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search NGO..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
        </div>

        {/* NGO TABLE */}
        {loading ? (
          <p className="text-center py-4 text-gray-600">Loading NGOs...</p>
        ) : filteredNgos.length === 0 ? (
          <p className="text-center py-4 text-gray-600">No NGOs found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="pb-3">NGO</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Criteria</th>
                <th className="pb-3">Interest</th>
                <th className="pb-3">Max Loan</th>
                <th className="pb-3">Processing</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredNgos.map((ngo) => (
                <tr key={ngo._id} className="border-b last:border-none">

                  <td className="py-3 font-semibold">{ngo.name}</td>

                  <td className="py-3">
                    <p>{ngo.phone}</p>
                    <p className="text-sm text-gray-500">{ngo.email}</p>
                  </td>

                  <td className="py-3 text-sm">{ngo.loanCriteria}</td>

                  <td className="py-3 flex items-center gap-1 text-green-700 font-bold">
                    <FaPercent /> {ngo.interestRate}%
                  </td>

                  <td className="py-3 flex items-center gap-1">
                    <FaRupeeSign /> {ngo.maxLoan}
                  </td>

                  <td className="py-3 flex items-center gap-1">
                    <FaClock /> {ngo.processingTime} days
                  </td>

                  <td className="py-3">
                    <button
                      onClick={() => openLoanModal(ngo)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      Apply
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

      {/* ---------------- MODAL ---------------- */}
      {modalOpen && selectedNgo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">

            <h2 className="text-xl font-bold text-gray-800">
              Apply for Loan - {selectedNgo.name}
            </h2>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-600">Amount (₹)</label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg mt-1 bg-gray-50"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-600">Purpose</label>
              <textarea
                rows="3"
                className="w-full p-3 border rounded-lg mt-1 bg-gray-50"
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
              />
              {errors.purpose && (
                <p className="text-red-600 text-sm mt-1">{errors.purpose}</p>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={submitLoan}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Submit Application
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AllNgos;
