import { useState } from "react";

export default function ActivityPage() {
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    date: "",
  });

  const [logs, setLogs] = useState([]);

  const handleAddActivity = () => {
    if (!activity.title || !activity.description || !activity.date) return;
    setLogs([...logs, activity]);
    setActivity({ title: "", description: "", date: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-green-800">Activity Log</h2>

      {/* Add Activity */}
      <div className="bg-white p-5 mt-4 rounded-xl shadow">
        <input
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 outline-green-700"
          type="text"
          placeholder="Activity Title"
          value={activity.title}
          onChange={(e) => setActivity({ ...activity, title: e.target.value })}
        />

        <textarea
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 outline-green-700"
          placeholder="Description"
          value={activity.description}
          onChange={(e) =>
            setActivity({ ...activity, description: e.target.value })
          }
        />

        <input
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 outline-green-700"
          type="date"
          value={activity.date}
          onChange={(e) => setActivity({ ...activity, date: e.target.value })}
        />

        <button
          className="w-full p-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
          onClick={handleAddActivity}
        >
          Add Activity
        </button>
      </div>

      <h3 className="text-2xl font-semibold mt-6">Previous Logs</h3>

      {logs.length === 0 ? (
        <p className="mt-2 text-gray-500">No activity logs yet</p>
      ) : (
        logs.map((log, index) => (
          <div
            key={index}
            className="bg-green-50 p-4 mt-3 rounded-lg border-l-4 border-green-700"
          >
            <h4 className="font-semibold">{log.title}</h4>
            <p>{log.description}</p>
            <span className="text-sm text-gray-600">{log.date}</span>
          </div>
        ))
      )}
    </div>
  );
}
