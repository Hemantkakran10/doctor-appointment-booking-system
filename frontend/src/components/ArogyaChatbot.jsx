import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Calendar,
  Minimize2,
  Maximize2,
  RotateCcw,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  Globe
} from 'lucide-react';

const WELCOME_MESSAGES = {
  en: `Good day. I am **ArogyaCare AI**, your Senior Clinical Triage Assistant & Medical AI Consultant. 🩺

How may I assist you with your health today?
- **Symptom Triage**: Share acute or chronic symptoms for immediate clinical guidance.
- **Prescription & Lab OCR**: Decode doctor's slips, dosages, and diagnostic panels.
- **Specialist Referrals**: Connect directly with verified top specialists across Delhi NCR.

Please describe your symptoms or medical inquiry.`,

  hi: `सादर नमस्कार। मैं **ArogyaCare AI** हूँ, आपका वरिष्ठ क्लीनिकल ट्राइएज एवं स्वास्थ्य परामर्श सहायक। 🩺

आज मैं आपके स्वास्थ्य संबंधी किस विषय में सहायता कर सकता हूँ?
- **प्राथमिक लक्षण मूल्यांकन**: बुखार, सिरदर्द, सीने में दर्द अथवा अन्य शारीरिक लक्षणों का क्लीनिकल विश्लेषण।
- **डिजिटल प्रिस्क्रिप्शन OCR**: डॉक्टर की पर्ची, दवाइयों की खुराक एवं लैब रिपोर्ट का विस्तृत स्पष्टीकरण।
- **विशेषज्ञ डॉक्टर शेड्यूलिंग**: दिल्ली एवं एनसीआर के शीर्ष सत्यापित विशेषज्ञ डॉक्टरों से तुरंत परामर्श।

कृपया अपने लक्षण अथवा स्वास्थ्य संबंधी प्रश्न साझा करें।`,

  hinglish: `Namaste. Main **ArogyaCare AI** hoon, aapka Senior Clinical Triage Assistant aur Medical AI Consultant. 🩺

Main aapki clinical sahayata kis tarah kar sakta hoon?
- **Symptom Triage**: Bukhar, sar dard, chest pain ya koi bhi lakshan bata kar clinical guidance lein.
- **Prescription OCR**: Doctor ke parcha aur lab reports ka detailed explanation samjhein.
- **Doctor Booking**: Top verified clinic specialists se direct appointment fix karein.

Apne symptoms ya health question yahan batayein.`
};

const PROMPTS_BY_LANG = {
  en: [
    { label: '🩺 Fever & Cough Triage', prompt: 'I have had high fever, dry cough, and body ache for 2 days. What clinical steps should I take?' },
    { label: '💊 Prescription Analysis', prompt: 'How do I use the Prescription OCR tool to decode my medical slip and tablet timings?' },
    { label: '❤️ Chest Discomfort / BP', prompt: 'I am experiencing chest heaviness and palpitations. Please recommend a cardiologist.' },
    { label: '🧠 Stress & Headache', prompt: 'I have severe tension headache, anxiety, and dizziness. What clinical precautions should I follow?' },
    { label: '📅 Book Specialist Visit', prompt: 'How do I schedule an in-person clinical appointment with a specialist?' }
  ],
  hi: [
    { label: '🩺 बुखार एवं श्वसन संक्रमण', prompt: 'नमस्ते, मुझे 2 दिनों से तेज बुखार, खांसी और बदन दर्द है, प्राथमिक क्लीनिकल सलाह दें।' },
    { label: '💊 प्रिस्क्रिप्शन विश्लेषण (OCR)', prompt: 'डॉक्टर की पर्ची और दवाइयों के उपयोग का विवरण कैसे समझें?' },
    { label: '❤️ कार्डियोलॉजिस्ट परामर्श', prompt: 'सीने में जकड़न और उच्च रक्तचाप के लिए उपयुक्त कार्डियोलॉजिस्ट की जानकारी दें।' },
    { label: '🧠 तनाव एवं मानसिक स्वास्थ्य', prompt: 'मानसिक तनाव, सिरदर्द और घबराहट के लिए क्लीनिकल सावधानियां बताएं।' },
    { label: '📅 डॉक्टर अपॉइंटमेंट बुकिंग', prompt: 'क्लिनिक में विशेषज्ञ डॉक्टर से अपॉइंटमेंट कैसे बुक करें?' }
  ],
  hinglish: [
    { label: '🩺 Fever & Cough Triage', prompt: 'Namaste, mujhe 2 din se tez bukhar aur khansi hai, primary clinical advice dein.' },
    { label: '💊 Prescription Decode Karein', prompt: 'Prescription slip aur dawaon ka timing decode kaise karein?' },
    { label: '❤️ Cardiologist Consult Karein', prompt: 'Chest me heaviness aur high BP hai, Cardiologist doctor suggest karein.' },
    { label: '🧠 Tension & Sar Dard', prompt: 'Mujhe bahut stress aur migraine headache ho raha hai, kya precautions lein?' },
    { label: '📅 Appointment Book Karein', prompt: 'Doctor se appointment book karne ka tarika batayein.' }
  ]
};

const ArogyaChatbot = () => {
  const { API_URL } = useApp();
  const { language, setLanguage, t, supportedLanguages, currentLanguageObj } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en,
      suggestedDoctors: []
    }
  ]);

  const messagesEndRef = useRef(null);

  // Update initial message when language changes if only welcome is present
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{
          id: `welcome-${language}`,
          role: 'assistant',
          content: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en,
          suggestedDoctors: []
        }];
      }
      return prev;
    });
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const activePrompts = PROMPTS_BY_LANG[language] || PROMPTS_BY_LANG.en;

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role === 'user' ? 'user' : 'model', content: m.content })),
          preferredLanguage: language === 'hi' ? 'hindi' : language === 'hinglish' ? 'hinglish' : 'english'
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.reply,
            suggestedDoctors: data.suggestedDoctors || []
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: language === 'hi'
              ? 'क्लीनिकल सर्वर से संपर्क स्थापित नहीं हो सका। कृपया पुनः प्रयास करें अथवा सपोर्ट से संपर्क करें।'
              : 'I encountered an issue connecting to the clinical server. Please try again or reach out to clinic support.',
            suggestedDoctors: []
          }
        ]);
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: language === 'hi'
            ? 'एआई सहायक तक पहुँचने में असमर्थ। कृपया अपना नेटवर्क कनेक्शन जांचें।'
            : 'Unable to reach the AI assistant. Please check your network connection.',
          suggestedDoctors: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en,
        suggestedDoctors: []
      }
    ]);
  };

  // Helper to render markdown-like text
  const renderFormattedText = (content) => {
    return content.split('\n').map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="font-bold text-base text-slate-900 dark:text-slate-50 mt-2 mb-1">{line.replace('## ', '')}</h3>;
      }
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1 text-xs">
            <span className="text-emerald-400 font-bold">•</span>
            <span>{parseBold(itemText)}</span>
          </div>
        );
      }
      // Numbered items
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1 text-xs">
            <span className="text-emerald-400 font-bold">{line.match(/^\d+\./)[0]}</span>
            <span>{parseBold(line.replace(/^\d+\.\s/, ''))}</span>
          </div>
        );
      }
      // Regular paragraph or empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return <p key={idx} className="my-1 text-xs leading-relaxed">{parseBold(line)}</p>;
    });
  };

  const parseBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>

      {/* Floating Toggle Button matching Figma */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open ArogyaCare AI Chatbot"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#071612] hover:bg-[#0c241e] text-[#00e599] rounded-full shadow-2xl shadow-black/80 hover:scale-105 active:scale-95 transition-all duration-300 group border border-emerald-500/40"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#00e599] group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00e599] rounded-full border-2 border-[#071612] animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide text-white hidden sm:inline">{t('chatbot.btnLabel')}</span>
          <Sparkles className="w-4 h-4 text-[#00e599] animate-spin-slow" />
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div
          className={`fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 w-[94vw] sm:w-[420px] bg-[#091b16] rounded-3xl shadow-2xl border border-emerald-500/25 flex flex-col overflow-hidden transition-all duration-300 animate-slide-up ${
            isMinimized ? 'h-16' : 'h-[590px] max-h-[86vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#071612] border-b border-emerald-500/20 text-white px-4 py-3 flex items-center justify-between select-none shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#00e599]">
                <Bot className="w-5 h-5 text-[#00e599]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-sm leading-tight text-white">ArogyaCare AI</h3>
                  <span className="text-[9px] bg-emerald-500/20 text-[#00e599] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider border border-emerald-500/30">
                    Online
                  </span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.2 rounded font-medium border border-emerald-500/20">
                    🩺 {t('chatbot.badge')}
                  </span>
                </div>
                {/* In-chat Language Switcher */}
                <div className="flex items-center gap-1 mt-1 bg-[#05110d] border border-emerald-500/20 p-0.5 rounded-lg w-fit">
                  {supportedLanguages.map(l => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setMessages([{
                          id: `welcome-${l.code}`,
                          role: 'assistant',
                          content: WELCOME_MESSAGES[l.code] || WELCOME_MESSAGES.en,
                          suggestedDoctors: []
                        }]);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                        language === l.code
                          ? 'bg-[#00e599] text-[#04120e]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {l.flag} {l.native}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Clear Chat"
                className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-400 hover:text-white transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#050e0b] text-slate-200 scrollbar-thin">
                {messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200 dark:border-blue-900">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-2xl p-3 text-xs shadow-sm ${
                          isUser
                            ? 'bg-[#00e599] text-[#04120e] font-medium rounded-br-sm'
                            : 'bg-[#091b16] border border-emerald-500/20 text-slate-200 rounded-bl-sm'
                        }`}
                      >
                        {isUser ? (
                          <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        ) : (
                          <div>{renderFormattedText(m.content)}</div>
                        )}

                        {/* Doctor recommendations attached inside the chat message */}
                        {m.suggestedDoctors && m.suggestedDoctors.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-emerald-500/15 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00e599] block">
                              {t('chatbot.recommendedDocs')}
                            </span>
                            {m.suggestedDoctors.map((doc) => (
                              <div
                                key={doc._id || doc.name}
                                className="flex items-center justify-between p-2 rounded-xl bg-[#061410] border border-emerald-500/15 text-xs"
                              >
                                <div>
                                  <p className="font-semibold text-white">{doc.name}</p>
                                  <p className="text-[10px] text-slate-400">
                                    {doc.specialization} • {doc.experience} yrs • ₹{doc.fees}
                                  </p>
                                </div>
                                <Link
                                  to={doc._id ? `/book/${doc._id}` : '/'}
                                  onClick={() => setIsOpen(false)}
                                  className="px-2.5 py-1 bg-[#00e599] hover:bg-[#00c985] text-[#04120e] text-[10px] font-extrabold rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0"
                                >
                                  <span>{t('chatbot.bookBtn')}</span>
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-[#00e599] flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing spinner */}
                {loading && (
                  <div className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[#00e599] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-[#091b16] border border-emerald-500/20 p-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-sm">
                      <div className="w-2 h-2 bg-[#00e599] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-[#00e599] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-[#00e599] rounded-full animate-bounce"></div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Chips */}
              <div className="px-3 py-2 bg-[#071612] border-t border-emerald-500/15 flex gap-1.5 overflow-x-auto scrollbar-hide">
                {activePrompts.map((qp, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(qp.prompt)}
                    className="shrink-0 text-[10px] font-medium bg-[#091b16] text-slate-300 hover:text-[#00e599] hover:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 transition-colors"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              {/* Chat Input Field */}
              <div className="p-3 bg-[#071612] border-t border-emerald-500/15">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('chatbot.placeholder')}
                    className="flex-1 bg-[#091b16] border border-emerald-500/25 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00e599] transition-all placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-2.5 bg-[#00e599] hover:bg-[#00c985] disabled:opacity-40 text-[#04120e] rounded-xl shadow-md transition-all shrink-0 hover-lift font-bold"
                  >
                    <Send className="w-4 h-4 text-[#04120e]" />
                  </button>
                </form>

                <div className="mt-2 text-[9px] text-center text-slate-500 flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-500" />
                  <span>{t('chatbot.disclaimer')}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ArogyaChatbot;
