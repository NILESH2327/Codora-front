// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { postJSON } from "../api";
// import { onLogin } from "../lib/actions/authActions";

// const Register = () => {
//   const [form, setForm] = useState({ name: "", phone: "", password: "" });
//     const handleChange = (e) =>
//         setForm({ ...form, [e.target.name]: e.target.value });


//   const onSubmit = async (e) => {
//     e.preventDefault();
//     console.log(form);
//     const res = await postJSON('/auth/register', form );
//     if(res.status===400){
//       alert(res.message);
//     }
//     console.log(res.data);    
//     alert('Sign Up Succesful');
//     return window.location.replace('/login');
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

//         <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
//           Create Your Account
//         </h2>

//         <form className="space-y-4" onChange={handleChange} onSubmit={onSubmit}>
//           <div>
//             <label className="block text-gray-700 font-semibold mb-1">Name</label>
//             <input
//               name="name"
//               type="text"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
//               placeholder="Enter your name"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-semibold mb-1">phone</label>
//             <input
//               type="phone"
//               name="phone"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
//               placeholder="Enter your phone"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-semibold mb-1">Password</label>
//             <input
//               type="password"
//               name="password"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
//               placeholder="Enter your password"
//             />
//           </div>

//           <p className="text-sm text-gray-500 text-center">
//             Check your phone after registration.
//           </p>

//           <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
//             Register
//           </button>
//         </form>

//         <p className="text-center text-gray-600 mt-4">
//           Already have an account?{" "}
//           <Link to="/login" className="text-green-600 font-semibold hover:underline">
//             Login
//           </Link>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Register;


import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated } from "../lib/actions/authActions";
import VerifyOtp from "./VerifyOtp";
import GoogleAuth from "../components/GoogleAuth";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(isAuthenticated());
    if (isAuthenticated()) {
      toast.error("Already Registered");
      navigate('/dashboard')
    }
  }, [])

  // State for form fields
  const [name, setName] = useState("");
  const [phone, setphone] = useState("");
  const [password, setPassword] = useState("");

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        toast.success(data.message); //success toast
        navigate("/verify-otp", { state: { phone } });
      } else {
        toast.error(data.message); //error toast
      }
    } catch (error) {
      toast.error("Registration failed! Try again.");
    }
  };

  return (


    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Create Your Account
        </h2>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">phone</label>
            <input
              type="phone"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Enter your phone"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            Login
          </Link>
        </p>

      

        <GoogleAuth/>

      </div>
    </div>





  );
};

export default Register;
