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
  Ruler,
} from "lucide-react";
import { getJSON, postJSON } from "../api";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdateProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    soilType: "",
    location: {
      latitude: "",
      longitude: "",
      district: "",
    },
    language: "ml-IN",
    irrigation: "",
    primaryCrop: "",
    landSize: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [title, settitle] = useState("Update Profile");
  const { state } = useLocation();
  const phone = state?.phone;

  // Load profile on mount
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getJSON(`/farmer/profile`, token);
        setProfile({ ...profile, ...res });
        if (phone) settitle("Complete Your Profile");
      } catch (err) {
        console.log("Server not available");
      }
    })();
  }, []);

  // Validation function
  const validateProfile = (profile) => {
    const errs = {};
    if (!profile.name.trim()) errs.name = "Name is required";

    if (!profile.email.trim()) errs.email = "Email is required";
    else if (!/^[\w-.]+@[\w-]+\.[\w-.]+$/.test(profile.email))
      errs.email = "Invalid email";

    if (!profile.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(profile.phone))
      errs.phone = "Phone must be 10 digits";

    if (!profile.primaryCrop.trim()) errs.primaryCrop = "Primary crop is required";
    if (!profile.irrigation.trim()) errs.irrigation = "Irrigation is required";

    if (!profile.landSize.trim()) errs.landSize = "Land size is required";
    else if (isNaN(Number(profile.landSize)) || Number(profile.landSize) <= 0)
      errs.landSize = "Enter a valid number";

    if (!profile.soilType.trim()) errs.soilType = "Soil type is required";

    if (!profile.location.district.trim()) errs.district = "Location is required";

    return errs;
  };

  // Auto GPS location
  const autoFillLocation = () => {
    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const long = pos.coords.longitude.toFixed(5);
        const city = await getCityName(lat, long);
        setProfile({
          ...profile,
          location: { latitude: lat, longitude: long, district: city },
        });
        setLocLoading(false);
        setErrors((prev) => ({ ...prev, district: null }));
      },
      () => {
        alert("Failed to access location");
        setLocLoading(false);
      },
      {
        enableHighAccuracy: true, // use GPS
        timeout: 10000, // wait max 10 sec
        maximumAge: 0,
      }
    );
  };

  // Submit handler
  const handleSave = async () => {
    const errs = validateProfile(profile);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);

    try {
      const res = await postJSON("/farmer/update", profile);
      console.log("Response from server:", res);
      if (res && res._id) {
        toast.success("Profile updated!");
        localStorage.setItem("isProfileComplete", "true");
        navigate("/dashboard");
        window.scrollTo(0, 0);
      }
    } catch {
      alert("Update failed!");
    }

    setLoading(false);
  };

  async function getCityName(lat, lon) {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=0c0fdbaea0ed2ec1f0f82ad4b62eea1b`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0]?.name || "";
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center pb-10 pt-10 relative"
      style={{ backgroundImage: "url('/bgAddCrop.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-30 w-full h-full"></div>

      <div className="relative p-6 max-w-4xl mx-auto bg-white bg-opacity-90 rounded-2xl shadow-lg border z-10">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">{title}</h1>
        <div className="p-8 rounded-2xl shadow-lg border grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
          <InputField
            label="Full Name"
            icon={<User className="text-green-600" />}
            value={profile.name}
            placeholder="Enter your name"
            onChange={(v) => setProfile({ ...profile, name: v })}
            error={errors.name}
          />

          <InputField
            label="Email"
            icon={<Mail className="text-green-600" />}
            value={profile.email}
            placeholder="Enter email"
            onChange={(v) => setProfile({ ...profile, email: v })}
            error={errors.email}
          />

          <InputField
            label="Phone"
            icon={<Phone className="text-green-600" />}
            value={profile.phone}
            placeholder="Phone number"
            onChange={(v) => setProfile({ ...profile, phone: v })}
            error={errors.phone}
          />

          <InputField
            label="Primary Crop"
            icon={<Sprout className="text-green-600" />}
            value={profile.primaryCrop}
            placeholder="Eg: Paddy, Banana"
            onChange={(v) => setProfile({ ...profile, primaryCrop: v })}
            error={errors.primaryCrop}
          />

          <InputField
            label="Irrigation Method"
            icon={<Droplet className="text-green-600" />}
            value={profile.irrigation}
            placeholder="Eg: Drip, Flood, Sprinkler"
            onChange={(v) => setProfile({ ...profile, irrigation: v })}
            error={errors.irrigation}
          />

          <InputField
            label="Land Size (in acres)"
            icon={<Ruler className="text-green-600" />}
            value={profile.landSize}
            placeholder="Eg: 2.5"
            onChange={(v) => setProfile({ ...profile, landSize: v })}
            error={errors.landSize}
          />

          <InputField
            label="Soil Type"
            icon={<Mountain className="text-green-600" />}
            value={profile.soilType}
            placeholder="Soil type"
            onChange={(v) => setProfile({ ...profile, soilType: v })}
            error={errors.soilType}
          />

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Location</label>
            <div
              className={`flex gap-2 border rounded-xl p-3 bg-gray-50 shadow-sm items-center ${
                errors.district ? "border-red-500" : ""
              }`}
            >
              <MapPin className="text-green-600" />
              <input
                type="text"
                className="flex-grow bg-transparent outline-none text-sm"
                placeholder="Enter location"
                value={profile.location.district}
                disabled
              />
              <button
                onClick={autoFillLocation}
                className="p-2 bg-green-200 rounded-lg text-green-800 hover:bg-green-300 transition"
              >
                {locLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
              </button>
            </div>
            {errors.district && <div className="text-xs text-red-600 mt-1">{errors.district}</div>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Preferred Language</label>
            <div className="flex items-center gap-2 border rounded-xl p-3 bg-gray-50 shadow-sm">
              <Languages className="text-green-600" />
              <select
                className="flex-grow bg-transparent outline-none text-sm"
                value={profile.language}
                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
              >
                <option value="ml">Malayalam</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleSave}
              className="w-full mt-2 bg-green-700 text-white py-3 rounded-xl shadow hover:bg-green-800 transition flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
}

/* Small Reusable Field Component */
function InputField({ label, icon, value, placeholder, onChange, error }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <div className={`flex items-center gap-2 border rounded-xl p-3 bg-gray-50 shadow-sm ${error ? "border-red-500" : ""}`}>
        {icon}
        <input
          type="text"
          className="w-full bg-transparent outline-none text-sm"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}
