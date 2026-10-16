import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Pill,
  Activity,
  FileCheck,
  Check,
  Scan,
  RotateCcw,
  User,
  Star,
  MapPin,
  ClipboardPaste,
  FileSpreadsheet,
  Download,
  Info
} from 'lucide-react';

const AIPrescriptionScanner = () => {
  const { API_URL, triggerAlert } = useApp();
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';

  const [docType, setDocType] = useState('prescription'); // 'prescription' | 'report'
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'paste'
  const [rawText, setRawText] = useState('');
  const [fileData, setFileData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerAlert(
        isHindi
          ? 'कृपया एक वैध इमेज फाइल (PNG, JPG, JPEG, WebP) अपलोड करें'
          : 'Please upload a valid image file (PNG, JPG, JPEG, WebP)',
        'error'
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      triggerAlert(
        isHindi ? 'फाइल का आकार 10MB से अधिक नहीं होना चाहिए' : 'File size exceeds 10MB limit',
        'error'
      );
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result);
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleClick = async (sampleId, type, sampleText = '') => {
    setDocType(type);
    setRawText(sampleText);
    setFileName(
      `Demo: ${
        sampleId === 'lipid-sample'
          ? 'Lipid Profile Report'
          : sampleId === 'cbc-sample'
          ? 'CBC Blood Count'
          : sampleId === 'cardiac-sample'
          ? 'Cardiac & BP Prescription'
          : 'Antibiotic Prescription'
      }`
    );
    setPreviewUrl(null);
    setFileData(null);
    await runAnalysis({ sampleId, analysisType: type, rawText: sampleText });
  };

  const runAnalysis = async (customPayload = null) => {
    setLoading(true);
    setResult(null);

    const payload = customPayload || {
      image: fileData,
      rawText: rawText.trim() || undefined,
      analysisType: docType,
      preferredLanguage: isHindi ? 'hindi' : 'english'
    };

    if (!payload.image && !payload.rawText && !payload.sampleId) {
      triggerAlert(
        isHindi
          ? 'कृपया दस्तावेज़ अपलोड करें या उसका विवरण दर्ज करें'
          : 'Please upload a file or paste prescription / report text to analyze',
        'warning'
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/ai/ocr-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setTimeout(() => {
          document.getElementById('ocr-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        triggerAlert(data.message || (isHindi ? 'ओसीआर विश्लेषण में त्रुटि' : 'Failed to process OCR analysis'), 'error');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      triggerAlert(
        isHindi
          ? 'दस्तावेज़ विश्लेषण में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Failed to complete OCR document analysis. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFileData(null);
    setPreviewUrl(null);
    setFileName('');
    setRawText('');
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-[#00e599] transition-colors">
          {t('nav.home', 'Home')}
        </Link>
        <span>/</span>
        <span className="text-[#00e599] font-medium">
          {isHindi ? 'पर्चा व लैब ओसीआर' : 'Prescription & Lab OCR'}
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('ocr.title', isHindi ? 'एआई पर्चा एवं लैब रिपोर्ट स्कैनर' : 'Prescription & Lab OCR')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          {t('ocr.subtitle', isHindi
            ? 'अपने डॉक्टर का पर्चा या पैथोलॉजी लैब रिपोर्ट अपलोड करें अथवा टेक्स्ट दर्ज करें। हमारा एआई तुरंत प्रमुख जानकारियों का विश्लेषण प्रस्तुत करेगा।'
            : 'Upload an image or paste notes of your prescription or diagnostic lab report. Our AI will extract, analyze, and explain key clinical findings instantly.')}
        </p>
      </div>

      {/* Document Type Selector (Prescription vs Lab Report) */}
      <div className="bg-white dark:bg-[#091b16] rounded-2xl border border-slate-200 dark:border-emerald-500/20 p-2 shadow-sm flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => {
            setDocType('prescription');
            setResult(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all ${
            docType === 'prescription'
              ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/20'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#071612]'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>{isHindi ? '💊 डॉक्टर का पर्चा (Prescription / Rx)' : '💊 Doctor Prescription (Rx)'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setDocType('report');
            setResult(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all ${
            docType === 'report'
              ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/20'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#071612]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{isHindi ? '🧪 लैब व रक्त परीक्षण रिपोर्ट (Lab Report)' : '🧪 Laboratory / Blood Test Report'}</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-[#091b16] rounded-3xl border border-slate-200 dark:border-emerald-500/20 p-6 sm:p-7 shadow-xl space-y-5">
            {/* Input Mode Switcher (Upload vs Paste Text) */}
            <div className="flex border-b border-slate-200 dark:border-emerald-500/15 pb-2 gap-4">
              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 -mb-2.5 ${
                  inputMode === 'upload'
                    ? 'border-[#00e599] text-[#00e599]'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{isHindi ? 'फाइल / फोटो अपलोड करें' : 'Upload Document / Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('paste')}
                className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 -mb-2.5 ${
                  inputMode === 'paste'
                    ? 'border-[#00e599] text-[#00e599]'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>{isHindi ? 'टेक्स्ट या टेस्ट वैल्यू दर्ज करें' : 'Paste or Type Notes'}</span>
              </button>
            </div>

            {/* Mode 1: File Upload Dropzone */}
            {inputMode === 'upload' ? (
              <label className="relative border-2 border-dashed border-slate-300 dark:border-emerald-500/25 hover:border-[#00e599] dark:hover:border-[#00e599] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50 dark:bg-[#061410] group overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {loading && (
                  <div className="absolute inset-0 bg-white/90 dark:bg-[#051510]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#00e599] to-transparent animate-pulse absolute top-1/2 -translate-y-1/2 shadow-lg shadow-[#00e599]"></div>
                    <div className="bg-slate-100 dark:bg-[#091b16] px-4 py-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-2 shadow-xl">
                      <div className="w-4 h-4 border-2 border-[#00e599] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-slate-900 dark:text-[#00e599]">
                        {isHindi ? 'मल्टीमोडल ओसीआर द्वारा स्कैनिंग जारी...' : 'Scanning Document with Vision OCR...'}
                      </span>
                    </div>
                  </div>
                )}

                {previewUrl ? (
                  <div className="relative w-full max-h-64 overflow-hidden rounded-xl">
                    <img
                      src={previewUrl}
                      alt="Uploaded preview"
                      className="w-full h-auto object-cover rounded-xl"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white text-[10px] px-2.5 py-1 rounded-md border border-emerald-500/30 font-mono shadow-md">
                      {fileName}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-[#00e599] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {isHindi
                        ? 'अपनी फाइल यहां खींचें या ब्राउज़ करने के लिए क्लिक करें'
                        : 'Drag & drop your file here or click to browse'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isHindi ? 'समर्थित प्रारूप: JPG, PNG, WEBP (अधिकतम 10MB)' : 'Supports: JPG, PNG, WEBP (Max 10MB)'}
                    </p>
                  </div>
                )}
              </label>
            ) : (
              /* Mode 2: Paste / Type Document Text */
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>
                    {docType === 'report'
                      ? isHindi
                        ? 'लैब रिपोर्ट के मान दर्ज करें (उदा. Cholesterol 230, Hb 11.5, Sugar 140):'
                        : 'Enter Lab Values (e.g. Cholesterol: 230, Hb: 11.5, Fasting Sugar: 140):'
                      : isHindi
                      ? 'पर्चे की दवाइयां या डॉक्टर के निर्देश दर्ज करें:'
                      : 'Paste Prescription Text or Doctor Notes:'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {docType === 'report' ? 'Biomarker Extraction' : 'Rx Medication Match'}
                  </span>
                </label>
                <textarea
                  rows={6}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={
                    docType === 'report'
                      ? isHindi
                        ? 'उदाहरण:\nTotal Cholesterol: 248 mg/dL\nLDL: 162 mg/dL\nHDL: 44 mg/dL\nTriglycerides: 185 mg/dL\nHemoglobin: 11.8 g/dL\nFasting Blood Sugar: 135 mg/dL'
                        : 'Example:\nTotal Cholesterol: 248 mg/dL\nLDL: 162 mg/dL\nHDL: 44 mg/dL\nTriglycerides: 185 mg/dL\nHemoglobin: 11.8 g/dL\nFasting Blood Sugar: 135 mg/dL'
                      : isHindi
                      ? 'उदाहरण:\n1. Augmentin 625mg BD - 5 days\n2. Montair-LC 1 tab OD at night\n3. Pan-D 40mg OD before breakfast'
                      : 'Example:\n1. Augmentin 625mg BD - 5 days\n2. Montair-LC 1 tab OD at night\n3. Pan-D 40mg OD before breakfast'
                  }
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#061410] border border-slate-300 dark:border-emerald-500/25 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-[#00e599] transition-all"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={(!fileData && !rawText.trim()) || loading}
                onClick={() => runAnalysis()}
                className="flex-1 py-3 px-4 bg-[#00e599] hover:bg-[#00c985] disabled:opacity-40 text-[#04120e] text-xs font-extrabold rounded-xl shadow-md shadow-[#00e599]/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#04120e]" />
                <span>
                  {loading
                    ? isHindi
                      ? 'विश्लेषण हो रहा है...'
                      : 'Processing...'
                    : isHindi
                    ? 'एआई द्वारा दस्तावेज़ विश्लेषित करें'
                    : 'Process Document with AI'}
                </span>
              </button>

              {(fileData || rawText || result) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-3 bg-slate-100 dark:bg-[#071612] border border-slate-300 dark:border-emerald-500/20 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs transition-colors"
                  title="Clear"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Preloaded Demo Presets */}
            <div className="pt-3 border-t border-slate-200 dark:border-emerald-500/15 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                {isHindi ? 'त्वरित डेमो परीक्षण सैंपल्स:' : 'Try Preloaded Interactive Demo Samples:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {docType === 'prescription' ? (
                  <>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        handleSampleClick(
                          'prescription-sample',
                          'prescription',
                          'Augmentin 625mg BD after food x 5 days\nMontair LC 10mg OD at night x 7 days\nPan-D 40mg OD before breakfast'
                        )
                      }
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#061410] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/20 text-left text-xs transition-colors group"
                    >
                      <span className="font-bold text-slate-900 dark:text-white block group-hover:text-[#00e599]">
                        Antibiotic & Allergy
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Augmentin & Montair</span>
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        handleSampleClick(
                          'cardiac-sample',
                          'prescription',
                          'Telmisartan 40mg OD in morning\nAmlodipine 5mg OD\nEcosprin 75mg OD after dinner'
                        )
                      }
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#061410] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/20 text-left text-xs transition-colors group"
                    >
                      <span className="font-bold text-slate-900 dark:text-white block group-hover:text-[#00e599]">
                        Hypertension & Heart
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Telmisartan & Amlodipine</span>
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        handleSampleClick(
                          'diabetes-sample',
                          'prescription',
                          'Metformin 500mg BD with meals\nGlimepiride 1mg OD\nPantocid 40mg OD AC'
                        )
                      }
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#061410] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/20 text-left text-xs transition-colors group"
                    >
                      <span className="font-bold text-slate-900 dark:text-white block group-hover:text-[#00e599]">
                        Diabetes Care
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Metformin & Glycomet</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        handleSampleClick(
                          'lipid-sample',
                          'report',
                          'Total Cholesterol: 248 mg/dL\nLDL Cholesterol: 162 mg/dL\nHDL: 44 mg/dL\nTriglycerides: 185 mg/dL'
                        )
                      }
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#061410] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/20 text-left text-xs transition-colors group"
                    >
                      <span className="font-bold text-slate-900 dark:text-white block group-hover:text-[#00e599]">
                        Lipid Profile
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Cholesterol & LDL</span>
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        handleSampleClick(
                          'cbc-sample',
                          'report',
                          'Hemoglobin (Hb): 11.8 g/dL\nTotal RBC: 4.1 million/mcL\nWBC: 6,800 /mcL\nPlatelets: 245,000 /mcL'
                        )
                      }
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#061410] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/20 text-left text-xs transition-colors group"
                    >
                      <span className="font-bold text-slate-900 dark:text-white block group-hover:text-[#00e599]">
                        CBC Blood Test
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Hb, RBC & Platelets</span>
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        handleSampleClick(
                          'diabetes-sample',
                          'report',
                          'Fasting Blood Sugar: 142 mg/dL\nHbA1c: 7.2 %\nSerum Creatinine: 1.1 mg/dL'
                        )
                      }
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#061410] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/20 text-left text-xs transition-colors group"
                    >
                      <span className="font-bold text-slate-900 dark:text-white block group-hover:text-[#00e599]">
                        Diabetes & HbA1c
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Glucose & HbA1c</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Holographic Document & Automatic Extraction Checklist */}
        <div className="lg:col-span-5 space-y-5">
          <div className="relative rounded-3xl bg-white dark:bg-[#091b16] border border-slate-200 dark:border-emerald-500/20 p-6 overflow-hidden shadow-xl">
            {/* Holographic Document Scanner Illustration */}
            <div className="relative h-64 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900 dark:bg-[#05130f]">
              <div className="absolute w-44 h-44 rounded-full bg-emerald-500/20 blur-2xl"></div>

              {/* Document Graphic with Scanner Beam */}
              <div className="relative w-44 h-52 rounded-xl bg-slate-800 dark:bg-[#081f18] border border-emerald-500/40 p-4 shadow-2xl flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-2.5 rounded bg-[#00e599]"></div>
                  <div className="w-full h-1.5 rounded bg-slate-600/40"></div>
                  <div className="w-5/6 h-1.5 rounded bg-slate-600/40"></div>
                  <div className="w-3/4 h-1.5 rounded bg-slate-600/40"></div>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-1.5 rounded bg-[#00e599]/40"></div>
                  <div className="w-2/3 h-1.5 rounded bg-[#00e599]/40"></div>
                </div>

                {/* Glowing Laser Scan Bar */}
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#00e599] to-transparent shadow-lg shadow-[#00e599] animate-pulse"></div>
              </div>

              <div className="absolute bottom-2 text-center text-[10px] text-emerald-400 font-mono">
                Multimodal Clinical OCR Engine • Bilingual
              </div>
            </div>

            {/* Checklist Box */}
            <div className="mt-5 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {isHindi ? 'स्वचालित विश्लेषण विशेषताएं:' : 'Extracts Automatically:'}
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-[#00e599] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#00e599]" />
                  </div>
                  <span>
                    {isHindi
                      ? 'दवाइयों के नाम, जेनेरिक संयोजन और ब्रांड्स'
                      : 'Medicine names & pharmaceutical ingredients'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-[#00e599] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#00e599]" />
                  </div>
                  <span>
                    {isHindi
                      ? 'खुराक, सेवन का समय (BD/TDS/OD) और अवधि'
                      : 'Dosage, frequency and meal schedules'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-[#00e599] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#00e599]" />
                  </div>
                  <span>
                    {isHindi
                      ? 'बायोमार्कर (कोलेस्ट्रॉल, हीमोग्लोबिन, शुगर, प्लेटलेट्स) का संदर्भ मूल्यांकन'
                      : 'Lab values and biomarker reference comparison'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-[#00e599] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#00e599]" />
                  </div>
                  <span>
                    {isHindi
                      ? 'महत्वपूर्ण सावधानियां एवं आहार निर्देश'
                      : 'Doctor instructions, dietary tips and warnings'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-[#00e599] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#00e599]" />
                  </div>
                  <span>
                    {isHindi
                      ? 'सत्यापित विशेषज्ञ डॉक्टर से परामर्श सिफारिश'
                      : 'Specialist physician match & booking'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div id="ocr-results" className="pt-6 space-y-6 animate-slide-up">
          {/* Header Card */}
          <div className="bg-white dark:bg-[#091b16] rounded-3xl border border-slate-200 dark:border-emerald-500/20 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-emerald-500/15 pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#00e599]">
                  {isHindi ? 'डीकोड किया गया दस्तावेज़' : 'Decoded Document'}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {result.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {result.doctorOrLab} • {result.date}
                </p>
              </div>
              <span className="px-3.5 py-1.5 bg-emerald-500/15 text-[#00e599] border border-emerald-500/30 text-xs font-bold rounded-full w-fit flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#00e599]" />
                <span>{isHindi ? 'सत्यापित ओसीआर' : 'Verified OCR'}</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#061410] border border-slate-200 dark:border-emerald-500/15 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white font-bold">
                {isHindi ? 'चिकित्सीय सारांश: ' : 'Summary: '}
              </strong>
              {result.summary}
            </div>
          </div>

          {/* Prescription Data Rendering */}
          {result.prescriptionData && result.prescriptionData.medications && (
            <div className="bg-white dark:bg-[#091b16] rounded-3xl border border-slate-200 dark:border-emerald-500/20 p-6 sm:p-8 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#00e599]" />
                <span>
                  {isHindi
                    ? 'निर्धारित दवाइयां एवं सरल भाषा में निर्देश'
                    : 'Prescribed Medications & Plain-Language Guide'}
                </span>
              </h3>

              <div className="space-y-3">
                {result.prescriptionData.medications.map((med, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#061410] border border-slate-200 dark:border-emerald-500/15 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{med.name}</h4>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-[#00e599] border border-emerald-500/30 w-fit">
                        {med.dosage} • {med.duration}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                          {isHindi ? 'समय व आवृत्ति (Schedule)' : 'Schedule'}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {med.frequency}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                          {isHindi ? 'उपयोग / लाभ (Purpose)' : 'Purpose'}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{med.purpose}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-emerald-500/10 pt-2">
                      <strong className="text-slate-900 dark:text-slate-200">
                        {isHindi ? 'सेवन विधि:' : 'Instructions:'}
                      </strong>{' '}
                      {med.instructions}
                    </p>

                    {med.warnings && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
                        <span>
                          <strong>{isHindi ? 'महत्वपूर्ण चेतावनी:' : 'Important:'}</strong>{' '}
                          {med.warnings}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Special Instructions */}
              {result.prescriptionData.specialInstructions &&
                result.prescriptionData.specialInstructions.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-emerald-500/15 space-y-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                      {isHindi ? 'विशेष चिकित्सीय निर्देश:' : 'Special Clinical Instructions:'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {result.prescriptionData.specialInstructions.map((ins, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#00e599] shrink-0" />
                          <span>{ins}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {/* Lab Report Data Rendering */}
          {result.labReportData && result.labReportData.parameters && (
            <div className="bg-white dark:bg-[#091b16] rounded-3xl border border-slate-200 dark:border-emerald-500/20 p-6 sm:p-8 shadow-xl space-y-5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                <span>
                  {isHindi
                    ? 'बायोमार्कर पैरामीटर्स एवं स्वास्थ्य विश्लेषण'
                    : 'Biomarker Parameters & Health Analysis'}
                </span>
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-emerald-500/15">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-[#061410] border-b border-slate-200 dark:border-emerald-500/15 text-[10px] uppercase text-slate-600 dark:text-slate-400 font-bold">
                      <th className="py-3 px-3.5">{isHindi ? 'पैरामीटर' : 'Parameter'}</th>
                      <th className="py-3 px-3.5">{isHindi ? 'मरीज का मान' : 'Patient Value'}</th>
                      <th className="py-3 px-3.5">{isHindi ? 'मानक सीमा' : 'Reference'}</th>
                      <th className="py-3 px-3.5">{isHindi ? 'स्थिति' : 'Status'}</th>
                      <th className="py-3 px-3.5">{isHindi ? 'चिकित्सीय व्याख्या' : 'Interpretation'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-emerald-500/10">
                    {result.labReportData.parameters.map((param, i) => {
                      const isHigh =
                        param.status === 'High' ||
                        param.status === 'अधिक' ||
                        param.status?.includes('अधिक');
                      const isLow =
                        param.status === 'Low' ||
                        param.status === 'कम' ||
                        param.status?.includes('कम');

                      return (
                        <tr
                          key={i}
                          className="hover:bg-slate-50 dark:hover:bg-emerald-500/5 transition-colors"
                        >
                          <td className="py-3 px-3.5 font-semibold text-slate-900 dark:text-white">
                            {param.name}
                          </td>
                          <td className="py-3 px-3.5 font-mono font-bold text-emerald-600 dark:text-[#00e599]">
                            {param.value}{' '}
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {param.unit}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-slate-500 dark:text-slate-400 font-mono">
                            {param.referenceRange}
                          </td>
                          <td className="py-3 px-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isHigh
                                  ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                                  : isLow
                                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/15 text-emerald-700 dark:text-[#00e599] border border-emerald-500/30'
                              }`}
                            >
                              {param.status}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-[11px] text-slate-600 dark:text-slate-300 max-w-xs">
                            {param.explanation || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Assessment & Lifestyle Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {result.labReportData.overallAssessment && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#061410] border border-slate-200 dark:border-emerald-500/15 space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {isHindi ? 'समग्र स्वास्थ्य मूल्यांकन:' : 'Overall Assessment:'}
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {result.labReportData.overallAssessment}
                    </p>
                  </div>
                )}

                {result.labReportData.lifestyleRecommendations &&
                  result.labReportData.lifestyleRecommendations.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#061410] border border-slate-200 dark:border-emerald-500/15 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {isHindi ? 'आहार एवं जीवनशैली सुझाव:' : 'Lifestyle Recommendations:'}
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {result.labReportData.lifestyleRecommendations.map((rec, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#00e599] shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Matched Recommended Doctors */}
          {result.recommendedDoctors && result.recommendedDoctors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isHindi
                  ? `अनुशंसित विशेषज्ञ डॉक्टर से परामर्श करें (${result.recommendedSpecialization})`
                  : `Consult a Recommended ${result.recommendedSpecialization}`}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.recommendedDoctors.map((doc) => (
                  <div
                    key={doc._id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#091b16] border border-slate-200 dark:border-emerald-500/15 flex flex-col justify-between hover-lift shadow-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-[#00e599] flex items-center justify-center font-bold text-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">{doc.name}</h4>
                          <p className="text-[10px] text-emerald-600 dark:text-[#00e599] font-medium">
                            {doc.specialization}
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 truncate">
                        {doc.hospital || 'ArogyaCare Super Speciality Hospital'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-3">
                        <span>{doc.experience} Yrs Exp.</span>
                        <span className="font-bold text-slate-900 dark:text-white">₹{doc.fees}</span>
                      </div>
                    </div>

                    <Link
                      to={`/book/${doc._id}`}
                      className="w-full py-2 px-3 bg-[#00e599] hover:bg-[#00c985] text-[#04120e] font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors shadow-sm"
                    >
                      <span>{isHindi ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              {result.disclaimer ||
                (isHindi
                  ? 'यह एआई विश्लेषण केवल सहायक मार्गदर्शन है। दवाइयों के सेवन से पहले डॉक्टर या फार्मासिस्ट से परामर्श अवश्य करें।'
                  : 'This AI automated analysis is an assistive tool and must be verified with a certified healthcare professional.')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPrescriptionScanner;
