import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated, onLogin } from "../lib/actions/authActions";
import GoogleAuth from "../components/GoogleAuth";
import { postJSON } from "../api";

const Login = () => {
  const navigate = useNavigate();

  const [phone, setphone] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log(isAuthenticated());
    if (isAuthenticated()) {
      toast.error("Already Registered");
      navigate('/dashboard')
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await postJSON("/auth/login", { phone, password, isAdmin });

      if (data.success) {
        onLogin({ id: data.userId, token: data.token, isAdmin });

        toast.success(data.message);

        setTimeout(() => {
          if (isAdmin) {
            window.location.href = "/admin/dashboard";
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
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-green-100">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Login
        </h2>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="phone"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter your phone"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ADMIN CHECKBOX */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="admin"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
              className="w-4 h-4 accent-green-600"
            />
            <label htmlFor="admin" className="text-gray-700">
              Login as Admin
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          New user?{" "}
          <Link to="/register" className="text-green-600 font-semibold">
            Register
          </Link>
        </p>

        <GoogleAuth />
      </div>
    </div>
  );
};

export default Login;
