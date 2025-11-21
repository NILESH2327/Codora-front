// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { postJSON } from "../api";
// import { onLogin } from "../lib/actions/authActions";

// const Login = () => {
//     const [form, setForm] = useState({email: "", password: "" });
//       const handleChange = (e) =>
//           setForm({ ...form, [e.target.name]: e.target.value });

//     const handleSubmit = async (e)=>{
//       e.preventDefault();
//       console.log(form);
//       const res = await postJSON('/auth/login', form );
//       if(res.status===400){
//         alert(res.message);
//       }
//       console.log(res.data)
//       onLogin(res.data.token, res.data.farmerId);
//       alert('Login Succesful');

//       return window.location.replace('/');
//     }


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
//       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-green-100">

//         <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
//           Login
//         </h2>

//         <form className="space-y-5" onChange={handleChange} onSubmit={handleSubmit}>
//           <div>
//             <label className="block text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
//               placeholder="Enter your email"
//               name="email"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               name="password"
//               className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
//               placeholder="Enter your password"
//             />
//           </div>

//           <button className="w-full bg-green-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all">
//             Login
//           </button>
//         </form>

//         <p className="text-sm text-center text-gray-600 mt-4">
//           New user?{" "}
//           <Link to="/register" className="text-green-600 font-semibold">
//             Register
//           </Link>
//         </p>

//         <p className="text-xs text-green-700 text-center mt-2">
//           ✔ Check your email for verification
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { onLogin } from "../lib/actions/authActions";

const Login = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        console.log(data);
        onLogin({ id: data.farmerId, token: data.token });
        toast.success(data.message); // Success Notification


        setTimeout(() => {
          navigate("/dashboard");
          window.location.reload(); // refresh the page
        }, 1000);

      } else {
        toast.error(data.message); // Error Notification
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
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
      </div>
    </div>
  );
};

export default Login;
