import React, { useState, useRef } from 'react';
import {
  Upload as UploadIcon,
  Camera,
  FileImage,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Upload = () => {
  const { t } = useLanguage();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    // Simulated AI result
    setTimeout(() => {
      setAnalysisResult({
        disease: 'Leaf Blight',
        confidence: 87,
        severity: 'Moderate',
        treatment: [
          'Remove affected leaves immediately',
          'Apply copper-based fungicide',
          'Improve air circulation around plants',
          'Reduce watering frequency',
        ],
        prevention: [
          'Avoid overhead watering',
          'Maintain proper plant spacing',
          'Apply preventive fungicide spray',
        ],
      });

      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('uploadTitle')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('uploadSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Image</h2>

            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />

                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your image here or click to browse
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  Supports JPG, PNG, WEBP up to 10MB
                </p>

                <div className="flex justify-center space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    <span>Take Photo</span>
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileImage className="h-4 w-4" />
                    <span>Choose File</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Uploaded crop"
                    className="w-full h-64 object-cover rounded-lg"
                  />

                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                      setAnalysisResult(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile?.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        <span>Analyze Image</span>
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
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Results</h2>

            {!analysisResult && !isAnalyzing && (
              <div className="text-center py-12">
                <FileImage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload an image to get AI-powered analysis</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <Loader className="h-16 w-16 text-green-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Analyzing your crop image...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6">
                
                {/* Disease Section */}
                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Disease Detected</h3>
                  </div>
                  <p className="text-lg font-bold text-orange-900 mb-1">
                    {analysisResult.disease}
                  </p>
                  <p className="text-sm text-orange-700">
                    Confidence: {analysisResult.confidence}% | Severity: {analysisResult.severity}
                  </p>
                </div>

                {/* Treatments */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Treatment Recommendations
                  </h3>

                  <ul className="space-y-2">
                    {analysisResult.treatment.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevention */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Prevention Tips</h3>

                  <ul className="space-y-2">
                    {analysisResult.prevention.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2"></span>
                        <span className="text-gray-700 text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
