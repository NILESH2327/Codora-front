import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated, onLogin } from "../lib/actions/authActions";
import GoogleAuth from "../components/GoogleAuth";
import { postJSON } from "../api";

const Login = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
  }, []);
  const navigate = useNavigate();

  const [phone, setphone] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      toast.error("Already Logged In");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await postJSON("/auth/login", { phone, password, isAdmin });

      if (data.success) {
        console.log("Login successful:", data);
        const role = data.role;
        onLogin({ id: data.userId, token: data.token, isAdmin ,role : data.role});
        toast.success(data.message);

        setTimeout(() => {
          if (isAdmin) {
            window.location.href = "/admin/dashboard";
          } else if(role === 'buyer'){
            toast.info("Redirecting to Marketplace...");
            window.location.href = "/market/buyer";
          }else if(role === 'loan'){
            toast.info("Redirecting to Loan Mediator Page...");
            window.location.href = "/ngo/profile/update";  
      
          } else {
            window.location.href = "/dashboard";
          }
        }, 800);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen url flex items-center justify-center px-4 pb-10 pt-10" style={{ backgroundImage: "url('/bg2.jpg')" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-10 py-10 border border-green-100">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-6">
          {/* Replace with your logo if you have one */}
          <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center text-white font-bold mb-2">
            K
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Krishi Sakhi</h1>
          <p className="text-sm text-gray-600 mt-2">
            Sign in to your account
          </p>
          <p className="text-xs text-gray-400">
            Welcome back! Please enter your details
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4 mt-2" onSubmit={handleLogin}>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 rounded-lg border border-green-200 bg-green-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
              placeholder="+ 98765 43210"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg border border-green-200 bg-green-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Admin checkbox + optional forgot password */}
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className="w-4 h-4 rounded border-green-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">Login as Admin</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-green-100" />
          <span className="px-3 text-xs text-gray-400 uppercase">
            or
          </span>
          <div className="flex-1 h-px bg-green-100" />
        </div>

        {/* Google button */}
        <div className="mb-1">
          <GoogleAuth />
        </div>

        {/* Bottom link */}
        <p className="text-xs text-center text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
