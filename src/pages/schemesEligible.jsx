import React, { useState, useEffect } from "react";
import { User, Clipboard, Check, BadgeCheck } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { getJSON, postJSON } from "../api"; // ⭐ IMPORT BACKEND CALL

export default function FarmerForm({ onSubmit }) {
  const { t } = useLanguage();

  const [age, setAge] = useState(30);
  const [caste, setCaste] = useState("");
  const [otherCaste, setOtherCaste] = useState("");
  const [income, setIncome] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [loading, setLoading] = useState(false); // ⭐ loader
  const [apiError, setApiError] = useState("");

  const dummySchemes = [
    {
      _id: "scheme1",
      name: "PM-Kisan Samman Nidhi",
      department: "Agriculture & Farmers Welfare",
      state: "Kerala",
      description:
        "Income support of ₹6000/year to eligible farmer families, payable in 3 installments.",
      benefits: "₹6,000 yearly support",
    },
    {
      _id: "scheme2",
      name: "Kisan Credit Card (KCC)",
      department: "NABARD",
      state: "All India",
      description:
        "Ensures farmers have timely access to credit with low interest rates.",
      benefits: "Low-interest crop loans",
    },
  ];

  useEffect(() => {
    if (caste !== "Other") setOtherCaste("");
  }, [caste]);

  const validate = () => {
    const e = {};
    const ageNum = Number(age);
    const incomeNum = Number(income);

    if (!age || isNaN(ageNum)) e.age = t("ageInvalid");
    else if (ageNum < 15) e.age = t("ageMin");
    else if (ageNum > 120) e.age = t("ageUnrealistic");

    if (!caste) e.caste = t("casteRequired");
    if (caste === "Other" && !otherCaste.trim())
      e.otherCaste = t("otherCasteRequired");

    if (income === "" || isNaN(incomeNum)) e.income = t("incomeRequired");
    else if (incomeNum < 0) e.income = t("incomeNegative");

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBackendCall = async (payload) => {
    setLoading(true);
    setApiError("");

    try {
      const res = await postJSON("/schemes/eligible", payload); // ⭐ BACKEND CALL
      console.log("this is the response" , res);


      if (res && res.eligibleSchemes) {
        setEligibleSchemes(res.eligibleSchemes);
        console.log("This is the eligible" , eligibleSchemes)
      } else {
        setEligibleSchemes([]);
      }
    } catch (error) {
      console.error("API Error:", error);

      // fallback to dummy schemes
      setApiError("Unable to fetch schemes, showing dummy results.");
      setEligibleSchemes(dummySchemes);
    }

    setLoading(false);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitted(false);

    if (!validate()) return;

    const payload = {
      age: Number(age),
      caste: caste === "Other" ? otherCaste.trim() : caste,
      "income": Number(income),
    };

    console.log("This is the payload" , payload);

    

    await handleBackendCall(payload);
    setSubmitted(true);
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        {/* FORM UI */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="hidden md:block md:w-1/3 bg-[url('https://cdn.pixabay.com/photo/2020/01/22/16/33/rice-4785684_1280.jpg')] bg-cover bg-center">
              <div className="h-full bg-gradient-to-b from-black/40 to-black/10 p-6 flex items-end">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{t("farmerDetails")}</h3>
                  <p className="text-sm opacity-90">{t("personalizeSubtitle")}</p>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="w-full md:w-2/3 p-8">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* AGE */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="mr-2 h-5 w-5 text-green-600" />
                    {t("Age")}
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`mt-2 w-full border px-4 py-3 rounded-lg ${
                      errors.age ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.age && <p className="text-red-600 text-sm">{errors.age}</p>}
                </div>

                {/* CASTE */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Clipboard className="mr-2 h-5 w-5 text-green-600" />
                    {t("Caste")}
                  </label>

                  <select
                    value={caste}
                    onChange={(e) => setCaste(e.target.value)}
                    className={`mt-2 w-full border px-4 py-3 rounded-lg ${
                      errors.caste ? "border-red-400" : "border-gray-300"
                    }`}
                  >
                    <option value="">{t("selectPlaceholder")}</option>
                    <option value="General">{t("general")}</option>
                    <option value="OBC">{t("obc")}</option>
                    <option value="SC">{t("sc")}</option>
                    <option value="ST">{t("st")}</option>
                    <option value="Other">{t("other")}</option>
                  </select>

                  {caste === "Other" && (
                    <input
                      type="text"
                      value={otherCaste}
                      onChange={(e) => setOtherCaste(e.target.value)}
                      className={`mt-3 w-full border px-4 py-3 rounded-lg ${
                        errors.otherCaste ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder={t("otherCastePlaceholder")}
                    />
                  )}

                  {errors.caste && <p className="text-red-600 text-sm">{errors.caste}</p>}
                  {errors.otherCaste && (
                    <p className="text-red-600 text-sm">{errors.otherCaste}</p>
                  )}
                </div>

                {/* INCOME */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <span className="mr-2 text-green-600">₹</span>
                    {t("Monthly Income")}
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className={`mt-2 w-full border px-4 py-3 rounded-lg ${
                      errors.income ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.income && <p className="text-red-600 text-sm">{errors.income}</p>}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700"
                >
                  <Check size={18} />
                  {loading ? t("Loading...") : t("Get Eligible Schemes")}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {submitted && (
          <div className="mt-10">
            {apiError && (
              <p className="text-yellow-600 mb-2 text-sm">{apiError}</p>
            )}

            <h2 className="text-2xl font-bold text-green-700 mb-4">
              {t("Eligible Schemes")}
            </h2>

            {eligibleSchemes.length === 0 ? (
              <p className="text-gray-500 text-sm">No schemes found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {eligibleSchemes.map((scheme) => (
                  <div
                    key={scheme._id}
                    className="bg-white border p-4 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BadgeCheck className="text-green-600" />
                      <h3 className="text-lg font-semibold">{scheme.name}</h3>
                    </div>

                    <p className="text-xs text-gray-600">
                      <b>Department:</b> {scheme.department}
                    </p>
                    <p className="text-xs text-gray-600">
                      <b>State:</b> {scheme.state}
                    </p>

                    <p className="text-xs text-gray-700 mt-2">
                      {scheme.description}
                    </p>

                    <p className="text-sm font-medium text-green-700 mt-2">
                      Benefit: {scheme.benefits}
                    </p>

                    <button className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg text-sm">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}