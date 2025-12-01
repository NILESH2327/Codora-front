import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Mountain,
  Languages,
  Loader2,
  LocateFixed,
  Droplet,
  Sprout,
  Ruler
} from "lucide-react";
import { getJSON, postJSON } from "../api";
import { useNavigate } from "react-router-dom";


export default function UpdateProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    soilType: "",
    location: "",
    language: "ml-IN",
    irrigation: "",
    primaryCrop: "",
    landSize: "",
  });

  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  // Load profile on mount
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getJSON(`/farmer/profile`, token);
        setProfile({ ...profile, ...res });

      } catch (err) {
        console.log("Server not available");
      }
    })();
  }, []);

  // 📍 Auto GPS location
  const autoFillLocation = () => {
    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        setProfile({ ...profile, location: loc });
        setLocLoading(false);
      },
      () => {
        alert("Failed to access location");
        setLocLoading(false);
      }
    );
  };

  // Submit
  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await postJSON("/farmer/update", profile);
      console.log("Response from server:", res); 
    if(res && res._id) {
        alert("Profile updated!");
        navigate("/farmer-profile");
        window.scrollTo(0, 0);
      }
    } catch {
      alert("Update failed!");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-green-800 mb-5">Update Profile</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg border flex flex-col gap-5">

        {/* Name */}
        <InputField
          label="Full Name"
          icon={<User className="text-green-600" />}
          value={profile.name}
          placeholder="Enter your name"
          onChange={(v) => setProfile({ ...profile, name: v })}
        />

        {/* Email */}
        <InputField
          label="Email"
          icon={<Mail className="text-green-600" />}
          value={profile.email}
          placeholder="Enter email"
          onChange={(v) => setProfile({ ...profile, email: v })}
        />

        {/* Phone */}
        <InputField
          label="Phone"
          icon={<Phone className="text-green-600" />}
          value={profile.phone}
          placeholder="Phone number"
          onChange={(v) => setProfile({ ...profile, phone: v })}
        />

        {/* Primary Crop */}
        <InputField
          label="Primary Crop"
          icon={<Sprout className="text-green-600" />}
          value={profile.primaryCrop}
          placeholder="Eg: Paddy, Banana"
          onChange={(v) => setProfile({ ...profile, primaryCrop: v })}
        />

        {/* Irrigation */}
        <InputField
          label="Irrigation Method"
          icon={<Droplet className="text-green-600" />}
          value={profile.irrigation}
          placeholder="Eg: Drip, Flood, Sprinkler"
          onChange={(v) => setProfile({ ...profile, irrigation: v })}
        />

        {/* Land Size */}
        <InputField
          label="Land Size (in acres)"
          icon={<Ruler className="text-green-600" />}
          value={profile.landSize}
          placeholder="Eg: 2.5"
          onChange={(v) => setProfile({ ...profile, landSize: v })}
        />

        {/* Soil Type */}
        <InputField
          label="Soil Type"
          icon={<Mountain className="text-green-600" />}
          value={profile.soilType}
          placeholder="Soil type"
          onChange={(v) => setProfile({ ...profile, soilType: v })}
        />

        {/* Location with GPS */}
        <div>
          <label className="text-sm font-semibold text-gray-600">Location</label>
          <div className="flex items-center gap-2 border rounded-xl p-3 bg-gray-50 shadow-sm">
            <MapPin className="text-green-600" />

            <input
              type="text"
              className="w-full bg-transparent outline-none"
              placeholder="Enter location"
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
            />

            <button
              onClick={autoFillLocation}
              className="p-2 bg-green-200 rounded-lg text-green-800 hover:bg-green-300 transition"
            >
              {locLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LocateFixed className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="text-sm font-semibold text-gray-600">
            Preferred Language
          </label>
          <div className="flex items-center gap-2 border rounded-xl p-3 bg-gray-50 shadow-sm">
            <Languages className="text-green-600" />
            <select
              className="w-full bg-transparent outline-none"
              value={profile.language}
              onChange={(e) =>
                setProfile({ ...profile, language: e.target.value })
              }
            >
              <option value="ml">Malayalam</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSave}
          className="mt-2 bg-green-700 text-white py-3 rounded-xl shadow hover:bg-green-800 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}

/* Small Reusable Field Component */
function InputField({ label, icon, value, placeholder, onChange }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <div className="flex items-center gap-2 border rounded-xl p-3 bg-gray-50 shadow-sm">
        {icon}
        <input
          type="text"
          className="w-full bg-transparent outline-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}