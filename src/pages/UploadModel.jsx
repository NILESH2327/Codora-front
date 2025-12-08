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

const UploadModel = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error(t("pleaseLoginFirst"));
      navigate("/login");
    }
    // include navigate and t to silence lint and keep behaviour stable
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

  // Real backend analysis (GitHub version)
  const analyzeImage = async () => {
    if (!selectedFile) return;

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
        `http://localhost:5000/api/advisory/detect-crop-disease`,
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
 <div
  className="min-h-screen bg-cover bg-center bg-no-repeat py-8 relative"
  style={{
    backgroundImage:
      "url('https://cdn.pixabay.com/photo/2021/09/18/02/27/vietnam-6634082_1280.jpg')",
  }}
>
  {/* Soft overlay for readability */}
  <div className="absolute inset-0 bg-white/50 backdrop-blur-[3px]"></div>

  {/* Page content wrapper */}
  <div className="relative z-10">      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("cropDetection.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("cropDetection.subtitle")}
          </p>
        </div>

        {/* grid with items-stretch keeps both cards same height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col min-h-[420px]">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t("uploadImage.title")}
            </h2>

            {/* Keep the content area flexible so footer (filename + button) stays at bottom */}
            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer flex-1 flex flex-col justify-center"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                }}
              >
                <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />

                <p className="text-lg font-medium text-gray-700 mb-2">
                  {t("uploadArea.dropOrClick")}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  {t("uploadArea.supports")}
                </p>

                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Camera className="h-4 w-4" />
                    <span>{t("uploadButtons.takePhoto")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <FileImage className="h-4 w-4" />
                    <span>{t("uploadButtons.chooseFile")}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="relative w-full rounded-lg overflow-hidden bg-gray-100">
                  {/* fixed preview height for stability */}
                  <div className="w-full h-64 sm:h-80 flex items-center justify-center bg-gray-50">
                    <img
                      src={previewUrl}
                      alt="crop"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                      setAnalysisResult(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    aria-label={t("closePreview")}
                  >
                    ×
                  </button>
                </div>

                {/* Footer area with file info + analyze button - consistent space reserved */}
                <div className="flex items-center justify-between mt-2">
                  <div className="min-w-0">
                    {/* truncate long filenames */}
                    <p className="font-medium text-gray-900 truncate">
                      {selectedFile?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2 ml-4"
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
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col min-h-[420px]">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t("analysisResults.title")}
            </h2>

            {/* make results area scrollable if content grows */}
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
                <div className="space-y-6">
                  {/* Disease */}
                  <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-900">
                        {t("analysisResults.diseaseDetected")}
                      </h3>
                    </div>

                    <p className="text-lg font-bold text-orange-900">{analysisResult.disease}</p>

                    <p className="text-sm text-orange-700">
                      {t("analysisResults.confidence")}: {analysisResult.confidence}% |{" "}
                      {t("analysisResults.severity")}: {analysisResult.severity}
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
                            <span className="text-gray-700 text-sm">{step}</span>
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
                            <span className="text-gray-700 text-sm">{tip}</span>
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
  </div>
  );
};

export default UploadModel;
