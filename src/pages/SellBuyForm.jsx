import React, { useEffect, useState, useRef } from "react";
import farm from "../assets/farm.png";
import CloudinaryUploader from "../components/ImageUploader";
import { getJSON, postJSON, putJSON } from "../api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * SellBuyWizard.jsx - translated using useLanguage() context
 */

const UNIT_OPTIONS = ["Quintal", "Kg", "Ton"];
const FREQUENCY_OPTIONS = ["once", "weekly", "monthly"];

export default function SellBuyWizard() {
  const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const fileInputRef = useRef();

  // Step state
  const [step, setStep] = useState(1);

  // Contract fields (matching schema)
  const [type, setType] = useState("sell"); // buy | sell
  const [postingDate, setPostingDate] = useState(todayISO);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const [priceAmount, setPriceAmount] = useState("");
  const [priceUnit, setPriceUnit] = useState("Quintal");

  const [quantityAmount, setQuantityAmount] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("Quintal");

  const [productName, setProductName] = useState("");
  const [productVariety, setProductVariety] = useState("");
  const [buyingFrequency, setBuyingFrequency] = useState("once");

  // Location fields
  const [stateVal, setStateVal] = useState("");
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState("");

  // Contractor info
  const [contractorName, setContractorName] = useState("");
  const [contractorPhone, setContractorPhone] = useState("");
  const [businessType, setBusinessType] = useState("Farmer");
  const [contractorImage, setContractorImage] = useState(null);

  // Images array for product
  const [images, setImages] = useState([]); // { file, url }
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // small sample states->districts to demo dependent select
  const STATES = {
    "Uttar Pradesh": ["Basti", "Ayodhya", "Gonda", "Gorakhpur"],
    Kerala: ["Thiruvananthapuram", "Kollam", "Kozhikode"],
    Maharashtra: ["Pune", "Mumbai", "Nagpur"],
  };

  // Validation errors
  const [errors, setErrors] = useState({});
  const { edit } = useParams();
  const isEditing = !!edit;

  const { t } = useLanguage();

  const fetchData = async () => {
    const res = await getJSON(`/requirements/${edit}`);
    return res.data;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchData()
        .then((data) => {
          setType(data.type || "sell");
          setPostingDate(data.postingDate || todayISO);
          setTitle(data.title || "");
          setNote(data.note || "");
          setPriceAmount(data.price?.amount ?? "");
          setPriceUnit(data.price?.unit || "Quintal");
          setQuantityAmount(data.quantity?.amount ?? "");
          setQuantityUnit(data.quantity?.unit || "Quintal");
          setProductName(data.product?.name || "");
          setProductVariety(data.product?.variety || "");
          setBuyingFrequency(data.product?.buyingFrequency || "once");
          setStateVal(data.contractorInfo?.state || "");
          setContractorName(data.contractorInfo?.name || "");
          setContractorPhone(data.contractorInfo?.phone || "");
          setBusinessType(data.contractorInfo?.businessType || "Farmer");
          setImages((data.images || []).map((url) => ({ url })));
        })
        .catch((err) => {
          toast.error(t("failedLoadContract"));
        })
        .finally(() => setLoading(false));
    }
  }, [isEditing, edit]);

  const removeImageAt = (index) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed?.url && removed.url.startsWith("blob:")) URL.revokeObjectURL(removed.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleContractorImage = (file) => {
    if (!file) {
      setContractorImage(null);
      return;
    }
    setContractorImage({
      file,
      url: URL.createObjectURL(file),
    });
  };

  // Validators
  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!title.trim()) e.title = t("errTitle");
      if (!productName.trim()) e.productName = t("errProductName");
      if (!productVariety.trim()) e.productVariety = t("errProductVariety");
      if (!stateVal) e.stateVal = t("errState");
      if (!location.trim() && !district) e.location = t("errLocation");
    }
    if (s === 2) {
      if (!quantityAmount || Number(quantityAmount) <= 0)
        e.quantityAmount = t("errQuantityAmount");
      if (!priceAmount || Number(priceAmount) <= 0) e.priceAmount = t("errPriceAmount");
    }
    if (s === 3) {
      if (!contractorName.trim()) e.contractorName = t("errContractorName");
      if (!contractorPhone.trim() || contractorPhone.length < 7)
        e.contractorPhone = t("errContractorPhone");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const buildPayload = async () => {
    const payload = {
      type,
      postingDate,
      title: title.trim(),
      note: note.trim(),
      price: { amount: Number(priceAmount), unit: priceUnit },
      quantity: { amount: Number(quantityAmount), unit: quantityUnit },
      product: {
        name: productName.trim(),
        variety: productVariety.trim(),
        location: location || `${district ? district + ", " : ""}${stateVal || ""}`,
        buyingFrequency,
      },
      contractorInfo: {
        name: contractorName.trim(),
        state: stateVal,
        image: contractorImage ? contractorImage.file.name : undefined,
        phone: contractorPhone.trim(),
      },
      images: images.map((i) => i.url),
    };

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // final validation (all steps)
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setStep(1);
      return;
    }

    const payload = await buildPayload();

    // If you want to send files, use FormData
    const formData = new FormData();
    formData.append("payload", JSON.stringify(payload));
    if (contractorImage?.file) formData.append("contractorImage", contractorImage.file);

    try {
      let res;
      if (isEditing) {
        res = await putJSON(`/requirements/${edit}`, payload);
      } else {
        res = await postJSON("/requirements", payload);
      }
      if (!res.success) {
        throw new Error(res.message || t("errSubmit"));
      }

      toast.success(res.message || t("submitSuccess"));
      if (isEditing) {
        navigate("/market/farmer");
      } else {
        navigate("/market-place");
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error(t("errSubmitting") + ": " + (err.message || ""));
    }
  };

  const stepProgress = Math.round(((step - 1) / 2) * 100);

  if (Loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("loading")}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="flex flex-col justify-start px-6 w-full">
          <div className="flex items-center gap-3">
            <div className="text-green-600 p-2 rounded-full bg-green-50">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.136 
                  0-2.224-.137-3.236-.394L3 20l1.394-4.763A7.962 
                  7.962 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600">{t("requiredInfo")}</h3>
              <div className="w-24 h-0.5 bg-amber-300 mt-1 rounded"></div>
            </div>
          </div>

          <div className="mt-12">
            <img src={farm} alt="farmer" className="rounded-lg shadow w-full object-cover" />
            <p className="mt-8 text-sm text-gray-500 leading-relaxed">
              {t("leftDescription")}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
          {/* Header / Stepper */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? t("updateContract") : t("createContract")}
              </h2>

              <div className="text-sm text-gray-500">
                {t("step")} {step} {t("of")} 3
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="h-2 bg-green-500 transition-all" style={{ width: `${stepProgress}%` }} aria-hidden />
              </div>

              <div className="flex justify-between text-xs text-gray-600 mt-3">
                <div className={`${step >= 1 ? "text-green-600 font-medium" : ""}`}>{t("basic")}</div>
                <div className={`${step >= 2 ? "text-green-600 font-medium" : ""}`}>{t("quantityPrice")}</div>
                <div className={`${step >= 3 ? "text-green-600 font-medium" : ""}`}>{t("contractor")}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            <div className={`${step === 1 ? "block" : "hidden"}`}>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex gap-3">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="sell"
                      checked={type === "sell"}
                      onChange={() => setType("sell")}
                      className="form-radio h-4 w-4 text-green-600"
                    />
                    <span className="ml-2 text-sm">{t("sell")}</span>
                  </label>

                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="buy"
                      checked={type === "buy"}
                      onChange={() => setType("buy")}
                      className="form-radio h-4 w-4 text-green-600"
                    />
                    <span className="ml-2 text-sm">{t("buy")}</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("postingDate")}</label>
                  <input
                    type="date"
                    value={postingDate}
                    onChange={(e) => setPostingDate(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("title")}</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("titlePlaceholder")}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                  />
                  {errors.title && <div className="text-xs text-red-600 mt-1">{errors.title}</div>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("productName")}</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder={t("productNamePlaceholder")}
                      className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                    />
                    {errors.productName && <div className="text-xs text-red-600 mt-1">{errors.productName}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("variety")}</label>
                    <input
                      type="text"
                      value={productVariety}
                      onChange={(e) => setProductVariety(e.target.value)}
                      placeholder={t("varietyPlaceholder")}
                      className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                    />
                    {errors.productVariety && <div className="text-xs text-red-600 mt-1">{errors.productVariety}</div>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("buyingFrequency")}</label>
                  <select
                    value={buyingFrequency}
                    onChange={(e) => setBuyingFrequency(e.target.value)}
                    className="mt-1 w-40 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                  >
                    {FREQUENCY_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {t(f)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("state")}</label>
                    <select
                      value={stateVal}
                      onChange={(e) => {
                        setStateVal(e.target.value);
                        setDistrict("");
                      }}
                      className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                    >
                      <option value="">{t("selectState")}</option>
                      {Object.keys(STATES).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.stateVal && <div className="text-xs text-red-600 mt-1">{errors.stateVal}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("district")}</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!stateVal}
                      className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300 disabled:bg-gray-100"
                    >
                      <option value="">{t("selectDistrict")}</option>
                      {stateVal &&
                        STATES[stateVal].map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("locationOptional")}</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t("locationPlaceholder")}
                      className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                    />
                    {errors.location && <div className="text-xs text-red-600 mt-1">{errors.location}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`${step === 2 ? "block" : "hidden"}`}>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700">{t("note")}</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                    />
                    {errors.note && <div className="text-xs text-red-600 mt-1">{errors.note}</div>}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">{t("quantityAmount")}</label>
                    <input
                      type="number"
                      min="0"
                      value={quantityAmount}
                      onChange={(e) => setQuantityAmount(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                    />
                    {errors.quantityAmount && <div className="text-xs text-red-600 mt-1">{errors.quantityAmount}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("quantityUnit")}</label>
                    <select
                      value={quantityUnit}
                      onChange={(e) => setQuantityUnit(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                    >
                      {UNIT_OPTIONS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">{t("priceAmount")}</label>
                    <input
                      type="number"
                      min="0"
                      value={priceAmount}
                      onChange={(e) => setPriceAmount(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                    />
                    {errors.priceAmount && <div className="text-xs text-red-600 mt-1">{errors.priceAmount}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("priceUnit")}</label>
                    <select
                      value={priceUnit}
                      onChange={(e) => setPriceUnit(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                    >
                      {UNIT_OPTIONS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("uploadImages")}</label>
                  <CloudinaryUploader images={images} setImages={setImages} />

                  {images.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative border rounded overflow-hidden">
                          <img src={img.url} alt={`preview-${idx}`} className="w-full h-28 object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImageAt(idx)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                            aria-label={t("removeImage")}
                          >
                            <svg className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 6l8 8M6 14L14 6" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`${step === 3 ? "block" : "hidden"}`}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("contractorName")}</label>
                  <input
                    type="text"
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                  />
                  {errors.contractorName && <div className="text-xs text-red-600 mt-1">{errors.contractorName}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("phone")}</label>
                  <input
                    type="tel"
                    value={contractorPhone}
                    onChange={(e) => setContractorPhone(e.target.value)}
                    placeholder="+91XXXXXXXXXX"
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                  />
                  {errors.contractorPhone && <div className="text-xs text-red-600 mt-1">{errors.contractorPhone}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("businessType")}</label>
                  <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("contractorImage")}</label>
                  <input type="file" accept="image/*" onChange={(e) => handleContractorImage(e.target.files[0])} className="mt-2" />
                  {contractorImage && (
                    <div className="mt-3 w-40 h-40 border overflow-hidden rounded">
                      <img src={contractorImage.url} alt="contractor" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Review summary */}
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h4 className="font-medium text-gray-800">{t("review")}</h4>
                  <div className="text-sm text-gray-700 mt-2 space-y-1">
                    <div><strong>{t("type")}:</strong> {t(type)}</div>
                    <div><strong>{t("title")}:</strong> {title}</div>
                    <div><strong>{t("postingDate")}:</strong> {postingDate}</div>
                    <div><strong>{t("product")}:</strong> {productName} ({productVariety})</div>
                    <div><strong>{t("location")}:</strong> {location || `${district ? district + ", " : ""}${stateVal}`}</div>
                    <div><strong>{t("quantity")}:</strong> {quantityAmount} {quantityUnit}</div>
                    <div><strong>{t("price")}:</strong> {priceAmount} / {priceUnit}</div>
                    <div><strong>{t("images")}:</strong> {images.length}</div>
                    <div><strong>{t("contractor")}:</strong> {contractorName} • {contractorPhone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                {step > 1 && (
                  <button type="button" onClick={prev} className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                    {t("back")}
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {step < 3 && (
                  <button type="button" onClick={next} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">
                    {t("next")}
                  </button>
                )}

                {step === 3 && (
                  <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">
                    {t("submit")}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
