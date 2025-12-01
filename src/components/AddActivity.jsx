import React, { useState } from "react";
import { postJSON } from "../api";
import { toast } from "react-toastify";
import { useLanguage } from "../contexts/LanguageContext";

export default function AddActivity() {
  const defaultform = { type: "", date: "", note: "" };
  const [form, setForm] = useState(defaultform);

  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await postJSON("/activity/add", form);

    if (res.farmerId) {
      toast.success(t("ActivitySuccess"));
      setForm(defaultform);
    } else {
      toast.error(t("ActivityFailed"));
    }
  };

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <form
      onSubmit={handleSubmit}
      onChange={onChange}
      className="
        w-full max-w-5xl mx-auto
        bg-white/90 border border-green-100 shadow-sm
        rounded-2xl md:rounded-full
        px-4 py-3
        flex flex-col gap-3
        md:flex-row md:items-center md:gap-3
      "
    >
      {/* Label + icon */}
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm">
          +
        </span>
        <span className="text-xs font-semibold text-gray-800">
          {t("Log activity")}
        </span>
      </div>

      {/* Type */}
      <div className="flex-1 w-full">
        <select
          name="type"
          value={form.type}
          className="w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-green-200"
        >
          <option value="">{t("Type")}</option>
          <option value="irrigation">{t("Irrigation")}</option>
          <option value="fertilization">{t("Fertilization")}</option>
          <option value="pesticide_application">{t("Pesticide")}</option>
          <option value="harvesting">{t("Harvesting")}</option>
          <option value="sowing">{t("Sowing")}</option>
          <option value="spraying">{t("Spraying")}</option>
          <option value="pest">{t("Pest Issue")}</option>
          <option value="Weatherimpact">{t("Weather Impact")}</option>
          <option value="Weeding">{t("Weeding")}</option>
          <option value="other">{t("Other")}</option>
        </select>
      </div>

      {/* Date */}
      <div className="w-full md:w-32">
        <input
          name="date"
          type="date"
          value={form.date}
          className="w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-green-200"
        />
      </div>

      {/* Note */}
      <div className="flex-1 w-full">
        <input
          name="note"
          value={form.note}
          placeholder={t("NotePlaceholder")}
          className="w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-green-200"
        />
      </div>

      {/* Button */}
      <div className="w-full md:w-auto">
        <button
          type="submit"
          className="w-full md:w-20 rounded-full bg-green-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-green-700 transition-colors"
        >
          {t("Save")}
        </button>
      </div>
    </form>
  );
}
