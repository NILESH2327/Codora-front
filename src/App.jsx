import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
// import Chatbot from './pages/Chatbot';
import Knowledge from "./pages/Knowledge";
import ActivityPage from './pages/ActivityPage';
import FarmerProfile from './pages/FarmerProfile';
import UpdateProfileForm from './pages/UpdateProfile';
import AdminPanel from './pages/AdminPanel';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllPlots from './pages/AllPlots';
import PlotDetails from './pages/PlotDetails';
import AddPlot from './pages/AddCrop';
import VerifyOtp from './pages/VerifyOtp';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { isAuthenticated } from './lib/actions/authActions';
import FloatingChatbot from './components/FloatingChatbot';
import ActivityDashboard from './pages/ActivityDashboard';
import DetectPest from './pages/PestDetection';
import MarketTrends from './components/MarketTrends';


function App() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("this is the token ", token);
    if(token !== null) setIsLogged(true);
    else setIsLogged(false);   
  }, [])
  

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

      <LanguageProvider>

        <Router>
          <ToastContainer position="bottom-right" />

          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar isAuthenticated={isLogged} />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<Upload />} />
                {/* <Route path="/chatbot" element={<Chatbot />} /> */}
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
                <Route path="/all-activities" element={<ActivityDashboard />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/pest-detection" element={<DetectPest />} />
                <Route path='/market-trends' element={<MarketTrends/>} />
               
                


              </Routes>
            </main>

            <Footer />
          </div>
        ̌<FloatingChatbot/>
        </Router>
                </LanguageProvider>
      
    </GoogleOAuthProvider>
  );
}

export default App;
