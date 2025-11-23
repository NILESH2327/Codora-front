import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE
  : "http://localhost:5000/api";

// POST JSON
export async function postJSON(path, body, token) {
  try {
    const res = await axios.post(
      `${API_BASE}${path}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );

    console.log("this is the res from api js", res);
    return res.data;
  } catch (err) {
    console.error("POST Error:", err);
    throw (err.response?.data || err);
  }
}

// GET JSON
export async function getJSON(path, token) {
  try {
    const res = await axios.get(
      `${API_BASE}${path}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );

    return res.data;
  } catch (err) {
    console.error("GET Error:", err);
    throw (err.response?.data || err);
  }
}
