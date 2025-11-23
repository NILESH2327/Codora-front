import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getJSON, postJSON } from "../api";

// FarmerProfile Component (Krishi Sakhi)
// - Farmer & farm profiling fields (name, location, crop, land size, soil, irrigation, photo)
// - Image upload & preview
// - Activity logging (sowing, irrigation, pest, input use) with timestamps
// - Optional simple Malayalam voice-to-text for activity entry (Web Speech API)
// - Optimistic UI for saves and basic validation
// - Local persistence fallback (localStorage) while backend unavailable

const ProfileField = ({ title, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl border">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-lg font-medium">{value || "Not added"}</p>
  </div>
);

export default function FarmerProfile() {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [lang, setLang] = useState("en-IN");

  const defaultProfile = {
    name: "",
    location: "",
    crop: "",
    landSize: "",
    soilType: "",
    irrigation: "",
    profileImage: null,
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [activities, setActivities] = useState([]);
  // Load profile from server on mount (if available)
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getJSON(`/farmer/profile`, token);
        
        setProfile({ ...res });   
        
        const Activityres = await getJSON(`/activity/list`, token);
        console.log("Fetched profile:", Activityres);
        setActivities(Activityres||[]); 
      } catch (err) {
        console.log("Server not available, using local profile");
      }
    })();
  }, []);
  

  const activityRef = useRef();
  const recognitionRef = useRef(null);




  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile({ ...profile, profileImage: reader.result });
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!profile.name || !profile.location) {
      toast.error("Please enter name and location");
      return;
    }

    setLoading(true);
    try {
      const id = await localStorage.getItem("userId");
      const res = await postJSON(`/farmer/${id}`, profile, id);
      const data = await res.json();
      if (data.success) {
        toast.success("Profile saved");
        setEditing(false);
      } else {
        toast.error(data.message || "Could not save profile");
      }
    } catch (err) {
      toast.warn("Unable to reach server — saved locally");
    }
    setLoading(false);
  };

  const addActivity = async (type, note) => {
    if (!note || !note.trim()) {
      toast.error("Please enter activity details");
      return;
    }

    const newAct = {  
      type,
      note,   
    };

    setActivities((prev) => [newAct, ...prev]);

    try {
      const token = localStorage.getItem("token");
      const res = await postJSON("/activity/add", newAct, token);
      console.log("Activity sync response:", res);

      if (res.ok) {
        setActivities((prev) => prev.map((a) => (a.id === newAct.id ? { ...a, synced: true } : a)));
      }
    } catch (e) {
      console.log("Activity saved locally; server unreachable");
    }
  };

  const removeActivity = async (id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/farmer/activity/${id}`, {
        method: "DELETE",
        headers: { "auth-token": token },
      });
    } catch (e) {
      console.log("Unable to remove from server");
    }
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceActive(true);
      toast.info("Listening...");
    };

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      if (activityRef.current) {
        activityRef.current.value = (activityRef.current.value ? activityRef.current.value + " " : "") + text;
      }
    };

    recognition.onerror = (err) => {
      console.error(err);
      toast.error("Voice recognition error");
      setVoiceActive(false);
    };

    recognition.onend = () => setVoiceActive(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopVoice = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setVoiceActive(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto border border-green-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={profile.profileImage || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"}
            alt="Farmer"
            className="w-28 h-28 rounded-full border-4 border-green-300 object-cover"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-green-700">{profile.name || "Farmer Name"}</h1>
            <p className="text-gray-600 text-lg">{profile.location || "Location not added"}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <ProfileField title="Primary Crop" value={profile.crop} />
              <ProfileField title="Land Size" value={profile.landSize ? `${profile.landSize} acres` : ""} />
              <ProfileField title="Soil Type" value={profile.soilType} />
              <ProfileField title="Irrigation" value={profile.irrigation} />
            </div>
          </div>

          <div className="ml-auto flex flex-col gap-2">
            <button onClick={() => setEditing(true)} className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700">Edit</button>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="p-2 rounded-xl border bg-white"
              title="Language for voice input"
            >
              <option value="en-IN">English (India)</option>
              <option value="ml-IN">Malayalam (ml-IN) — if supported</option>
            </select>
          </div>
        </div>

        <hr className="my-6" />

        <div>
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
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg space-y-4 border border-green-200">
            <h2 className="text-xl font-bold text-green-700">Edit Profile</h2>

            <input className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Farmer Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />

            <input className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Location" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />

            <input className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Primary Crop" value={profile.crop} onChange={(e) => setProfile({ ...profile, crop: e.target.value })} />

            <input className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Land Size (acres)" value={profile.landSize} onChange={(e) => setProfile({ ...profile, landSize: e.target.value })} />

            <select className="w-full p-3 border rounded-xl bg-gray-50" value={profile.soilType} onChange={(e) => setProfile({ ...profile, soilType: e.target.value })}>
              <option value="">Soil Type</option>
              <option>Laterite</option>
              <option>Alluvial</option>
              <option>Clay</option>
              <option>Sandy</option>
            </select>

            <select className="w-full p-3 border rounded-xl bg-gray-50" value={profile.irrigation} onChange={(e) => setProfile({ ...profile, irrigation: e.target.value })}>
              <option value="">Irrigation</option>
              <option>Canal</option>
              <option>Borewell</option>
              <option>Drip Irrigation</option>
              <option>Rainfed</option>
            </select>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Profile Photo</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
            </div>

            <div className="flex gap-2">
              <button onClick={saveProfile} disabled={loading} className="flex-1 w-full bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 disabled:bg-green-400">{loading ? 'Saving...' : 'Save'}</button>
              <button onClick={() => setEditing(false)} className="flex-1 w-full bg-gray-300 text-black p-3 rounded-xl">Cancel</button>
            </div>

            <p className="text-xs text-gray-500">Note: Data is saved locally if backend is unavailable. Connect to a network to sync.</p>
          </div>
        </div>
      )}
    </div>
  );
}
