import React, { useEffect, useMemo, useState } from "react";
import { getJSON, postJSON } from "../api";
import {
  FaTint,
  FaLeaf,
  FaBug,
  FaTractor,
  FaEllipsisH,
  FaCheckCircle,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from "react-toastify";

/* icon mapping (kept from your original) */
const iconsMap = {
  irrigation: <FaTint className="text-green-600" />,
  fertilization: <FaLeaf className="text-emerald-600" />,
  pesticide_application: <FaBug className="text-red-500" />,
  harvesting: <FaTractor className="text-yellow-600" />,
  other: <FaEllipsisH className="text-gray-600" />,
};

export default function ActivityDashboard() {
  const { t } = useLanguage();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [suggestions, setSuggestions] = useState([]);
  const [lastAiAt, setLastAiAt] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    setLoading(true);
    getJSON("/activity/list")
      .then((res) => {
        setActivities(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load activities", err);
        setError(t("failedLoadActivities"));
        toast.error(t("failedLoadActivities"));
      })
      .finally(() => setLoading(false));
  }, [t]);

  // derived lists
  const activityTypes = useMemo(() => {
    const s = new Set();
    activities.forEach((a) => {
      if (a.type) s.add(a.type);
    });
    return Array.from(s);
  }, [activities]);

  // top activity types (by frequency) -> for AI
  const topActivityTypes = useMemo(() => {
    const freq = {};
    activities.forEach((a) => {
      const k = a.type || "other";
      freq[k] = (freq[k] || 0) + 1;
    });
    const arr = Object.keys(freq).map((k) => ({ type: k, count: freq[k] }));
    arr.sort((a, b) => b.count - a.count);
    return arr.slice(0, 10);
  }, [activities]);

  // filtered activities for display
  const displayed = useMemo(() => {
    return activities
      .filter((a) => (filterType === "all" ? true : a.type === filterType))
      .filter((a) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          (a.note || "").toLowerCase().includes(q) ||
          (a.type || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [activities, filterType, query]);

  // helper: pretty date
  const prettyDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  // Generate AI suggestions
  const generateAiSuggestions = async () => {
    setAiLoading(true);
    setSuggestions([]);
    setLastAiAt(null);

    try {
      const res = await postJSON("/advisory/generate-suggestions");
      if (res && res.suggestions && res.suggestions.length) {
        setSuggestions(res.suggestions);
        setLastAiAt(new Date().toISOString());
      } else {
        setSuggestions([{ title: t("noSuggestionsTitle"), description: t("noSuggestionsDetail") }]);
      }
    } catch (e) {
      console.error("AI suggestion error", e);
      setSuggestions([{ title: t("aiErrorTitle"), description: t("aiErrorDetail") }]);
      toast.error(t("aiErrorToast"));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Activities (2/3 width on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t("activityDashboard")}</h2>
                <p className="text-sm text-gray-500">{t("recentOperations")}</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{activities.length}</div>
                  <div className="text-xs text-gray-500">{t("totalActivities")}</div>
                </div>
                <button
                  onClick={() => {
                    setLoading(true);
                    getJSON("/activity/list")
                      .then((r) => setActivities(r.data || []))
                      .finally(() => setLoading(false));
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md text-sm hover:shadow"
                  title={t("refresh")}
                >
                  <FaSyncAlt />
                </button>
              </div>
            </div>

            {/* controls */}
            <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4 gap-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-100"
                  />
                  <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <div className="w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
                >
                  <option value="all">{t("allTypes")}</option>
                  {activityTypes.map((tt, idx) => (
                    <option key={idx} value={tt}>
                      {t(`type_${tt}`) || tt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* timeline */}
            <div className="mt-5 divide-y">
              {loading ? (
                <div className="py-6 text-center text-gray-500">{t("loadingActivities")}</div>
              ) : displayed.length ? (
                displayed.map((act) => (
                  <div
                    key={act._id || act.timestamp + act.type}
                    className="py-4 flex items-start gap-4"
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-50 border rounded-lg">
                      <div className="text-2xl">
                        {iconsMap[act.type] || <FaCheckCircle className="text-gray-600" />}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-800 capitalize">
                          {t(`type_${act.type}`) || act.type || "other"}
                        </div>
                        <div className="text-xs text-gray-400">{prettyDate(act.timestamp)}</div>
                      </div>
                      {act.note && <div className="mt-2 text-gray-700 text-sm">{truncateText(act.note, 600)}</div>}
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="inline-block text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg">
                          {act.field ? act.field : t("fieldNA")}
                        </span>
                        <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                          {t("loggedBy")}: {act.user || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-gray-500">{t("noActivities")}</div>
              )}
            </div>
          </div>

          {/* small stats / top activities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-500">{t("uniqueTypes")}</div>
              <div className="text-lg font-semibold">{activityTypes.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-500">{t("topActivity")}</div>
              <div className="text-lg font-semibold">{topActivityTypes[0]?.type || "—"}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-500">{t("mostRecent")}</div>
              <div className="text-lg font-semibold">
                {activities[0] ? prettyDate(activities[0].timestamp) : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: AI suggestions & quick actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-md font-semibold text-gray-900">{t("aiSuggestionsTitle")}</h3>
            <p className="text-sm text-gray-500 mb-3">{t("aiSuggestionsSubtitle")}</p>

            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <div className="font-medium">{t("topActivityTypesLabel")}</div>
                <ol className="list-decimal ml-5 mt-2 text-sm">
                  {topActivityTypes.map((titem, i) => (
                    <li key={titem.type}>
                      {t(`type_${titem.type}`) || titem.type} — {titem.count}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={generateAiSuggestions}
                  disabled={aiLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                >
                  {aiLoading ? t("generating") : t("generateSuggestions")}
                </button>
                <button
                  onClick={() => {
                    setSuggestions([]);
                    setLastAiAt(null);
                  }}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  {t("clear")}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="font-semibold text-gray-900">{t("suggestions")}</h4>
            <p className="text-xs text-gray-500 mb-2">{t("suggestionsSubtitle")}</p>

            <div className="space-y-3">
              {aiLoading && <div className="text-sm text-gray-500">{t("aiThinking")}</div>}

              {!aiLoading && suggestions.length === 0 && (
                <div className="text-sm text-gray-400">{t("noSuggestionsPrompt")}</div>
              )}

              {suggestions.map((s, i) => (
                <div key={i} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-800">{s.title || `${t("suggestion")} ${i + 1}`}</div>

                    {s.confidence && (
                      <div className="text-xs text-gray-500">{Math.round(s.confidence * 100)}%</div>
                    )}
                  </div>

                  {s.description && <div className="mt-2 text-sm text-gray-700">{s.description}</div>}

                  {s.timing && (
                    <div className="mt-1 text-xs text-gray-600">
                      <span className="font-medium">{t("timing")}: </span> {s.timing}
                    </div>
                  )}

                  {s.reason && (
                    <div className="mt-1 text-xs text-gray-600">
                      <span className="font-medium">{t("reason")}: </span> {s.reason}
                    </div>
                  )}
                </div>
              ))}

              {lastAiAt && <div className="text-xs text-gray-400 mt-2">{t("lastGenerated")}: {prettyDate(lastAiAt)}</div>}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-sm text-gray-600">
            <div className="font-semibold mb-2">{t("howAiWorksTitle")}</div>
            <ul className="list-disc ml-5">
              <li>{t("howAiUsesTopAndRecent")}</li>
              <li>{t("howAiFlagsAnomalies")}</li>
              <li>{t("howAiAdvisoryNote")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* small helper (kept inside file) for note truncation */
function truncateText(str, n = 300) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "…" : str;
}
