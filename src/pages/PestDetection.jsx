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
import { postJSON } from "../api";
import { isAuthenticated } from "../lib/actions/authActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Responsive, accessible and slightly refactored version of the original component
// Main styling improvements:
// - Cards stretch to same height (h-full) so columns align on larger screens
// - Buttons become full-width on small screens and inline on >=sm
// - Image preview has responsive heights and preserves aspect ratio
// - Drop area is keyboard accessible (role="button" and onKeyDown)
// - Result section is scrollable if content overflows on small screens

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

  // Select file
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

  // Analyze image via backend
  const analyzeImage = async () => {
    if (!selectedFile) {
      toast.error(t("selectFileFirst"));
      return;
    }

    // optional: size check (10 MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error(t("fileTooLarge"));
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/advisory/detect-pest-disease`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to analyze image");

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisResult({
        disease: t("networkError"),
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
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
                  if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-green-400 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-300"
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
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-full sm:w-auto space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Camera className="h-4 w-4" />
                    <span>{t("uploadButtons.takePhoto")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-full sm:w-auto space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
                    alt="pest preview"
                    className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover"
                  />

                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                      setAnalysisResult(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    aria-label={t("closePreview")}
                  >
                    ×
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{selectedFile?.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <div className="w-full sm:w-auto">
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="w-full sm:inline-flex justify-center items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          <span>{t("analyzing")}</span>
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          <span>{t("analyzeButton")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
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

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              {t("analysisResults.title")}
            </h2>

            <div className="flex-1 overflow-auto">
              {!analysisResult && !isAnalyzing && (
                <div className="text-center py-12">
                  <FileImage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t("analysisResults.empty")}</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <Loader className="h-16 w-16 text-green-600 mx-auto animate-spin mb-4" />
                  <p className="text-gray-600">{t("analysisProgress")}</p>
                  <p className="text-sm text-gray-500 mt-2">{t("analysisProgressNote")}</p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6 pb-4">
                  {/* Disease */}
                  <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-900">
                        {t("analysisResults.diseaseDetected")}
                      </h3>
                    </div>

                    <p className="text-lg font-bold text-orange-900 truncate">
                      {analysisResult.disease}
                    </p>

                    <p className="text-sm text-orange-700 mt-1">
                      {t("analysisResults.confidence")} : {analysisResult.confidence}% | {t("analysisResults.severity")} : {analysisResult.severity}
                    </p>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      {t("analysisResults.treatmentRecommendations")}
                    </h3>

                    <ul className="space-y-2">
                      {analysisResult.treatment?.length ? (
                        analysisResult.treatment.map((step, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-gray-700 text-sm break-words">{step}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-600">{t("analysisResults.noTreatment")}</li>
                      )}
                    </ul>
                  </div>

                  {/* Prevention */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {t("analysisResults.preventionTips")}
                    </h3>

                    <ul className="space-y-2">
                      {analysisResult.prevention?.length ? (
                        analysisResult.prevention.map((tip, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2"></span>
                            <span className="text-gray-700 text-sm break-words">{tip}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-600">{t("analysisResults.noPrevention")}</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectPest;
