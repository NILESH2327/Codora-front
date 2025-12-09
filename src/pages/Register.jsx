import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated } from "../lib/actions/authActions";
import GoogleAuth from "../components/GoogleAuth";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Default role = Farmer
  const [role, setRole] = useState("farmer");

  useEffect(() => {
    if (isAuthenticated()) {
      toast.error("Already Registered");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          password,
          role, // 🔥 send role to backend
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        navigate("/verify-otp", { state: { phone } });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Registration failed! Try again.");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pb-10 pt-10"
      style={{ backgroundImage: "url('/bg3.jpg')" }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-10 py-10 border border-green-100">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center text-white font-bold mb-2">
            K
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Krishi Sakhi</h1>
          <p className="text-sm text-gray-600 mt-2">Create your account</p>
        </div>

        {/* Form */}
        <form className="space-y-4 mt-2" onSubmit={handleRegister}>
          
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-green-200 bg-green-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              className="w-full px-3 py-2 rounded-lg border border-green-200 bg-green-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
              placeholder="Enter your phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg border border-green-200 bg-green-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Register As
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-green-200 bg-green-50 
                         focus:bg-white focus:border-green-500 focus:ring-2 
                         focus:ring-green-100 outline-none text-sm"
            >
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
              <option value="loan">NGO/ Organization</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-green-100" />
          <span className="px-3 text-xs text-gray-400 uppercase">or</span>
          <div className="flex-1 h-px bg-green-100" />
        </div>

        {/* Google Auth */}
        <GoogleAuth />

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
