import React, { useState } from "react";
import { FaRegBuilding, FaPhone, FaMapMarkerAlt, FaInfoCircle, FaPercent, FaRupeeSign, FaClock } from "react-icons/fa";
import NgoSidebar from "../components/NgoSidebar";
import { useEffect } from "react";
import { getJSON } from "../api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const NgoProfile = () => {
    const [profile, setProfile] = useState({
        name: "Green Future Foundation",
        email: "greenfuture@ngo.org",
        phone: "9876543210",
        address: "Delhi, India",
        description: "We help farmers access micro loans and financial support.",
        loanCriteria: "Small & marginal farmers, low-income groups, self-help groups.",
        interestRate: "7.5",
        maxLoan: "100000",
        processingTime: "7"
    });

    const fetchProfile = async () => {
        // Fetch profile from backend (dummy for now)
        // You can implement actual fetch logic here
        const fetchedProfile = await getJSON("/ngo/profile");
        if (fetchedProfile.success) {
            setProfile(fetchedProfile.ngo);
            toast.success("Profile loaded successfully");
        }


    }

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSubmit = () => {
        alert("Profile Saved (Dummy)");
    };

    return (
        <div className="flex">
            <NgoSidebar />
            <div className="flex-1">
                <div className="min-h-screen bg-gray-50 p-6">

                    <div className="max-w-4xl mx-auto">

                        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 flex items-center gap-2">
                            <FaRegBuilding className="text-green-600" /> NGO Profile
                        </h1>

                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">

                            {/* TOP SECTION */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <label className="text-sm text-gray-600 font-medium">NGO Name</label>
                                    <div className="flex items-center bg-gray-100 p-2 rounded">
                                        <FaRegBuilding className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 font-medium">Email</label>
                                    <div className="flex items-center bg-gray-100 p-2 rounded">
                                        <FaInfoCircle className="text-gray-500 mr-2" />
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 font-medium">Phone</label>
                                    <div className="flex items-center bg-gray-100 p-2 rounded">
                                        <FaPhone className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 font-medium">Address</label>
                                    <div className="flex items-center bg-gray-100 p-2 rounded">
                                        <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            value={profile.address}
                                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <label className="text-sm text-gray-600 font-medium">About NGO</label>
                                <textarea
                                    value={profile.description}
                                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                    className="w-full bg-gray-100 p-3 rounded outline-none mt-1"
                                    rows="3"
                                />
                            </div>

                            {/* LOAN DETAILS */}
                            <h2 className="text-xl font-bold mt-10 mb-4 text-gray-800">
                                Loan Policy & Terms
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Loan Criteria */}
                                <div>
                                    <label className="text-sm text-gray-600 font-medium">
                                        Eligibility / Loan Criteria
                                    </label>
                                    <textarea
                                        value={profile.loanCriteria}
                                        onChange={(e) => setProfile({ ...profile, loanCriteria: e.target.value })}
                                        className="w-full bg-gray-100 p-3 rounded outline-none mt-1"
                                        rows="3"
                                    />
                                </div>

                                {/* Interest Rate */}
                                <div>
                                    <label className="text-sm text-gray-600 font-medium">Interest Rate (%)</label>
                                    <div className="flex items-center bg-gray-100 p-2 rounded mt-1">
                                        <FaPercent className="text-gray-500 mr-2" />
                                        <input
                                            type="number"
                                            value={profile.interestRate}
                                            onChange={(e) => setProfile({ ...profile, interestRate: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Max Loan Amount */}
                                <div>
                                    <label className="text-sm text-gray-600 font-medium">Maximum Loan Amount (₹)</label>
                                    <div className="flex items-center bg-gray-100 p-2 rounded mt-1">
                                        <FaRupeeSign className="text-gray-500 mr-2" />
                                        <input
                                            type="number"
                                            value={profile.maxLoan}
                                            onChange={(e) => setProfile({ ...profile, maxLoan: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Processing Time */}
                                <div>
                                    <label className="text-sm text-gray-600 font-medium">Loan Processing Time (Days)</label>
                                    <div className="flex items-center bg-gray-100 p-2 rounded mt-1">
                                        <FaClock className="text-gray-500 mr-2" />
                                        <input
                                            type="number"
                                            value={profile.processingTime}
                                            onChange={(e) => setProfile({ ...profile, processingTime: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Save Button */}
                            <Link
                                // onClick={handleSubmit}
                                to="/ngo/profile/update"
                                className="w-full bg-green-600 text-white py-3 rounded-lg mt-8 font-bold hover:bg-green-700 transition"
                            >
                                Save Profile
                            </Link>

                        </div>

                    </div>

                </div>
            </div>
        </div>

    );
};

export default NgoProfile;
