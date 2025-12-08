import React, { useState, useEffect } from "react";
import { User, Clipboard, Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function FarmerForm({ onSubmit }) {
  // useLanguage must be called (not conditionally)
  const { t } = useLanguage();

  const [age, setAge] = useState(30);
  const [caste, setCaste] = useState("");
  const [otherCaste, setOtherCaste] = useState("");
  const [income, setIncome] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // reset otherCaste if caste changes
    if (caste !== "Other") setOtherCaste("");
  }, [caste]);

  const validate = () => {
    const e = {};
    const ageNum = Number(age);
    const incomeNum = Number(income);

    if (!age || Number.isNaN(ageNum)) e.age = t("ageInvalid");
    else if (ageNum < 15) e.age = t("ageMin");
    else if (ageNum > 120) e.age = t("ageUnrealistic");

    if (!caste) e.caste = t("casteRequired");
    if (caste === "Other" && !otherCaste.trim()) e.otherCaste = t("otherCasteRequired");

    if (income === "" || Number.isNaN(incomeNum)) e.income = t("incomeRequired");
    else if (incomeNum < 0) e.income = t("incomeNegative");

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setSubmitted(false);

    if (!validate()) return;

    const payload = {
      age: Number(age),
      caste: caste === "Other" ? otherCaste.trim() : caste,
      monthlyIncome: Number(income),
    };

    if (onSubmit) {
      onSubmit(payload);
    } else {
      console.log("Farmer payload:", payload);
      setSubmitted(true);
    }
  };

  return (
    <section className="py-12 bg-gray-50 min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left: Visual / header */}
            <div className="hidden md:block md:w-1/3 bg-[url('https://cdn.pixabay.com/photo/2020/01/22/16/33/rice-4785684_1280.jpg')] bg-cover bg-center">
              <div className="h-full w-full bg-gradient-to-b from-black/40 to-black/10 p-6 flex items-end">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{t("farmerDetails")}</h3>
                  <p className="text-sm opacity-90">
                    {t("personalizeSubtitle")}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="w-full md:w-2/3 p-8">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Age */}
                <div>
                  <label htmlFor="age" className="flex items-center text-sm font-medium text-gray-700">
                    <User className="mr-2 h-5 w-5 text-green-600" />
                    {t("Age")}
                  </label>
                  <input
                    id="age"
                    type="number"
                    min="0"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`mt-2 block w-full rounded-lg border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 ${errors.age ? "border-red-400" : "border-gray-200"}`}
                    placeholder={t("agePlaceholder")}
                  />
                  {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
                </div>

                {/* Caste / Category */}
                <div>
                  <label htmlFor="caste" className="flex items-center text-sm font-medium text-gray-700">
                    <Clipboard className="mr-2 h-5 w-5 text-green-600" />
                    {t("Caste")}
                  </label>

                  <select
                    id="caste"
                    value={caste}
                    onChange={(e) => setCaste(e.target.value)}
                    className={`mt-2 block w-full rounded-lg border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 ${errors.caste ? "border-red-400" : "border-gray-200"}`}
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
                      className={`mt-3 block w-full rounded-lg border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 ${errors.otherCaste ? "border-red-400" : "border-gray-200"}`}
                      placeholder={t("otherCastePlaceholder")}
                    />
                  )}

                  {errors.caste && <p className="mt-1 text-sm text-red-600">{errors.caste}</p>}
                  {errors.otherCaste && <p className="mt-1 text-sm text-red-600">{errors.otherCaste}</p>}
                </div>

                {/* Monthly Income with ₹ symbol */}
                <div>
                  <label htmlFor="income" className="flex items-center text-sm font-medium text-gray-700">
                    <span className="mr-2 h-5 w-5 text-green-600 inline-flex items-center justify-center text-base font-semibold">₹</span>
                    {t("Monthly Income")}
                  </label>
                  <input
                    id="income"
                    type="number"
                    min="0"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className={`mt-2 block w-full rounded-lg border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 ${errors.income ? "border-red-400" : "border-gray-200"}`}
                    placeholder={t("incomePlaceholder")}
                  />
                  {errors.income && <p className="mt-1 text-sm text-red-600">{errors.income}</p>}
                </div>

                {/* Submit row */}
                <div className="flex items-center justify-between">
                  <button 
                    type="submit"
                    className="inline-flex items-center mr-5 gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                  >
                    <Check className="h-4 w-4" /> {t("saveDetails")}
                  </button>

                  <p className="text-sm text-gray-500">{t("privacyNote")}</p>
                </div>

                {submitted && (
                  <div className="mt-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700">
                    {t("detailsSaved")}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
