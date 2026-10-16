import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    label: 'English',
    native: 'English',
    flag: '🇬🇧',
    description: 'Complete English clinical interface'
  },
  {
    code: 'hi',
    label: 'Hindi',
    native: 'हिन्दी',
    flag: '🇮🇳',
    description: 'सम्पूर्ण हिन्दी क्लीनिकल इंटरफ़ेस'
  },
  {
    code: 'hinglish',
    label: 'Hinglish',
    native: 'Hinglish',
    flag: '🇮🇳',
    description: 'Conversational Hindi in English script'
  }
];

const TRANSLATIONS = {
  // Navigation
  'nav.findDoctors': {
    en: 'Find Doctors',
    hi: 'डॉक्टर खोजें',
    hinglish: 'Doctors Khojein'
  },
  'nav.aiSymptomChecker': {
    en: 'AI Symptom Checker',
    hi: 'एआई लक्षण जांच',
    hinglish: 'AI Symptom Checker'
  },
  'nav.prescriptionOCR': {
    en: 'Prescription OCR',
    hi: 'प्रिस्क्रिप्शन स्कैनर',
    hinglish: 'Prescription OCR'
  },
  'nav.myBookings': {
    en: 'My Bookings',
    hi: 'मेरी अपॉइंटमेंट्स',
    hinglish: 'Meri Bookings'
  },
  'nav.doctorPanel': {
    en: 'Doctor Panel',
    hi: 'डॉक्टर पैनल',
    hinglish: 'Doctor Panel'
  },
  'nav.adminPanel': {
    en: 'Admin Panel',
    hi: 'एडमिन पैनल',
    hinglish: 'Admin Panel'
  },
  'nav.signIn': {
    en: 'Sign In',
    hi: 'लॉग इन',
    hinglish: 'Sign In'
  },
  'nav.createAccount': {
    en: 'Create Account',
    hi: 'खाता बनाएं',
    hinglish: 'Account Banayein'
  },
  'nav.patientProfile': {
    en: 'Patient Profile',
    hi: 'मरीज़ प्रोफ़ाइल',
    hinglish: 'Patient Profile'
  },
  'nav.logOut': {
    en: 'Log Out',
    hi: 'लॉग आउट',
    hinglish: 'Log Out'
  },
  'nav.selectLanguage': {
    en: 'Select Language',
    hi: 'भाषा चुनें',
    hinglish: 'Language Chunein'
  },

  // Patient Dashboard & Profile
  'patient.languageTitle': {
    en: 'Language & Regional Preference',
    hi: 'भाषा एवं क्षेत्रीय प्राथमिकता',
    hinglish: 'Language & Regional Preference'
  },
  'patient.languageSubtitle': {
    en: 'Select your preferred language. The entire website, symptom analysis, and AI assistant will adapt to your choice.',
    hi: 'अपनी पसंदीदा भाषा चुनें। पूरी वेबसाइट, लक्षण विश्लेषण और एआई सहायक आपके चयन के अनुसार कार्य करेंगे।',
    hinglish: 'Apni pasandeeda bhasha chunein. Pura website, symptom analysis aur AI assistant aapki choice ke according chalenge.'
  },
  'patient.activeBadge': {
    en: 'Active Language',
    hi: 'सक्रिय भाषा',
    hinglish: 'Active Language'
  },
  'patient.verifiedPatient': {
    en: 'Verified Patient',
    hi: 'सत्यापित मरीज़',
    hinglish: 'Verified Patient'
  },
  'patient.uploadPhoto': {
    en: 'Upload Photo',
    hi: 'फोटो अपलोड करें',
    hinglish: 'Photo Upload Karein'
  },
  'patient.chooseAvatar': {
    en: 'Choose Avatar',
    hi: 'अवतार चुनें',
    hinglish: 'Avatar Chunein'
  },
  'patient.remove': {
    en: 'Remove',
    hi: 'हटाएं',
    hinglish: 'Remove Karein'
  },
  'patient.emailAddress': {
    en: 'Email Address',
    hi: 'ईमेल पता',
    hinglish: 'Email Address'
  },
  'patient.phoneContact': {
    en: 'Phone Contact',
    hi: 'फ़ोन नंबर',
    hinglish: 'Phone Contact'
  },
  'patient.notAdded': {
    en: 'Not added',
    hi: 'दर्ज नहीं',
    hinglish: 'Not added'
  },
  'patient.myAppointments': {
    en: 'My Booked Appointments',
    hi: 'मेरी बुक की गई अपॉइंटमेंट्स',
    hinglish: 'Meri Booked Appointments'
  },
  'patient.total': {
    en: 'Total',
    hi: 'कुल',
    hinglish: 'Total'
  },
  'patient.date': {
    en: 'Date',
    hi: 'तारीख',
    hinglish: 'Date'
  },
  'patient.time': {
    en: 'Time',
    hi: 'समय',
    hinglish: 'Time'
  },
  'patient.paidFee': {
    en: 'Paid Fee',
    hi: 'परामर्श शुल्क',
    hinglish: 'Paid Fee'
  },
  'patient.cancelAppt': {
    en: 'Cancel Appointment',
    hi: 'अपॉइंटमेंट रद्द करें',
    hinglish: 'Appointment Cancel Karein'
  },
  'patient.noAppointments': {
    en: 'No Appointments Booked',
    hi: 'कोई अपॉइंटमेंट बुक नहीं है',
    hinglish: 'Koi Appointment Booked Nahi Hai'
  },
  'patient.noAppointmentsDesc': {
    en: "You haven't booked any medical appointments yet.",
    hi: 'आपने अभी तक कोई डॉक्टर अपॉइंटमेंट बुक नहीं किया है।',
    hinglish: 'Aapne abhi tak koi medical appointment book nahi kiya hai.'
  },
  'patient.selectAvatarTitle': {
    en: 'Select a Medical Profile Avatar:',
    hi: 'मेडिकल प्रोफ़ाइल अवतार चुनें:',
    hinglish: 'Medical Profile Avatar Chunein:'
  },
  'patient.uploadCustom': {
    en: 'Upload custom file',
    hi: 'फ़ाइल अपलोड करें',
    hinglish: 'Custom file upload karein'
  },
  'patient.close': {
    en: 'Close',
    hi: 'बंद करें',
    hinglish: 'Band Karein'
  },

  // Home Page
  'home.badge': {
    en: 'Next-Gen AI Healthcare Ecosystem',
    hi: 'नेक्स्ट-जेन एआई स्वास्थ्य सेवा नेटवर्क',
    hinglish: 'Next-Gen AI Healthcare Ecosystem'
  },
  'home.heroTitle1': {
    en: 'AI-Powered Doctor Booking &',
    hi: 'एआई-संचालित डॉक्टर बुकिंग एवं',
    hinglish: 'AI-Powered Doctor Booking &'
  },
  'home.heroTitle2': {
    en: 'Clinical Diagnostics',
    hi: 'क्लीनिकल स्वास्थ्य सेवा',
    hinglish: 'Clinical Diagnostics'
  },
  'home.heroDesc': {
    en: 'Find verified doctors, get AI-powered symptom analysis, scan prescriptions and lab reports, and book appointments — all in one place.',
    hi: 'सत्यापित डॉक्टर खोजें, एआई द्वारा लक्षण जांच कराएं, पर्चा व लैब रिपोर्ट स्कैन करें और तुरंत अपॉइंटमेंट बुक करें - सब एक ही स्थान पर।',
    hinglish: 'Verified doctors khojein, AI symptom analysis paayein, prescription scan karein aur appointment book karein - sab ek jagah.'
  },
  'home.heroSubtitle': {
    en: 'Find verified doctors, get AI-powered symptom analysis, scan prescriptions and lab reports, and book appointments — all in one place.',
    hi: 'सत्यापित डॉक्टर खोजें, एआई द्वारा लक्षण जांच कराएं, पर्चा व लैब रिपोर्ट स्कैन करें और तुरंत अपॉइंटमेंट बुक करें - सब एक ही स्थान पर।',
    hinglish: 'Verified doctors khojein, AI symptom analysis paayein, prescription scan karein aur appointment book karein - sab ek jagah.'
  },
  'home.searchPlaceholder': {
    en: 'Search doctors, specialties, clinics...',
    hi: 'डॉक्टर, विशेषज्ञता अथवा क्लीनिक खोजें...',
    hinglish: 'Doctors, specialties, clinics search karein...'
  },
  'home.locationPlaceholder': {
    en: 'Enter location...',
    hi: 'स्थान दर्ज करें...',
    hinglish: 'Location enter karein...'
  },
  'home.verifiedDoctors': {
    en: 'Verified Doctors',
    hi: 'सत्यापित डॉक्टर',
    hinglish: 'Verified Doctors'
  },
  'home.securePrivate': {
    en: 'Secure & Private',
    hi: 'सुरक्षित व गोपनीय',
    hinglish: 'Secure & Private'
  },
  'home.instantBooking': {
    en: 'Instant Booking',
    hi: 'त्वरित बुकिंग',
    hinglish: 'Instant Booking'
  },
  'home.aiInsights': {
    en: 'AI-Powered Insights',
    hi: 'एआई संचालित विश्लेषण',
    hinglish: 'AI-Powered Insights'
  },
  'home.findRightDoctor': {
    en: 'Find the Right Doctor',
    hi: 'सही डॉक्टर खोजें',
    hinglish: 'Sahi Doctor Khojein'
  },
  'home.findRightDoctorSubtitle': {
    en: 'Book appointments with certified and experienced doctors across multiple specialties.',
    hi: 'विभिन्न विशेषताओं में प्रमाणित और अनुभवी डॉक्टरों के साथ अपॉइंटमेंट बुक करें।',
    hinglish: 'Multiple specialties me certified aur experienced doctors ke sath appointment book karein.'
  },
  'home.specialistsTitle': {
    en: 'Verified Medical Specialists',
    hi: 'सत्यापित चिकित्सा विशेषज्ञ',
    hinglish: 'Verified Medical Specialists'
  },
  'home.specialistsSubtitle': {
    en: 'Book in-person or video consultations with verified physicians in Delhi NCR.',
    hi: 'दिल्ली एनसीआर के सत्यापित चिकित्सकों के साथ व्यक्तिगत अथवा वीडियो परामर्श बुक करें।',
    hinglish: 'Delhi NCR ke verified doctors ke sath consultation schedule karein.'
  },
  'home.allCategories': {
    en: 'All',
    hi: 'सभी',
    hinglish: 'All'
  },

  // OCR Prescription & Lab Scanner
  'ocr.title': {
    en: 'Prescription & Lab OCR Scanner',
    hi: 'प्रिस्क्रिप्शन एवं लैब रिपोर्ट ओसीआर स्कैनर',
    hinglish: 'Prescription & Lab OCR Scanner'
  },
  'ocr.subtitle': {
    en: 'Upload or paste prescriptions and laboratory reports. Our clinical AI extracts medications, dosages, and biomarkers instantly.',
    hi: 'डॉक्टर का पर्चा या पैथोलॉजी रिपोर्ट अपलोड करें अथवा टेक्स्ट दर्ज करें। हमारा एआई दवाइयां, खुराक और जांच परिणाम तुरंत निकालेगा।',
    hinglish: 'Prescriptions aur lab reports upload ya paste karein. Hamara AI medicines, dosages aur biomarkers instantly extract karega.'
  },
  'ocr.docType': {
    en: 'Document Type',
    hi: 'दस्तावेज़ का प्रकार',
    hinglish: 'Document Type'
  },
  'ocr.prescription': {
    en: 'Doctor Prescription (Rx)',
    hi: 'डॉक्टर का पर्चा (Rx)',
    hinglish: 'Doctor Prescription (Rx)'
  },
  'ocr.labReport': {
    en: 'Laboratory / Blood Report',
    hi: 'लैब / रक्त परीक्षण रिपोर्ट',
    hinglish: 'Lab / Blood Report'
  },
  'ocr.uploadTab': {
    en: 'Upload Image / Scan',
    hi: 'फ़ाइल अपलोड करें',
    hinglish: 'Image Upload Karein'
  },
  'ocr.pasteTab': {
    en: 'Paste or Type Text',
    hi: 'टेक्स्ट दर्ज या पेस्ट करें',
    hinglish: 'Text Paste Karein'
  },
  'ocr.pastePlaceholder': {
    en: 'Paste prescription medicines or lab report test numbers here (e.g., Augmentin 625mg BD 5 days, or Total Cholesterol: 248 mg/dL, HDL: 44, Hb: 11.8)...',
    hi: 'पर्चे की दवाइयां या लैब जांच के आंकड़े यहां पेस्ट करें (जैसे: Augmentin 625mg BD 5 दिन, या Total Cholesterol: 248 mg/dL, Hb: 11.8)...',
    hinglish: 'Prescription medicines ya lab report numbers yahan paste karein (jaise: Augmentin 625mg BD, Total Cholesterol: 248 mg/dL, Hb: 11.8)...'
  },
  'ocr.processBtn': {
    en: 'Process Document with AI',
    hi: 'एआई द्वारा दस्तावेज़ विश्लेषण करें',
    hinglish: 'AI Se Document Analyze Karein'
  },
  'ocr.scanning': {
    en: 'Scanning Document with Vision OCR...',
    hi: 'विज़न ओसीआर द्वारा दस्तावेज़ स्कैन जारी है...',
    hinglish: 'Scanning Document with Vision OCR...'
  },
  'ocr.demoSamples': {
    en: 'Try Preloaded Interactive Demo Samples:',
    hi: 'डेमो सैम्पल जांच कर देखें:',
    hinglish: 'Try Preloaded Interactive Demo Samples:'
  },


  // AI Symptom Checker
  'symptoms.badge': {
    en: 'Holographic Medical Triage AI',
    hi: 'होलोग्राफिक मेडिकल ट्राइएज एआई',
    hinglish: 'Holographic Medical Triage AI'
  },
  'symptoms.title': {
    en: 'AI Holographic Symptom Checker',
    hi: 'एआई होलोग्राफिक लक्षण विश्लेषक',
    hinglish: 'AI Holographic Symptom Checker'
  },
  'symptoms.subtitle': {
    en: 'Interactive 3D anatomical triage engine detecting physiological trauma & recommending platform specialists.',
    hi: 'शारीरिक लक्षणों का सटीक त्रि-आयामी एनाटॉमिकल ट्राइएज एवं विशेषज्ञ डॉक्टर सिफारिश।',
    hinglish: 'Interactive anatomical triage engine jo symptoms analyze karke specialist doctors recommend karta hai.'
  },
  'symptoms.describeTitle': {
    en: 'Describe Your Symptoms',
    hi: 'अपने लक्षणों का विवरण दें',
    hinglish: 'Apne Symptoms Describe Karein'
  },
  'symptoms.placeholder': {
    en: 'Describe your symptoms in detail (e.g., severe throbbing headache for 2 days with mild fever and nausea)...',
    hi: 'अपने लक्षणों का विस्तार से विवरण दें (जैसे: 2 दिनों से तेज सिरदर्द, हल्का बुखार और चक्कर आना)...',
    hinglish: 'Apne symptoms detail me batayein (jaise: 2 din se tez sar dard, halka bukhar aur ulti aana)...'
  },
  'symptoms.selectBodyRegion': {
    en: 'Select Affected Body Region',
    hi: 'प्रभावित शारीरिक अंग चुनें',
    hinglish: 'Affected Body Part Chunein'
  },
  'symptoms.quickInquiries': {
    en: 'Quick Clinical Inquiries',
    hi: 'त्वरित लक्षण उदाहरण',
    hinglish: 'Quick Symptom Examples'
  },
  'symptoms.analyzeBtn': {
    en: 'Analyze Symptoms with AI',
    hi: 'एआई द्वारा लक्षण विश्लेषण करें',
    hinglish: 'AI Se Symptoms Analyze Karein'
  },
  'symptoms.scanningBtn': {
    en: 'Scanning Hologram & Clinical Triage...',
    hi: 'होलोग्राम स्कैन एवं ट्राइएज जारी है...',
    hinglish: 'Scanning Hologram & Clinical Triage...'
  },
  'symptoms.resultsTitle': {
    en: 'Clinical Diagnostic Triage',
    hi: 'क्लीनिकल डायग्नोस्टिक ट्राइएज',
    hinglish: 'Clinical Diagnostic Triage'
  },

  // Chatbot
  'chatbot.btnLabel': {
    en: 'Clinical AI Assistant',
    hi: 'क्लीनिकल एआई सहायक',
    hinglish: 'Clinical AI Assistant'
  },
  'chatbot.badge': {
    en: 'Clinical Consultant',
    hi: 'क्लीनिकल परामर्शदाता',
    hinglish: 'Clinical Consultant'
  },
  'chatbot.placeholder': {
    en: 'Describe symptoms or ask a medical question...',
    hi: 'लक्षण बताएं अथवा स्वास्थ्य प्रश्न पूछें...',
    hinglish: 'Apne symptoms ya health question likhein...'
  },
  'chatbot.disclaimer': {
    en: 'Clinical AI Medical Triage • In case of emergency, call 108/112 or visit nearest ER immediately.',
    hi: 'क्लीनिकल एआई मेडिकल ट्राइएज • आपातकाल में तुरंत 108/112 अथवा निकटतम इमरजेंसी वार्ड में संपर्क करें।',
    hinglish: 'Clinical AI Triage • Emergency me turant 108/112 par call karein ya hospital visit karein.'
  },
  'chatbot.recommendedDocs': {
    en: 'Recommended Specialists',
    hi: 'अनुशंसित विशेषज्ञ डॉक्टर',
    hinglish: 'Recommended Specialists'
  },
  'chatbot.bookBtn': {
    en: 'Book',
    hi: 'बुक करें',
    hinglish: 'Book'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('arogya_language') || 'en';
  });

  const setLanguage = (newLang) => {
    if (['en', 'hi', 'hinglish'].includes(newLang)) {
      setLanguageState(newLang);
      localStorage.setItem('arogya_language', newLang);
      document.documentElement.lang = newLang === 'hi' ? 'hi' : 'en';
    }
  };

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  const t = (key, fallback = '') => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][language]) {
      return TRANSLATIONS[key][language];
    }
    if (TRANSLATIONS[key] && TRANSLATIONS[key]['en']) {
      return TRANSLATIONS[key]['en'];
    }
    if (fallback) return fallback;
    const parts = key.split('.');
    const lastPart = parts[parts.length - 1];
    return lastPart.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };


  const currentLanguageObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguageObj
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
