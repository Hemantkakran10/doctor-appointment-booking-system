import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import DoctorCard from '../components/DoctorCard';
import {
  Search,
  Stethoscope,
  Star,
  Heart,
  User,
  Sparkles,
  Smile,
  ShieldCheck,
  Lock,
  Calendar,
  Zap,
  MapPin,
  ChevronDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Scan,
  Bot,
  Activity,
  FileText,
  CheckCircle2,
  SlidersHorizontal,
  Play,
  Pause,
  Award,
  Users,
  Building2,
  ExternalLink
} from 'lucide-react';

const HighlightText = ({ text, query }) => {
  if (!query) return <span>{text}</span>;

  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return <span>{text}</span>;

  const escapedWords = words.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');

  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        const matches = regex.test(part);
        regex.lastIndex = 0;
        return matches ? (
          <mark key={index} className="bg-[#00e599]/30 text-[#00e599] font-bold px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
};

// Auto-transitioning Hero Photo Showcase configuration
const HERO_SLIDES = [
  {
    id: 'pm-modi',
    image: '/assets/pm_modi.jpg',
    imagePosition: 'object-top',
    tag: {
      en: 'Ayushman Bharat Digital Mission (ABDM)',
      hi: 'आयुष्मान भारत डिजिटल मिशन (ABDM)',
      hinglish: 'Ayushman Bharat Digital Mission'
    },
    quote: {
      en: 'Swasth Bharat, Sashakt Bharat',
      hi: 'स्वस्थ भारत, सशक्त भारत',
      hinglish: 'Swasth Bharat, Sashakt Bharat'
    },
    title: {
      en: 'Hon\'ble PM Shri Narendra Modi',
      hi: 'माननीय प्रधानमंत्री श्री नरेन्द्र मोदी',
      hinglish: 'Hon\'ble PM Shri Narendra Modi'
    },
    subtitle: {
      en: 'Universal, tech-enabled healthcare for 140 Cr+ citizens with ABHA digital health accounts & PM-JAY coverage.',
      hi: '140 करोड़+ नागरिकों के लिए आभा डिजिटल हेल्थ अकाउंट और पीएम-जय सुरक्षा के साथ सुलभ व आधुनिक स्वास्थ्य सेवा।',
      hinglish: '140 Cr+ citizens ke liye ABHA Digital Health Account aur PM-JAY ke sath modern healthcare.'
    },
    badge1: {
      title: { en: 'ABHA Health ID', hi: 'आभा हेल्थ कार्ड', hinglish: 'ABHA Health Card' },
      desc: { en: '140 Cr+ Citizens', hi: '140 करोड़+ नागरिक', hinglish: '140 Cr+ Citizens' },
      icon: 'shield'
    },
    badge2: {
      title: { en: 'PM-JAY Empanelled', hi: 'पीएम-जय संबद्ध', hinglish: 'PM-JAY Empanelled' },
      desc: { en: '₹5L Cashless Cover', hi: '₹5 लाख मुफ्त उपचार', hinglish: '₹5L Cashless Cover' },
      icon: 'heart'
    },
    pill: {
      en: '🇮🇳 PM Modi (ABDM)',
      hi: '🇮🇳 पीएम मोदी (ABDM)',
      hinglish: '🇮🇳 PM Modi (ABDM)'
    },
    tagColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
  },
  {
    id: 'verified-doctors',
    image: '/assets/doctor_hero.jpg',
    imagePosition: 'object-center',
    tag: {
      en: 'Top Verified Specialists',
      hi: 'शीर्ष सत्यापित विशेषज्ञ',
      hinglish: 'Top Verified Specialists'
    },
    quote: {
      en: 'Better Health, Brighter Days',
      hi: 'बेहतर स्वास्थ्य, सुखद जीवन',
      hinglish: 'Better Health, Brighter Days'
    },
    title: {
      en: '10,000+ Certified Doctors',
      hi: '10,000+ प्रमाणित डॉक्टर्स',
      hinglish: '10,000+ Certified Doctors'
    },
    subtitle: {
      en: 'Consult top doctors from AIIMS, Apollo, Max and Fortis hospitals with verified patient reviews.',
      hi: 'एम्स, अपोलो, मैक्स और फोर्टिस जैसे प्रतिष्ठित अस्पतालों के डॉक्टरों से सत्यापित समीक्षाओं के साथ परामर्श करें।',
      hinglish: 'AIIMS, Apollo, Max aur Fortis hospitals ke top doctors se instant consultation karein.'
    },
    badge1: {
      title: { en: 'Personalized Care', hi: 'व्यक्तिगत परामर्श', hinglish: 'Personalized Care' },
      desc: { en: 'Health Insights', hi: 'स्वास्थ्य परामर्श', hinglish: 'Health Insights' },
      icon: 'activity'
    },
    badge2: {
      title: { en: '10K+ Specialists', hi: '10K+ विशेषज्ञ', hinglish: '10K+ Specialists' },
      desc: { en: '4.9★ Top Rated', hi: '4.9★ उच्च रेटेड', hinglish: '4.9★ Top Rated' },
      icon: 'users'
    },
    pill: {
      en: '👨‍⚕️ Top Doctors',
      hi: '👨‍⚕️ शीर्ष डॉक्टर',
      hinglish: '👨‍⚕️ Top Doctors'
    },
    tagColor: 'text-[#00e599] border-emerald-500/40 bg-emerald-500/10'
  },
  {
    id: 'opd-consult',
    image: '/assets/doctor_consult.jpg',
    imagePosition: 'object-center',
    tag: {
      en: 'Hospital OPD & Tele-Consult',
      hi: 'अस्पताल ओपीडी व टेली-कंसल्ट',
      hinglish: 'Hospital OPD & Tele-Consult'
    },
    quote: {
      en: 'Zero Wait Time Appointments',
      hi: 'शून्य प्रतीक्षा समय अपॉइंटमेंट',
      hinglish: 'Zero Wait Time Appointments'
    },
    title: {
      en: 'Clinical & Online Consultations',
      hi: 'क्लिनिक व ऑनलाइन परामर्श',
      hinglish: 'Clinical & Online Consultations'
    },
    subtitle: {
      en: 'Skip physical hospital queues with guaranteed appointment slots, video teleconsultation, and instant e-prescriptions.',
      hi: 'अस्पताल की लंबी कतारों से बचें - गारंटीड अपॉइंटमेंट स्लॉट, वीडियो परामर्श और तुरंत डिजिटल प्रिस्क्रिप्शन पाएं।',
      hinglish: 'Hospital lines skip karein - guaranteed slots, video consultation aur instant e-prescription paayein.'
    },
    badge1: {
      title: { en: 'Instant OPD Pass', hi: 'त्वरित ओपीडी पास', hinglish: 'Instant OPD Pass' },
      desc: { en: 'No Queue Waiting', hi: 'बिना लाइन प्रतीक्षा', hinglish: 'No Queue Waiting' },
      icon: 'calendar'
    },
    badge2: {
      title: { en: '24x7 Emergency', hi: '24x7 इमरजेंसी', hinglish: '24x7 Emergency' },
      desc: { en: 'Audio & Video Call', hi: 'ऑडियो व वीडियो कॉल', hinglish: 'Audio & Video Call' },
      icon: 'zap'
    },
    pill: {
      en: '🏥 Clinical OPD',
      hi: '🏥 क्लिनिकल ओपीडी',
      hinglish: '🏥 Clinical OPD'
    },
    tagColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10'
  },
  {
    id: 'ai-diagnostics',
    image: '/assets/lab_diagnostics.jpg',
    imagePosition: 'object-center',
    tag: {
      en: 'Vision OCR & 3D Hologram',
      hi: 'विजन ओसीआर व 3D होलोग्राम',
      hinglish: 'Vision OCR & 3D Hologram'
    },
    quote: {
      en: 'Neural Health Intelligence',
      hi: 'आधुनिक न्यूरल स्वास्थ्य तकनीक',
      hinglish: 'Neural Health Intelligence'
    },
    title: {
      en: 'Prescription OCR & 3D Anatomy',
      hi: 'प्रिस्क्रिप्शन ओसीआर व 3D एनाटॉमी',
      hinglish: 'Prescription OCR & 3D Anatomy'
    },
    subtitle: {
      en: 'Scan handwritten doctor notes and lab tests with Vision AI, and inspect health concerns on our interactive 3D body hologram.',
      hi: 'हस्तलिखित डॉक्टर के पर्चे और लैब रिपोर्ट को विजन एआई से स्कैन करें और 3D बॉडी होलोग्राम पर जांचें।',
      hinglish: 'Handwritten prescription aur lab reports scan karein aur 3D body hologram par inspect karein.'
    },
    badge1: {
      title: { en: 'Vision OCR', hi: 'विजन ओसीआर', hinglish: 'Vision OCR' },
      desc: { en: 'Multi-lingual Scan', hi: 'बहुभाषी स्कैन', hinglish: 'Multi-lingual Scan' },
      icon: 'scan'
    },
    badge2: {
      title: { en: '3D Hologram', hi: '3D होलोग्राम', hinglish: '3D Hologram' },
      desc: { en: 'Body Symptom Map', hi: 'शरीर लक्षण मैप', hinglish: 'Body Symptom Map' },
      icon: 'bot'
    },
    pill: {
      en: '🔬 AI Diagnostics',
      hi: '🔬 एआई डायग्नोस्टिक्स',
      hinglish: '🔬 AI Diagnostics'
    },
    tagColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10'
  }
];

const SPECIALIZATIONS = [
  'All',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Neurologist',
  'Gynecologist',
  'Orthopedic',
  'General Physician',
  'ENT Specialist',
  'Psychiatrist',
  'Ophthalmologist',
  'Gastroenterologist'
];

const Home = () => {
  const { API_URL, setLoading, triggerAlert } = useApp();
  const { language, t } = useLanguage();
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('Delhi');
  const [selectedSpec, setSelectedSpec] = useState('All');

  // Photo Carousel State & Controls
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slideProgress, setSlideProgress] = useState(0);

  const SLIDE_DURATION = 5000;
  const PROGRESS_INTERVAL = 50;

  useEffect(() => {
    if (!isPlaying) return;

    const progressStep = (PROGRESS_INTERVAL / SLIDE_DURATION) * 100;
    const interval = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % HERO_SLIDES.length);
          return 0;
        }
        return prev + progressStep;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  const handleSelectSlide = (idx) => {
    setCurrentSlide(idx);
    setSlideProgress(0);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setSlideProgress(0);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setSlideProgress(0);
  };

  const getSpecLabel = (spec) => {
    if (language === 'hi') {
      const map = {
        'All': 'सभी',
        'Cardiologist': 'हृदय रोग विशेषज्ञ',
        'Dermatologist': 'त्वचा विशेषज्ञ',
        'Pediatrician': 'बाल रोग विशेषज्ञ',
        'Neurologist': 'न्यूरोलॉजिस्ट',
        'Gynecologist': 'स्त्री रोग विशेषज्ञ',
        'Orthopedic': 'हड्डी व जोड़ विशेषज्ञ',
        'General Physician': 'सामान्य चिकित्सक',
        'ENT Specialist': 'ईएनटी विशेषज्ञ',
        'Psychiatrist': 'मनोचिकित्सक',
        'Ophthalmologist': 'नेत्र रोग विशेषज्ञ',
        'Gastroenterologist': 'गैस्ट्रोएंटेरोलॉजिस्ट'
      };
      return map[spec] || spec;
    }
    return spec;
  };


  // AI Suggestions states
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedFromSuggestions, setSelectedFromSuggestions] = useState(false);

  const containerRef = useRef(null);
  const cacheRef = useRef({});

  // Debounced API Suggestions Fetching with Caching
  useEffect(() => {
    if (selectedFromSuggestions) {
      setSelectedFromSuggestions(false);
      return;
    }

    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const trimmedQuery = searchQuery.trim();

    if (cacheRef.current[trimmedQuery]) {
      setSuggestions(cacheRef.current[trimmedQuery]);
      setShowDropdown(true);
      return;
    }

    setLoadingSuggestions(true);
    setShowDropdown(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/doctors/suggestions?q=${encodeURIComponent(trimmedQuery)}`);
        const data = await res.json();
        if (res.ok) {
          setSuggestions(data);
          cacheRef.current[trimmedQuery] = data;
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Suggestions API call failed:", err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedFromSuggestions, API_URL]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[activeIndex];
        setSearchQuery(selected.searchQuery);
        setSelectedFromSuggestions(true);
        setShowDropdown(false);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  // Fetch active doctors from backend
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/doctors`);
      const data = await res.json();
      if (res.ok) {
        setDoctors(data);
      } else {
        triggerAlert(data.message || 'Failed to fetch doctors', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Failed to connect to backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [API_URL]);

  // Client-side filtering across name, specialization, and hospital location
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.hospital && doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpec = selectedSpec === 'All' || doc.specialization.toLowerCase() === selectedSpec.toLowerCase();

    // Location query filtering: matches general Delhi or specific localities like Najafgarh, Dwarka, Saket, etc.
    const trimmedLoc = locationQuery.trim().toLowerCase();
    const isGeneralDelhi = !trimmedLoc || trimmedLoc === 'delhi' || trimmedLoc === 'delhi, india' || trimmedLoc === 'all';
    const matchesLoc = isGeneralDelhi || (doc.hospital && doc.hospital.toLowerCase().includes(trimmedLoc)) ||
      trimmedLoc.split(/[\s,]+/).filter(w => w && w !== 'delhi' && w !== 'india').some(loc => doc.hospital && doc.hospital.toLowerCase().includes(loc));

    return matchesSearch && matchesSpec && matchesLoc;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16 animate-fade-in">
      {/* 1. HERO SECTION matching Figma */}
      <section className="relative pt-4 pb-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#00e599] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#00e599]" />
              <span>{language === 'hi' ? 'एआई-संचालित स्वास्थ्य सेवा मंच' : 'AI-Powered Healthcare Platform'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              {language === 'hi' ? (
                <>
                  स्वस्थ जीवन के लिए <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e599] via-emerald-400 to-teal-200">
                    उन्नत स्वास्थ्य देखभाल
                  </span>
                </>
              ) : (
                <>
                  Smarter Care <br />
                  for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e599] via-emerald-400 to-teal-200">Healthier You</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              {t('home.heroSubtitle')}
            </p>

            {/* Floating Search Capsule Card matching Figma */}
            <div className="bg-[#071612]/95 border border-emerald-500/25 p-2.5 sm:p-2 rounded-2xl sm:rounded-full shadow-2xl shadow-black/50 backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
              {/* Specialty dropdown / input */}
              <div ref={containerRef} className="relative flex-1 flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-[#00e599] shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setShowDropdown(true);
                  }}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none text-xs text-white placeholder-slate-400 focus:outline-none w-full"
                />

                {/* Suggestions Dropdown */}
                {showDropdown && (
                  <div className="absolute z-50 left-0 right-0 top-full mt-3 bg-[#091b16] border border-emerald-500/25 shadow-2xl rounded-2xl overflow-hidden max-h-64 overflow-y-auto animate-fade-in">
                    {loadingSuggestions ? (
                      <div className="flex items-center justify-center py-4 text-[#00e599] gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-[#00e599] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs">{language === 'hi' ? 'सुझाव लोड हो रहे हैं...' : 'Analyzing recommendations...'}</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((s, index) => (
                        <button
                          key={index}
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => {
                            setSearchQuery(s.searchQuery);
                            setSelectedFromSuggestions(true);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs transition-colors border-b border-emerald-500/10 last:border-none flex items-center justify-between ${
                            index === activeIndex
                              ? 'bg-[#00e599]/20 text-[#00e599]'
                              : 'text-slate-300 hover:bg-emerald-500/10 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{s.text}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 opacity-60 ml-2">
                            {s.type}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-400">
                        {language === 'hi' ? 'कोई मेल नहीं मिला' : 'No matches found.'}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Divider */}
              <div className="w-full h-[1px] bg-emerald-500/15 sm:hidden"></div>

              {/* Desktop Divider */}
              <div className="hidden sm:block w-[1px] h-8 bg-emerald-500/20"></div>

              {/* Location Input */}
              <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 sm:w-48">
                <MapPin className="w-4 h-4 text-[#00e599] shrink-0" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder={t('home.locationPlaceholder')}
                  className="bg-transparent border-none text-xs text-white placeholder-slate-400 focus:outline-none w-full truncate"
                />
              </div>

              {/* Search Action Button: Full-width on phone, circular on desktop */}
              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  document.getElementById('verified-doctors-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-10 h-10 sm:h-10 rounded-xl sm:rounded-full bg-[#00e599] hover:bg-[#00c985] text-[#04120e] flex items-center justify-center font-bold gap-2 shrink-0 self-center transition-all hover-lift shadow-lg shadow-[#00e599]/30 cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#04120e]" />
                <span className="sm:hidden text-xs font-bold">{language === 'hi' ? 'डॉक्टर्स खोजें' : 'Search Doctors'}</span>
              </button>
            </div>

            {/* 4 Trust Badges: Clean 2x2 grid on mobile, flex row on desktop */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-[#071612]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none border border-emerald-500/10 sm:border-none">
                <CheckCircle2 className="w-4 h-4 text-[#00e599] shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs truncate">{t('home.verifiedDoctors')}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#071612]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none border border-emerald-500/10 sm:border-none">
                <Lock className="w-4 h-4 text-[#00e599] shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs truncate">{t('home.securePrivate')}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#071612]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none border border-emerald-500/10 sm:border-none">
                <Calendar className="w-4 h-4 text-[#00e599] shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs truncate">{t('home.instantBooking')}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#071612]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none border border-emerald-500/10 sm:border-none">
                <Sparkles className="w-4 h-4 text-[#00e599] shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs truncate">{t('home.aiInsights')}</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Dynamic Auto-Transitioning Photo Showcase */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Ambient emerald backlight glow */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#00e599]/15 blur-3xl pointer-events-none"></div>

            {/* Dynamic Cursive Motto matching Active Slide */}
            <div className="w-full text-right pointer-events-none select-none hidden sm:block mb-2 pr-2">
              <span className="text-xl sm:text-2xl font-serif italic text-[#00e599]/75 tracking-wider transition-all duration-500">
                {HERO_SLIDES[currentSlide].quote[language] || HERO_SLIDES[currentSlide].quote.en}
              </span>
            </div>

            {/* Photo Slider Card with Hover-Pause */}
            <div
              className="relative z-10 w-full max-w-sm sm:max-w-md h-[360px] sm:h-[490px] rounded-3xl overflow-hidden border border-emerald-500/30 bg-[#091b16] shadow-2xl group transition-all"
              onMouseEnter={() => setIsPlaying(false)}
              onMouseLeave={() => setIsPlaying(true)}
            >
              {/* Slides Container */}
              {HERO_SLIDES.map((slide, index) => {
                const isActive = index === currentSlide;
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      isActive
                        ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                        : 'opacity-0 scale-105 pointer-events-none z-0'
                    }`}
                  >
                    {/* Photo */}
                    <img
                      src={slide.image}
                      alt={slide.title[language] || slide.title.en}
                      className={`w-full h-full object-cover ${slide.imagePosition} transition-transform duration-1000 ${
                        isActive ? 'scale-100' : 'scale-105'
                      }`}
                    />

                    {/* Dark gradient vignette overlays for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04120e] via-[#04120e]/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#04120e]/75 via-transparent to-transparent"></div>

                    {/* Photo Overlay Content with protected white text styling */}
                    <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between photo-overlay-content">
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                        {/* Slide Tag Badge */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border ${slide.tagColor}`}
                        >
                          {slide.id === 'pm-modi' && <Award className="w-3 h-3 text-amber-400" />}
                          {slide.id === 'verified-doctors' && <CheckCircle2 className="w-3 h-3 text-[#00e599]" />}
                          {slide.id === 'opd-consult' && <Calendar className="w-3 h-3 text-sky-400" />}
                          {slide.id === 'ai-diagnostics' && <Bot className="w-3 h-3 text-purple-400" />}
                          <span className="truncate max-w-[190px] sm:max-w-none">{slide.tag[language] || slide.tag.en}</span>
                        </div>

                        {/* Slide Counter & Play/Pause */}
                        <div className="flex items-center gap-1.5 bg-[#071612]/80 border border-emerald-500/20 px-2 sm:px-2.5 py-1 rounded-full text-[10px] backdrop-blur-md shrink-0">
                          <span className="text-[#00e599] font-bold">{index + 1}</span>
                          <span className="text-slate-400">/</span>
                          <span className="text-slate-300 font-semibold">{HERO_SLIDES.length}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsPlaying(!isPlaying);
                            }}
                            title={isPlaying ? 'Pause auto-slide' : 'Resume auto-slide'}
                            className="ml-1 text-slate-300 hover:text-[#00e599] transition-colors cursor-pointer"
                          >
                            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      {/* Floating Badge 1: Top Left beneath Header */}
                      <div className="self-start mt-1 sm:mt-2 bg-[#071612]/90 border border-emerald-500/30 px-2.5 sm:px-3 py-1 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2 sm:gap-2.5 animate-slide-up">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-emerald-500/20 text-[#00e599] flex items-center justify-center shrink-0">
                          {slide.badge1.icon === 'shield' && <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
                          {slide.badge1.icon === 'activity' && <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00e599]" />}
                          {slide.badge1.icon === 'calendar' && <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />}
                          {slide.badge1.icon === 'scan' && <Scan className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />}
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-[11px] font-bold leading-tight">
                            {slide.badge1.title[language] || slide.badge1.title.en}
                          </p>
                          <p className="text-[8px] sm:text-[9px] text-[#00e599] font-medium">
                            {slide.badge1.desc[language] || slide.badge1.desc.en}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Slide Info & Badges */}
                      <div className="space-y-2 sm:space-y-3 mt-auto">
                        {/* Floating Badge 2: Right-aligned */}
                        <div className="self-end ml-auto w-fit bg-[#071612]/90 border border-emerald-500/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-1.5 sm:gap-2 animate-slide-up">
                          {slide.badge2.icon === 'users' ? (
                            <div className="flex -space-x-1.5 overflow-hidden">
                              <img className="inline-block h-4 w-4 sm:h-5 sm:w-5 rounded-full ring-1 ring-emerald-500" src="https://images.unsplash.com/photo-1594824813560-4b0811b514d7?w=100&auto=format&fit=crop&q=80" alt="Doc" />
                              <img className="inline-block h-4 w-4 sm:h-5 sm:w-5 rounded-full ring-1 ring-emerald-500" src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80" alt="Doc" />
                              <img className="inline-block h-4 w-4 sm:h-5 sm:w-5 rounded-full ring-1 ring-emerald-500" src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80" alt="Doc" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-emerald-500/20 text-[#00e599] flex items-center justify-center">
                              {slide.badge2.icon === 'heart' && <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400 fill-red-400" />}
                              {slide.badge2.icon === 'zap' && <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />}
                              {slide.badge2.icon === 'bot' && <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400" />}
                            </div>
                          )}
                          <div className="text-right">
                            <span className="text-[9px] sm:text-[10px] font-extrabold block leading-tight">
                              {slide.badge2.title[language] || slide.badge2.title.en}
                            </span>
                            <span className="text-[8px] sm:text-[9px] text-[#00e599]">
                              {slide.badge2.desc[language] || slide.badge2.desc.en}
                            </span>
                          </div>
                        </div>

                        {/* Title & Subtitle Card */}
                        <div className="bg-[#05130f]/90 border border-emerald-500/25 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl backdrop-blur-md">
                          <h3 className="text-sm sm:text-lg font-extrabold leading-tight text-white line-clamp-1 sm:line-clamp-none">
                            {slide.title[language] || slide.title.en}
                          </h3>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 leading-snug mt-0.5 sm:mt-1 line-clamp-2">
                            {slide.subtitle[language] || slide.subtitle.en}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Prev & Next Floating Buttons */}
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-[#00e599] hover:text-[#04120e] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 shadow-lg cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-[#00e599] hover:text-[#04120e] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 shadow-lg cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Bottom Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 z-20">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#00e599] transition-all ease-linear"
                  style={{ width: `${slideProgress}%` }}
                />
              </div>
            </div>

            {/* Interactive Pill Thumbnails underneath */}
            <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 mt-3 z-10 w-full max-w-md overflow-x-auto pb-1 scrollbar-hide px-1">
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => handleSelectSlide(idx)}
                    className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/30 scale-105'
                        : 'bg-[#091b16]/80 text-slate-300 hover:text-white hover:bg-emerald-500/20 border border-emerald-500/20'
                    }`}
                  >
                    <span>{slide.pill[language] || slide.pill.en}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. NATIONAL AYUSHMAN BHARAT & DIGITAL HEALTH SHOWCASE */}
      <section className="relative rounded-3xl overflow-hidden border border-emerald-500/25 bg-gradient-to-r from-[#071612] via-[#091f18] to-[#071612] p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        {/* Tricolor ribbon top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Identity & PM Modi miniature */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500/40 shrink-0 shadow-lg group">
              <img
                src="/assets/pm_modi.jpg"
                alt="Hon'ble PM Narendra Modi"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#00e599]">
                  {language === 'hi' ? 'आयुष्मान भारत डिजिटल मिशन' : 'Ayushman Bharat Digital Mission (ABDM)'}
                </span>
                <span className="text-[10px] text-amber-400 font-bold hidden sm:inline">
                  {language === 'hi' ? 'स्वस्थ भारत, सशक्त भारत' : 'Healthy India, Empowered India'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white mt-1">
                {language === 'hi'
                  ? 'माननीय प्रधानमंत्री श्री नरेन्द्र मोदी का डिजिटल स्वास्थ्य संकल्प'
                  : 'Hon\'ble PM Shri Narendra Modi\'s Digital Health Vision'}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mt-0.5">
                {language === 'hi'
                  ? 'आभा (ABHA) हेल्थ आईडी, पेपरलेस अस्पताल पंजीकरण एवं पीएम-जय (PM-JAY) ₹5 लाख कैशलेस उपचार की सुविधा।'
                  : 'Universal healthcare with ABHA Digital Health Accounts, paperless OPD queues, and PM-JAY ₹5 Lakh cashless coverage.'}
              </p>
            </div>
          </div>

          {/* Stats & Jump Action */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
            <div className="px-3 py-2 rounded-xl bg-black/40 border border-emerald-500/20 text-center min-w-[90px]">
              <span className="text-xs font-black text-[#00e599] block">140 Cr+</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                {language === 'hi' ? 'आभा आईडी' : 'ABHA Accounts'}
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-black/40 border border-emerald-500/20 text-center min-w-[90px]">
              <span className="text-xs font-black text-amber-400 block">10,000+</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                {language === 'hi' ? 'संबद्ध अस्पताल' : 'Hospitals'}
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-black/40 border border-emerald-500/20 text-center min-w-[90px]">
              <span className="text-xs font-black text-sky-400 block">₹5 Lakh</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                {language === 'hi' ? 'मुफ्त कवरेज' : 'PM-JAY Cover'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                handleSelectSlide(0);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2.5 rounded-xl bg-[#00e599] hover:bg-[#00c985] text-[#04120e] text-xs font-bold transition-all shadow-md shadow-[#00e599]/20 flex items-center gap-1.5 shrink-0"
            >
              <span>{language === 'hi' ? 'प्रधानमंत्री विजन देखें' : 'View PM Vision'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. OUR AI TOOLS SECTION matching Figma */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00e599] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'हमारे एआई उपकरण' : 'Our AI Tools'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'hi' ? 'आपके स्वास्थ्य के लिए शक्तिशाली एआई टूल्स' : 'Powerful Tools for Your Health Journey'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            {language === 'hi' ? 'स्वास्थ्य सेवा को सरल, सटीक और सुलभ बनाने के लिए आधुनिक एआई सुविधाएं।' : 'Advanced AI features designed to make healthcare simpler, faster and more accessible.'}
          </p>
        </div>

        {/* 3 AI Cards Grid matching Figma */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: AI Symptom Checker (Emerald Theme) */}
          <div className="relative rounded-3xl bg-[#091b16] border border-emerald-500/20 p-6 flex flex-col justify-between overflow-hidden shadow-xl hover-lift group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00e599] group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00e599] transition-colors">
                  {t('nav.aiSymptomChecker')}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'hi' ? 'अपने लक्षण दर्ज करें और 3D होलोग्राम व विशेषज्ञ डॉक्टरों की सटीक सलाह प्राप्त करें।' : 'Describe your symptoms and get possible conditions with specialist recommendations.'}
                </p>
              </div>
            </div>

            <Link
              to="/ai-symptoms"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/40 text-xs font-bold text-[#00e599] hover:bg-[#00e599] hover:text-[#04120e] transition-all w-fit shadow-sm"
            >
              <span>{language === 'hi' ? 'लक्षण जांच शुरू करें' : 'Start Symptom Check'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Prescription & Lab OCR (Cyan/Blue Theme) */}
          <div className="relative rounded-3xl bg-[#091b16] border border-sky-500/20 p-6 flex flex-col justify-between overflow-hidden shadow-xl hover-lift group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                  {t('nav.aiScanner')}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'hi' ? 'डॉक्टर का पर्चा या रिपोर्ट अपलोड करें। एआई तुरंत आवश्यक सारांश तैयार करेगा।' : 'Upload prescriptions or lab reports. Our AI extracts key information instantly.'}
                </p>
              </div>
            </div>

            <Link
              to="/ai-scanner"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-500/40 text-xs font-bold text-sky-400 hover:bg-sky-400 hover:text-[#04120e] transition-all w-fit shadow-sm"
            >
              <span>{language === 'hi' ? 'अपलोड और स्कैन करें' : 'Upload & Scan'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: AI Health Assistant (Purple Theme) */}
          <div className="relative rounded-3xl bg-[#091b16] border border-purple-500/20 p-6 flex flex-col justify-between overflow-hidden shadow-xl hover-lift group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {t('nav.aiChatbot')}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'hi' ? '24/7 तत्काल उत्तर, दवाइयों की जानकारी और व्यक्तिगत स्वास्थ्य सलाह प्राप्त करें।' : 'Get instant answers, medication advice, and 24/7 personalized guidance.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const chatbotBtn = document.querySelector('[aria-label="Open ArogyaCare AI Chatbot"]');
                if (chatbotBtn) chatbotBtn.click();
              }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/40 text-xs font-bold text-purple-400 hover:bg-purple-400 hover:text-[#04120e] transition-all w-fit shadow-sm"
            >
              <span>{language === 'hi' ? 'आरोग्यकेयर एआई से पूछें' : 'Ask ArogyaCare AI'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. VERIFIED PROFESSIONALS SECTION matching Figma */}
      <section className="space-y-6" id="verified-doctors-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00e599]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सत्यापित विशेषज्ञ डॉक्टर्स' : 'Verified Professionals'}</span>
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#00e599]">
                {filteredDoctors.length} {language === 'hi' ? 'डॉक्टर्स उपलब्ध (दिल्ली)' : 'Doctors in Delhi'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('home.findRightDoctor')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t('home.findRightDoctorSubtitle')}
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedSpec('All');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-[#00e599] hover:text-[#05d68d] flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Chips & Search Bar matching Figma */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Specialization Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SPECIALIZATIONS.map((spec) => {
              const isSelected = selectedSpec === spec;
              return (
                <button
                  key={spec}
                  onClick={() => setSelectedSpec(spec)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/20'
                      : 'bg-[#071612] text-slate-300 border border-emerald-500/20 hover:border-emerald-500/40 hover:text-white'
                  }`}
                >
                  {getSpecLabel(spec)}
                </button>
              );
            })}
          </div>

          {/* Quick Doctor Search Field */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={language === 'hi' ? 'डॉक्टर के नाम से खोजें...' : 'Search doctor by name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#071612] border border-emerald-500/20 rounded-full text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00e599] transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Doctor Cards Grid (4 columns on desktop) */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredDoctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl bg-[#091b16] border border-emerald-500/15 p-8">
            <Stethoscope className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white">No Doctors Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try clearing your filters or search query.</p>
          </div>
        )}
      </section>

      {/* 4. HEALTHCARE SIMPLIFIED IN 4 STEPS matching Figma */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00e599] mb-1">
              <span>How It Works</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Healthcare, Simplified in 4 Steps
            </h2>
          </div>

          {/* Nav arrows matching Figma */}
          <div className="hidden sm:flex items-center gap-2">
            <button className="p-2 rounded-full border border-emerald-500/20 bg-[#071612] text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full border border-emerald-500/20 bg-[#071612] text-slate-400 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Search & Select Doctor',
              desc: 'Explore certified specialists by medical category, fees, and Delhi hospital locations.'
            },
            {
              step: '02',
              title: 'Choose Available Slot',
              desc: 'Pick your preferred date and convenient time slot with instant calendar locking.'
            },
            {
              step: '03',
              title: 'AI Health Assessment',
              desc: 'Run a pre-check with our AI symptom analysis or upload existing medical test reports.'
            },
            {
              step: '04',
              title: 'Instant Confirmation',
              desc: 'Receive immediate appointment confirmation with reminder schedules.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#091b16] border border-emerald-500/15 shadow-sm space-y-2 hover-lift"
            >
              <span className="text-2xl font-black text-[#00e599]/40 font-mono block">
                {item.step}
              </span>
              <h4 className="font-extrabold text-sm text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
