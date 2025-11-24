import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getJSON, postJSON } from "../api";
import { Link } from "react-router-dom";
import { Bell, Droplets, Layers, Leaf, MapPin, Mountain, PlusCircle, User } from "lucide-react";


export default function FarmerProfile() {

  const [lang, setLang] = useState("en-IN");

  const defaultProfile = {
    name: "",
    location: "",
    crop: "",
    landSize: "",
    soilType: "",
    irrigation: "",
    profileImage: null,
    primaryCrop: ""
  };

  const [profile, setProfile] = useState(defaultProfile);

  // Load profile from server on mount (if available)
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getJSON(`/farmer/profile`, token);
        console.log(res)
        setProfile({ ...res });

      } catch (err) {
        console.log("Server not available, using local profile");
      }
    })();
  }, []);


  /* Small reusable card */
  function DetailCard({ icon, title, value }) {
    return (
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border shadow-sm">
        <div className="p-2 bg-green-100 rounded-full">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-lg font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen p-6  from-green-50 to-green-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg  mx-auto  border-green-200">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 ">

          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={
                profile.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              }
              alt="Farmer"
              className="w-28 h-28 rounded-full border-4 border-green-400 shadow-md object-cover"
            />
          </div>

          {/* Profile Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-green-800">
              {profile.name || "Farmer Name"}
            </h1>

            <p className="text-gray-700 text-lg flex items-center gap-2 mt-1">
              <MapPin size={18} className="text-green-600" />
              {profile.location || "Location not added"}
            </p>

            {/* Grid Fields */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

              <DetailCard icon={<Leaf className="text-green-600" />} title="Primary Crop" value={profile.primaryCrop || "—"} />

              <DetailCard
                icon={<Mountain className="text-green-600" />}
                title="Land Size"
                value={profile.landSize ? `${profile.landSize} acres` : "—"}
              />

              <DetailCard icon={<Mountain className="text-green-600" />} title="Soil Type" value={profile.soilType || "—"} />

              <DetailCard icon={<Droplets className="text-green-600" />} title="Irrigation" value={profile.irrigation || "—"} />

            </div>
          </div>

          {/* Edit + Language
          <div className="ml-auto flex flex-col gap-3 w-full md:w-auto">

            <button
              onClick={() => setEditing(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-xl shadow hover:bg-green-700 transition"
            >
              Edit
            </button>

            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="p-2 rounded-xl border bg-white shadow-sm"
            >
              <option value="en-IN">English (India)</option>
              <option value="ml-IN">Malayalam (ml-IN)</option>
            </select>
          </div> */}
        </div>


       <div className="p-6">

          {/* Menu Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">

            {/* Update Profile */}
            <Link to={'/update-profile'}
              // onClick={onUpdateProfile}
              className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
            >
              <User className="text-green-700 w-10 h-10 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Update Profile</h3>
              <p className="text-gray-500 text-sm mt-1">Edit crop, soil, irrigation & location</p>
            </Link>

            {/* Notifications */}
            <div
              // onClick={onViewNotifications}
              className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
            >
              <Bell className="text-green-700 w-10 h-10 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
              <p className="text-gray-500 text-sm mt-1">View alerts & updates</p>
            </div>

            {/* Show Plots */}
            <Link
              to={'/plot'}
              className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
            >
              <Layers className="text-green-700 w-10 h-10 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Show Plots</h3>
              <p className="text-gray-500 text-sm mt-1">See all your farm plots</p>
            </Link>
            
            {/* Add Plots */}
            <Link
              to={'/add-plot'}              
              className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
            >
              <PlusCircle className="text-green-700 w-10 h-10 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Add Plots</h3>
              <p className="text-gray-500 text-sm mt-1">Add your Plots</p>
            </Link>

          </div>
        </div>

        {/* <div>
          <h2 className="text-xl font-semibold text-green-700">Activity Summary</h2>
          <p className="text-gray-600 mt-2">Log sowing, irrigation, pest issues, input use or any notes in simple language.</p>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border">
              <label className="text-gray-700 font-medium">Add Activity</label>

              <div className="mt-2 flex gap-2">
                <select id="atype" className="p-2 rounded-xl border w-40" defaultValue="Sowing">
                  <option>Sowing</option>
                  <option>Irrigation</option>
                  <option>Pest</option>
                  <option>Input</option>
                  <option>Other</option>
                </select>

                <div className="flex-1">
                  <textarea ref={activityRef} placeholder="Write activity in Malayalam or English" className="w-full p-3 border rounded-xl bg-gray-50" rows={3}></textarea>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {!voiceActive ? (
                  <button onClick={startVoice} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Start Voice</button>
                ) : (
                  <button onClick={stopVoice} className="px-4 py-2 rounded-xl bg-red-500 text-white">Stop</button>
                )}

                <button
                  onClick={() => {
                    const type = document.getElementById("atype").value;
                    const note = activityRef.current ? activityRef.current.value : "";
                    addActivity(type, note);
                    if (activityRef.current) activityRef.current.value = "";
                  }}
                  className="ml-auto bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                >
                  Add Activity
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border h-full flex flex-col">
              <label className="text-gray-700 font-medium">Recent Activities</label>

              <div className="mt-3 overflow-y-auto" style={{ maxHeight: 220 }}>
                {activities.length === 0 ? (
                  <div className="h-28 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">No activity recorded yet</div>
                ) : (
                  activities.map((a) => (
                    <div key={a.id} className="p-3 my-2 rounded-xl border flex items-start justify-between">
                      <div>
                        <div className="text-sm text-gray-500">{new Date(a.timestamp).toLocaleString()}</div>
                        <div className="font-medium">{a.type}</div>
                        <div className="text-gray-700">{a.note}</div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className={`text-xs px-2 py-1 rounded-full ${a.synced ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {a.synced ? 'Synced' : 'Local'}
                        </div>
                        <button onClick={() => removeActivity(a.id)} className="text-sm text-red-500">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div> */}
      </div>


    </div>
  );
}
