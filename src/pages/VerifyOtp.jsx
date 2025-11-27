import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postJSON } from "../api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const phone = state?.phone;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [resending, setResending] = useState(false);


  // Countdown effect

  // Redirect if no phone found
  useEffect(() => {
    if (!phone) {
      toast.error("No phone number found");
      navigate("/register");
    }
  }, [phone, navigate]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // Only digits or empty

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleClear = () => {
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const handleSubmit = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      return toast.error("Enter 6-digit OTP");
    }

    try {
      const res = await postJSON('/auth/verify', { phone, otp: code });
      const data = res;
    

      if (data.success) {
        toast.success("OTP Verified!");
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    }
  };

  const resendOtp = async () => {
    setResending(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("OTP resent successfully.");      
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (e) {
      console.log('this is the errow while sending', e);
      toast.error("Server error. Please try again.");
    }
    setResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">Verify OTP</h2>
        <p className="text-gray-600 mb-6">
          OTP sent to <b>{phone}</b>
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-xl border-2 border-gray-300 rounded-lg text-center focus:outline-none focus:border-green-500 transition-shadow duration-300 shadow-sm focus:shadow-lg"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mb-4 text-gray-600">
          <span>Didn't receive the OTP?</span>

          <button
            className="text-green-600 font-semibold hover:underline disabled:text-gray-400"
            onClick={resendOtp}
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        <button
          onClick={handleSubmit}
        
          className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${otp.every(d => d !== "") ?          "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
        >
          Verify OTP
        </button>

        <button
          onClick={handleClear}
          className="w-full mt-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:underline"
        >
          Clear OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
