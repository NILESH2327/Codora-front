import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJSON } from "../api";

// lucide icons
import {
  User,
  LayoutDashboard,
  Bell,
  Layers,
  PlusCircle,
  MapPin,
  Leaf,
  Mountain,
  Droplets,
  Mail,
  Phone,
  Globe,
  LogOut,
} from "lucide-react";

/* ---------------- LOCATION RENDER FUNCTION ---------------- */
function renderLocation(location) {
  if (!location) return "Location not added";

  // If backend sends object
  if (typeof location === "object") {
    return (
      <>
        <span className="font-semibold">{location.district}</span> <br />
        Lat: {location.latitude} <br />
        Lng: {location.longitude}
      </>
    );
  }

  // If it's a string
  return location;
}

export default function FarmerProfile() {
  const defaultProfile = {
    name: "",
    location: "",
    primaryCrop: "",
    landSize: "",
    soilType: "",
    irrigation: "",
    email: "",
    phone: "",
    profileImage: "",
  };

  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getJSON("/farmer/profile", token);
        setProfile(res);
      } catch (err) {
        console.log("Failed to load profile");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ---------------- RIGHT MAIN PANEL ---------------- */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">

        <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your profile, farm details, and account settings.
        </p>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">

            {/* Profile Card */}
            <div className="bg-white shadow rounded-2xl p-6 border">
              <div className="flex flex-col items-center text-center">
                <img
                  src={
                    profile.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="w-28 h-28 rounded-full border-4 border-green-500 object-cover shadow"
                  alt="Farmer"
                />
                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  {profile.name || "Farmer Name"}
                </h2>

                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <MapPin size={16} className="text-green-600" />
                  {renderLocation(profile.location)}
                </p>

                <Link
                  to="/update-profile"
                  className="mt-4 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white shadow rounded-2xl p-6 border space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Contact</h3>

              <Row icon={<Mail />} label="Email" value={profile.email} />
              <Row icon={<Phone />} label="Phone" value={profile.phone} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Farm Info */}
            <div className="bg-white shadow rounded-2xl p-6 border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Farm Details
              </h3>

              <div className="grid sm:grid-cols-2 gap-6">
                <Detail label="Primary Crop" value={profile.primaryCrop} icon={<Leaf />} />
                <Detail label="Land Size" value={profile.landSize ? `${profile.landSize} acres` : "—"} icon={<Mountain />} />
                <Detail label="Soil Type" value={profile.soilType} icon={<Mountain />} />
                <Detail label="Irrigation" value={profile.irrigation} icon={<Droplets />} />
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white shadow rounded-2xl p-6 border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Address</h3>

              <p className="text-gray-600">
                {renderLocation(profile.location)}
              </p>
            </div>

            {/* Account Settings */}
            <div className="bg-white shadow rounded-2xl p-6 border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Account Settings
              </h3>

              <div className="space-y-3">
                <SettingRow label="Language" value="English (India)" icon={<Globe />} />
                <SettingRow label="Account Type" value="Farmer" icon={<User />} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-gray-700">
      <div className="p-2 bg-gray-100 rounded-xl text-green-700">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold">{value || "—"}</p>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 border p-4 rounded-xl">
      <div className="p-2 bg-green-100 rounded-xl text-green-700">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value || "—"}</p>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 border-b pb-3">
      <div className="text-green-700">{icon}</div>
      <div>
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-gray-500">{value}</p>
      </div>
    </div>
  );
}
