import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Chatbot from './pages/Chatbot';
import Knowledge from "./pages/knowledge";
import ActivityPage from './pages/ActivityPage';
import FarmerProfile from './pages/FarmerProfile';
import UpdateProfileForm from './pages/UpdateProfile';

import { LanguageProvider } from './contexts/LanguageContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllPlots from './pages/AllPlots';
import PlotDetails from './pages/PlotDetails';
import AddPlot from './pages/AddCrop';
import VerifyOtp from './pages/VerifyOtp';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

      <LanguageProvider>

        <Router>
          <ToastContainer position="bottom-right" />

          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/farmer-profile" element={<FarmerProfile />} />
                <Route path="/update-profile" element={<UpdateProfileForm />} />
                <Route path="/knowledge" element={<Knowledge />} />
                <Route path="/plot" element={<AllPlots />} />
                <Route path="/plot/:id" element={<PlotDetails />} />
                <Route path="/add-plot" element={<AddPlot />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />

              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
