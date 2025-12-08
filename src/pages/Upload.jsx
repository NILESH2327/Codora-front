import React, { useState, useRef, useEffect } from "react";
import {
  Upload as UploadIcon,
  Camera,
  FileImage,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { isAuthenticated } from "../lib/actions/authActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Upload = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error(t("pleaseLoginFirst"));
      navigate("/login");
    }
  }, [navigate, t]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // 🔥 SEND IMAGE TO BACKEND
  const analyzeImage = async () => {
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File too large");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/advisory/detect-crop-disease",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to analyze image");

      const result = await response.json();
      console.log("Analysis:", result);
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisResult({
        disease: "Network error",
        confidence: 0,
        severity: "Unknown",
        stage: "Unknown",
        treatment: [],
        prevention: [],
        Fertilizers: [],
        Quantity: "",
        quantityPerUnit: "",
        totalQuantity: "",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-8 relative"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2021/09/18/02/27/vietnam-6634082_1280.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[3px]"></div>

      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4">

          {/* PAGE HEADING */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t("cropDetection.title")}</h1>
            <p className="text-xl text-gray-600">{t("cropDetection.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* UPLOAD CARD */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">{t("uploadImage.title")}</h2>

              {!previewUrl ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-400"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700">{t("uploadArea.dropOrClick")}</p>
                  <p className="text-sm text-gray-500">{t("uploadArea.supports")}</p>

                  <div className="mt-4 flex justify-center space-x-4">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2">
                      <Camera className="h-4 w-4" />
                      <span>{t("uploadButtons.takePhoto")}</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border rounded-lg flex items-center space-x-2"
                    >
                      <FileImage className="h-4 w-4" />
                      <span>{t("uploadButtons.chooseFile")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <div className="relative w-full rounded-lg overflow-hidden bg-gray-100">
                    <img src={previewUrl} className="w-full max-h-80 object-contain" alt="preview" />
                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                        setAnalysisResult(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full"
                    >
                      ×
                    </button>
                  </div>

                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>{t("analyzing")}</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        <span>{t("analyzeButton")}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>

            {/* RESULTS CARD */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">{t("analysisResults.title")}</h2>

              <div className="max-h-[70vh] overflow-auto">

                {!analysisResult && !isAnalyzing && (
                  <div className="text-center py-12">
                    <FileImage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{t("analysisResults.empty")}</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-12">
                    <Loader className="h-16 w-16 text-green-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">{t("analysisProgress")}</p>
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-6">

                    {/* --- DISEASE CARD --- */}
                    <div className="border border-orange-200 bg-orange-50 p-5 rounded-xl shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-orange-900">
                            {t("analysisResults.diseaseDetected")}
                          </h3>

                          <p className="text-xl font-bold text-orange-900 mt-1">
                            {analysisResult.disease}
                          </p>

                          <p className="text-orange-700 text-sm mt-1">
                            Confidence: {analysisResult.confidence}% | Severity: {analysisResult.severity}
                          </p>

                          {/* NEW: DISEASE STAGE */}
                          <p className="text-blue-700 text-sm font-medium mt-1">
                            Stage: {analysisResult.stage || "Unknown"}
                          </p>

                          {/* Confidence bar */}
                          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div
                              style={{ width: `${analysisResult.confidence}%` }}
                              className="h-2 bg-green-500 rounded-full"
                            ></div>
                          </div>

                          {/* Per-acre dose */}
                          {analysisResult.quantityPerUnit &&
                            analysisResult.quantityPerUnit.trim() !== "" && (
                              <>
                                <p className="mt-4 text-sm font-semibold text-gray-700">
                                  Dose (per acre):
                                </p>
                                <p className="text-sm text-gray-800">
                                  {analysisResult.quantityPerUnit}
                                </p>

                                {analysisResult._personalization?.usedFallback && (
                                  <div className="mt-2 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 inline-block">
                                    Estimated fallback dose used
                                  </div>
                                )}
                              </>
                            )}

                          {/* Quantity Description */}
                          {analysisResult.Quantity && (
                            <p className="mt-3 text-xs text-gray-700">
                              <strong>Details:</strong> {analysisResult.Quantity}
                            </p>
                          )}

                          {/* Note */}
                          {analysisResult.note && (
                            <p className="mt-2 text-xs italic text-gray-500">{analysisResult.note}</p>
                          )}
                        </div>

                        {/* Total Quantity */}
                        {analysisResult.totalQuantity &&
                          analysisResult.totalQuantity.trim() !== "" && (
                            <div className="text-right">
                              <div className="bg-white border border-orange-100 px-3 py-2 rounded-full shadow">
                                <p className="text-xs text-gray-500">Total for your land</p>
                                <p className="font-bold text-sm">
                                  {analysisResult.totalQuantity}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* TREATMENT */}
                    <div className="bg-white border rounded-xl p-5 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        {t("analysisResults.treatmentRecommendations")}
                      </h3>

                      {analysisResult.treatment?.length ? (
                        <ul className="space-y-2">
                          {analysisResult.treatment.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </div>
                              <p className="text-sm text-gray-700">{step}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No treatment available.</p>
                      )}
                    </div>

                    {/* PREVENTION */}
                    <div className="bg-white border rounded-xl p-5 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        {t("analysisResults.preventionTips")}
                      </h3>

                      {analysisResult.prevention?.length ? (
                        <ul className="space-y-2">
                          {analysisResult.prevention.map((tip, idx) => (
                            <li key={idx} className="flex gap-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                              <p className="text-sm text-gray-700">{tip}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No prevention available.</p>
                      )}
                    </div>

                    {/* FERTILIZERS */}
                    <div className="bg-white border rounded-xl p-5 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-3">Recommended Fertilizers</h3>

                      {analysisResult.Fertilizers?.length ? (
                        <ul className="space-y-2">
                          {analysisResult.Fertilizers.map((f, idx) => (
                            <li key={idx} className="flex gap-3">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                              <p className="text-sm text-gray-700">{f}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No fertilizer recommendations.</p>
                      )}
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
