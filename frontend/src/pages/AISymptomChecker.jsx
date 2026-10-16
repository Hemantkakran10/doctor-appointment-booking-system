import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Stethoscope,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  User,
  Star,
  MapPin,
  Mic,
  Activity,
  ShieldCheck,
  RotateCcw,
  Check,
  Crosshair,
  Target,
  Scan,
  Zap,
  Info
} from 'lucide-react';


const COMMON_SYMPTOMS = {
  en: [
    'Headache & mild fever since 2 days',
    'Chest tightness and shortness of breath',
    'Itchy red skin rash with small bumps',
    'Persistent dry cough with throat pain',
    'Stomach acidity, nausea, and cramping pain',
    'Morning knee stiffness and joint swelling'
  ],
  hi: [
    '2 दिनों से तेज सिरदर्द और हल्का बुखार',
    'सीने में भारीपन, जकड़न और सांस फूलना',
    'त्वचा पर लाल दाने, चकत्ते और खुजली',
    'लगातार सूखी खांसी और गले में दर्द',
    'पेट में तीव्र गैस, जलन, उल्टी और ऐंठन',
    'घुटनों और जोड़ों में दर्द व सुबह की अकड़न'
  ],
  hinglish: [
    '2 din se bahut tez sir dard aur bukhar',
    'Seene me dard, heaviness aur ghabrahat',
    'Twacha par lal daane aur tez khujli',
    'Gale me kharash aur lagatar khansi',
    'Pet me acidity, gas aur ulti jaisa lagna',
    'Ghutno aur joron me dard aur swelling'
  ]
};

const BODY_REGIONS = [
  {
    id: 'head',
    name: {
      en: 'Head & Cranial Brain',
      hi: 'सिर एवं मस्तिष्क',
      hinglish: 'Head & Brain'
    },
    short: {
      en: 'Head & Brain',
      hi: 'सिर व मस्तिष्क',
      hinglish: 'Head & Brain'
    },
    icon: '🧠',
    cx: 50,
    cy: 20,
    color: '#f59e0b',
    sampleSymptom: {
      en: 'Severe headache, migraine, dizziness, and sensitivity to light',
      hi: '2 दिनों से तेज सिरदर्द, चक्कर और माइग्रेन की समस्या',
      hinglish: 'Bahut tez sir dard, migraine aur chakkar aa rahe hain'
    },
    keywords: [
      'head', 'migraine', 'headache', 'dizziness', 'brain', 'vertigo',
      'sar dard', 'sir dard', 'sar me dard', 'sir me dard', 'sir ghoom', 'sir ghum', 'chakkar', 'sir bhari',
      'सिरदर्द', 'सिर दर्द', 'सर दर्द', 'चक्कर', 'माइग्रेन', 'सिर घूमना', 'सिर भारी', 'बेहोशी', 'नस'
    ],
    description: {
      en: 'Frontal lobe, temporal pathways, cranial sensory nerves and cephalic pain receptors',
      hi: 'कपाल संवेदी तंत्रिकाएं एवं मस्तिष्क दर्द रिसेप्टर्स',
      hinglish: 'Frontal lobe aur cranial nerves sensory pathways'
    }
  },
  {
    id: 'throat',
    name: {
      en: 'Throat & Upper Respiratory',
      hi: 'गला एवं ऊपरी श्वसन तंत्र',
      hinglish: 'Throat & Upper Respiratory'
    },
    short: {
      en: 'Throat & Neck',
      hi: 'गला व श्वसन',
      hinglish: 'Throat & Neck'
    },
    icon: '🗣️',
    cx: 50,
    cy: 35,
    color: '#38bdf8',
    sampleSymptom: {
      en: 'Persistent dry cough, sore throat, and difficulty swallowing',
      hi: 'लगातार सूखी खांसी, गले में खराश और निगलने में कठिनाई',
      hinglish: 'Gale me kharash, dry cough aur nigalne me dard'
    },
    keywords: [
      'throat', 'cough', 'cold', 'sore throat', 'voice', 'swallow', 'pharynx',
      'gala', 'khansi', 'sardi', 'zukam', 'jukam', 'gale me dard', 'gala kharab', 'gale me jalan',
      'खांसी', 'गले', 'सर्दी', 'जुकाम', 'गला खराब', 'कफ', 'गले में दर्द'
    ],
    description: {
      en: 'Pharynx, vocal cords, larynx and upper tracheal mucosal membranes',
      hi: 'ग्रसनी, स्वरयंत्र एवं श्वासनली की म्यूकोसल परत',
      hinglish: 'Pharynx, vocal cords aur tracheal mucosa'
    }
  },
  {
    id: 'chest',
    name: {
      en: 'Chest & Cardiovascular Region',
      hi: 'छाती एवं हृदय तंत्र',
      hinglish: 'Chest & Heart'
    },
    short: {
      en: 'Chest & Heart',
      hi: 'छाती व हृदय',
      hinglish: 'Chest & Heart'
    },
    icon: '🫀',
    cx: 50,
    cy: 53,
    color: '#ef4444',
    sampleSymptom: {
      en: 'Chest tightness, palpitations, and shortness of breath',
      hi: 'सीने में जकड़न, घबराहट और सांस फूलने की समस्या',
      hinglish: 'Chest me heaviness, ghabrahat aur saans lene me takleef'
    },
    keywords: [
      'chest', 'heart', 'cardio', 'angina', 'palpitation', 'breath', 'bp', 'blood pressure',
      'seene', 'chhati', 'dil', 'dhadkan', 'dil ki dhadkan', 'saans phoolna', 'ghabrahat', 'seene me dard', 'chhati me dard',
      'धड़कन', 'सीने', 'छाती', 'दिल', 'घबराहट', 'सांस फूलना', 'रक्तचाप', 'सीने में दर्द', 'छाती में दर्द'
    ],
    description: {
      en: 'Pericardial sac, coronary arteries, cardiac rhythm axis and thoracic chamber',
      hi: 'पेरीकार्डियम, कोरोनरी धमनियां एवं वक्षीय गुहा अक्ष',
      hinglish: 'Coronary arteries aur thoracic chamber axis'
    }
  },
  {
    id: 'abdomen',
    name: {
      en: 'Stomach & Gastrointestinal System',
      hi: 'उदर एवं पाचन तंत्र',
      hinglish: 'Stomach & Gut'
    },
    short: {
      en: 'Stomach & Gut',
      hi: 'पेट व पाचन',
      hinglish: 'Stomach & Gut'
    },
    icon: '🫄',
    cx: 50,
    cy: 74,
    color: '#10b981',
    sampleSymptom: {
      en: 'Stomach burning acidity, indigestion, nausea, and cramps',
      hi: 'पेट में जलन, एसिडिटी, अपच, मतली और ऐंठन',
      hinglish: 'Pet me jalan, acidity, gas aur ulti jaisa lagna'
    },
    keywords: [
      'stomach', 'abdomen', 'acidity', 'gas', 'digest', 'nausea', 'vomit', 'loose motion', 'diarrhea',
      'pet', 'pet dard', 'pet me dard', 'ulti', 'dast', 'kabz', 'jalan', 'hazam', 'khana hazam',
      'पेट', 'दस्त', 'उल्टी', 'पेट दर्द', 'पेट में दर्द', 'गैस', 'एसिडिटी', 'कब्ज', 'खाना हजम'
    ],
    description: {
      en: 'Gastric mucosa, hepatic biliary tract, stomach cavity and intestinal loops',
      hi: 'आमाशय म्यूकोसा, यकृत पित्त प्रणाली एवं आंतों का तंत्र',
      hinglish: 'Gastric mucosa aur intestinal digestive loops'
    }
  },
  {
    id: 'pelvis',
    name: {
      en: 'Pelvic & Reproductive Basin',
      hi: 'श्रोणि एवं प्रजनन अंग',
      hinglish: 'Pelvic & Reproductive Basin'
    },
    short: {
      en: 'Pelvic Basin',
      hi: 'पेल्विस व श्रोणि',
      hinglish: 'Pelvic Basin'
    },
    icon: '🧬',
    cx: 50,
    cy: 92,
    color: '#ec4899',
    sampleSymptom: {
      en: 'Lower abdominal cramps, pelvic pressure, or menstrual cycle pain',
      hi: 'निचले पेट में दर्द, ऐंठन या माहवारी चक्र में असहनीय दर्द',
      hinglish: 'Lower abdomen me cramps, pelvic pain ya periods ka dard'
    },
    keywords: [
      'period', 'menstrual', 'pelvis', 'pelvic', 'cramp', 'pregnancy', 'gyneco', 'ovary', 'urinary',
      'mahawari', 'periods dard', 'garbhavastha', 'pet ke nichle hisse me dard',
      'माहवारी', 'पीरियड्स', 'मासिक धर्म', 'गर्भावस्था', 'पेल्विक दर्द', 'माहवारी में दर्द'
    ],
    description: {
      en: 'Uterine, ovarian and genitourinary lower pelvic basin structures',
      hi: 'गर्भाशय, अंडाशय एवं निचले पेल्विक बेसिन की संरचनाएं',
      hinglish: 'Uterine aur pelvic basin anatomical organs'
    }
  },
  {
    id: 'joints',
    name: {
      en: 'Musculoskeletal Joints & Spine',
      hi: 'जोड़, मांसपेशियां एवं रीढ़',
      hinglish: 'Joints & Frame'
    },
    short: {
      en: 'Joints & Spine',
      hi: 'जोड़ व हड्डियां',
      hinglish: 'Joints & Spine'
    },
    icon: '🦾',
    cx: 34,
    cy: 118,
    color: '#a855f7',
    sampleSymptom: {
      en: 'Morning joint stiffness, knee pain, swelling, and muscle ache',
      hi: 'सुबह जोड़ों में अकड़न, घुटनों में दर्द, सूजन और मांसपेशियों में खिंचाव',
      hinglish: 'Ghutno me dard, swelling aur subah joron me stiffness'
    },
    keywords: [
      'joint', 'knee', 'leg', 'arm', 'stiff', 'bone', 'arthritis', 'muscle', 'back pain', 'spine',
      'ghutna', 'kamar dard', 'haddi', 'joron me dard', 'badan dard', 'dard ho raha',
      'घुटने', 'कमर दर्द', 'जोड़ों में दर्द', 'बदन दर्द', 'हड्डी', 'रीढ़ की हड्डी'
    ],
    description: {
      en: 'Synovial joint capsules, articular cartilage, ligaments and skeletal frame',
      hi: 'साइनोवियल जोड़ कैप्सूल, उपास्थि, स्नायुबंधन एवं अस्थि ढांचा',
      hinglish: 'Synovial joints, ligaments aur skeletal frame'
    }
  },
  {
    id: 'skin',
    name: {
      en: 'Skin & Dermal Integument',
      hi: 'त्वचा एवं उपकला तंत्र',
      hinglish: 'Skin & Dermis'
    },
    short: {
      en: 'Skin & Dermis',
      hi: 'त्वचा व एलर्जी',
      hinglish: 'Skin & Dermis'
    },
    icon: '🩹',
    cx: 50,
    cy: 64,
    color: '#06b6d4',
    sampleSymptom: {
      en: 'Itchy red skin rash, small bumps, and skin irritation',
      hi: 'त्वचा पर खुजली, लाल दाने, चकत्ते और जलन',
      hinglish: 'Twacha par khujli, lal daane aur skin irritation'
    },
    keywords: [
      'skin', 'rash', 'acne', 'itching', 'pimple', 'derm', 'eczema',
      'khujli', 'daane', 'tvacha', 'chehre pe daane', 'lal daane', 'skin allergy',
      'खुजली', 'दाने', 'त्वचा', 'मुंहासे', 'पिंपल', 'खाज', 'लाल चकत्ते', 'चेहरे पर दाने'
    ],
    description: {
      en: 'Epidermal cellular barrier, cutaneous histaminic layers and dermal tissue',
      hi: 'एपिडर्मल सेलुलर परत एवं क्यूटेनियस त्वचा ऊतक',
      hinglish: 'Epidermal barrier aur cutaneous dermal layer'
    }
  }
];

const AISymptomChecker = () => {
  const { API_URL, triggerAlert } = useApp();
  const { language, t } = useLanguage();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const activeCommonSymptoms = COMMON_SYMPTOMS[language] || COMMON_SYMPTOMS.en;

  const getRegionName = (reg) => (reg ? (reg.name[language] || reg.name.en) : '');
  const getRegionShort = (reg) => (reg ? (reg.short[language] || reg.short.en) : '');
  const getRegionDesc = (reg) => (reg ? (reg.description[language] || reg.description.en) : '');
  const getRegionSample = (reg) => (reg ? (reg.sampleSymptom[language] || reg.sampleSymptom.en) : '');

  // Compute active body region based on analysisResult, manual user selection, or real-time text input
  const activeRegion = useMemo(() => {
    // 1. If analysis result returned an affectedBodyPart, use that
    if (analysisResult?.affectedBodyPart?.id) {
      const match = BODY_REGIONS.find(r => r.id === analysisResult.affectedBodyPart.id);
      if (match) return match;
    }

    // 2. If user manually selected a region
    if (selectedRegionId) {
      const match = BODY_REGIONS.find(r => r.id === selectedRegionId);
      if (match) return match;
    }

    // 3. Detect from typed text in symptoms input
    if (symptoms.trim()) {
      const lower = symptoms.toLowerCase();
      for (const r of BODY_REGIONS) {
        if (r.keywords.some(kw => lower.includes(kw))) {
          return r;
        }
      }
    }

    return null;
  }, [analysisResult, selectedRegionId, symptoms]);

  const handleSelectRegion = (region) => {
    setSelectedRegionId(region.id);
    const sample = getRegionSample(region);
    if (!symptoms) {
      setSymptoms(sample);
    } else if (!symptoms.toLowerCase().includes(region.id)) {
      setSymptoms(prev => `${prev}, ${sample}`);
    }
  };

  const handleChipClick = (text) => {
    setSymptoms(prev => (prev ? `${prev}, ${text}` : text));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!symptoms.trim()) {
      triggerAlert(
        language === 'hi' 
          ? 'कृपया जांच के लिए अपने लक्षण दर्ज करें' 
          : language === 'hinglish' 
          ? 'Analyze karne ke liye apne symptoms enter karein' 
          : 'Please enter your symptoms to analyze', 
        'error'
      );
      return;
    }

    setLoading(true);
    setCurrentStep(2);
    setAnalysisResult(null);

    try {
      const res = await fetch(`${API_URL}/ai/symptom-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          symptoms,
          preferredLanguage: language === 'hi' ? 'hindi' : language === 'hinglish' ? 'hinglish' : 'english'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAnalysisResult(data);
        setCurrentStep(3);
        setTimeout(() => {
          document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        triggerAlert(data.message || 'Failed to analyze symptoms', 'error');
        setCurrentStep(1);
      }
    } catch (err) {
      console.error('Symptom analysis failed:', err);
      triggerAlert(
        language === 'hi'
          ? 'एआई लक्षण विश्लेषण में असमर्थ। कृपया पुनः प्रयास करें।'
          : 'Unable to complete AI symptom analysis. Please try again.',
        'error'
      );
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms('');
    setCurrentStep(1);
    setAnalysisResult(null);
    setSelectedRegionId(null);
  };

  const getTriageBadge = (level) => {
    if (level === 'urgent' || level === 'high') {
      return {
        bg: 'bg-red-500/10 border-red-500/30 text-red-400',
        icon: AlertTriangle,
        text: language === 'hi'
          ? 'तत्काल चिकित्सकीय परामर्श आवश्यक'
          : language === 'hinglish'
          ? 'Urgent Medical Attention Advised'
          : 'Urgent Medical Attention Advised',
        desc: language === 'hi'
          ? 'लक्षण किसी गंभीर स्थिति का संकेत हो सकते हैं, तुरंत विशेषज्ञ डॉक्टर से संपर्क करें।'
          : language === 'hinglish'
          ? 'Symptoms acute condition suggest kar rahe hain, turant specialist doctor ko dikhayein.'
          : 'Symptoms may indicate an acute condition requiring swift clinical evaluation.'
      };
    }
    if (level === 'moderate') {
      return {
        bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        icon: AlertCircle,
        text: language === 'hi'
          ? 'मध्यम स्तर — जल्द परामर्श लें'
          : language === 'hinglish'
          ? 'Moderate Urgency — Consultation Schedule Karein'
          : 'Moderate Urgency — Schedule Consultation',
        desc: language === 'hi'
          ? 'निकट भविष्य में किसी विशेषज्ञ डॉक्टर से क्लीनिकल जांच कराना उचित रहेगा।'
          : language === 'hinglish'
          ? 'Symptoms ke liye specialist doctor se regular consultation schedule karein.'
          : 'Symptoms warrant a clinical review by a specialist in the near future.'
      };
    }
    return {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-[#00e599]',
      icon: CheckCircle2,
      text: language === 'hi'
        ? 'सामान्य / हल्का — आपातकालीन नहीं'
        : language === 'hinglish'
        ? 'Routine / Mild — Non-Emergency'
        : 'Routine / Mild — Non-Emergency',
      desc: language === 'hi'
        ? 'लक्षण सामान्य हैं, लेकिन यदि समस्या बनी रहे या बढ़े तो डॉक्टर से परामर्श लें।'
        : language === 'hinglish'
        ? 'Symptoms self-limiting lag rahe hain, agar bane rahein toh doctor se consult karein.'
        : 'Symptoms appear self-limiting, but consult if they persist or worsen.'
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumb matching Figma */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-[#00e599] transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <span className="text-[#00e599] font-medium">{t('nav.aiSymptomChecker')}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('symptoms.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          {t('symptoms.subtitle')}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 border-b border-emerald-500/15 pb-6">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            currentStep >= 1 ? 'bg-[#00e599] text-[#04120e]' : 'bg-[#071612] text-slate-400 border border-emerald-500/20'
          }`}>
            1
          </div>
          <span className={`text-xs font-bold ${currentStep >= 1 ? 'text-white' : 'text-slate-400'}`}>
            {language === 'hi' ? 'लक्षण दर्ज करें' : language === 'hinglish' ? 'Symptoms Batayein' : 'Describe Symptoms'}
          </span>
        </div>

        <div className="w-8 sm:w-16 h-[1px] bg-emerald-500/20"></div>

        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            currentStep >= 2 ? 'bg-[#00e599] text-[#04120e]' : 'bg-[#071612] text-slate-400 border border-emerald-500/20'
          }`}>
            2
          </div>
          <span className={`text-xs font-bold ${currentStep >= 2 ? 'text-white' : 'text-slate-400'}`}>
            {language === 'hi' ? 'होलोग्राम स्कैन' : language === 'hinglish' ? 'Hologram Scanning' : 'Hologram Analysis'}
          </span>
        </div>

        <div className="w-8 sm:w-16 h-[1px] bg-emerald-500/20"></div>

        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            currentStep >= 3 ? 'bg-[#00e599] text-[#04120e]' : 'bg-[#071612] text-slate-400 border border-emerald-500/20'
          }`}>
            3
          </div>
          <span className={`text-xs font-bold ${currentStep >= 3 ? 'text-white' : 'text-slate-400'}`}>
            {language === 'hi' ? 'जांच परिणाम' : language === 'hinglish' ? 'Targeted Findings' : 'Targeted Findings'}
          </span>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#091b16] rounded-3xl border border-emerald-500/20 p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t('symptoms.enterSymptoms')} *
              </label>
              {activeRegion && (
                <span className="text-[11px] font-mono text-[#00e599] flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25 animate-fade-in">
                  <Target className="w-3 h-3 text-[#00e599]" />
                  <span>{language === 'hi' ? 'पहचाना गया अंग: ' : 'Localized: '}{getRegionShort(activeRegion)}</span>
                </span>
              )}
            </div>

            {/* Textarea container with mic icon & character counter */}
            <div className="relative rounded-2xl bg-[#061410] border border-emerald-500/25 p-3.5 focus-within:border-[#00e599] transition-all">
              <textarea
                rows="5"
                maxLength="500"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={t('symptoms.placeholder')}
                className="w-full bg-transparent border-none text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              ></textarea>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10">
                <button
                  type="button"
                  title="Voice input simulation"
                  onClick={() => handleChipClick(
                    language === 'hi' 
                      ? 'सुबह से बहुत तेज सिरदर्द और चक्कर आ रहे हैं' 
                      : language === 'hinglish' 
                      ? 'Subah se tez sir dard aur giddiness ho rahi hai' 
                      : 'Severe headache and dizziness since morning'
                  )}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#00e599] hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5 text-xs"
                >
                  <Mic className="w-4 h-4 text-[#00e599]" />
                  <span className="text-[10px]">{language === 'hi' ? 'आवाज़ से बोलें' : 'Voice Input'}</span>
                </button>

                <span className="text-[11px] font-mono text-slate-400">
                  {symptoms.length}/500
                </span>
              </div>
            </div>

            {/* Quick Suggestions Chips */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                {t('symptoms.quickInquiries')}:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeCommonSymptoms.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="text-xs bg-[#071612] hover:bg-emerald-500/10 text-slate-300 hover:text-[#00e599] px-3 py-1.5 rounded-full border border-emerald-500/20 transition-all hover-lift"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !symptoms.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#00e599] hover:bg-[#00c985] disabled:opacity-40 text-[#04120e] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#00e599]/25 hover-lift transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#04120e] border-t-transparent rounded-full animate-spin"></div>
                    <span>{language === 'hi' ? 'अंग स्कैनिंग व ग्रिड विश्लेषण जारी...' : language === 'hinglish' ? 'Anatomical grid scanning in progress...' : 'Triangulating Anatomical Grid...'}</span>
                  </>
                ) : (
                  <>
                    <span>{t('symptoms.analyzeBtn')}</span>
                    <ArrowRight className="w-4 h-4 text-[#04120e]" />
                  </>
                )}
              </button>

              {symptoms && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-3 bg-[#071612] border border-emerald-500/20 text-slate-400 hover:text-white rounded-xl text-xs transition-colors"
                  title={language === 'hi' ? 'रीसेट करें' : 'Reset Symptoms'}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Graphic Column: Interactive 3D Medical Hologram Visualizer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl bg-[#091b16] border border-emerald-500/25 p-5 sm:p-6 overflow-hidden shadow-2xl space-y-4">
            
            {/* Hologram Header Bar */}
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00e599] animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                  <Scan className="w-3.5 h-3.5 text-[#00e599]" />
                  <span>{language === 'hi' ? 'शरीर 3D होलोग्राम' : 'Anatomy Hologram'}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                  loading 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                    : activeRegion
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-[#00e599]'
                    : 'bg-[#071612] border-emerald-500/20 text-slate-400'
                }`}>
                  {loading 
                    ? (language === 'hi' ? 'स्कैनिंग जारी...' : 'ACTIVE SCANNING...') 
                    : activeRegion 
                    ? `${language === 'hi' ? 'पहचान' : 'LOCK'}: ${getRegionShort(activeRegion).toUpperCase()}` 
                    : (language === 'hi' ? 'स्टैंडबाय ग्रिड' : 'STANDBY GRID')}
                </span>
              </div>
            </div>

            {/* Holographic 3D Interactive Human Body Canvas */}
            <div className="relative h-80 sm:h-88 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-[#040f0c] border border-emerald-500/20 select-none">
              
              {/* Radial Holographic Backdrop Glow */}
              <div 
                className="absolute w-56 h-56 rounded-full blur-3xl opacity-35 transition-all duration-700 pointer-events-none"
                style={{ backgroundColor: activeRegion ? activeRegion.color : '#00e599' }}
              />

              {/* High-Tech Sweep Laser Line */}
              {loading && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00e599] to-transparent shadow-[0_0_20px_#00e599] animate-laser-sweep pointer-events-none z-10" />
              )}

              {/* Scanning Telemetry Overlay during Loading */}
              {loading && (
                <div className="absolute top-2 inset-x-0 text-center text-[10px] font-mono text-[#00e599] bg-[#040f0c]/85 backdrop-blur-sm py-1 border-b border-emerald-500/20 animate-pulse z-20">
                  {language === 'hi' ? 'शारीरिक अंगों और वाहिकाओं की एआई स्कैनिंग...' : 'SCANNING EPIDERMAL & VISCERAL PATHWAYS...'}
                </div>
              )}

              {/* Precision Cybernetic Wireframe SVG (viewBox: 0 0 100 160) */}
              <svg 
                className="w-48 sm:w-56 h-72 sm:h-80 transition-all duration-500 relative z-10" 
                viewBox="0 0 100 160" 
                fill="none"
              >
                {/* Cybernetic Grid & Axial Guides */}
                <circle cx="50" cy="80" r="75" stroke="#00e599" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.15" />
                <circle cx="50" cy="80" r="50" stroke="#00e599" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.1" />
                <circle cx="50" cy="80" r="25" stroke="#00e599" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.1" />
                <line x1="10" y1="80" x2="90" y2="80" stroke="#00e599" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.2" />
                <line x1="50" y1="5" x2="50" y2="155" stroke="#00e599" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.2" />

                {/* Corner Target Marks */}
                <path d="M 6 12 L 6 6 L 12 6" stroke="#00e599" strokeWidth="0.8" opacity="0.4" />
                <path d="M 94 12 L 94 6 L 88 6" stroke="#00e599" strokeWidth="0.8" opacity="0.4" />
                <path d="M 6 148 L 6 154 L 12 154" stroke="#00e599" strokeWidth="0.8" opacity="0.4" />
                <path d="M 94 148 L 94 154 L 88 154" stroke="#00e599" strokeWidth="0.8" opacity="0.4" />

                {/* Hologram Body Silhouette Lines */}
                <g stroke="#00e599" strokeWidth="1.2" opacity="0.6">
                  {/* Head & Brain Contour */}
                  <circle cx="50" cy="20" r="9" strokeDasharray="3 2" />
                  <path d="M47 17 Q50 14 53 17 Q50 20 47 23" strokeWidth="0.8" opacity="0.5" />
                  
                  {/* Cervical Neck */}
                  <line x1="47" y1="29" x2="47" y2="36" />
                  <line x1="53" y1="29" x2="53" y2="36" />

                  {/* Clavicle / Shoulders */}
                  <path d="M28 42 Q50 37 72 42" strokeWidth="1.5" />

                  {/* Thorax / Ribcage */}
                  <path d="M33 44 Q50 41 67 44 L64 64 Q50 67 36 64 Z" strokeWidth="1.3" strokeDasharray="2 2" />
                  <line x1="38" y1="49" x2="62" y2="49" strokeWidth="0.7" opacity="0.4" />
                  <line x1="39" y1="54" x2="61" y2="54" strokeWidth="0.7" opacity="0.4" />
                  <line x1="41" y1="59" x2="59" y2="59" strokeWidth="0.7" opacity="0.4" />

                  {/* Heart chamber silhouette inside chest */}
                  <path 
                    d="M48 51 C48 49 46 48 44 49 C42 50 42 53 45 55 L48 57 L51 55 C54 53 54 50 52 49 C50 48 48 49 48 51 Z" 
                    fill={activeRegion?.id === 'chest' ? '#ef4444' : 'none'}
                    stroke={activeRegion?.id === 'chest' ? '#ef4444' : '#00e599'}
                    strokeWidth="0.8"
                    opacity={activeRegion?.id === 'chest' ? '0.9' : '0.4'}
                  />

                  {/* Spinal Column */}
                  <line x1="50" y1="36" x2="50" y2="92" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.4" />

                  {/* Abdomen & Viscera */}
                  <path d="M37 66 Q50 68 63 66 L60 86 Q50 89 40 86 Z" strokeDasharray="3 2" />

                  {/* Pelvic Basin */}
                  <path d="M38 88 Q50 91 62 88 L58 104 Q50 107 42 104 Z" strokeWidth="1.3" />

                  {/* Arms & Hands */}
                  <path d="M28 42 L22 72 L18 102" strokeDasharray="2 2" />
                  <circle cx="17" cy="105" r="2" strokeWidth="0.8" />
                  <path d="M72 42 L78 72 L82 102" strokeDasharray="2 2" />
                  <circle cx="83" cy="105" r="2" strokeWidth="0.8" />

                  {/* Legs & Knees */}
                  <path d="M42 104 L37 126" strokeDasharray="3 2" />
                  <circle cx="36" cy="128" r="2.5" strokeWidth="1" />
                  <path d="M36 131 L35 152" strokeDasharray="3 2" />
                  <path d="M33 153 L38 153" strokeWidth="1.5" />

                  <path d="M58 104 L63 126" strokeDasharray="3 2" />
                  <circle cx="64" cy="128" r="2.5" strokeWidth="1" />
                  <path d="M64 131 L65 152" strokeDasharray="3 2" />
                  <path d="M62 153 L67 153" strokeWidth="1.5" />
                </g>

                {/* Target Lock Reticle over Active Anatomical Region */}
                {activeRegion && (
                  <g className="animate-fade-in">
                    {/* Concentric Sonar Ping Wave */}
                    <circle 
                      cx={activeRegion.cx} 
                      cy={activeRegion.cy} 
                      r="16" 
                      fill="none" 
                      stroke={activeRegion.color} 
                      strokeWidth="1.2" 
                      className="animate-ping" 
                      opacity="0.8"
                    />

                    {/* Rotating Crosshair Radar Ring */}
                    <circle 
                      cx={activeRegion.cx} 
                      cy={activeRegion.cy} 
                      r="11" 
                      fill="none" 
                      stroke={activeRegion.color} 
                      strokeWidth="1.5" 
                      strokeDasharray="4 2" 
                      className="animate-spin-slow" 
                    />

                    {/* Precision Crosshair Ticks */}
                    <line x1={activeRegion.cx - 7} y1={activeRegion.cy} x2={activeRegion.cx + 7} y2={activeRegion.cy} stroke={activeRegion.color} strokeWidth="1" />
                    <line x1={activeRegion.cx} y1={activeRegion.cy - 7} x2={activeRegion.cx + 7} y2={activeRegion.cy} stroke={activeRegion.color} strokeWidth="1" />

                    {/* Center Core Beacon */}
                    <circle cx={activeRegion.cx} cy={activeRegion.cy} r="4" fill={activeRegion.color} />
                    <circle cx={activeRegion.cx} cy={activeRegion.cy} r="1.5" fill="#ffffff" />
                  </g>
                )}

                {/* Interactive Clickable Anatomical Hotspots */}
                {BODY_REGIONS.map((r) => {
                  const isHovered = hoveredRegion?.id === r.id;
                  const isActive = activeRegion?.id === r.id;
                  return (
                    <g 
                      key={r.id} 
                      onClick={() => handleSelectRegion(r)}
                      onMouseEnter={() => setHoveredRegion(r)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      className="cursor-pointer group"
                    >
                      {/* Transparent Hover Hitbox */}
                      <circle cx={r.cx} cy={r.cy} r="10" fill="transparent" />

                      {/* Passive Node Marker */}
                      {!isActive && (
                        <circle 
                          cx={r.cx} 
                          cy={r.cy} 
                          r={isHovered ? "4" : "2.5"} 
                          fill={isHovered ? r.color : 'rgba(0,229,153,0.3)'}
                          stroke={isHovered ? '#ffffff' : '#00e599'} 
                          strokeWidth="1"
                          className="transition-all duration-200"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Floating High-Tech HUD Target Card */}
              {activeRegion && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 max-w-[210px] bg-[#071612]/95 border border-emerald-500/40 backdrop-blur-md rounded-2xl p-3 shadow-2xl text-left pointer-events-none z-20 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-wider" style={{ color: activeRegion.color }}>
                    <Crosshair className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>{language === 'hi' ? 'अंग लॉक हुआ' : 'Target Lock Acquired'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-base">{activeRegion.icon}</span>
                    <h4 className="text-xs font-bold text-white leading-tight">{getRegionShort(activeRegion)}</h4>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1 font-light leading-snug">
                    {analysisResult?.affectedBodyPart?.clinicalNotes || getRegionDesc(activeRegion)}
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-emerald-500/15 flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span>GRID: {activeRegion.cx}X / {activeRegion.cy}Y</span>
                    <span className="font-bold" style={{ color: activeRegion.color }}>LOCKED</span>
                  </div>
                </div>
              )}

              {/* Bottom Mode Status */}
              <div className="absolute bottom-2 inset-x-0 text-center text-[10px] text-slate-400 font-mono flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse"></span>
                <span>{activeRegion ? `${language === 'hi' ? 'सक्रिय अंग' : 'Active Node'}: ${getRegionName(activeRegion)}` : (language === 'hi' ? 'समस्या वाले अंग को चुनने के लिए क्लिक करें' : 'Click body nodes to isolate problem area')}</span>
              </div>
            </div>

            {/* Quick Anatomical Region Click Selector */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('symptoms.selectBodyRegion')}:
                </span>
                {selectedRegionId && (
                  <button
                    type="button"
                    onClick={() => setSelectedRegionId(null)}
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>{language === 'hi' ? 'स्वचालित पहचान' : 'Auto-detect'}</span>
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {BODY_REGIONS.map((r) => {
                  const isSelected = activeRegion?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelectRegion(r)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 border-[#00e599] text-white font-bold shadow-md shadow-[#00e599]/15 scale-105'
                          : 'bg-[#071612] border-emerald-500/15 text-slate-300 hover:text-white hover:border-emerald-500/40 hover:bg-emerald-500/10'
                      }`}
                    >
                      <span>{r.icon}</span>
                      <span>{getRegionShort(r)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checklist Box */}
            <div className="mt-4 pt-3 border-t border-emerald-500/15 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-[#00e599] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#00e599]" />
                </div>
                <span>{language === 'hi' ? 'शरीर के प्रभावित अंग की सटीक पहचान' : 'Identifies exact anatomical organ system'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-[#00e599] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#00e599]" />
                </div>
                <span>{language === 'hi' ? 'संबंधित विशेषज्ञ डॉक्टरों से मिलान' : 'Matches corresponding clinical specialists'}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div id="analysis-results" className="pt-6 space-y-6 animate-slide-up">
          
          {/* Triage Banner */}
          {(() => {
            const badge = getTriageBadge(analysisResult.triageLevel);
            const Icon = badge.icon;
            return (
              <div className={`p-5 rounded-2xl border ${badge.bg} flex items-center gap-4 shadow-xl`}>
                <div className="p-3 rounded-xl bg-black/20">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">{badge.text}</h3>
                  <p className="text-xs opacity-90 mt-0.5">{badge.desc}</p>
                </div>
              </div>
            );
          })()}

          {/* Hologram Diagnostic Localization Findings Card */}
          {analysisResult.affectedBodyPart && (
            <div className="bg-[#091b16] rounded-3xl border border-emerald-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg border"
                    style={{ 
                      backgroundColor: `${analysisResult.affectedBodyPart.color || '#00e599'}15`,
                      borderColor: `${analysisResult.affectedBodyPart.color || '#00e599'}40`
                    }}
                  >
                    {activeRegion?.icon || '🎯'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#00e599] tracking-wider flex items-center gap-1">
                        <Crosshair className="w-3 h-3" />
                        <span>{language === 'hi' ? 'होलोग्राम असामान्यता की पहचान' : 'Hologram Anomaly Identified'}</span>
                      </span>
                      <span 
                        className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider border"
                        style={{
                          backgroundColor: `${analysisResult.affectedBodyPart.color || '#00e599'}20`,
                          borderColor: `${analysisResult.affectedBodyPart.color || '#00e599'}50`,
                          color: analysisResult.affectedBodyPart.color || '#00e599'
                        }}
                      >
                        {analysisResult.affectedBodyPart.badge || (language === 'hi' ? 'अंग पहचान' : 'Anatomical Lock')}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white mt-0.5">
                      {analysisResult.affectedBodyPart.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {analysisResult.affectedBodyPart.clinicalNotes || (language === 'hi' ? 'एआई क्लीनिकल ट्राइएज ने दर्ज लक्षणों को इस शारीरिक प्रणाली से संबद्ध पाया है।' : 'The AI clinical triage engine localized the reported symptoms to this physiological system.')}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 bg-[#061410] sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-none border-emerald-500/15">
                  <span className="text-[10px] font-mono text-slate-400 block">
                    {language === 'hi' ? 'पहचाना गया अंग तंत्र' : 'Identified Organ System'}
                  </span>
                  <span className="text-xs font-bold text-[#00e599] block mt-0.5">
                    {analysisResult.affectedBodyPart.organ || analysisResult.affectedBodyPart.region}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                    Target: {analysisResult.affectedBodyPart.coordinates?.x}% X, {analysisResult.affectedBodyPart.coordinates?.y}% Y
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Diagnosis & Specialist */}
          <div className="bg-[#091b16] rounded-3xl border border-emerald-500/20 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/15 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {language === 'hi' ? 'सुझाई गई विशेषज्ञता' : 'Recommended Specialty'}
                </span>
                <h2 className="text-2xl font-extrabold text-[#00e599]">
                  {analysisResult.recommendedSpecialization}
                </h2>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-[#00e599] border border-emerald-500/30 w-fit">
                {language === 'hi' ? 'एआई क्लीनिकल मैच' : 'AI Clinical Match'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {analysisResult.conditionSummary}
            </p>

            {/* Differential considerations */}
            {analysisResult.possibleConditions && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  {language === 'hi' ? 'संभावित चिकित्सीय स्थितियां' : 'Differential Considerations'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysisResult.possibleConditions.map((cond, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-[#061410] border border-emerald-500/15">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-xs text-white">{cond.name}</h4>
                        <span className="text-[10px] text-[#00e599] font-bold">
                          {cond.likelihood}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{cond.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions to ask doctor */}
            {analysisResult.suggestedQuestions && (
              <div className="pt-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                  {language === 'hi' ? 'डॉक्टर से परामर्श हेतु महत्वपूर्ण प्रश्न' : 'Questions to Prepare for Your Doctor'}
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysisResult.suggestedQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-[#00e599] mt-0.5 shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Matched Doctors in ₹ INR */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-white">
              {language === 'hi' 
                ? `दिल्ली में उपलब्ध ${analysisResult.recommendedSpecialization} विशेषज्ञ` 
                : `Available ${analysisResult.recommendedSpecialization}s in Delhi`}
            </h3>
            {analysisResult.recommendedDoctors && analysisResult.recommendedDoctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysisResult.recommendedDoctors.map((doc) => (
                  <div
                    key={doc._id}
                    className="p-4 rounded-2xl bg-[#091b16] border border-emerald-500/15 flex flex-col justify-between hover-lift shadow-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-[#00e599] flex items-center justify-center font-bold text-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white">{doc.name}</h4>
                          <p className="text-[10px] text-[#00e599]">{doc.specialization}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">{doc.hospital || 'Fortis Hospital, Delhi'}</p>
                      <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
                        <span>{doc.experience} {language === 'hi' ? 'वर्ष अनुभव' : 'Yrs Exp.'}</span>
                        <span className="font-bold text-white">₹{doc.fees}</span>
                      </div>
                    </div>

                    <Link
                      to={`/book/${doc._id}`}
                      className="w-full py-2 px-3 bg-[#00e599] hover:bg-[#00c985] text-[#04120e] font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>{t('chatbot.bookBtn')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#091b16] text-center text-xs text-slate-400">
                {language === 'hi' ? 'मुख्य पृष्ठ पर सभी उपलब्ध विशेषज्ञों को देखें।' : 'Browse all specialists on the home page.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISymptomChecker;
