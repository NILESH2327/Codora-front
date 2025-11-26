import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { onLogin } from "../lib/actions/authActions";  
import GoogleAuth from "../components/GoogleAuth";
import { postJSON } from "../api";

const Login = () => {
  const navigate = useNavigate();

  const [phone, setphone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await postJSON('/auth/login',{ phone, password } );
   

      if (data.success) {
        
        onLogin({ id: data.farmerId, token: data.token });

        toast.success(data.message);
        setTimeout(() => window.location.href = "/dashboard", 1000);

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
      <GoogleAuth/>
      </div>
    </div>
  );
};

export default Login;
