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

const DetectPest = () => {
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

  // 🔥 Analyze Image with token + formData
  const analyzeImage = async () => {
    if (!selectedFile) {
      toast.error(t("selectFileFirst"));
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error(t("fileTooLarge"));
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/advisory/detect-pest-disease",
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
      console.log("Pest Analysis Result:", result);
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisResult({
        Pest: t("networkError"),
        confidence: 0,
        severity: t("unknown"),
        treatment: [],
        prevention: [t("analysisNetworkError") + ": " + err.message],
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {t("pestDetection.title")}
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {t("pestDetection.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                {t("uploadImage.title")}
              </h2>

              {!previewUrl ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      fileInputRef.current?.click();
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                >
                  <UploadIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />

                  <p className="text-lg font-medium text-gray-700 mb-1">
                    {t("uploadArea.dropOrClick")}
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    {t("uploadArea.supports")}
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                    <button
                      type="button"
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Camera className="h-4 w-4" />
                      <span>{t("uploadButtons.takePhoto")}</span>
                    </button>

                    <button
                      type="button"
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <FileImage className="h-4 w-4" />
                      <span>{t("uploadButtons.chooseFile")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="relative overflow-hidden rounded-lg shadow-sm">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />

                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                        setAnalysisResult(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                    >
                      ×
                    </button>
                  </div>

                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full flex justify-center items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                        {t("analyzing")}
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        {t("analyzeButton")}
                      </>
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                {t("analysisResults.title")}
              </h2>

              <div className="flex-1 overflow-auto">
                {!analysisResult && !isAnalyzing && (
                  <div className="text-center py-12">
                    <FileImage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {t("analysisResults.empty")}
                    </p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-12">
                    <Loader className="h-16 w-16 text-green-600 mx-auto animate-spin mb-4" />
                    <p className="text-gray-600">{t("analysisProgress")}</p>
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-6 pb-4">
                    
                    {/* Pest Name */}
                    <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <h3 className="font-semibold text-orange-900">
                          Detected Pest
                        </h3>
                      </div>

                      <p className="text-lg font-bold text-orange-900">
                        {analysisResult.Pest}
                      </p>

                      <p className="text-sm text-orange-700 mt-1">
                        Confidence: {analysisResult.confidence}% | Severity:{" "}
                        {analysisResult.severity}
                      </p>
                    </div>

                    {/* Treatment */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        Treatment Recommendations
                      </h3>

                      <ul className="space-y-2">
                        {analysisResult.treatment?.length ? (
                          analysisResult.treatment.map((step, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="text-gray-700 text-sm">
                                {step}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-600">
                            No treatment available.
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Prevention Tips
                      </h3>

                      <ul className="space-y-2">
                        {analysisResult.prevention?.length ? (
                          analysisResult.prevention.map((tip, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2"></span>
                              <span className="text-gray-700 text-sm">
                                {tip}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-600">
                            No prevention tips available.
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* NEW: Pesticides */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Recommended Pesticides
                      </h3>

                      <ul className="space-y-2">
                        {analysisResult.Pesticides?.length ? (
                          analysisResult.Pesticides.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                              <span className="text-gray-700 text-sm">
                                {item}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-600">
                            No pesticides recommended.
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* NEW: Quantity */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Recommended Quantity
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {analysisResult.Quantity ||
                          "No quantity information available."}
                      </p>
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

export default DetectPest;
