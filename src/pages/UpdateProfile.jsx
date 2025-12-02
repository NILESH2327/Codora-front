import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
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
import { toast } from "react-toastify";
import { useLanguage } from "../contexts/LanguageContext";

export default function UpdateProfilePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const navigate = useNavigate();
  const { t } = useLanguage();
  const { state } = useLocation();
  const phone = state?.phone;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: phone || "",
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

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getJSON("/farmer/profile", token);
        if (res) setProfile((prev) => ({ ...prev, ...res }));
      } catch (err) {
        console.log("Server not available", err);
        toast.error(t("serverNotAvailable"));
      }
    })();
  }, []);

  // Validation uses translated messages
  const validateProfile = (p) => {
    const errs = {};
    if (!p.name?.trim()) errs.name = t("nameRequired");

    if (!p.email?.trim()) errs.email = t("emailRequired");
    else if (!/^[\w-.]+@[\w-]+\.[\w-.]+$/.test(p.email))
      errs.email = t("invalidEmail");

    if (!p.phone?.trim()) errs.phone = t("phoneRequired");
    else if (!/^\d{10}$/.test(p.phone)) errs.phone = t("phoneInvalid");

    if (!p.primaryCrop?.trim()) errs.primaryCrop = t("primaryCropRequired");
    if (!p.irrigation?.trim()) errs.irrigation = t("irrigationRequired");

    if (!String(p.landSize || "").trim()) errs.landSize = t("landSizeRequired");
    else if (isNaN(Number(p.landSize)) || Number(p.landSize) <= 0)
      errs.landSize = t("landSizeInvalid");

    if (!p.soilType?.trim()) errs.soilType = t("soilTypeRequired");

    if (!p.location?.district?.trim()) errs.district = t("locationRequired");

    return errs;
  };

  // Auto GPS location
  const autoFillLocation = () => {
    setLocLoading(true);

    if (!navigator.geolocation) {
      toast.error(t("geolocationNotSupported"));
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude.toFixed(5);
          const long = pos.coords.longitude.toFixed(5);
          const city = await getCityName(lat, long);
          setProfile((prev) => ({
            ...prev,
            location: { latitude: lat, longitude: long, district: city },
          }));
          setErrors((prev) => ({ ...prev, district: null }));
        } catch (err) {
          toast.error(t("failedDetectLocation"));
        } finally {
          setLocLoading(false);
        }
      },
      () => {
        toast.error(t("failedAccessLocation"));
        setLocLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
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
      if (res && (res._id || res.success)) {
        toast.success(t("profileUpdated"));
        localStorage.setItem("isProfileComplete", "true");
        navigate("/dashboard");
        window.scrollTo(0, 0);
      } else {
        toast.error(t("updateFailed"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("updateFailed"));
    }
    setLoading(false);
  };

  async function getCityName(lat, lon) {
    // keep your API key or replace with environment variable
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=0c0fdbaea0ed2ec1f0f82ad4b62eea1b`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0]?.name || "";
  }

  const title = phone ? t("completeProfile") : t("updateProfile");

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center pb-10 pt-10 relative"
      style={{ backgroundImage: "url('/bgAddCrop.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-30 w-full h-full"></div>

      <div className="relative p-6 max-w-4xl mx-auto w-2xl bg-white bg-opacity-90 rounded-2xl shadow-lg border z-10">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
          {title}
        </h1>

        <div className="p-8 rounded-2xl shadow-lg border grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
          <InputField
            labelKey="fullName"
            icon={<User className="text-green-600" />}
            value={profile.name}
            placeholderKey="enterYourName"
            onChange={(v) => setProfile({ ...profile, name: v })}
            error={errors.name}
          />

          <InputField
            labelKey="emailLabel"
            icon={<Mail className="text-green-600" />}
            value={profile.email}
            placeholderKey="enterEmail"
            onChange={(v) => setProfile({ ...profile, email: v })}
            error={errors.email}
          />

          <InputField
            labelKey="phoneLabel"
            icon={<Phone className="text-green-600" />}
            value={profile.phone}
            placeholderKey="phonePlaceholder"
            onChange={(v) => setProfile({ ...profile, phone: v })}
            error={errors.phone}
          />

          <InputField
            labelKey="primaryCropLabel"
            icon={<Sprout className="text-green-600" />}
            value={profile.primaryCrop}
            placeholderKey="primaryCropPlaceholder"
            onChange={(v) => setProfile({ ...profile, primaryCrop: v })}
            error={errors.primaryCrop}
          />

          <InputField
            labelKey="irrigationLabel"
            icon={<Droplet className="text-green-600" />}
            value={profile.irrigation}
            placeholderKey="irrigationPlaceholder"
            onChange={(v) => setProfile({ ...profile, irrigation: v })}
            error={errors.irrigation}
          />

          <InputField
            labelKey="landSizeLabel"
            icon={<Ruler className="text-green-600" />}
            value={profile.landSize}
            placeholderKey="landSizePlaceholder"
            onChange={(v) => setProfile({ ...profile, landSize: v })}
            error={errors.landSize}
          />

          <InputField
            labelKey="soilTypeLabel"
            icon={<Mountain className="text-green-600" />}
            value={profile.soilType}
            placeholderKey="soilTypePlaceholder"
            onChange={(v) => setProfile({ ...profile, soilType: v })}
            error={errors.soilType}
          />

          {/* Location with GPS */}
          <div>
            <label className="text-sm font-semibold text-gray-600">{t("locationLabel")}</label>
            <div className="flex flex-col gap-1 border rounded-xl p-3 bg-gray-50 shadow-sm">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-grow bg-transparent outline-none text-sm"
                  placeholder={t("detectYourLocation")}
                  value={
                    profile.location.district
                      ? `${profile.location.district} (${profile.location.latitude}, ${profile.location.longitude})`
                      : ""
                  }
                  disabled
                />
                <button
                  type="button"
                  onClick={autoFillLocation}
                  disabled={locLoading}
                  className={`p-2 rounded-lg text-green-800 transition flex items-center justify-center
                    ${locLoading ? "bg-green-100 cursor-not-allowed" : "bg-green-200 hover:bg-green-300"}`}
                >
                  {locLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <LocateFixed className="w-5 h-5" />
                  )}
                </button>
              </div>

              {!profile.location.district && (
                <p className="text-[11px] text-gray-500">{t("tapGpsToDetect")}</p>
              )}
            </div>
            {errors.district && (
              <div className="text-xs text-red-600 mt-1">{errors.district}</div>
            )}
          </div>

          {/* Preferred Language */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">
              {t("preferredLanguageLabel")}
            </label>
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
              type="button"
              onClick={handleSave}
              className="w-full mt-2 bg-green-700 text-white py-3 rounded-xl shadow hover:bg-green-800 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("saveChanges")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small Reusable Field Component */
function InputField({ labelKey, icon, value, placeholderKey, onChange, error }) {
  const { t } = useLanguage();
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600">{t(labelKey)}</label>
      <div className={`flex items-center gap-2 border rounded-xl p-3 bg-gray-50 shadow-sm ${error ? "border-red-500" : ""}`}>
        {icon}
        <input
          type="text"
          className="w-full bg-transparent outline-none text-sm"
          placeholder={t(placeholderKey)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}
