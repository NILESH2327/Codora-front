import React, { useEffect, useState } from "react";
import {
    FaRegBuilding,
    FaPhone,
    FaMapMarkerAlt,
    FaInfoCircle,
    FaPercent,
    FaRupeeSign,
    FaClock
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getJSON } from "../api";

const UpdateNgoProfile = () => {
    const [loading, setLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        description: "",
        loanCriteria: "",
        interestRate: "",
        maxLoan: "",
        processingTime: ""
    });

    const [errors, setErrors] = useState({});

    // -------------------- VALIDATION -------------------- //
    const validate = () => {
        let temp = {};

        if (!profile.name?.trim()) temp.name = "NGO name is required";
        if (!profile.email?.trim()) temp.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(profile.email))
            temp.email = "Invalid email format";

        if (!profile.phone?.trim()) temp.phone = "Phone number required";
        else if (!/^[0-9]{10}$/.test(profile.phone))
            temp.phone = "Phone must be 10 digits";

        if (!profile.address?.trim()) temp.address = "Address required";
        if (!profile.description?.trim())
            temp.description = "NGO description required";

        if (!profile.loanCriteria?.trim())
            temp.loanCriteria = "Eligibility criteria required";

        if (!profile.interestRate)
            temp.interestRate = "Interest rate required";
        else if (profile.interestRate < 1 || profile.interestRate > 30)
            temp.interestRate = "Rate must be 1% - 30%";

        if (!profile.maxLoan)
            temp.maxLoan = "Maximum loan amount required";

        if (!profile.processingTime)
            temp.processingTime = "Processing time required";

        setErrors(temp);

        return Object.keys(temp).length === 0;
    };

    // -------------------- FETCH PROFILE FROM BACKEND -------------------- //
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getJSON("/ngo/profile");

                if (data.success) {
                    const ngo = data.ngo;

                    setProfile({
                        name: ngo.name || "",
                        email: ngo.email || "",
                        phone: ngo.phone || "",
                        address: ngo.address || "",
                        description: ngo.description || "",
                        loanCriteria: ngo.loanCriteria || "",
                        interestRate: ngo.interestRate || "",
                        maxLoan: ngo.maxLoan || "",
                        processingTime: ngo.processingTime || ""
                    });

                    toast.success("Profile loaded successfully");
                }
            } catch (err) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // -------------------- AUTO CHECK COMPLETION -------------------- //
    useEffect(() => {
        if (!loading) {
            setIsComplete(validate());
        }
    }, [profile, loading]);

    // -------------------- SAVE PROFILE -------------------- //
    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please fix all errors");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/ngo/update", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profile)
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Profile successfully updated!");
                window.location.href = "/ngo/dashboard";
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (err) {
            toast.error("Server error");
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-center text-lg font-semibold text-gray-600">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="flex">
            <div className="flex-1 p-6 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-green-100">

                    {/* Title */}
                    <h1 className="text-3xl font-extrabold mb-6 text-gray-800 flex items-center gap-2">
                        <FaRegBuilding className="text-green-600" /> Complete Your NGO Profile
                    </h1>

                    {!isComplete && (
                        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg mb-6 border-l-4 border-yellow-600">
                            Complete all fields before accessing the dashboard.
                        </div>
                    )}

                    {/* FORM GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <Field
                            label="NGO Name"
                            icon={<FaRegBuilding />}
                            value={profile.name}
                            error={errors.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />

                        <Field
                            label="Email"
                            icon={<FaInfoCircle />}
                            value={profile.email}
                            error={errors.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />

                        <Field
                            label="Phone"
                            icon={<FaPhone />}
                            value={profile.phone}
                            error={errors.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />

                        <Field
                            label="Address"
                            icon={<FaMapMarkerAlt />}
                            value={profile.address}
                            error={errors.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        />

                    </div>

                    {/* Description */}
                    <TextAreaField
                        label="About NGO"
                        value={profile.description}
                        error={errors.description}
                        onChange={(e) =>
                            setProfile({ ...profile, description: e.target.value })
                        }
                    />

                    {/* Loan Terms */}
                    <h2 className="text-xl font-bold mt-10 mb-4 text-gray-800">
                        Loan Policy & Terms
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <TextAreaField
                            label="Eligibility Criteria"
                            value={profile.loanCriteria}
                            error={errors.loanCriteria}
                            onChange={(e) =>
                                setProfile({ ...profile, loanCriteria: e.target.value })
                            }
                        />

                        <Field
                            label="Interest Rate (%)"
                            icon={<FaPercent />}
                            type="number"
                            value={profile.interestRate}
                            error={errors.interestRate}
                            onChange={(e) =>
                                setProfile({ ...profile, interestRate: e.target.value })
                            }
                        />

                        <Field
                            label="Maximum Loan Amount (₹)"
                            icon={<FaRupeeSign />}
                            type="number"
                            value={profile.maxLoan}
                            error={errors.maxLoan}
                            onChange={(e) =>
                                setProfile({ ...profile, maxLoan: e.target.value })
                            }
                        />

                        <Field
                            label="Processing Time (Days)"
                            icon={<FaClock />}
                            type="number"
                            value={profile.processingTime}
                            error={errors.processingTime}
                            onChange={(e) =>
                                setProfile({ ...profile, processingTime: e.target.value })
                            }
                        />

                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSubmit}
                        className={`w-full mt-8 py-3 rounded-lg font-bold transition 
                        ${isComplete
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                        disabled={!isComplete}
                    >
                        Save Profile
                    </button>

                </div>
            </div>
        </div>
    );
};

const Field = ({ label, icon, value, onChange, error, type = "text" }) => (
    <div>
        <label className="text-sm text-gray-600 font-medium">{label}</label>
        <div className="flex items-center bg-gray-100 p-2 rounded mt-1">
            <span className="text-gray-500 mr-2">{icon}</span>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full bg-transparent outline-none"
            />
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const TextAreaField = ({ label, value, onChange, error }) => (
    <div className="col-span-2">
        <label className="text-sm text-gray-600 font-medium">{label}</label>
        <textarea
            value={value}
            rows={3}
            onChange={onChange}
            className="w-full bg-gray-100 p-3 rounded outline-none mt-1"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export default UpdateNgoProfile;
