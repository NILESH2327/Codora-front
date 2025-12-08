import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import "leaflet/dist/leaflet.css";


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

import FertilizerGuidance from "./pages/FertilizerGuidance";
import SoilScanner from './pages/SoilScanner';
import NearbyAgriServices from './pages/NearbyAgriService';

// YOUR ROUTES (from HEAD)
import TwilioInvite from './pages/TwilioInvite';
import CommodityMarketplace from './pages/MarketPlace';
import RequirementDetails from './pages/Requirements';
import Schemes from './pages/Schemes';
import SellBuyForm from './pages/SellBuyForm';
import SchemeEligible from './pages/schemesEligible';
import SchemeForm from './pages/AddScheme';
import SchemeDetailPage from './pages/SchemePage';
import AdminDashboard from './pages/AdminDashboard';
import PesticideRestrictionChecker from './pages/PesticideRestrictionChecker';

// NEW ROUTE FROM GITHUB
import CropCalendar from "./components/CropCalendar";
import UpdateScheme from './components/UpdateScheme';
import { ModifyOrdersPage } from './pages/ModifyOrders';
import ViewTools from './pages/ViewTools';
import Chatbot from './pages/KnowledgeEngine';
import AddCropEvent from './pages/AddCropEvent';

function App() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("this is the token ", token);
    if (token !== null) setIsLogged(true);
    else setIsLogged(false);
  }, [])

  return (
    <GoogleOAuthProvider clientId="145908921972-5nv0rla1inn6b7msb0svfvn4qp0n25hq.apps.googleusercontent.com">
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
                <Route path="/farmer-profile" element={<FarmerProfile />} />
                <Route path="/update-profile" element={<UpdateProfileForm />} />
                <Route path="/knowledge-engine" element={<Knowledge />} />
                <Route path="/tools" element={<ViewTools />} />

                {/* PLOTS */}
                <Route path="/farms" element={<AllPlots />} />
                <Route path="/farms/:id" element={<PlotDetails />} />
                <Route path="/farms/add" element={<AddPlot />} />

                {/* OTP */}
                <Route path="/verify-otp" element={<VerifyOtp />} />

                {/* ACTIVITY */}
                <Route path="/Activity" element={<ActivityDashboard />} />

                {/* ADMIN */}
                <Route path="/admin-panel" element={<AdminPanel />} />

                {/* PEST & MARKET */}
                <Route path="/pest-detection" element={<DetectPest />} />
                <Route path='/market-trends' element={<MarketTrends />} />

                {/* TWILIO */}
                <Route path="/twilio-invite" element={<TwilioInvite />} />

                {/* SCHEMES */}
                <Route path="/schemes" element={<Schemes />} />
                <Route path="/SchemesEligible" element={<SchemeEligible />} />
                <Route path="/schemes/add" element={<SchemeForm />} />
                <Route path='/schemes/:id' element={<SchemeDetailPage />} />

                {/* MARKETPLACE */}
                <Route path='/market-place' element={<CommodityMarketplace />} />
                <Route path='/market-place/create-requirement' element={<SellBuyForm />} />
                <Route path="/requirements/edit/:edit" element={<SellBuyForm />} />
                <Route path="/requirements/:id" element={<RequirementDetails />} />
                <Route path="/market/farmer" element={<ModifyOrdersPage />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/schemes/add" element={<SchemeForm />} />
                <Route path="/admin/schemes/:schemeId" element={<UpdateScheme/>} />
               
                

                {/* NEW GITHUB ROUTE */}
                <Route path='/crop-calender' element={<CropCalendar/>}/>
                {/* Fertilizer Guidance */}
                <Route path="/fertilizer-guidance" element={<FertilizerGuidance />} />

                {/* Soil Scanner */}
                <Route path="/soil-scanner" element={<SoilScanner />} />

                {/* Nearby service*/}
                <Route path="/nearby-service" element={<NearbyAgriServices />} />
                <Route path='/chatbot' element={<Chatbot/>}/>
                


                <Route path="/pestisides-scanner" element={<PesticideRestrictionChecker />} />
                <Route path='/add-crop-event' element={<AddCropEvent/>}/>






              </Routes>
            </main>
            

            <Footer />
          </div>

          <FloatingChatbot />
        </Router>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
