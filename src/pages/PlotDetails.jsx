import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Leaf,
  Sprout,
  CheckCircle,
} from "lucide-react";
import { getJSON } from "../api";

const PlotDetails = () => {
  // const { state: initialPlot } = useLocation();
  const { id } = useParams();

  const [plot, setPlot] = useState( null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getJSON(`/farmer/allfarms/${id}`);
        setPlot(res.farm);
        console.log(res.farm)
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load farm details");
        setLoading(false);
      }
    };

   
      fetchData();
   
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const events = useMemo(() => plot?.events ?? [], [plot]);

  const calculateHarvestDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    d.setDate(d.getDate() + 120);
    return d.toISOString().split("T")[0];
  };

  const { todayEvents, upcoming, missed, completed } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const buckets = {
      todayEvents: [],
      upcoming: [],
      missed: [],
      completed: [],
    };

    events.forEach((ev) => {
      const due = new Date(ev.dueDate);
      if (ev.isCompleted) {
        buckets.completed.push(ev);
      } else if (due < startOfToday) {
        buckets.missed.push(ev);
      } else if (due >= startOfToday && due < endOfToday) {
        buckets.todayEvents.push(ev);
      } else {
        buckets.upcoming.push(ev);
      }
    });

    Object.values(buckets).forEach((list) =>
      list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    );

    return buckets;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (activeTab === "today") return todayEvents;
    if (activeTab === "upcoming") return upcoming;
    if (activeTab === "missed") return missed;
    if (activeTab === "completed") return completed;
    return events;
  }, [activeTab, todayEvents, upcoming, missed, completed, events]);

  const statusStyles = (ev) => {
    if (ev.isCompleted)
      return {
        label: "Completed",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        chip: "bg-emerald-100 text-emerald-800",
      };
    const due = new Date(ev.dueDate);
    const now = new Date();
    if (due < new Date(now.getFullYear(), now.getMonth(), now.getDate()))
      return {
        label: "Overdue",
        bg: "bg-amber-50",
        border: "border-amber-200",
        chip: "bg-amber-100 text-amber-800",
      };
    return {
      label: "Upcoming",
      bg: "bg-sky-50",
      border: "border-sky-200",
      chip: "bg-sky-100 text-sky-800",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-green-700 font-semibold">Loading plot details…</p>
      </div>
    );
  }

  if (error || !plot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-red-600 font-semibold">
          {error || "Plot not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 pb-10">
      <div className="w-full h-[220px] bg-green-200 rounded-b-2xl shadow-md flex items-end overflow-hidden mb-8">
        <img
          src={'/bg1.jpg'}
          alt="crop"
          className="w-full h-[220px] object-cover rounded-b-2xl"
        />
      </div>

      <div className="bg-white shadow-xl mx-auto w-full max-w-2xl p-8 rounded-2xl -mt-14 relative z-10">
        <h2 className="text-3xl font-bold text-green-700 flex items-center gap-3 mb-4">
          <Leaf size={26} /> {plot.farmName || plot.plotName || "Farm"}
        </h2>

        {/* basic plot info */}
        <div className="grid gap-5 mt-4">
          <div className="flex items-center bg-green-100 p-4 rounded-xl gap-3 shadow-sm">
            <Sprout size={22} className="text-green-600" />
            <span className="text-lg">
              <strong>Crop Name: </strong>
              {plot.cropName}
            </span>
          </div>

          <div className="flex items-center bg-green-100 p-4 rounded-xl gap-3 shadow-sm">
            <CalendarIcon size={22} className="text-green-600" />
            <span className="text-lg">
              <strong>Sowing Date: </strong>
              {plot.sowingDate
                ? new Date(plot.sowingDate).toLocaleDateString()
                : "-"}
            </span>
          </div>

          <div className="flex items-center bg-green-100 p-4 rounded-xl gap-3 shadow-sm">
            <CheckCircle size={22} className="text-green-700" />
            <span className="text-lg">
              <strong>Expected Harvest: </strong>
              {calculateHarvestDate(plot.sowingDate)}
            </span>
          </div>

          <div className="flex items-center bg-green-100 p-4 rounded-xl gap-3 shadow-sm">
            <span className="text-lg">
              <strong>Variety: </strong>
              {plot.variety || "-"}
            </span>
          </div>
        </div>

        {/* Farmer Diary section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-green-700 flex items-center gap-2">
              <CalendarIcon size={22} /> Tasks 
            </h3>
            <span className="text-sm text-gray-500">
              {events.length} scheduled operations
            </span>
          </div>

          {/* tabs */}
          <div className="inline-flex rounded-full bg-green-50 p-1 text-sm mb-4">
            {[
              { id: "all", label: "All Tasks" },
              { id: "today", label: "Today" },
              { id: "upcoming", label: "Upcoming" },
              { id: "missed", label: "Missed" },
              { id: "completed", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-green-700 hover:bg-green-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* cards for filtered events */}
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <p className="text-sm text-gray-500">
                No tasks in this category yet.
              </p>
            ) : (
              filteredEvents.map((ev) => {
                const styles = statusStyles(ev);
                return (
                  <div
                    key={ev._id}
                    className={`rounded-2xl border ${styles.border} ${styles.bg} px-4 py-3 flex justify-between items-start shadow-sm`}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {ev.title}
                      </p>
                       <p className="font-semibold text-sm text-gray-800">
                        {ev.advice}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(ev.dueDate).toLocaleDateString()} •{" "}
                        {ev.type || "Task"}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.chip}`}
                    >
                      {styles.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* All events list below diary (compact) */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-green-800 mb-3">
              All Events Timeline
            </h4>
            {events.length === 0 ? (
              <p className="text-sm text-gray-500">
                No events added for this plot yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {[...events]
                  .sort(
                    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
                  )
                  .map((ev) => {
                    const styles = statusStyles(ev);
                    return (
                      <li
                        key={ev._id}
                        className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2 text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {ev.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(ev.dueDate).toLocaleDateString()} •{" "}
                            {ev.type || "Task"}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-1 rounded-full ${styles.chip}`}
                        >
                          {styles.label}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotDetails;
