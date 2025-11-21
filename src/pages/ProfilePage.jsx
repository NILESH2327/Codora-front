import { useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    crop: "",
    soil: "",
    irrigation: "",
    location: "",
  });

  const handleSave = () => {
    alert("Profile saved!");
    console.log(profile);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-green-800">Farmer Profile</h2>

      <div className="bg-white p-5 mt-4 rounded-xl shadow">
        <input
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 outline-green-700"
          type="text"
          placeholder="Crop Type"
          value={profile.crop}
          onChange={(e) => setProfile({ ...profile, crop: e.target.value })}
        />

        <input
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 outline-green-700"
          type="text"
          placeholder="Soil Type"
          value={profile.soil}
          onChange={(e) => setProfile({ ...profile, soil: e.target.value })}
        />

        <input
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 outline-green-700"
          type="text"
          placeholder="Irrigation Method"
          value={profile.irrigation}
          onChange={(e) =>
            setProfile({ ...profile, irrigation: e.target.value })
          }
        />

        <input
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 outline-green-700"
          type="text"
          placeholder="Location"
          value={profile.location}
          onChange={(e) =>
            setProfile({ ...profile, location: e.target.value })
          }
        />

        <button
          onClick={handleSave}
          className="w-full p-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
