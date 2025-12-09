import React, { useState, useRef, useEffect } from "react";
import {
  Upload as UploadIcon,
  Camera,
  FileImage,
  Loader,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { isAuthenticated } from "../lib/actions/authActions";
import { useNavigate } from "react-router-dom";

const DetectPesticide = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileRef = useRef(null);

  const handleFile = (file) => {
    setSelectedFile(file);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(
        "http://localhost:5000/api/advisory/detect-pesticide",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to analyze!");

      const data = await response.json();
      setResult(data);
    } catch (e) {
      toast.error("Network error, try again");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Badge colors for Allowed / Restricted / Banned
  const statusBadge = (status) => {
    if (status === "Allowed")
      return "bg-green-100 text-green-700 border-green-300";
    if (status === "Restricted")
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    if (status === "Banned")
      return "bg-red-100 text-red-700 border-red-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  const statusIcon = (status) => {
    if (status === "Allowed") return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (status === "Restricted") return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    if (status === "Banned") return <XCircle className="h-6 w-6 text-red-600" />;
    return <AlertTriangle className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pesticide Detection</h1>
          <p className="text-gray-600 text-lg">
            Upload a pesticide bottle or label image to check if it is allowed, restricted, or banned.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT: UPLOAD */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Pesticide Image</h2>

            {!previewUrl ? (
              <div
                className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-green-500"
                onClick={() => fileRef.current?.click()}
              >
                <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="font-medium text-gray-700">Drop or Choose Image</p>
                <p className="text-sm text-gray-500">Supports JPG, PNG</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
                  <img src={previewUrl} alt="preview" className="w-full object-contain max-h-80" />
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1"
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                      setResult(null);
                    }}
                  >
                    ×
                  </button>
                </div>

                <button
                  onClick={analyze}
                  disabled={isAnalyzing}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="h-5 w-5" />
                      Analyze Image
                    </>
                  )}
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* RIGHT: RESULT */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Result</h2>

            {!result && !isAnalyzing && (
              <div className="text-center text-gray-500 py-10">
                <FileImage className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                No analysis yet
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-10">
                <Loader className="h-16 w-16 mx-auto mb-4 animate-spin text-green-600" />
                <p className="text-gray-600">Analyzing pesticide image...</p>
              </div>
            )}

            {result && (
              <div className="space-y-5">

                {/* Name */}
                <div className="border-b pb-3">
                  <h3 className="text-lg font-bold text-gray-800">{result.name}</h3>

                  {/* Status badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 mt-2 rounded-full text-sm border ${statusBadge(
                      result.status
                    )}`}
                  >
                    {statusIcon(result.status)}
                    <span>{result.status}</span>
                  </div>
                </div>

                {/* Active Ingredient */}
                <div>
                  <p className="text-sm text-gray-500">Active Ingredient</p>
                  <p className="font-medium text-gray-800">
                    {result.activeIngredient || "Unknown"}
                  </p>
                </div>

                {/* Category */}
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-800">
                    {result.category || "Unknown"}
                  </p>
                </div>

                {/* Confidence */}
                <div>
                  <p className="text-sm text-gray-500">Detection Confidence</p>
                  <p className="font-medium text-gray-800">{result.confidence}%</p>
                </div>

                {/* Reason */}
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-sm text-gray-700">{result.reason}</p>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetectPesticide;
