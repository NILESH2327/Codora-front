import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getJSON } from "../api";
import { Link } from "react-router-dom";

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

import { useLanguage } from "../contexts/LanguageContext";

/* ---------------- LOCATION RENDER FUNCTION ---------------- */
function renderLocation(location, t) {
  if (!location) return t("locationNotAdded");

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
  const { t } = useLanguage();
  const [lang, setLang] = useState("en-IN");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
  }, []);

  const defaultProfile = {
    name: "",
    location: "",
    primaryCrop: "",
    landSize: "",
    soilType: "",
    irrigation: "",
    profileImage: null,
    email: "",
    phone: "",
  };

  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getJSON("/farmer/profile", token);
        setProfile(res || defaultProfile);
      } catch (err) {
        console.log("Failed to load profile", err);
        toast.error(t("failedLoadProfile"));
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ---------------- RIGHT MAIN PANEL ---------------- */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800">{t("profileSettings")}</h1>
        <p className="text-gray-500 mt-1">{t("profileManage")}</p>

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
                  alt={profile.name || t("farmerNamePlaceholder")}
                />
                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  {profile.name || t("farmerNamePlaceholder")}
                </h2>

                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <MapPin size={16} className="text-green-600" />
                  <span>{renderLocation(profile.location, t)}</span>
                </p>

                <Link
                  to="/update-profile"
                  className="mt-4 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700"
                >
                  {t("editProfile")}
                </Link>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white shadow rounded-2xl p-6 border space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">{t("contact")}</h3>

              <Row icon={<Mail />} label="email" value={profile.email} />
              <Row icon={<Phone />} label="phone" value={profile.phone} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Farm Info */}
            <div className="bg-white shadow rounded-2xl p-6 border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("farmDetails")}</h3>

              <div className="grid sm:grid-cols-2 gap-6">
                <Detail label="primaryCrop" value={profile.primaryCrop} icon={<Leaf />} />
                <Detail
                  label="landSize"
                  value={profile.landSize ? `${profile.landSize} ${t("acres")}` : "—"}
                  icon={<Mountain />}
                />
                <Detail label="soilType" value={profile.soilType} icon={<Mountain />} />
                <Detail label="irrigation" value={profile.irrigation} icon={<Droplets />} />
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white shadow rounded-2xl p-6 border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("address")}</h3>

              <p className="text-gray-600">{renderLocation(profile.location, t)}</p>
            </div>

            {/* Account Settings */}
            <div className="bg-white shadow rounded-2xl p-6 border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("accountSettings")}</h3>

              <div className="space-y-3">
                <SettingRow label="language" value={t("englishIndia")} icon={<Globe />} />
                <SettingRow label="accountType" value={t("farmer")} icon={<User />} />
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
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3 text-gray-700">
      <div className="p-2 bg-gray-100 rounded-xl text-green-700">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{t(label)}</p>
        <p className="font-semibold">{value || "—"}</p>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-4 bg-gray-50 border p-4 rounded-xl">
      <div className="p-2 bg-green-100 rounded-xl text-green-700">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{t(label)}</p>
        <p className="text-lg font-semibold text-gray-800">{value || "—"}</p>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, value }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-4 border-b pb-3">
      <div className="text-green-700">{icon}</div>
      <div>
        <p className="font-semibold text-gray-700">{t(label)}</p>
        <p className="text-gray-500">{value}</p>
      </div>
    </div>
  );
}
