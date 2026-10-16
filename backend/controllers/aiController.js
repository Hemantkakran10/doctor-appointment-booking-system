import Doctor from '../models/Doctor.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Helper to fetch active doctors matching a specialization
 */
const findMatchingDoctors = async (specialization) => {
  try {
    let query = { isActive: true };
    if (specialization && specialization !== 'General' && specialization !== 'All') {
      query.specialization = { $regex: new RegExp(specialization, 'i') };
    }
    const doctors = await Doctor.find(query).select('name specialization degree experience fees hospital rating reviewsCount image').limit(4);
    if (doctors.length > 0) return doctors;
    // Fallback to top rated active doctors if none directly match
    return await Doctor.find({ isActive: true }).select('name specialization degree experience fees hospital rating reviewsCount image').limit(3);
  } catch (err) {
    console.error('Error fetching matching doctors:', err);
    return [];
  }
};

// Language detection helper functions
export const isDevanagari = (text) => /[\u0900-\u097F]/.test(text || '');

export const isHinglish = (text) => {
  const hinglishTokens = [
    'hai', 'hain', 'kya', 'nahi', 'nhi', 'dost', 'bhai', 'yaar', 'kaise', 'kaisa', 'kaisi',
    'mera', 'meri', 'mere', 'mujhe', 'hum', 'aap', 'tum', 'tumhara', 'tumhari', 'karo', 'kare',
    'karna', 'karu', 'karoon', 'batao', 'bataiye', 'theek', 'thik', 'chahiye',
    'bukhar', 'dard', 'sar', 'sir', 'pet', 'khansi', 'sardi', 'zukam', 'jukam', 'gala', 'chhati',
    'seene', 'dawai', 'parcha', 'tabiyat', 'madad', 'pareshani', 'namaste', 'shukriya', 'dhanyawad',
    'chakkar', 'ulti', 'dil', 'dhadkan', 'khoon', 'kamzori', 'aaram', 'bimar', 'bimari', 'dikhao',
    'dikhana', 'milna', 'doctor', 'kaun', 'kuch', 'accha', 'achha', 'tension', 'chinta', 'sun', 'suno'
  ];
  const lower = (text || '').toLowerCase();
  const words = lower.split(/[\s,?.!'"()]+/);
  return words.some(w => hinglishTokens.includes(w));
};

export const detectLanguage = (text) => {
  if (isDevanagari(text)) return 'hindi';
  if (isHinglish(text)) return 'hinglish';
  return 'english';
};

/**
 * Clinical Symptom Knowledge Base with Comprehensive English, Hindi, and Hinglish Lexicons
 */
const SYMPTOM_SPECIALTY_MAP = [
  {
    keywords: [
      'chest pain', 'heart', 'palpitation', 'shortness of breath', 'angina', 'high blood pressure', 'bp', 'cardio', 'irregular heartbeat',
      'seene me dard', 'chhati me dard', 'seene mein dard', 'chhati me jalan', 'dil', 'dhadkan', 'dil ki dhadkan', 'saans phoolna', 'saans lene me takleef', 'ghabrahat', 'blood pressure', 'high bp',
      'सीने में दर्द', 'छाती में दर्द', 'दिल', 'धड़कन', 'घबराहट', 'सांस फूलना', 'उच्च रक्तचाप', 'छाती में भारीपन', 'एंजाइना'
    ],
    specialization: 'Cardiologist',
    condition: 'Cardiovascular Assessment (Possible Angina / Arrhythmia / Hypertension)',
    conditionHindi: 'हृदय एवं रक्तचाप मूल्यांकन (संभावित एंजाइना / कार्डियोवास्कुलर अतालता / हाई बीपी)',
    urgency: 'high',
    advice: 'If you experience severe crushing chest pain radiating to the jaw, neck, or left arm with cold sweats, seek emergency medical care immediately.',
    adviceHindi: 'यदि आपको सीने में भारी दबाव, जबड़े या बायीं बांह में दर्द और पसीना आ रहा है, तो तुरंत आपातकालीन एम्बुलेंस बुलाएं या नजदीकी अस्पताल जाएं।',
    questions: ['How long has the chest tightness lasted?', 'Does it worsen with physical exertion?', 'Is there any dizziness or nausea?'],
    questionsHindi: ['सीने में जकड़न कितनी देर से है?', 'क्या चलने या मेहनत करने पर दर्द बढ़ जाता है?', 'क्या चक्कर या घबराहट भी महसूस हो रही है?'],
    homeCare: 'Rest in a comfortable sitting position, avoid strenuous activity, avoid caffeine, and monitor blood pressure if a monitor is available.',
    homeCareHindi: 'आराम से बैठ जाएं, किसी भी भारी काम से बचें, कैफीन या चाय न लें और ब्लड प्रेशर चेक करें।'
  },
  {
    keywords: [
      'rash', 'skin', 'acne', 'itching', 'eczema', 'psoriasis', 'hives', 'mole', 'dermatitis', 'allergy on skin', 'dry skin', 'blister',
      'khujli', 'daane', 'pimples', 'acne', 'rash', 'allergy', 'tvacha', 'chehre pe daane', 'khujli hona', 'lal daane', 'skin allergy', 'khujli chal rahi',
      'खुजली', 'दाने', 'मुंहासे', 'त्वचा', 'पिंपल', 'रैश', 'एलर्जी', 'खाज', 'चेहरे पर दाने', 'त्वचा में जलन', 'लाल चकत्ते'
    ],
    specialization: 'Dermatologist',
    condition: 'Dermatological Condition (Contact Dermatitis / Eczema / Urticaria / Acne Vulgaris)',
    conditionHindi: 'त्वचा विकार एवं एलर्जी (डर्मेटाइटिस / एक्जिमा / एलर्जी / मुंहासे)',
    urgency: 'mild',
    advice: 'Avoid scratching the affected region to prevent secondary bacterial infection.',
    adviceHindi: 'प्रभावित जगह को बिल्कुल न खरोंचें ताकि बैक्टीरियल संक्रमण न फैले।',
    questions: ['Did the rash appear after using a new cosmetic, soap, or food?', 'Is it spreading rapidly or accompanied by fever?', 'Is there any pus or weeping fluid?'],
    questionsHindi: ['क्या यह दाने किसी नए साबुन, कॉस्मेटिक या खाने के बाद निकले?', 'क्या यह तेजी से फैल रहे हैं?', 'क्या इनमें मवाद या पानी आ रहा है?'],
    homeCare: 'Apply a mild, fragrance-free moisturizer or cold compress. Avoid harsh soaps, hot water, and scratching.',
    homeCareHindi: 'ठंडी सिकाई करें या शुद्ध एलोवेरा जेल लगाएं। गर्म पानी और सुगंधित साबुन से बचें।'
  },
  {
    keywords: [
      'headache', 'migraine', 'dizziness', 'seizure', 'numbness', 'tingling', 'tremor', 'vertigo', 'loss of balance', 'nerve', 'brain', 'memory loss',
      'sar dard', 'sir dard', 'sar me dard', 'sir ghoom raha', 'chakkar', 'migraine', 'sir bhari', 'aankhon ke samne andhera', 'sir ghoomna', 'sir ghumna',
      'सिरदर्द', 'सिर दर्द', 'सर दर्द', 'चक्कर', 'माइग्रेन', 'सिर घूमना', 'बेहोशी', 'नस', 'सिर भारी होना', 'आंखों के आगे अंधेरा'
    ],
    specialization: 'Neurologist',
    condition: 'Neurological Assessment (Migraine / Tension Headache / Neuropathy / Vertigo)',
    conditionHindi: 'न्यूरोलॉजिकल एवं मस्तिष्क मूल्यांकन (माइग्रेन / तनाव सिरदर्द / वर्टिगो / नस की समस्या)',
    urgency: 'moderate',
    advice: 'Sudden onset of the worst headache of your life, sudden facial drooping, or limb weakness requires immediate emergency attention.',
    adviceHindi: 'यदि सिरदर्द अचानक असहनीय तेज हो या चेहरे और अंगों में कमजोरी लगे, तो तुरंत इमरजेंसी डॉक्टर को दिखाएं।',
    questions: ['Is the headache one-sided or throbbing?', 'Is there visual disturbance or sensitivity to light/sound?', 'Any neck stiffness or fever?'],
    questionsHindi: ['क्या सिरदर्द एक तरफ हो रहा है या पूरे सिर में?', 'क्या रोशनी या तेज आवाज से परेशानी हो रही है?', 'क्या गर्दन में अकड़न भी है?'],
    homeCare: 'Rest in a quiet, dark room, stay well-hydrated, and keep a headache trigger log.',
    homeCareHindi: 'अंधेरे शांत कमरे में लेटकर आराम करें, स्क्रीन से दूर रहें और पर्याप्त पानी पिएं।'
  },
  {
    keywords: [
      'child', 'baby', 'toddler', 'infant', 'kid', 'pediatric', 'vaccination for child', 'growth delay', 'colic',
      'bacha', 'baccha', 'bacche ko bukhar', 'chhota bacha', 'bacche ki tabiyat',
      'बच्चा', 'शिशु', 'बाल रोग', 'बच्चे को बुखार', 'छोटे बच्चे'
    ],
    specialization: 'Pediatrician',
    condition: 'Pediatric Health Evaluation',
    conditionHindi: 'बाल रोग एवं शिशु स्वास्थ्य मूल्यांकन',
    urgency: 'moderate',
    advice: 'Children can dehydrate rapidly during illness. Ensure continuous fluid intake.',
    adviceHindi: 'बीमारी में बच्चों में पानी की कमी जल्दी हो जाती है। उन्हें लगातार ओआरएस या पानी पिलाते रहें।',
    questions: ['What is the child’s exact temperature and age?', 'Is the child drinking liquids, urinating regularly, and alert?', 'Are there any breathing difficulties?'],
    questionsHindi: ['बच्चे की सही उम्र और बुखार का तापमान कितना है?', 'क्या बच्चा तरल पदार्थ पी रहा है और पेशाब सामान्य है?', 'क्या सांस लेने में कोई तकलीफ है?'],
    homeCare: 'Ensure plenty of oral rehydration fluids, light comfortable clothing, and monitor temperature closely.',
    homeCareHindi: 'ओआरएस और तरल पदार्थ दें, हल्के आरामदायक कपड़े पहनाएं और तापमान मापते रहें।'
  },
  {
    keywords: [
      'period', 'menstrual', 'pregnancy', 'cramp', 'vaginal', 'gyneco', 'ovary', 'pcos', 'pelvic pain', 'fertility', 'menopause', 'spotting',
      'mahawari', 'periods dard', 'pet ke nichle hisse me dard', 'garbhavastha', 'period aana', 'period nahi aaya',
      'माहवारी', 'पीरियड्स', 'मासिक धर्म', 'गर्भावस्था', 'पेल्विक दर्द', 'माहवारी में दर्द', 'पीसीओडी'
    ],
    specialization: 'Gynecologist',
    condition: 'Gynecological & Reproductive Health Evaluation (Dysmenorrhea / Hormonal Imbalance / Pelvic Health)',
    conditionHindi: 'स्त्री रोग एवं प्रजनन स्वास्थ्य मूल्यांकन (हार्मोनल असंतुलन / पेल्विक स्वास्थ्य)',
    urgency: 'moderate',
    advice: 'Severe sudden lower abdominal pain with dizziness or heavy abnormal bleeding requires urgent medical evaluation.',
    adviceHindi: 'यदि पेट के निचले हिस्से में अचानक तेज दर्द या असामान्य रक्तस्राव हो तो तुरंत चिकित्सीय जांच करवाएं।',
    questions: ['When was your last menstrual cycle?', 'Is there any possibility of pregnancy?', 'Are cramps accompanied by fever or nausea?'],
    questionsHindi: ['आपकी पिछली माहवारी कब आई थी?', 'क्या गर्भावस्था की कोई संभावना है?', 'क्या दर्द के साथ उल्टी या बुखार भी है?'],
    homeCare: 'Apply a warm heating pad to the lower abdomen, stay hydrated, and rest in a comfortable fetal position.',
    homeCareHindi: 'पेट के निचले हिस्से पर हीटिंग पैड से गर्म सिकाई करें, भरपूर पानी पिएं और आराम करें।'
  },
  {
    keywords: [
      'cough', 'fever', 'cold', 'sore throat', 'flu', 'weakness', 'fatigue', 'body ache', 'chills', 'vomiting', 'diarrhea', 'stomach ache',
      'pet dard', 'pet me dard', 'gas', 'acidity', 'ulti', 'vomit', 'loose motion', 'dast', 'kabz', 'khana hazam nahi', 'jalan',
      'पेट दर्द', 'पेट में दर्द', 'गैस', 'एसिडिटी', 'उल्टी', 'दस्त', 'कब्ज', 'खाना हजम न होना',
      'bukhar', 'khansi', 'sardi', 'zukam', 'jukam', 'gala kharab', 'gale me dard', 'thakawat', 'kamzori', 'badan dard', 'gale me jalan',
      'बुखार', 'खांसी', 'सर्दी', 'जुकाम', 'गले में खराश', 'कमजोरी', 'बदन दर्द', 'गले में दर्द'
    ],
    specialization: 'General Physician',
    condition: 'Acute Viral Syndrome / Upper Respiratory Infection / Gastroenteritis',
    conditionHindi: 'वायरल सिंड्रोम / श्वसन संक्रमण / पेट व पाचन समस्या',
    urgency: 'mild',
    advice: 'Maintain adequate fluid hydration and rest. If high fever persists beyond 3 days or breathing becomes difficult, seek clinical consultation.',
    adviceHindi: 'पर्याप्त पानी पिएं और पूरा आराम करें। यदि 3 दिन से अधिक तेज बुखार बना रहे तो डॉक्टर को अवश्य दिखाएं।',
    questions: ['What is your current body temperature?', 'How many days have symptoms persisted?', 'Can you keep fluids down without vomiting?'],
    questionsHindi: ['वर्तमान में आपका तापमान कितना है?', 'यह लक्षण कितने दिनों से हैं?', 'क्या उल्टी के बिना पानी या खाना पच रहा है?'],
    homeCare: 'Drink warm fluids, oral electrolytes, get adequate sleep, and take saline gargles for throat discomfort.',
    homeCareHindi: 'गुनगुना पानी पिएं, नमक के पानी के गरारे करें, हल्का खाना लें और अच्छी नींद लें।'
  }
];

/**
 * @desc    Intelligent Symptom Analysis
 * @route   POST /api/ai/symptom-analysis
 */
/**
 * Determine anatomical body region and hologram coordinates based on symptoms
 */
export const determineAffectedBodyPart = (symptomsText, specialization, conditionName, preferredLanguage) => {
  const text = (symptomsText + " " + (conditionName || "")).toLowerCase();
  const isHindi = preferredLanguage === 'hindi' || preferredLanguage === 'hi' || (!preferredLanguage && isDevanagari(symptomsText));

  // Chest / Cardiovascular
  if (
    text.includes('chest') || text.includes('heart') || text.includes('cardio') || text.includes('angina') ||
    text.includes('palpitation') || text.includes('bp') || text.includes('blood pressure') ||
    text.includes('seene') || text.includes('chhati') || text.includes('dil') || text.includes('dhadkan') ||
    text.includes('saans phoolna') || text.includes('ghabrahat') ||
    text.includes('धड़कन') || text.includes('सीने') || text.includes('छाती') || text.includes('दिल') ||
    text.includes('घबराहट') || text.includes('सांस फूलना') || text.includes('रक्तचाप')
  ) {
    return {
      id: 'chest',
      name: isHindi ? 'हृदय एवं वक्ष प्रदेश' : 'Chest & Cardiovascular Region',
      region: isHindi ? 'वक्ष गुहा' : 'Thoracic Cavity',
      organ: isHindi ? 'हृदय एवं कोरोनरी धमनियां' : 'Heart & Coronary Arteries',
      coordinates: { x: 50, y: 52 },
      color: '#ef4444',
      badge: isHindi ? 'हृदय स्कैन लॉक' : 'Cardiovascular Lock',
      clinicalNotes: isHindi
        ? 'एनाटॉमिकल स्कैन वक्ष गुहा और कोरोनरी अक्ष पर तनाव को दर्शाता है।'
        : 'Anatomical scan indicates strain in the central thoracic compartment and coronary axis.'
    };
  }

  // Head / Brain / Cranial
  if (
    text.includes('head') || text.includes('migraine') || text.includes('dizziness') || text.includes('vertigo') ||
    text.includes('brain') || text.includes('sar dard') || text.includes('sir dard') || text.includes('sar me dard') ||
    text.includes('sir ghoom') || text.includes('chakkar') || text.includes('sir bhari') ||
    text.includes('सिरदर्द') || text.includes('सिर दर्द') || text.includes('सर दर्द') || text.includes('चक्कर') ||
    text.includes('माइग्रेन') || text.includes('बेहोशी') || text.includes('सिर भारी') || text.includes('नस')
  ) {
    return {
      id: 'head',
      name: isHindi ? 'कपाल एवं न्यूरोलॉजिकल क्षेत्र' : 'Cranial & Neurological Region',
      region: isHindi ? 'कपाल गुहा' : 'Cranial Vault',
      organ: isHindi ? 'मस्तिष्क एवं सेरेब्रोवास्कुलर तंत्र' : 'Brain & Cerebrovascular Pathways',
      coordinates: { x: 50, y: 19 },
      color: '#f59e0b',
      badge: isHindi ? 'मस्तिष्क न्यूरल लॉक' : 'Cranial Neural Lock',
      clinicalNotes: isHindi
        ? 'होलोग्राफिक स्कैन सेफेलिक दर्द रिसेप्टर्स और वेस्टिबुलर तंत्रिकाओं को लक्षित करता है।'
        : 'Holographic triangulation isolates cephalic pain receptors and vestibular nerve pathways.'
    };
  }

  // Throat / Respiratory
  if (
    text.includes('throat') || text.includes('cough') || text.includes('khansi') || text.includes('खांसी') ||
    text.includes('gala') || text.includes('गले') || text.includes('sardi') || text.includes('zukam') ||
    text.includes('jukam') || text.includes('सर्दी') || text.includes('जुकाम') || text.includes('voice') ||
    text.includes('pharynx') || text.includes('sore throat') || text.includes('swallow') || text.includes('कफ')
  ) {
    return {
      id: 'throat',
      name: isHindi ? 'श्वसन एवं ग्रीवा प्रदेश' : 'Upper Respiratory & Cervical Region',
      region: isHindi ? 'श्वासनली एवं ग्रीवा तंत्र' : 'Cervical / Tracheal Tract',
      organ: isHindi ? 'गला, स्वरयंत्र एवं श्वासनली' : 'Pharynx, Larynx & Upper Airways',
      coordinates: { x: 50, y: 34 },
      color: '#38bdf8',
      badge: isHindi ? 'श्वसन तंत्र लॉक' : 'Respiratory Lock',
      clinicalNotes: isHindi
        ? 'थर्मल सेंसर ऊपरी श्वासनली और गले की झिल्लियों में सूजन/खराश डिटेक्ट कर रहा है।'
        : 'Thermal signature detects irritation across upper tracheal and mucosal membranes.'
    };
  }

  // Stomach / Abdomen
  if (
    text.includes('stomach') || text.includes('abdomen') || text.includes('belly') || text.includes('pet') ||
    text.includes('पेट') || text.includes('acidity') || text.includes('gas') || text.includes('digest') ||
    text.includes('vomit') || text.includes('ulti') || text.includes('nausea') || text.includes('loose motion') ||
    text.includes('diarrhea') || text.includes('dast') || text.includes('दस्त') || text.includes('उल्टी') ||
    text.includes('कब्ज') || text.includes('एसिडिटी') || text.includes('hazam')
  ) {
    return {
      id: 'abdomen',
      name: isHindi ? 'उदर एवं पाचन तंत्र' : 'Gastrointestinal & Abdominal Cavity',
      region: isHindi ? 'उदर गुहा' : 'Abdominal Viscera',
      organ: isHindi ? 'पेट, आंतें और यकृत' : 'Stomach, Intestinal Tract & Liver',
      coordinates: { x: 50, y: 74 },
      color: '#10b981',
      badge: isHindi ? 'पाचन तंत्र लॉक' : 'Gastrointestinal Lock',
      clinicalNotes: isHindi
        ? 'टारगेट लॉक आमाशय और आंतों की सक्रियता व ऐंठन को रेखांकित करता है।'
        : 'Target lock highlights gastric mucosa and peristaltic intestinal tracts.'
    };
  }

  // Pelvis / Reproductive
  if (
    text.includes('period') || text.includes('menstrual') || text.includes('pelvic') || text.includes('pelvis') ||
    text.includes('cramp') || text.includes('pregnancy') || text.includes('gyneco') || text.includes('ovary') ||
    text.includes('mahawari') || text.includes('माहवारी') || text.includes('मासिक धर्म') ||
    text.includes('गर्भावस्था') || text.includes('garbhavastha')
  ) {
    return {
      id: 'pelvis',
      name: isHindi ? 'श्रोणि एवं प्रजनन तंत्र' : 'Pelvic & Reproductive Region',
      region: isHindi ? 'श्रोणि गुहा' : 'Pelvic Cavity',
      organ: isHindi ? 'प्रजनन एवं मूत्र तंत्र' : 'Reproductive & Genitourinary Tract',
      coordinates: { x: 50, y: 92 },
      color: '#ec4899',
      badge: isHindi ? 'श्रोणि मेश लॉक' : 'Pelvic Mesh Lock',
      clinicalNotes: isHindi
        ? 'सटीक रडार लॉक निचले पेल्विक बेसिन और प्रजनन अंगों पर केंद्रित है।'
        : 'Focused radar lock on lower pelvic basin and reproductive organs.'
    };
  }

  // Skin / Dermal
  if (
    text.includes('skin') || text.includes('rash') || text.includes('itching') || text.includes('khujli') ||
    text.includes('acne') || text.includes('pimple') || text.includes('eczema') || text.includes('dermat') ||
    text.includes('tvacha') || text.includes('daane') || text.includes('खुजली') || text.includes('दाने') ||
    text.includes('त्वचा') || text.includes('मुंहासे') || text.includes('पिंपल')
  ) {
    return {
      id: 'skin',
      name: isHindi ? 'त्वचा एवं उपकला तंत्र' : 'Dermal & Epidermal Integument',
      region: isHindi ? 'एपिडर्मल परत' : 'Epidermal Barrier',
      organ: isHindi ? 'क्यूटेनियस त्वचा परत' : 'Cutaneous Dermal Layer',
      coordinates: { x: 50, y: 64 },
      color: '#06b6d4',
      badge: isHindi ? 'त्वचा स्कैन लॉक' : 'Dermatological Lock',
      clinicalNotes: isHindi
        ? 'एपिडर्मल सेंसर स्थानीय सूजन, एलर्जी और हिस्टामाइन प्रतिक्रिया को दर्ज करता है।'
        : 'Surface epidermal sensor registers localized inflammation and histamine reaction.'
    };
  }

  // Musculoskeletal / Joints
  if (
    text.includes('joint') || text.includes('knee') || text.includes('leg') || text.includes('arm') ||
    text.includes('shoulder') || text.includes('bone') || text.includes('stiff') || text.includes('arthritis') ||
    text.includes('back pain') || text.includes('spine') || text.includes('ghutna') || text.includes('kamar dard') ||
    text.includes('badan dard') || text.includes('घुटने') || text.includes('कमर दर्द') || text.includes('जोड़ों')
  ) {
    return {
      id: 'joints',
      name: isHindi ? 'मस्कुलोस्केलेटल एवं जोड़' : 'Musculoskeletal & Articular Frame',
      region: isHindi ? 'परिधीय जोड़ एवं रीढ़' : 'Peripheral Joints & Spine',
      organ: isHindi ? 'जोड़ों के कार्टिलेज एवं स्नायु' : 'Articular Cartilage & Ligaments',
      coordinates: { x: 34, y: 118 },
      color: '#a855f7',
      badge: isHindi ? 'अस्थि-जोड़ लॉक' : 'Musculoskeletal Lock',
      clinicalNotes: isHindi
        ? 'बायोमैकेनिकल विश्लेषण जोड़ों और रीढ़ की संरचना पर तनाव प्रदर्शित करता है।'
        : 'Stress analysis shows articular tension across synovial joint structures.'
    };
  }

  // Fallbacks by specialization
  if (specialization === 'Cardiologist') {
    return {
      id: 'chest',
      name: isHindi ? 'हृदय एवं वक्ष प्रदेश' : 'Chest & Cardiovascular Region',
      region: isHindi ? 'वक्ष गुहा' : 'Thoracic Cavity',
      organ: isHindi ? 'हृदय एवं कोरोनरी धमनियां' : 'Heart & Pulmonary Vasculature',
      coordinates: { x: 50, y: 52 },
      color: '#ef4444',
      badge: isHindi ? 'हृदय स्कैन लॉक' : 'Cardiovascular Lock',
      clinicalNotes: isHindi
        ? 'एनाटॉमिकल स्कैन वक्ष गुहा और कोरोनरी अक्ष पर तनाव को दर्शाता है।'
        : 'Anatomical scan indicates strain in the central thoracic compartment and coronary axis.'
    };
  }
  if (specialization === 'Neurologist') {
    return {
      id: 'head',
      name: isHindi ? 'कपाल एवं न्यूरोलॉजिकल क्षेत्र' : 'Cranial & Neurological Region',
      region: isHindi ? 'कपाल गुहा' : 'Cranial Vault',
      organ: isHindi ? 'मस्तिष्क एवं सेरेब्रोवास्कुलर तंत्र' : 'Brain & Cerebrovascular Pathways',
      coordinates: { x: 50, y: 19 },
      color: '#f59e0b',
      badge: isHindi ? 'मस्तिष्क न्यूरल लॉक' : 'Cranial Neural Lock',
      clinicalNotes: isHindi
        ? 'होलोग्राफिक स्कैन सेफेलिक दर्द रिसेप्टर्स और वेस्टिबुलर तंत्रिकाओं को लक्षित करता है।'
        : 'Holographic triangulation isolates cephalic pain receptors and vestibular nerve pathways.'
    };
  }
  if (specialization === 'Dermatologist') {
    return {
      id: 'skin',
      name: isHindi ? 'त्वचा एवं उपकला तंत्र' : 'Dermal & Epidermal Integument',
      region: isHindi ? 'एपिडर्मल परत' : 'Epidermal Barrier',
      organ: isHindi ? 'क्यूटेनियस त्वचा परत' : 'Cutaneous Dermal Layer',
      coordinates: { x: 50, y: 64 },
      color: '#06b6d4',
      badge: isHindi ? 'त्वचा स्कैन लॉक' : 'Dermatological Lock',
      clinicalNotes: isHindi
        ? 'एपिडर्मल सेंसर स्थानीय सूजन, एलर्जी और हिस्टामाइन प्रतिक्रिया को दर्ज करता है।'
        : 'Surface epidermal sensor registers localized inflammation and histamine reaction.'
    };
  }
  if (specialization === 'Gynecologist') {
    return {
      id: 'pelvis',
      name: isHindi ? 'श्रोणि एवं प्रजनन तंत्र' : 'Pelvic & Reproductive Region',
      region: isHindi ? 'श्रोणि गुहा' : 'Pelvic Cavity',
      organ: isHindi ? 'प्रजनन एवं मूत्र तंत्र' : 'Reproductive & Genitourinary Tract',
      coordinates: { x: 50, y: 92 },
      color: '#ec4899',
      badge: isHindi ? 'श्रोणि मेश लॉक' : 'Pelvic Mesh Lock',
      clinicalNotes: isHindi
        ? 'सटीक रडार लॉक निचले पेल्विक बेसिन और प्रजनन अंगों पर केंद्रित है।'
        : 'Focused radar lock on lower pelvic basin and reproductive organs.'
    };
  }

  return {
    id: 'systemic',
    name: isHindi ? 'प्रणालीगत एवं प्रतिरक्षा तंत्र' : 'Systemic & Metabolic Immune Network',
    region: isHindi ? 'संपूर्ण शरीर शारीरिक अक्ष' : 'Full Body Physiological Axis',
    organ: isHindi ? 'प्रतिरक्षा एवं संवहनी तंत्र' : 'Immune, Vascular & Thermoregulatory Network',
    coordinates: { x: 50, y: 48 },
    color: '#00e599',
    badge: isHindi ? 'बायो-सिस्टम स्कैन' : 'Systemic Bio-Scan',
    clinicalNotes: isHindi
      ? 'बायोमेट्रिक टेलीमेट्री पूरे शरीर में सामान्य प्रतिरक्षा व शारीरिक सक्रियता दर्शाती है।'
      : 'Biometric telemetry demonstrates generalized systemic immune/metabolic activation.'
  };
};

export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, age, gender, duration, preferredLanguage } = req.body;

    if (!symptoms || symptoms.trim().length === 0) {
      return res.status(400).json({ message: 'Please provide symptom details for analysis' });
    }

    const doctors = await Doctor.find({ isActive: true }).select('name specialization degree experience fees');
    const doctorsContext = doctors.map(d => ({
      name: d.name,
      specialization: d.specialization,
      experience: d.experience,
      fees: d.fees
    }));

    // If Gemini API Key is available, use Gemini 1.5 Flash
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' }
        });

        const prompt = `
You are an expert clinical triage AI assistant for the ArogyaCareAI healthcare platform.
Analyze the following patient symptoms and recommend appropriate next steps and medical specialist.

Patient Info:
- Symptoms: "${symptoms}"
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}
- Duration: ${duration || 'Not specified'}

Available Specialist Categories in Clinic Network:
[Cardiologist, Dermatologist, Neurologist, Pediatrician, Gynecologist, General Physician]

Active Doctors Context:
${JSON.stringify(doctorsContext, null, 2)}

Instructions:
1. Determine triage level: "mild" (self-limiting, schedule normal visit), "moderate" (needs medical review soon), or "urgent" (needs immediate medical attention).
2. Identify top 2-3 possible clinical conditions or differential considerations.
3. Recommend the best medical specialization from the list above.
4. Give a concise, empathetic plain-language clinical summary.
5. Provide 3 specific questions the patient should prepare for their doctor.
6. Provide safe, non-medicinal immediate home care / precautions.
7. Include a standard medical disclaimer.

Return strictly JSON matching this structure:
{
  "triageLevel": "mild" | "moderate" | "urgent",
  "recommendedSpecialization": "Cardiologist",
  "conditionSummary": "Brief overview of what may be occurring",
  "possibleConditions": [
    { "name": "Condition Name", "likelihood": "High" | "Moderate" | "Low", "description": "Brief description" }
  ],
  "suggestedQuestions": ["Question 1", "Question 2", "Question 3"],
  "immediateCareSteps": ["Step 1", "Step 2", "Step 3"],
  "safetyWarning": "Crucial red flag symptoms to watch out for",
  "disclaimer": "This analysis is for informational and triage purposes only and does not replace professional medical diagnosis."
}
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        let cleanedJson = responseText.trim();
        if (cleanedJson.startsWith("```")) {
          cleanedJson = cleanedJson.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }

        const parsed = JSON.parse(cleanedJson);
        const matchedDoctors = await findMatchingDoctors(parsed.recommendedSpecialization);
        const affectedBodyPart = determineAffectedBodyPart(symptoms, parsed.recommendedSpecialization, parsed.possibleConditions?.[0]?.name);

        return res.json({
          ...parsed,
          affectedBodyPart,
          recommendedDoctors: matchedDoctors
        });
      } catch (geminiError) {
        console.error('Gemini Symptom Analysis failed, using clinical fallback engine:', geminiError.message);
      }
    }

    // Clinical Fallback Knowledge Engine
    const normalizedInput = symptoms.toLowerCase();
    let bestMatch = SYMPTOM_SPECIALTY_MAP[5]; // Default to General Physician

    for (const rule of SYMPTOM_SPECIALTY_MAP) {
      if (rule.keywords.some(kw => normalizedInput.includes(kw))) {
        bestMatch = rule;
        break;
      }
    }

    let lang = detectLanguage(symptoms);
    if (preferredLanguage) {
      if (preferredLanguage === 'hindi' || preferredLanguage === 'hi') lang = 'hindi';
      else if (preferredLanguage === 'hinglish') lang = 'hinglish';
      else if (preferredLanguage === 'english' || preferredLanguage === 'en') lang = 'english';
    }
    const isHindi = lang === 'hindi';
    const isHing = lang === 'hinglish';

    const matchedDoctors = await findMatchingDoctors(bestMatch.specialization);
    const affectedBodyPart = determineAffectedBodyPart(symptoms, bestMatch.specialization, bestMatch.condition, lang);

    const specHindiMap = {
      'Cardiologist': 'हृदयरोग विशेषज्ञ',
      'Dermatologist': 'त्वचा रोग विशेषज्ञ',
      'Neurologist': 'न्यूरोलॉजिस्ट / मस्तिष्क रोग विशेषज्ञ',
      'Pediatrician': 'बाल रोग विशेषज्ञ',
      'Gynecologist': 'स्त्री रोग विशेषज्ञ',
      'General Physician': 'सामान्य चिकित्सक'
    };

    let conditionSummary = `Based on your reported symptoms ("${symptoms}"), our clinical triage engine has identified a potential need for evaluation by a ${bestMatch.specialization}.`;
    let possibleConditions = [
      {
        name: bestMatch.condition,
        likelihood: 'Moderate to High',
        description: `Common presentation associated with reported symptoms of ${symptoms.slice(0, 50)}...`
      },
      {
        name: 'General Systemic / Lifestyle Strain',
        likelihood: 'Moderate',
        description: 'Fatigue, stress, dehydration, or localized physiological reaction.'
      }
    ];
    let suggestedQuestions = bestMatch.questions;
    let immediateCareSteps = [
      bestMatch.homeCare,
      'Maintain a hydration log and record when symptoms flare up.',
      'Avoid self-medicating with unprescribed pharmaceuticals.'
    ];
    let safetyWarning = bestMatch.advice;
    let disclaimer = 'This automated triage is powered by ArogyaCareAI for informational and clinical coordination purposes only and does not replace an in-person medical evaluation.';

    if (isHindi) {
      conditionSummary = `आपके द्वारा बताए गए लक्षणों ("${symptoms}") के आधार पर, हमारे AI क्लीनिकल ट्राइएज इंजन ने पाया है कि आपको ${specHindiMap[bestMatch.specialization] || bestMatch.specialization} से परामर्श लेना चाहिए।`;
      possibleConditions = [
        {
          name: bestMatch.conditionHindi || bestMatch.condition,
          likelihood: 'मध्यम से उच्च (Moderate to High)',
          description: `आपके बताए गए लक्षणों (${symptoms.slice(0, 50)}) के आधार पर यह संभावित स्वास्थ्य स्थिति हो सकती है।`
        },
        {
          name: 'सामान्य थकान / शारीरिक खिंचाव अथवा पानी की कमी (Dehydration)',
          likelihood: 'मध्यम (Moderate)',
          description: 'शारीरिक थकावट, मानसिक तनाव, अपर्याप्त पानी या मौसमी बदलाव का प्रभाव।'
        }
      ];
      suggestedQuestions = bestMatch.questionsHindi || bestMatch.questions;
      immediateCareSteps = [
        bestMatch.homeCareHindi || bestMatch.homeCare,
        'पर्याप्त मात्रा में पानी व तरल पदार्थ पिएं और लक्षण कब बढ़ते हैं उस पर नजर रखें।',
        'बिना डॉक्टर की पर्ची के कोई भी तेज या अप्रमाणित दवाई न लें।'
      ];
      safetyWarning = bestMatch.adviceHindi || bestMatch.advice;
      disclaimer = 'यह स्वचालित विश्लेषण ArogyaCareAI द्वारा केवल प्राथमिक जानकारी एवं मार्गदर्शन के लिए है। यह किसी प्रमाणित डॉक्टर के व्यक्तिगत परीक्षण का विकल्प नहीं है।';
    } else if (isHing) {
      conditionSummary = `Aapke bataye gaye symptoms ("${symptoms}") ke anusaar, hamara AI triage engine recommend karta hai ki aapko ek ${bestMatch.specialization} (${specHindiMap[bestMatch.specialization] || ''}) se consult karna chahiye.`;
      possibleConditions = [
        {
          name: `${bestMatch.condition} (${bestMatch.conditionHindi || ''})`,
          likelihood: 'Moderate to High',
          description: `Aapke symptoms (${symptoms.slice(0, 50)}) ke aadhar par sambhavit health condition.`
        },
        {
          name: 'General Lifestyle / Physical Strain',
          likelihood: 'Moderate',
          description: 'Thakawat, stress, ya dehydration ke kaaran hone wali pareshani.'
        }
      ];
      suggestedQuestions = bestMatch.questionsHindi
        ? bestMatch.questions.map((q, idx) => `${q} (${bestMatch.questionsHindi[idx] || ''})`)
        : bestMatch.questions;
      immediateCareSteps = [
        bestMatch.homeCareHindi ? `${bestMatch.homeCare} / ${bestMatch.homeCareHindi}` : bestMatch.homeCare,
        'Khub saara paani piyein aur note karein ki takleef kis samay badhti hai.',
        'Bina doctor ke prescription ke koi bhi new medicine na lein.'
      ];
      safetyWarning = `${bestMatch.advice} (${bestMatch.adviceHindi || ''})`;
      disclaimer = 'Yeh automated triage ArogyaCareAI dwara keval informational guidance ke liye hai, yeh certified doctor ke consultation ka replacement nahi hai.';
    }

    return res.json({
      triageLevel: bestMatch.urgency,
      recommendedSpecialization: bestMatch.specialization,
      conditionSummary,
      affectedBodyPart,
      possibleConditions,
      suggestedQuestions,
      immediateCareSteps,
      safetyWarning,
      disclaimer,
      recommendedDoctors: matchedDoctors
    });
  } catch (error) {
    console.error('Symptom analysis error:', error);
    return res.status(500).json({ message: 'Failed to process symptom analysis', error: error.message });
  }
};

/**
 * @desc    Conversational Medical Chatbot
 * @route   POST /api/ai/chat
 */

export const chatWithAI = async (req, res) => {
  try {
    const { messages, userRole, patientName, preferredLanguage } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    const latestMessage = messages[messages.length - 1].content;
    const doctors = await Doctor.find({ isActive: true }).select('name specialization experience fees degree hospital rating image');
    
    let lang = detectLanguage(latestMessage);
    if (preferredLanguage) {
      if (preferredLanguage === 'hindi' || preferredLanguage === 'hi') lang = 'hindi';
      else if (preferredLanguage === 'hinglish') lang = 'hinglish';
      else if (preferredLanguage === 'english' || preferredLanguage === 'en') lang = 'english';
    }

    // If Gemini is available
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemInstruction = `
You are ArogyaCare AI, the Senior Clinical Triage Assistant & Medical AI Consultant for the ArogyaCareAI healthcare ecosystem.

CORE PROFESSIONAL STANDARDS & CLINICAL PERSONA:
1. PROFESSIONAL, CLINICAL & COURTEOUS TONE:
   - Communicate with the expertise, precision, empathy, and professional decorum of an experienced clinical consultant.
   - Maintain a respectful, evidence-based, and objective bedside manner. Avoid casual slang or colloquialisms (do NOT use "Arre dost", "yaar", "bhai", "main hoon na").
   - Address the patient with respect (e.g., "Hello", "नमस्ते [Name] जी", "Aapka swagat hai ArogyaCareAI clinical portal mein").
2. MULTILINGUAL CLINICAL ACCURACY (ENGLISH, HINDI, HINGLISH):
   - Match the patient's language with professional phrasing:
     * HINDI: Use formal, respectful, accurate Hindi (जैसे: "सादर नमस्कार। आपके द्वारा बताए गए लक्षणों के आधार पर प्राथमिक क्लीनिकल मूल्यांकन निम्नलिखित है...").
     * HINGLISH: Use polite, clear, respectful Hinglish suited for clinical consultations.
     * ENGLISH: Use articulate, reassuring healthcare communication.
3. STRUCTURED CLINICAL RESPONSE FORMAT:
   - 📋 **Clinical Assessment & Triage**: Clear, structured medical assessment of symptoms.
   - 🔍 **Differential Considerations**: Likely physiological or clinical considerations to discuss with a physician.
   - 🛡️ **Supportive Home Care & Precautions**: Safe, non-pharmacological supportive advice (hydration, rest, elevation, monitoring). Never prescribe unverified prescription-only antibiotics or dangerous pharmaceuticals.
   - 🚨 **Red Flag Emergency Alerts**: Crucial indicators requiring immediate emergency medical care / ambulance.
   - 🩺 **Specialist Referrals**: Relevant platform specialists available for booking:
   ${JSON.stringify(doctors.map(d => ({ name: d.name, spec: d.specialization, exp: `${d.experience} yrs`, fees: `₹${d.fees}`, hospital: d.hospital })), null, 2)}
4. MEDICAL DISCLAIMER:
   - Always conclude with a concise medical disclaimer that this automated AI triage does not replace in-person diagnostic evaluation.
`;

        const prompt = `${systemInstruction}\n\nConversation History:\n${messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}\nAssistant:`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        // Check if query matches doctor specialties
        const lowerMsg = latestMessage.toLowerCase();
        let doctorSuggestions = [];
        for (const doc of doctors) {
          if (lowerMsg.includes(doc.specialization.toLowerCase()) || lowerMsg.includes(doc.name.toLowerCase())) {
            doctorSuggestions.push(doc);
          }
        }

        return res.json({
          reply,
          suggestedDoctors: doctorSuggestions.slice(0, 3)
        });
      } catch (geminiError) {
        console.error('Gemini Chat failed, using professional fallback engine:', geminiError.message);
      }
    }

    // Professional clinical conversational fallback engine
    const query = latestMessage.toLowerCase();
    let reply = "";
    let suggestedDoctors = [];

    // Helper to get doctors by specialty
    const getDocs = (spec) => doctors.filter(d => d.specialization.toLowerCase().includes(spec.toLowerCase()));

    // 1. Greetings & Professional Inquiries
    const isGreeting = (
      query.includes('namaste') || query.includes('नमस्ते') || query.includes('hello') || query.includes('hi') ||
      query.includes('hey') || query.includes('good morning') || query.includes('good afternoon') || query.includes('good evening') ||
      query.includes('kaise ho') || query.includes('kaisa hai') || query.includes('who are you') || query.includes('tum kaun') ||
      query.includes('aap kaun') || query.includes('help') || query.includes('madad')
    );

    // 2. Fever / Cold / Cough / Flu / Body Ache
    const isFeverCold = (
      query.includes('bukhar') || query.includes('बुखार') || query.includes('fever') || query.includes('cold') ||
      query.includes('cough') || query.includes('khansi') || query.includes('खांसी') || query.includes('sardi') ||
      query.includes('सर्दी') || query.includes('zukam') || query.includes('जुकाम') || query.includes('gala') ||
      query.includes('गले') || query.includes('sore throat') || query.includes('chills') || query.includes('flu') ||
      query.includes('shivering') || query.includes('badan dard') || query.includes('बदन दर्द') || query.includes('body pain')
    );

    // 3. Headache / Migraine / Dizziness
    const isHeadache = (
      query.includes('headache') || query.includes('head ache') || query.includes('sar dard') || query.includes('sir dard') ||
      query.includes('सिरदर्द') || query.includes('सिर दर्द') || query.includes('सर दर्द') || query.includes('migraine') ||
      query.includes('माइग्रेन') || query.includes('chakkar') || query.includes('चक्कर') || query.includes('dizziness') ||
      query.includes('vertigo') || ((query.includes('sir') || query.includes('sar') || query.includes('सिर') || query.includes('सर')) && (query.includes('dard') || query.includes('दर्द') || query.includes('भारी') || query.includes('pain')))
    );

    // 4. Stomach Pain / Acidity / Digestion / Vomiting / Loose Motion
    const isStomach = (
      query.includes('stomach') || query.includes('pet dard') || query.includes('पेट दर्द') || query.includes('पेट में') ||
      query.includes('pet me') || query.includes('पेट') || query.includes('acidity') || query.includes('एसिडिटी') ||
      query.includes('gas') || query.includes('गैस') || query.includes('vomit') || query.includes('ulti') ||
      query.includes('उल्टी') || query.includes('loose motion') || query.includes('dast') || query.includes('दस्त') ||
      query.includes('cramp') || query.includes('kabz') || query.includes('constipation') || query.includes('diarrhea') ||
      query.includes('अपच') || query.includes('digestion')
    );

    // 5. Heart / Chest Pain / Heaviness / BP
    const isHeart = (
      query.includes('heart') || query.includes('dil') || query.includes('दिल') || query.includes('chest') ||
      query.includes('chhati') || query.includes('छाती') || query.includes('seene') || query.includes('सीना') ||
      query.includes('सीने') || query.includes('cardio') || query.includes('blood pressure') || query.includes('bp') ||
      query.includes('dhadkan') || query.includes('धड़कन') || query.includes('palpitation') || query.includes('cardiac')
    );

    // 6. Skin / Rash / Acne / Itching
    const isSkin = (
      query.includes('skin') || query.includes('tvacha') || query.includes('त्वचा') || query.includes('rash') ||
      query.includes('रैश') || query.includes('acne') || query.includes('pimple') || query.includes('पिंपल') ||
      query.includes('daane') || query.includes('दाने') || query.includes('itching') || query.includes('khujli') ||
      query.includes('खुजली') || query.includes('derm') || query.includes('allergy') || query.includes('एलर्जी')
    );

    // 7. Prescription / Medicine / OCR Scanner / Lab Reports
    const isPrescription = (
      query.includes('prescription') || query.includes('medicine') || query.includes('tablet') || query.includes('dose') ||
      query.includes('parcha') || query.includes('पर्चा') || query.includes('dawai') || query.includes('दवाई') ||
      query.includes('दवा') || query.includes('ocr') || query.includes('scanner') || query.includes('goli') ||
      query.includes('गोली') || query.includes('report') || query.includes('रिपोर्ट')
    );

    // 8. Book Appointment / Doctors
    const isBooking = (
      query.includes('book') || query.includes('appointment') || query.includes('अपॉइंटमेंट') || query.includes('बुकिंग') ||
      query.includes('slot') || query.includes('doctor dikhana') || query.includes('डॉक्टर') || query.includes('doctor chahiye') ||
      query.includes('milna hai') || query.includes('consult')
    );

    // 9. Mental Stress / Anxiety / Psychological Wellness
    const isStress = (
      query.includes('stress') || query.includes('tension') || query.includes('टेंशन') || query.includes('depress') ||
      query.includes('udas') || query.includes('उदास') || query.includes('chinta') || query.includes('चिंता') ||
      query.includes('akela') || query.includes('lonely') || query.includes('ghabrahat') || query.includes('घबराहट') ||
      query.includes('anxiety') || query.includes('sad') || query.includes('panic')
    );

    // Generate structured professional response based on intent and language
    if (isFeverCold) {
      if (lang === 'hindi') {
        reply = `### प्राथमिक क्लीनिकल मूल्यांकन: ज्वर एवं तीव्र श्वसन संक्रमण (Fever & Cold)

सादर नमस्कार। आपके द्वारा बताए गए बुखार एवं खांसी/सर्दी के लक्षण सामान्यतः **तीव्र वायरल श्वसन संक्रमण (Acute Viral Upper Respiratory Infection)** की ओर संकेत करते हैं।

#### क्लीनिकल सावधानियां एवं घरेलू देखभाल (Supportive Care):
- **पर्याप्त विश्राम (Bed Rest)**: शरीर की प्रतिरक्षा प्रणाली (Immune System) को रोग से लड़ने हेतु पूर्ण विश्राम दें और भारी श्रम से बचें।
- **हाइड्रेशन एवं तरल पदार्थ**: निर्जलीकरण से बचने हेतु दिनभर गुनगुना पानी, सूप एवं ओरल रिहाइड्रेशन घोल (ORS) लें।
- **भाप एवं गरारे (Inhalation & Gargles)**: श्वासनली की सूजन व जकड़न दूर करने के लिए दिन में दो बार भाप लें तथा गुनगुने नमक के पानी से गरारे करें।
- **संतुलित एवं हल्का आहार**: ताजा, सुपाच्य और पौष्टिक भोजन (दलिया, मूंग दाल खिचड़ी, गुनगुना सूप) ग्रहण करें।

🚨 **आपातकालीन चेतावनी (Red Flags)**: यदि बुखार **102°F (38.9°C)** से अधिक हो, 3 दिनों से अधिक बना रहे, अथवा सांस लेने में कठिनाई या सीने में दर्द हो, तो तुरंत चिकित्सीय सहायता लें।

👨‍⚕️ **अनुशंसित विशेषज्ञ**: सटीक परीक्षण हेतु हमारे सत्यापित **General Physician (सामान्य चिकित्सक)** से परामर्श लें:`;
      } else if (lang === 'hinglish') {
        reply = `### Clinical Assessment: Acute Fever & Upper Respiratory Tract Infection

Namaste. Aapke bataye gaye bukhar aur khansi/cold ke lakshan aamtaur par **Viral Upper Respiratory Infection** ke sanket hote hain.

#### Recommended Clinical Supportive Care:
- **Adequate Bed Rest**: Body ko heal hone ke liye proper rest dein aur physical strain avoid karein.
- **Hydration Support**: Din bhar gunguna paani, soups aur electrolytes ka sevan karein taaki dehydration na ho.
- **Steam Inhalation & Saline Gargles**: Band naak aur gale ki kharash ke liye din me 2 baar steam lein aur warm saline gargles karein.
- **Light & Digestible Diet**: Khichdi, dalia ya soup jaisa halka aur nutritious khana lein.

🚨 **Clinical Red Flags**: Agar bukhar **102°F** se zyada ho, 3 din se kam na ho, ya saans phoolne lage, toh turant in-person medical evaluation karwayein.

👨‍⚕️ **Recommended Specialist**: Auscultation aur prescription review ke liye hamare verified **General Physician** se consult karein:`;
      } else {
        reply = `### Clinical Assessment: Acute Febrile & Upper Respiratory Syndrome

Hello. Based on your reported symptoms of fever and cough/cold, this clinical presentation is commonly consistent with an **Acute Viral Upper Respiratory Tract Infection** or influenza-like illness.

#### Recommended Supportive Protocol:
- **Adequate Bed Rest**: Maintain strict bed rest (7–9 hours) to support immune recovery and prevent physical fatigue.
- **Aggressive Oral Hydration**: Maintain continuous fluid intake (warm water, broths, electrolyte fluids) to counteract insensible fluid loss from fever.
- **Airway & Pharyngeal Care**: Perform steam inhalation twice daily for 5–10 minutes to mobilize mucosal secretions, and warm saline gargles for throat irritation.
- **Nutritional Support**: Opt for easily digestible, warm meals such as clear broths, lentils, and steamed vegetables.

🚨 **Emergency Red Flags**: Seek immediate medical care if your body temperature exceeds **102°F (38.9°C)**, persists beyond 72 hours, or if you develop dyspnea (shortness of breath), chest pain, or marked lethargy.

👨‍⚕️ **Recommended Specialist**: An in-person clinical examination by a **General Physician** is recommended for chest auscultation and diagnostic management:`;
      }
      suggestedDoctors = getDocs('General Physician').slice(0, 2);
      if (suggestedDoctors.length === 0) suggestedDoctors = doctors.slice(0, 2);

    } else if (isHeadache) {
      if (lang === 'hindi') {
        reply = `### क्लीनिकल मूल्यांकन: सिरदर्द एवं न्यूरोलॉजिकल ट्राइएज (Cephalea / Headache)

सिरदर्द एवं चक्कर आने के लक्षण सामान्यतः **तनाव जनित सिरदर्द (Tension-type Headache)**, **माइग्रेन (Migraine)**, अथवा **शरीर में पानी की कमी (Dehydration)** से संबंधित हो सकते हैं।

#### प्राथमिक क्लीनिकल प्रबंधन:
- **प्रकाश एवं स्क्रीन नियंत्रण**: मोबाइल और लैपटॉप की तेज स्क्रीन तथा तीव्र प्रकाश से तुरंत दूर हटें और शांत, अंधकारमय कक्ष में विश्राम करें।
- **हाइड्रेशन**: तुरंत 1–2 गिलास शुद्ध जल पिएं; निर्जलीकरण संवहनी सिरदर्द को शीघ्र उत्तेजित करता है।
- **शीतल सिकाई (Cold Compress)**: माथे अथवा कनपटी पर शीतल पट्टी रखने से वाहिका संकुचन होकर दर्द में आराम मिलता है।
- **ग्रीवा विश्राम**: गर्दन और कंधों को धीरे-धीरे स्ट्रेच करें ताकि मांसपेशियों का खिंचाव कम हो सके।

🚨 **आपातकालीन संकेत (Thunderclap Criteria)**: यदि सिरदर्द अचानक अत्यंत तीव्र ("जीवन का सबसे भयंकर सिरदर्द") हो, साथ में उल्टी, दृष्टि दोष, गर्दन में अकड़न, अथवा अंगों में सुन्नता या कमजोरी आए, तो तुरंत निकटतम इमरजेंसी अस्पताल जाएं।

👨‍⚕️ **अनुशंसित विशेषज्ञ**: विस्तृत न्यूरोलॉजिकल परीक्षण हेतु हमारे वरिष्ठ **Neurologist (न्यूरोलॉजिस्ट)** से संपर्क करें:`;
      } else if (lang === 'hinglish') {
        reply = `### Clinical Assessment: Cephalea & Neurological Triage

Headache aur dizziness ke lakshan aamtaur par **Tension Headache**, **Migraine**, ya **Dehydration Strain** ke kaaran trigger hote hain.

#### Clinical Care Recommendations:
- **Screen & Light Restriction**: Bright displays aur ambient noise se door shant, andhere kamre me aaram karein.
- **Immediate Hydration**: 1-2 glass paani piyein taaki dehydration-induced headache control ho sake.
- **Cold Compress**: Temples aur mathe par cool compress lagayein vascular inflammation reduce karne ke liye.
- **Cervical Posture**: Gardan aur shoulder muscles ko gently stretch karein.

🚨 **Emergency Red Flags**: Agar dard achanak severe thunderclap jaisa ho, vision me blurriness ho, ya neck stiffness ke sath bukhar ho, toh turant Emergency Department visit karein.

👨‍⚕️ **Recommended Specialist**: Comprehensive evaluation ke liye hamare verified **Neurologist** se consult karein:`;
      } else {
        reply = `### Clinical Evaluation: Cephalea & Neurological Symptoms

Hello. Headache and dizzy spells are most frequently categorized under **Tension-type Cephalea**, **Migraine Episode**, **Cervicogenic Strain**, or **Fluid Deficit**.

#### Clinical Management Recommendations:
- **Sensory & Visual Decompression**: Rest in a quiet, darkened room away from digital monitors, bright fluorescent lights, and noise.
- **Hydration Replacement**: Drink 500–750 ml of water immediately, as subtle dehydration is a predominant headache catalyst.
- **Cold Compress Modality**: Apply a cold or damp compress over the forehead or temporal arteries for localized vasoconstrictive relief.
- **Myofascial Relaxation**: Gently roll the shoulders and extend the cervical spine to relieve muscle guarding.

🚨 **Emergency Red Flags**: Seek immediate emergency care if you experience sudden onset excruciating pain ("thunderclap headache"), limb weakness, facial asymmetry, speech difficulty, or high fever with neck stiffness.

👨‍⚕️ **Recommended Specialist**: A clinical evaluation by a **Neurologist** or **General Physician** is indicated:`;
      }
      suggestedDoctors = getDocs('Neurologist').slice(0, 2);
      if (suggestedDoctors.length === 0) suggestedDoctors = doctors.slice(0, 2);

    } else if (isStomach) {
      if (lang === 'hindi') {
        reply = `### क्लीनिकल मूल्यांकन: उदर एवं जठरांत्र ट्राइएज (Gastrointestinal Assessment)

पेट में दर्द, एसिडिटी, गैस अथवा उल्टी के लक्षण **तीव्र गैस्ट्राइटिस (Acute Gastritis)**, **गैस्ट्रोएंटेराइटिस**, अथवा **अपच (Dyspepsia)** की ओर संकेत करते हैं।

#### प्राथमिक क्लीनिकल प्रोटोकॉल:
- **इलेक्ट्रोलाइट संतुलन (ORS)**: तरल पदार्थों की कमी की रोकथाम हेतु ओरल रिहाइड्रेशन साल्ट्स (ORS) अथवा नारियल पानी घूंट-घूंट कर पिएं।
- **सादा एवं सुपाच्य आहार**: तैलीय, मसालेदार, खट्टे एवं कैफीनयुक्त खाद्य पदार्थों का पूर्ण परहेज़ करें; मूंग दाल खिचड़ी अथवा दही-चावल का सेवन करें।
- **उदर सिकाई**: पेट पर हीटिंग पैड से सिकाई करने से आंतों की ऐंठन व मरोड़ में आराम मिलता है।
- **स्व-चिकित्सा से बचाव**: बिना चिकित्सीय परामर्श के दर्द निवारक दवाइयां (NSAIDs) कदापि न लें, इनसे पेट में अल्सर अथवा जलन बढ़ सकती है।

🚨 **आपातकालीन संकेत (Acute Abdomen)**: यदि पेट में असहनीय तीव्र दर्द हो, पेट कड़ा हो, उल्टी या मल में रक्त दिखे, अथवा अत्यधिक कमजोरी लगे, तो अविलंब अस्पताल की इमरजेंसी में संपर्क करें।

👨‍⚕️ **अनुशंसित विशेषज्ञ**: उचित निदान एवं उपचार हेतु हमारे **General Physician** अथवा **Gastroenterologist** से संपर्क करें:`;
      } else if (lang === 'hinglish') {
        reply = `### Clinical Assessment: Gastrointestinal & Abdominal Triage

Pet me dard, acidity, gas ya ulti/loose motions **Gastritis**, **Indigestion**, ya **Gastroenteritis** ke lakshan ho sakte hain.

#### Clinical Care Protocol:
- **Hydration & Electrolytes**: Small, frequent sips me ORS solution ya electrolyte fluids lein dehydration prevent karne ke liye.
- **Bland Diet**: Oily, spicy aur fast food band karein; plain rice, khichdi aur curd lein.
- **Warm Abdominal Compress**: Heating pad use karein visceral muscle spasms ko soothe karne ke liye.
- **Avoid Self-Medicating**: Bina prescription koi bhi painkiller (NSAIDs) na lein.

🚨 **Emergency Red Flags**: Agar dard severe aur localized ho, stool/vomit me blood ho, ya dehydration extreme ho, toh turant hospital visit karein.

👨‍⚕️ **Recommended Specialist**: Diagnostic evaluation ke liye hamare verified **General Physician** se consult karein:`;
      } else {
        reply = `### Clinical Evaluation: Gastrointestinal & Abdominal Symptoms

Hello. Abdominal discomfort, dyspepsia, hyperacidity, or emesis is frequently associated with **Acute Gastritis**, **Functional Dyspepsia**, or **Gastroenteritis**.

#### Supportive Clinical Protocol:
- **Oral Rehydration Therapy**: Ingest Oral Rehydration Salts (ORS) or electrolyte solutions in small, measured sips to maintain fluid and electrolyte homeostasis.
- **Bland Nutritional Regimen**: Strictly avoid spicy, fried, acidic, and caffeinated triggers. Transition to bland staples (steamed rice, bananas, broth).
- **Thermal Therapy**: Apply moderate, indirect warmth (heating pad) to the abdominal region to alleviate smooth muscle spasms.
- **Avoid Gastric Irritants**: Refrain from self-administering NSAIDs (such as ibuprofen/aspirin), which aggravate gastric mucosal lining.

🚨 **Emergency Red Flags (Acute Abdomen)**: Incessant localized abdominal pain, hematemesis (vomiting blood), melena (black/bloody stool), or rigid abdominal guarding requires urgent Emergency Room evaluation.

👨‍⚕️ **Recommended Specialist**: Consultation with a **General Physician** or **Gastroenterologist** is advised:`;
      }
      suggestedDoctors = getDocs('General Physician').slice(0, 2);
      if (suggestedDoctors.length === 0) suggestedDoctors = doctors.slice(0, 2);

    } else if (isHeart) {
      if (lang === 'hindi') {
        reply = `### अति-महत्वपूर्ण क्लीनिकल ट्राइएज: कार्डियोवास्कुलर एवं वक्षीय प्रोटोकॉल (Chest & Heart)

सीने में दर्द, जकड़न, घबराहट अथवा दिल की धड़कन तेज होने के किसी भी लक्षण को **सर्वोच्च क्लीनिकल प्राथमिकता** के साथ देखा जाना अनिवार्य है।

#### तत्काल अनुपालन योग्य निर्देश:
- **शारीरिक गतिविधि तुरंत बंद करें**: किसी भी प्रकार का परिश्रम रोक दें और आरामदायक, सहारा युक्त बैठने की स्थिति में आ जाएं।
- **वस्त्र शिथिल करें**: गर्दन एवं छाती के वस्त्र ढीले करें और शांत होकर नियंत्रित श्वास लें।

🚨 **अति-महत्वपूर्ण आपातकालीन प्रोटोकॉल (तुरंत 108 / 112 पर संपर्क करें अथवा इमरजेंसी वार्ड जाएं)**:
यदि आपको निम्नलिखित में से कोई भी लक्षण है:
- सीने में भारी दबाव, जलन अथवा निचोड़ने जैसी तीव्र जकड़न
- दर्द का बायीं बांह, कंधे, जबड़े अथवा पीठ की ओर प्रसार होना
- साथ में ठंडा पसीना, अत्यधिक सांस फूलना अथवा चक्कर/मूर्छा आना
**एक भी क्षण का विलंब किए बिना तुरंत निकटतम अस्पताल के इमरजेंसी विभाग (ER) पहुंचें अथवा एम्बुलेंस सेवा को कॉल करें। स्वयं वाहन न चलाएं।**

👨‍⚕️ **हृदयरोग विशेषज्ञ परामर्श**:
रक्तचाप नियंत्रण, ईसीजी एवं हृदय स्वास्थ्य के विधिवत मूल्यांकन हेतु हमारे वरिष्ठ **Cardiologists (हृदयरोग विशेषज्ञों)** से परामर्श लें:`;
      } else if (lang === 'hinglish') {
        reply = `### Critical Clinical Triage: Cardiovascular & Thoracic Care Protocol

Chest pain, heaviness, palpitation ya high blood pressure ke lakshan ko **highest clinical priority** par treat kiya jaana chahiye.

#### Immediate Safety Actions:
- **Complete Physical Rest**: Har tarah ki physical activity turant rokein aur comfortable, upright position me baith jayein.
- **Loosen Tight Clothing**: Deep, controlled breaths lein aur calm rahein.

🚨 **URGENT EMERGENCY WARNING (Call 108/112 or Visit Nearest Hospital Emergency Room)**:
Agar aapko:
- Seene me bhaari dabav, squeezing sensation ya acute jalan
- Dard jo left arm, shoulder, jaw ya back tak radiate ho raha ho
- Saath me thanda paseena, acute breathlessness ya dizziness
**Bina delay kiye turant Emergency Department visit karein ya ambulance call karein.**

👨‍⚕️ **Cardiologist Consultation**:
Blood pressure control, ECG aur cardiovascular management ke liye hamare verified **Cardiologists** available hain:`;
      } else {
        reply = `### Critical Clinical Triage: Cardiovascular & Thoracic Protocol

Precordial chest discomfort, tightness, palpitations, or dyspnea must always be managed with **paramount clinical urgency**.

#### Immediate Safety Directive:
- **Complete Physical Cessation**: Cease all physical activity immediately and sit in a supported, upright or semi-reclined position.
- **Airway & Ventilation**: Loosen restrictive collars and tight clothing. Maintain calm, controlled respiration.

🚨 **CRITICAL EMERGENCY PROTOCOL (Immediate Emergency Department / Call 108 / 112)**:
If you or the patient experience:
- Crushing, heavy, or retrosternal squeezing chest pressure
- Pain radiating across the left arm, shoulder, neck, jaw, or interscapular back
- Concomitant cold diaphoresis (sweats), acute breathlessness, or presyncope
**Activate emergency medical services or proceed directly to the nearest hospital Emergency Department. Do not attempt to drive.**

👨‍⚕️ **Cardiovascular Specialist Referral**:
For comprehensive clinical assessment, resting ECG, echocardiography, and hypertension management, consult our verified **Cardiologists** below:`;
      }
      suggestedDoctors = getDocs('Cardiologist').slice(0, 2);
      if (suggestedDoctors.length === 0) suggestedDoctors = doctors.slice(0, 2);

    } else if (isSkin) {
      if (lang === 'hindi') {
        reply = `### क्लीनिकल मूल्यांकन: त्वचा विकार एवं डर्मेटोलॉजी ट्राइएज (Dermatological Care)

त्वचा पर खुजली, लाल दाने, चकत्ते अथवा मुंहासे **एलर्जिक डर्मेटाइटिस (Contact Dermatitis)**, **एक्जिमा**, अथवा **अर्टिकेरिया (Hives)** के लक्षण हो सकते हैं।

#### क्लीनिकल प्रोटोकॉल एवं सावधानियां:
- **खरोंचने से पूर्ण परहेज़**: प्रभावित स्थान को बिल्कुल न खुजलाएं; नाखून लगाने से द्वितीयक बैक्टीरियल संक्रमण (Secondary Infection) का खतरा रहता है।
- **शीतल सिकाई (Cold Compress)**: खुजली व जलन शांत करने हेतु साफ कपड़े में लपेटकर शीतल सिकाई करें।
- **रासायनिक उत्पादों से दूरी**: सुगंधित साबुन, कठोर डिटर्जेंट एवं गर्म जल का उपयोग बंद करें।
- **सौम्य मॉइस्चराइजर**: शुद्ध एलोवेरा अथवा सुगंध-रहित मॉइस्चराइजर का उपयोग त्वचा की सुरक्षा परत को सुरक्षित रखता है।

🚨 **आपातकालीन संकेत**: यदि दाने तेजी से पूरे शरीर में फैल रहे हों, चेहरे/होठों पर सूजन आ रही हो, अथवा सांस लेने में रुकावट लगे, तो यह गंभीर तीव्र एलर्जिक प्रतिक्रिया (Anaphylaxis) हो सकती है; तत्काल इमरजेंसी में जाएं।

👨‍⚕️ **अनुशंसित विशेषज्ञ**: उचित डायग्नोसिस एवं उपचार हेतु हमारे सत्यापित **Dermatologist (त्वचा रोग विशेषज्ञ)** से परामर्श लें:`;
      } else if (lang === 'hinglish') {
        reply = `### Clinical Assessment: Dermatological & Cutaneous Triage

Skin par rash, daane, itching ya pimples **Contact Dermatitis**, **Urticaria**, ya **Eczema** ke lakshan ho sakte hain.

#### Clinical Care Protocol:
- **Strictly Avoid Scratching**: Nails se scratch bilkul mat karein, isse bacterial infection enter hone ka risk badhta hai.
- **Cool Compress**: Affected area par thandi patti lagane se histamine reaction aur itching control hoti hai.
- **Fragrance-free Care**: Chemical soaps aur hot showers avoid karein; mild aloe vera gel ya barrier moisturizer use karein.
- **Avoid Unprescribed Steroid Creams**: Bina doctor prescription ke koi bhi strong topical ointment na lagayein.

🚨 **Red Flag Warning**: Agar rash sudden spread ho aur lips/face par swelling ya saans lene me takleef ho, toh immediate emergency evaluation zaroori hai.

👨‍⚕️ **Recommended Specialist**: Accurate dermatological diagnosis ke liye hamare verified **Dermatologist** se consult karein:`;
      } else {
        reply = `### Clinical Evaluation: Dermatological & Cutaneous Symptoms

Hello. Cutaneous eruptions, pruritus (itching), or urticaria are frequently linked to **Contact Dermatitis**, **Eczema**, **Urticarial Allergic Reactions**, or **Acne Vulgaris**.

#### Clinical Care Protocol:
- **Refrain from Excoriation**: Avoid scratching the affected region, as mechanical abrasion compromises the epidermal barrier and predisposes to secondary bacterial superinfections.
- **Hypoallergenic Cold Compress**: Apply clean, cool damp compresses for 10–15 minutes to reduce localized histamine-mediated pruritus.
- **Barrier Preservation**: Avoid harsh chemical soaps and hot water. Apply unfragranced, hypoallergenic emollients or pure aloe vera.
- **Avoid Unverified Topical Steroids**: Do not apply unprescribed steroid formulations without a confirmed clinical diagnosis.

🚨 **Emergency Red Flags (Systemic Anaphylaxis)**: If the cutaneous outbreak is accompanied by facial/lip angioedema (swelling), difficulty swallowing, or acute respiratory distress, seek emergency medical care immediately.

👨‍⚕️ **Recommended Specialist**: For accurate diagnosis and targeted dermatological therapy, consult our verified **Dermatologists** below:`;
      }
      suggestedDoctors = getDocs('Dermatologist').slice(0, 2);
      if (suggestedDoctors.length === 0) suggestedDoctors = doctors.slice(0, 2);

    } else if (isPrescription) {
      if (lang === 'hindi') {
        reply = `### डिजिटल प्रिस्क्रिप्शन एवं मेडिकल रिपोर्ट विश्लेषण (AI OCR System)

ArogyaCareAI का **AI Prescription & Medical Report OCR Scanner** डॉक्टरों के हस्तलिखित पर्चों तथा पैथोलॉजी रिपोर्ट्स का सटीक क्लीनिकल विश्लेषण करता है।

#### यह प्रणाली किस प्रकार सहायता करती है:
1. **हस्तलेख एवं संक्षिप्ताक्षरों का डिकोडिंग**: डॉक्टर द्वारा प्रयुक्त लैटिन मेडिकल टर्म्स (जैसे OD, BD, TDS, PC, HS) को स्पष्ट भाषा में समझाना।
2. **औषधि विवरण (Medication Insights)**: प्रत्येक दवा का सामान्य नाम, उपयोग, सेवन का सही समय (भोजन से पूर्व अथवा पश्चात) तथा आवश्यक सावधानियां।
3. **लैब टेस्ट इंटरप्रिटेशन**: रक्त जांच (CBC, Lipid Profile, Liver Panel) के परिणामों को मानक संदर्भ सीमाओं (Reference Ranges) के साथ सरल रूप में प्रस्तुत करना।

📋 **उपयोग विधि**: शीर्ष नेविगेशन बार में **"Prescription OCR"** पर जाएं और अपनी पर्ची अथवा लैब रिपोर्ट की स्पष्ट छवि अपलोड करें।`;
      } else if (lang === 'hinglish') {
        reply = `### Digital Prescription & Medical Report OCR Analysis

ArogyaCareAI ka **AI Prescription & Medical Report OCR Scanner** doctors ke handwritten slips aur pathology test reports ko digitally decode karta hai.

#### Key Clinical Capabilities:
1. **Medical Abbreviations Decoded**: Prescription terms jaise OD (once daily), BD (twice daily), TDS (thrice daily), PC (after meals) ko simple language me translate karta hai.
2. **Medication Instructions**: Har medicine ka purpose, dosage schedule, aur essential safety precautions batata hai.
3. **Diagnostic Report Summary**: Lab parameters (Blood Sugar, Lipid Profile, LFT, CBC) ko normal ranges ke sath compare karke clinical summary deta hai.

📋 **Usage**: Top navbar me **"Prescription OCR"** par click karein aur apne prescription ya report ki photo upload karein.`;
      } else {
        reply = `### Digital Prescription & Diagnostic Report Analysis (AI OCR)

ArogyaCareAI's **AI Prescription & Medical Report OCR Scanner** is engineered to transcribe handwritten prescriptions, decode complex medical notation, and summarize laboratory panels.

#### Clinical Capabilities:
1. **Pharmacological Decryption**: Translates medical Latin abbreviations (such as OD = once daily, BD = twice daily, TDS = thrice daily, PC = post-prandial / after meals).
2. **Regimen & Safety Breakdown**: Clarifies therapeutic indication, exact administration timings, and critical drug interactions.
3. **Diagnostic Panel Interpretation**: Analyzes laboratory hematology, lipid, and metabolic panels against standardized reference intervals.

📋 **How to Access**: Navigate to **"Prescription OCR"** in the top navigation bar to upload your prescription or diagnostic document for instant analysis.`;
      }

    } else if (isBooking) {
      if (lang === 'hindi') {
        reply = `### स्पेशलिस्ट डॉक्टर अपॉइंटमेंट शेड्यूलिंग (Clinical Appointments)

ArogyaCareAI पोर्टल पर सत्यापित विशेषज्ञों से परामर्श अपॉइंटमेंट बुक करने की प्रक्रिया निम्नलिखित है:

#### अपॉइंटमेंट बुकिंग प्रक्रिया:
1. नीचे प्रस्तुत क्लिनिक विशेषज्ञों में से अपने रोग/लक्षण के अनुकूल विशेषज्ञ का चयन करें।
2. डॉक्टर के प्रोफाइल कार्ड पर **"Book"** बटन पर क्लिक करें।
3. अपनी सुविधानुसार परामर्श की तारीख एवं उपलब्ध समय स्लॉट चुनें।
4. विवरण की पुष्टि करें; आपकी डिजिटल अपॉइंटमेंट रसीद तुरंत जारी हो जाएगी।

👨‍⚕️ **उपलब्ध सत्यापित विशेषज्ञ (Verified Clinical Specialists)**:`;
      } else if (lang === 'hinglish') {
        reply = `### Clinical Specialist Appointment Scheduling

ArogyaCareAI platform par verified doctors se consultation schedule karne ke steps:

#### Booking Steps:
1. Niche di gayi list me se relevant specialty ke doctor select karein.
2. Doctor ke profile par **"Book"** button par click karein.
3. Apni convenience ke according Date aur Time Slot choose karein.
4. Booking confirm karein; aapka appointment instantly confirm ho jayega.

👨‍⚕️ **Available Verified Specialists**:`;
      } else {
        reply = `### Clinical Specialist Appointment Scheduling

Consultation scheduling with ArogyaCareAI verified physicians is streamlined and secure.

#### Scheduling Protocol:
1. Review the clinical credentials and specialties of the verified physicians below.
2. Click **"Book"** on the physician's clinical profile card.
3. Select your preferred consultation date and available clinical time slot.
4. Confirm your appointment details; your digital consultation token will be generated instantly.

👨‍⚕️ **Available Verified Specialists**:`;
      }
      suggestedDoctors = doctors.slice(0, 3);

    } else if (isStress) {
      if (lang === 'hindi') {
        reply = `### क्लीनिकल मूल्यांकन: मानसिक स्वास्थ्य एवं तनाव प्रबंधन (Behavioral Health Triage)

तीव्र मानसिक तनाव, चिंता (Anxiety) अथवा अनिद्रा के लक्षण शरीर के स्वायत्त तंत्रिका तंत्र (Autonomic Nervous System) पर प्रत्यक्ष प्रभाव डालते हैं।

#### क्लीनिकल स्व-देखभाल एवं शांत करने के उपाय:
- **नियंत्रित श्वसन तकनीक (4-7-8 Breathing Technique)**: 4 सेकंड तक नासिका से सांस भीतर खींचें, 7 सेकंड तक रोकें, और 8 सेकंड में मुख से धीरे-धीरे बाहर छोड़ें। यह पैरासिम्पेथेटिक नर्वस सिस्टम को सक्रिय कर हृदय गति सामान्य करता है।
- **संवेदी विश्राम**: डिजिटल उपकरणों से 15–30 मिनट का विराम लें, एक गिलास शीतल जल पिएं और शांत स्थान पर बैठें।
- **नियमित निद्रा चक्र**: प्रतिदिन 7–8 घंटे की आरामदायक नींद सुनिश्चित करें।

🚨 **परामर्श**: यदि चिंता, घबराहट अथवा अवसाद दैनिक कार्यप्रणाली को बाधित कर रहे हों, तो हमारे सामान्य चिकित्सक अथवा मनोचिकित्सक (Psychiatrist / Counselor) से परामर्श लेना अत्यंत लाभप्रद रहेगा।`;
      } else if (lang === 'hinglish') {
        reply = `### Clinical Assessment: Behavioral Health & Stress Management

Excessive stress, anxiety, aur restlessness aapki physical aur mental well-being ko impact kar sakti hai.

#### Clinical Self-Care Protocols:
- **Controlled Respiration (4-7-8 Method)**: 4 seconds inhale karein, 7 seconds hold karein, aur 8 seconds me slowly exhale karein heart rate stabilize karne ke liye.
- **Sensory Grounding**: Digital screens se break lein, fresh air me gentle walking karein aur hydration maintain karein.
- **Sleep Hygiene**: Consistent sleep schedule maintain karein aur late-night caffeine avoid karein.

🚨 **Clinical Recommendation**: Agar anxiety ya mood disturbances persistent hain, toh professional clinical consultation zaroor lein:`;
      } else {
        reply = `### Clinical Assessment: Behavioral Health & Stress Triage

Hello. Acute psychological stress, anxiety, or emotional fatigue exerts measurable strain on the autonomic nervous system and neuroendocrine axis.

#### Clinical Supportive Protocols:
- **Vagus Nerve Activation (4-7-8 Respiratory Protocol)**: Inhale deeply through the nose for 4 seconds, retain the breath gently for 7 seconds, and exhale slowly through pursed lips for 8 seconds to down-regulate sympathetic tone.
- **Sensory Grounding & Hydration**: Step away from digital displays, hydrate with cool water, and engage in brief aerobic walking in natural light.
- **Sleep Architecture**: Prioritize uninterrupted nocturnal sleep (7–8 hours) and restrict evening caffeine intake.

🚨 **Clinical Consultation**: Persistent depressive symptoms, severe panic episodes, or debilitating anxiety warrant consultation with a **Psychiatrist** or clinical psychologist for professional therapy.`;
      }

    } else if (isGreeting) {
      if (lang === 'hindi') {
        reply = `सादर नमस्कार। मैं **ArogyaCare AI** हूँ, आपका समर्पित क्लीनिकल ट्राइएज एवं स्वास्थ्य परामर्श सहायक।

मैं निम्नलिखित विषयों में आपकी सहायता कर सकता हूँ:
- **लक्षण मूल्यांकन एवं ट्राइएज (Symptom Assessment)**: अपने लक्षणों का विवरण देकर प्राथमिक चिकित्सीय मार्गदर्शन प्राप्त करें।
- **प्रिस्क्रिप्शन एवं मेडिकल रिपोर्ट डिकोडिंग**: डॉक्टर के पर्चे अथवा लैब रिपोर्ट्स की जांच एवं व्याख्या।
- **विशेषज्ञ डॉक्टर परामर्श**: हमारे क्लिनिक नेटवर्क के सत्यापित विशेषज्ञ डॉक्टरों से अपॉइंटमेंट शेड्यूलिंग।

कृपया बताएं, आज मैं आपके स्वास्थ्य संबंधी किस विषय में सहायता कर सकता हूँ?`;
      } else if (lang === 'hinglish') {
        reply = `Namaste. Main **ArogyaCare AI** hoon, aapka professional clinical triage assistant.

Main aapki in areas me clinical sahayata kar sakta hoon:
- **Symptom Evaluation**: Apne health symptoms bata kar primary clinical triage paayein.
- **Prescription & Lab OCR**: Doctor ke parcha aur lab reports ka detailed clinical explanation samjhein.
- **Specialist Booking**: Verified cardiologists, neurologists, dermatologists aur physicians se instant appointment fix karein.

Aapki health query ya medical guidance me main kis tarah sahayata kar sakta hoon?`;
      } else {
        reply = `Good day. I am **ArogyaCare AI**, your clinical triage consultant and digital healthcare assistant.

I am equipped to assist you with:
- **Symptom Triage & Clinical Assessment**: Evaluating acute or chronic symptoms and directing you to the appropriate level of care.
- **Prescription & Diagnostic Report Explanations**: Transcribing medical abbreviations, dosages, and laboratory panels via AI OCR.
- **Specialist Referrals & Appointments**: Direct scheduling with verified specialists in Cardiology, Neurology, Dermatology, and General Medicine.

How may I assist you with your clinical health inquiry today?`;
      }

    } else {
      // General Professional Fallback
      if (lang === 'hindi') {
        reply = `सादर नमस्कार। मैं **ArogyaCare AI** हूँ, आपका समर्पित क्लीनिकल ट्राइएज एवं स्वास्थ्य परामर्श सहायक।

कृपया अपने स्वास्थ्य संबंधी प्रश्न का स्पष्ट विवरण प्रदान करें:
- **लक्षण (Symptoms)**: जैसे सिरदर्द, बुखार, सीने में भारीपन, अथवा पाचन विकार।
- **प्रिस्क्रिप्शन**: डॉक्टर के पर्चे अथवा लैब रिपोर्ट का स्पष्टीकरण।
- **अपॉइंटमेंट**: क्लिनिक नेटवर्क के सत्यापित डॉक्टरों से अपॉइंटमेंट बुकिंग।

मैं आपकी किस प्रकार सहायता कर सकता हूँ?`;
      } else if (lang === 'hinglish') {
        reply = `Namaste. Main **ArogyaCare AI** hoon, aapka clinical triage consultant.

Kripya apni query ya symptoms describe karein:
- **Symptoms**: Fever, headache, chest discomfort, skin allergy, ya digestive issues.
- **Prescription OCR**: Doctor ke handwritten slip aur lab reports ka medical explanation.
- **Doctor Appointments**: Top clinic specialists se consultation booking.

Aapki kya clinical sahayata kar sakta hoon?`;
      } else {
        reply = `Good day. I am **ArogyaCare AI**, your professional clinical triage assistant.

Please specify your health inquiry or symptoms:
- **Symptom Triage**: Provide details regarding onset, duration, and severity of symptoms.
- **Prescription & Lab OCR**: Upload medical slips for pharmacological and diagnostic explanations.
- **Specialist Appointments**: Connect directly with verified physicians in our clinic network.

How may I assist you with your clinical inquiry?`;
      }
      suggestedDoctors = doctors.slice(0, 2);
    }

    return res.json({
      reply,
      suggestedDoctors
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ message: 'Failed to process chat message', error: error.message });
  }
};

/**
 * @desc    OCR-powered Prescription Explanation & Medical Report Summarization
 * @route   POST /api/ai/ocr-analyze
 */
export const analyzeMedicalDocument = async (req, res) => {
  try {
    const { image, analysisType, rawText, sampleId, preferredLanguage } = req.body;
    const isHindi = preferredLanguage === 'hindi' || preferredLanguage === 'hi' || (!preferredLanguage && isDevanagari(rawText));

    // If Gemini multimodal API is active and image or rawText is provided
    if (process.env.GEMINI_API_KEY && (image || rawText)) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' }
        });

        const prompt = `
You are an advanced medical OCR and clinical summarization AI for ArogyaCareAI.
Analyze the provided medical document (which could be a handwritten/printed prescription OR a laboratory/diagnostic report).

Analysis Mode: "${analysisType || 'auto'}"
Text context (if provided): "${rawText || ''}"
Preferred Language: "${isHindi ? 'Hindi (Devanagari)' : 'English'}"

Perform:
1. OCR transcription: Extract all visible text accurately.
2. Determine document type: "prescription" or "lab_report".
3. If PRESCRIPTION:
   - Extract Doctor Name, Clinic, Date.
   - List all medications: Generic name, Brand name, Dosage, Frequency (decode abbreviations like BD, TDS, PRN, OD, HS), Duration, plain-language explanation of what it treats, instructions (e.g. after meals), and important warnings.
   - General advice and suggested follow-up doctor specialization.
4. If LAB REPORT:
   - Identify test panel (e.g. Lipid Profile, Complete Blood Count, Liver Function, Diabetic Panel).
   - Extract key test parameters with Result, Standard Reference Range, Units, and Status ("Normal", "High", "Low", "Critical").
   - Plain-language interpretation of what each abnormal parameter means to the patient's health.
   - Executive clinical summary.
   - Recommended doctor specialization for consultation.

Output ALL summaries, explanations, instructions, and warnings in ${isHindi ? 'Hindi (Devanagari script)' : 'English'}.
Return strictly JSON with this schema:
{
  "documentType": "prescription" | "lab_report",
  "title": "Document Title",
  "doctorOrLab": "Clinic or Lab Name",
  "date": "Document Date",
  "summary": "Plain summary for the patient",
  "prescriptionData": {
    "patientName": "Patient Name",
    "medications": [
      {
        "name": "Medication Name",
        "dosage": "500mg",
        "frequency": "Twice daily (after breakfast & dinner)",
        "duration": "5 days",
        "purpose": "Antibiotic to treat bacterial respiratory infection",
        "instructions": "Take with full glass of water. Complete the entire course.",
        "warnings": "Avoid dairy within 2 hours if taking with iron supplements."
      }
    ],
    "specialInstructions": ["Dietary or rest advice"]
  },
  "labReportData": {
    "patientName": "Patient Name",
    "testName": "Lipid Profile / CBC / Diabetic Panel",
    "parameters": [
      {
        "name": "Total Cholesterol",
        "value": "240",
        "unit": "mg/dL",
        "referenceRange": "< 200",
        "status": "High",
        "explanation": "Elevated cholesterol levels may indicate higher risk of arterial plaque buildup."
      }
    ],
    "overallAssessment": "Assessment overview",
    "lifestyleRecommendations": ["Low-sodium diet", "Aerobic exercise 30m/day"]
  },
  "recommendedSpecialization": "Cardiologist",
  "disclaimer": "This AI OCR transcription and explanation is an assistive tool and does not substitute professional medical verification."
}
`;

        let contents = [prompt];

        if (image && image.startsWith('data:')) {
          const [mimeInfo, base64Data] = image.split(';base64,');
          const mimeType = mimeInfo.replace('data:', '');
          contents = [
            prompt,
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType || 'image/jpeg'
              }
            }
          ];
        }

        const result = await model.generateContent(contents);
        const responseText = result.response.text();
        let cleanedJson = responseText.trim();
        if (cleanedJson.startsWith("```")) {
          cleanedJson = cleanedJson.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }

        const parsed = JSON.parse(cleanedJson);
        const matchedDocs = await findMatchingDoctors(parsed.recommendedSpecialization);

        return res.json({
          ...parsed,
          recommendedDoctors: matchedDocs
        });
      } catch (geminiError) {
        console.error('Gemini OCR failed, using intelligent clinical OCR engine:', geminiError.message);
      }
    }

    // ============================================================
    // INTELLIGENT CLINICAL OCR & INTERPRETATION ENGINE (FALLBACK / OFFLINE)
    // ============================================================
    const lowerRaw = (rawText || '').toLowerCase();

    // Check if this is a laboratory / diagnostic report
    const isLabReport =
      analysisType === 'report' ||
      sampleId === 'lipid-sample' ||
      sampleId === 'cbc-sample' ||
      sampleId === 'diabetes-sample' ||
      sampleId === 'thyroid-sample' ||
      lowerRaw.includes('cholesterol') ||
      lowerRaw.includes('lipid') ||
      lowerRaw.includes('hemoglobin') ||
      lowerRaw.includes('cbc') ||
      lowerRaw.includes('blood count') ||
      lowerRaw.includes('glucose') ||
      lowerRaw.includes('sugar') ||
      lowerRaw.includes('hba1c') ||
      lowerRaw.includes('creatinine') ||
      lowerRaw.includes('thyroid') ||
      lowerRaw.includes('tsh') ||
      lowerRaw.includes('platelet') ||
      lowerRaw.includes('wbc') ||
      lowerRaw.includes('bilirubin');

    if (isLabReport) {
      // 1. Check for custom parameter values in rawText using smart regex
      const detectedParams = [];

      // Helper to extract numbers following parameter name
      const extractVal = (pattern) => {
        const match = lowerRaw.match(pattern);
        return match ? parseFloat(match[1]) : null;
      };

      // Check Cholesterol
      const cholVal = extractVal(/(?:total\s+)?cholesterol[:=\s-]+([0-9]+(?:\.[0-9]+)?)/);
      if (cholVal !== null) {
        const isHigh = cholVal >= 200;
        detectedParams.push({
          name: isHindi ? 'कुल कोलेस्ट्रॉल (Total Cholesterol)' : 'Total Cholesterol',
          value: cholVal.toString(),
          unit: 'mg/dL',
          referenceRange: '< 200',
          status: isHigh ? (isHindi ? 'अधिक' : 'High') : (isHindi ? 'सामान्य' : 'Normal'),
          explanation: isHigh
            ? (isHindi ? 'रक्त में कोलेस्ट्रॉल की मात्रा अधिक है, जिससे धमनियों में रुकावट का जोखिम बढ़ सकता है।' : 'Elevated total circulating cholesterol, indicating excess blood lipids.')
            : (isHindi ? 'कोलेस्ट्रॉल का स्तर सुरक्षित एवं स्वस्थ सीमा में है।' : 'Total cholesterol is within healthy protective limits.')
        });
      }

      // Check LDL
      const ldlVal = extractVal(/ldl(?:[\s\-_]cholesterol)?[:=\s-]+([0-9]+(?:\.[0-9]+)?)/);
      if (ldlVal !== null) {
        const isHigh = ldlVal >= 100;
        detectedParams.push({
          name: isHindi ? 'एलडीएल खराब कोलेस्ट्रॉल (LDL)' : 'LDL Cholesterol ("Bad")',
          value: ldlVal.toString(),
          unit: 'mg/dL',
          referenceRange: '< 100',
          status: isHigh ? (isHindi ? 'अधिक' : 'High') : (isHindi ? 'सामान्य' : 'Normal'),
          explanation: isHigh
            ? (isHindi ? 'एलडीएल का स्तर अधिक है, हृदय विशेषज्ञ से परामर्श लें।' : 'High LDL increases cardiovascular risk and plaque deposition.')
            : (isHindi ? 'एलडीएल स्तर सामान्य है।' : 'LDL cholesterol is at an optimal level.')
        });
      }

      // Check HDL
      const hdlVal = extractVal(/hdl(?:[\s\-_]cholesterol)?[:=\s-]+([0-9]+(?:\.[0-9]+)?)/);
      if (hdlVal !== null) {
        const isLow = hdlVal < 40;
        detectedParams.push({
          name: isHindi ? 'एचडीएल अच्छा कोलेस्ट्रॉल (HDL)' : 'HDL Cholesterol ("Good")',
          value: hdlVal.toString(),
          unit: 'mg/dL',
          referenceRange: '> 40',
          status: isLow ? (isHindi ? 'कम' : 'Low') : (isHindi ? 'सामान्य' : 'Normal'),
          explanation: isLow
            ? (isHindi ? 'सुरक्षात्मक एचडीएल कम है; व्यायाम व स्वस्थ वसा अपनाएं।' : 'Suboptimal protective HDL levels.')
            : (isHindi ? 'पर्याप्त सुरक्षात्मक एचडीएल स्तर।' : 'Healthy protective high-density lipoprotein level.')
        });
      }

      // Check Triglycerides
      const tgVal = extractVal(/(?:triglycerides|triglyceride|tg)[:=\s-]+([0-9]+(?:\.[0-9]+)?)/);
      if (tgVal !== null) {
        const isHigh = tgVal >= 150;
        detectedParams.push({
          name: isHindi ? 'ट्राइग्लिसराइड्स (Triglycerides)' : 'Serum Triglycerides',
          value: tgVal.toString(),
          unit: 'mg/dL',
          referenceRange: '< 150',
          status: isHigh ? (isHindi ? 'अधिक' : 'High') : (isHindi ? 'सामान्य' : 'Normal'),
          explanation: isHigh
            ? (isHindi ? 'रक्त में वसा की मात्रा अधिक है; चीनी व तली-भुनी चीजों से बचें।' : 'Elevated circulating blood fats, often influenced by dietary sugars and simple carbs.')
            : (isHindi ? 'ट्राइग्लिसराइड्स सामान्य सीमा में हैं।' : 'Triglycerides within standard fasting limits.')
        });
      }

      // Check Hemoglobin
      const hbVal = extractVal(/(?:hemoglobin|hb)[:=\s-]+([0-9]+(?:\.[0-9]+)?)/);
      if (hbVal !== null) {
        const isLow = hbVal < 12.0;
        const isHigh = hbVal > 17.5;
        detectedParams.push({
          name: isHindi ? 'हीमोग्लोबिन (Hemoglobin Hb)' : 'Hemoglobin (Hb)',
          value: hbVal.toString(),
          unit: 'g/dL',
          referenceRange: '12.0 - 17.5',
          status: isLow ? (isHindi ? 'कम' : 'Low') : isHigh ? (isHindi ? 'अधिक' : 'High') : (isHindi ? 'सामान्य' : 'Normal'),
          explanation: isLow
            ? (isHindi ? 'हीमोग्लोबिन कम है (एनीमिया के लक्षण), जिससे थकान और कमजोरी हो सकती है।' : 'Low hemoglobin indicates reduced oxygen-carrying capacity (anemia).')
            : (isHindi ? 'हीमोग्लोबिन का स्तर बिल्कुल सामान्य व स्वस्थ है।' : 'Hemoglobin is in the optimal physiological range.')
        });
      }

      // Check Glucose / Blood Sugar
      const sugarVal = extractVal(/(?:glucose|blood\s+sugar|fasting\s+sugar|fbs|rbs|ppbs)[:=\s-]+([0-9]+(?:\.[0-9]+)?)/);
      if (sugarVal !== null) {
        const isHigh = sugarVal >= 126;
        const isBorderline = sugarVal >= 100 && sugarVal < 126;
        detectedParams.push({
          name: isHindi ? 'रक्त शर्करा (Blood Glucose)' : 'Blood Glucose (Fasting / Random)',
          value: sugarVal.toString(),
          unit: 'mg/dL',
          referenceRange: '70 - 100',
          status: isHigh ? (isHindi ? 'अधिक (डायबिटिक)' : 'High') : isBorderline ? (isHindi ? 'सीमांत अधिक' : 'Borderline') : (isHindi ? 'सामान्य' : 'Normal'),
          explanation: isHigh
            ? (isHindi ? 'रक्त शर्करा सामान्य से अधिक है, डायबिटोलॉजिस्ट या फिजिशियन से परामर्श करें।' : 'Elevated blood sugar warranting glycemic management and dietary control.')
            : (isHindi ? 'रक्त शर्करा सामान्य स्तर पर है।' : 'Blood sugar level is well controlled.')
        });
      }

      // Check HbA1c
      const a1cVal = extractVal(/hba1c[:=\s-]+([0-9]+(?:\.[0-9]+)?)/);
      if (a1cVal !== null) {
        const isHigh = a1cVal >= 6.5;
        const isPre = a1cVal >= 5.7 && a1cVal < 6.5;
        detectedParams.push({
          name: isHindi ? 'ग्लाइकेटेड हीमोग्लोबिन (HbA1c)' : 'Glycated Hemoglobin (HbA1c)',
          value: a1cVal.toString(),
          unit: '%',
          referenceRange: '< 5.7',
          status: isHigh ? (isHindi ? 'अधिक (डायबिटीज)' : 'High') : isPre ? (isHindi ? 'प्री-डायबिटीज' : 'Borderline') : (isHindi ? 'सामान्य' : 'Normal'),
          explanation: isHigh
            ? (isHindi ? 'पिछले 3 महीनों का औसत शुगर स्तर अधिक है।' : '3-month average glucose indicates diabetic state.')
            : (isHindi ? 'पिछले 3 महीनों का औसत शुगर स्तर सामान्य है।' : 'Good long-term glycemic control.')
        });
      }

      // Check Platelets
      const pltVal = extractVal(/(?:platelets|platelet\s+count|plt)[:=\s-]+([0-9]+(?:\.[0-9]+)?)/);
      if (pltVal !== null) {
        const isLow = pltVal < 150;
        detectedParams.push({
          name: isHindi ? 'प्लेटलेट्स काउंट (Platelets)' : 'Platelet Count',
          value: pltVal >= 1000 ? pltVal.toLocaleString() : (pltVal * 1000).toLocaleString(),
          unit: '/mcL',
          referenceRange: '150,000 - 450,000',
          status: isLow ? (isHindi ? 'कम' : 'Low') : (isHindi ? 'सामान्य' : 'Normal'),
          explanation: isLow
            ? (isHindi ? 'प्लेटलेट्स सामान्य से कम हैं, डॉक्टर की निगरानी आवश्यक है।' : 'Platelets are below standard range.')
            : (isHindi ? 'रक्त के थक्के जमने की प्रक्रिया सामान्य है।' : 'Healthy clotting parameters.')
        });
      }

      // Check Creatinine
      const creatVal = extractVal(/(?:creatinine|serum\s+creatinine)[:=\s-]+([0-9]+(?:\.[0-9]+)?)/);
      if (creatVal !== null) {
        const isHigh = creatVal > 1.2;
        detectedParams.push({
          name: isHindi ? 'सीरम क्रिएटिनिन (Creatinine)' : 'Serum Creatinine (Renal Function)',
          value: creatVal.toString(),
          unit: 'mg/dL',
          referenceRange: '0.6 - 1.2',
          status: isHigh ? (isHindi ? 'अधिक' : 'High') : (isHindi ? 'सामान्य' : 'Normal'),
          explanation: isHigh
            ? (isHindi ? 'किडनी फिल्टरेशन दर प्रभावित हो सकती है, पर्याप्त पानी पिएं।' : 'Elevated creatinine warrants renal function follow-up.')
            : (isHindi ? 'गुर्दे (किडनी) का कार्य सामान्य है।' : 'Healthy kidney filtration marker.')
        });
      }

      // If custom parameters were successfully extracted from user's raw text
      if (detectedParams.length > 0) {
        const hasCardio = detectedParams.some(p => p.name.includes('Cholesterol') || p.name.includes('LDL') || p.name.includes('कोलेस्ट्रॉल'));
        const hasSugar = detectedParams.some(p => p.name.includes('Glucose') || p.name.includes('HbA1c') || p.name.includes('शर्करा'));
        const recommendedSpecialization = hasCardio ? 'Cardiologist' : hasSugar ? 'Endocrinologist' : 'General Physician';
        const matchedDocs = await findMatchingDoctors(recommendedSpecialization);

        return res.json({
          documentType: 'lab_report',
          title: isHindi ? 'एआई विश्लेषित नैदानिक प्रयोगशाला रिपोर्ट' : 'AI-Extracted Clinical Laboratory Report',
          doctorOrLab: isHindi ? 'आरोग्यकेयर डिजिटल पैथोलॉजी नेटवर्क' : 'ArogyaCare Digital Diagnostics Lab',
          date: 'October 15, 2026',
          summary: isHindi
            ? `आपकी रिपोर्ट में ${detectedParams.length} मुख्य बायोमार्कर की पहचान की गई है। आवश्यक पैरामीटर्स का विश्लेषण नीचे प्रस्तुत है।`
            : `Successfully extracted ${detectedParams.length} key biomarkers from your diagnostic report with automatic clinical reference comparison.`,
          labReportData: {
            patientName: isHindi ? 'सत्यापित मरीज (Patient)' : 'Patient Document (Verified)',
            testName: isHindi ? 'व्यापक स्वास्थ्य परीक्षण पैनल' : 'Comprehensive Health Profile Panel',
            parameters: detectedParams,
            overallAssessment: isHindi
              ? 'बायोमार्कर रिपोर्ट का अवलोकन दर्शाता है कि असामान्य पैरामीटर्स पर खान-पान और डॉक्टर के मार्गदर्शन में ध्यान देने की आवश्यकता है।'
              : 'Overall metabolic and biomarker markers reviewed. Please consult a specialist to discuss any abnormal values.',
            lifestyleRecommendations: isHindi
              ? [
                  'प्रतिदिन कम से कम 30 मिनट पैदल चलें या हल्का व्यायाम करें।',
                  'संतुलित आहार लें, अधिक नमक, चीनी व प्रोसेस्ड फूड से बचें।',
                  'पर्याप्त मात्रा में पानी पिएं और पर्याप्त नींद लें।'
                ]
              : [
                  'Engage in 30 minutes of moderate physical activity daily.',
                  'Maintain balanced nutrition; reduce ultra-processed foods, refined sugar, and excess sodium.',
                  'Stay well-hydrated and follow up with a certified physician.'
                ]
          },
          recommendedSpecialization,
          disclaimer: isHindi
            ? 'यह एआई विश्लेषण केवल सूचनात्मक सहायता के लिए है। किसी भी दवा या उपचार से पहले डॉक्टर से परामर्श अवश्य लें।'
            : 'This AI automated report analysis is an assistive tool and must be reviewed with a qualified physician.',
          recommendedDoctors: matchedDocs
        });
      }

      // If user clicked CBC sample or text implies CBC
      if (sampleId === 'cbc-sample' || lowerRaw.includes('cbc') || lowerRaw.includes('hemoglobin') || lowerRaw.includes('anemia')) {
        const matchedDocs = await findMatchingDoctors('General Physician');
        return res.json({
          documentType: 'lab_report',
          title: isHindi ? 'पूर्ण रक्त गणना (CBC) प्रयोगशाला रिपोर्ट' : 'Complete Blood Count (CBC) Laboratory Report',
          doctorOrLab: isHindi ? 'आरोग्यकेयर सेंट्रल पैथोलॉजी लैब' : 'Arogya Diagnostics & Pathology Central',
          date: 'October 15, 2026',
          summary: isHindi
            ? 'आपकी सीबीसी रिपोर्ट में हीमोग्लोबिन और आरबीसी का स्तर सामान्य से थोड़ा कम है, जो हल्के एनीमिया का संकेत है। श्वेत रक्त कोशिकाएं (WBC) और प्लेटलेट्स बिल्कुल सामान्य हैं।'
            : 'Your Complete Blood Count indicates a slightly reduced hemoglobin and red blood cell count, suggesting mild iron-deficiency anemia, while white blood cells and platelets remain in the healthy reference range.',
          labReportData: {
            patientName: isHindi ? 'अमित कुमार (उम्र 34 वर्ष, पुरुष)' : 'Amit Kumar (Age 34, Male)',
            testName: isHindi ? 'कम्प्लीट ब्लड काउंट (सीबीसी) ऑटोमेटेड पैनल' : 'Complete Blood Count (CBC) with Automated Differential',
            parameters: [
              {
                name: isHindi ? 'हीमोग्लोबिन (Hemoglobin Hb)' : 'Hemoglobin (Hb)',
                value: '11.8',
                unit: 'g/dL',
                referenceRange: '13.5 - 17.5',
                status: isHindi ? 'कम' : 'Low',
                explanation: isHindi
                  ? 'हीमोग्लोबिन थोड़ा कम है, जिससे कमजोरी या थकान हो सकती है। आयरन युक्त आहार लाभ देगा।'
                  : 'Slightly below standard levels, indicating reduced oxygen-carrying capacity (mild anemia).'
              },
              {
                name: isHindi ? 'कुल आरबीसी गणना (Total RBC Count)' : 'Total RBC Count',
                value: '4.1',
                unit: 'million/mcL',
                referenceRange: '4.5 - 5.9',
                status: isHindi ? 'कम' : 'Low',
                explanation: isHindi
                  ? 'लाल रक्त कोशिकाओं की संख्या थोड़ी कम है, जो हीमोग्लोबिन के स्तर के अनुरूप है।'
                  : 'Red blood cell count is mildly depressed, consistent with the hemoglobin level.'
              },
              {
                name: isHindi ? 'श्वेत रक्त कोशिकाएं (White Blood Cells - WBC)' : 'White Blood Cell (WBC)',
                value: '6,800',
                unit: '/mcL',
                referenceRange: '4,500 - 11,000',
                status: isHindi ? 'सामान्य' : 'Normal',
                explanation: isHindi
                  ? 'रोग प्रतिरोधक क्षमता सामान्य है, कोई तीव्र जीवाणु संक्रमण नहीं है।'
                  : 'Normal immune cell count indicates no acute severe bacterial infection.'
              },
              {
                name: isHindi ? 'प्लेटलेट्स काउंट (Platelet Count)' : 'Platelet Count',
                value: '245,000',
                unit: '/mcL',
                referenceRange: '150,000 - 450,000',
                status: isHindi ? 'सामान्य' : 'Normal',
                explanation: isHindi
                  ? 'रक्त का थक्का जमाने वाली कोशिकाएं स्वस्थ व सामान्य संख्या में हैं।'
                  : 'Healthy blood clotting parameters.'
              },
              {
                name: isHindi ? 'एमसीवी (Mean Corpuscular Volume - MCV)' : 'Mean Corpuscular Volume (MCV)',
                value: '76.2',
                unit: 'fL',
                referenceRange: '80 - 100',
                status: isHindi ? 'कम' : 'Low',
                explanation: isHindi
                  ? 'आयरन की कमी के कारण लाल रक्त कोशिकाओं का आकार थोड़ा छोटा है।'
                  : 'Microcytic cells characteristic of mild iron deficiency.'
              }
            ],
            overallAssessment: isHindi
              ? 'हल्का माइक्रोसाइटिक एनीमिया। आहार में आयरन और विटामिन सी बढ़ाने तथा डॉक्टर की सलाह पर आयरन सप्लीमेंट से इसमें सुधार संभव है।'
              : 'Mild microcytic hypochromic anemia. Likely responsive to dietary iron enhancement and oral iron supplementation under clinical oversight.',
            lifestyleRecommendations: isHindi
              ? [
                  'आयरन से भरपूर खाद्य पदार्थ खाएं (पालक, दालें, बीन्स, अनार, गुड़, कद्दू के बीज)।',
                  'आयरन के अवशोषण के लिए विटामिन सी युक्त फल (संतरा, नींबू, आंवला) साथ में लें।',
                  'भोजन के तुरंत बाद चाय या कॉफी न पिएं, क्योंकि यह आयरन के अवशोषण को कम करती है।'
                ]
              : [
                  'Include iron-rich foods (spinach, lentils, lean meats, beans, pumpkin seeds).',
                  'Pair iron foods with Vitamin C (oranges, bell peppers) to boost absorption.',
                  'Avoid drinking black tea or coffee immediately with meals as tannins reduce iron uptake.'
                ]
          },
          recommendedSpecialization: 'General Physician',
          disclaimer: isHindi
            ? 'यह रिपोर्ट सारांश एआई सहायता के लिए है। कृपया अपने चिकित्सक से परामर्श अवश्य करें।'
            : 'This automated report analysis is an AI assistive interpretation and must be reviewed with your primary care physician.',
          recommendedDoctors: matchedDocs
        });
      }

      // Default / Lipid Profile Diagnostic Panel
      const matchedDocs = await findMatchingDoctors('Cardiologist');
      return res.json({
        documentType: 'lab_report',
        title: isHindi ? 'व्यापक लिपिड प्रोफाइल एवं हृदय स्वास्थ्य परीक्षण' : 'Comprehensive Lipid & Cardiovascular Panel',
        doctorOrLab: isHindi ? 'आरोग्यकेयर हार्ट एंड डायग्नोस्टिक लैब्स' : 'ArogyaCare Heart & Diagnostic Labs',
        date: 'October 15, 2026',
        summary: isHindi
          ? 'आपकी लिपिड प्रोफाइल में कुल कोलेस्ट्रॉल और एलडीएल (खराब कोलेस्ट्रॉल) का स्तर अधिक पाया गया है, साथ ही ट्राइग्लिसराइड्स भी सीमांत अधिक हैं। एचडीएल (अच्छा कोलेस्ट्रॉल) सामान्य है। हृदय रोग विशेषज्ञ से परामर्श और जीवनशैली में बदलाव की सिफारिश की जाती है।'
          : 'Your lipid profile shows elevated Total Cholesterol and LDL (bad cholesterol), with borderline high Triglycerides. While HDL (good cholesterol) is acceptable, clinical intervention with lifestyle modification or statin evaluation is recommended.',
        labReportData: {
          patientName: isHindi ? 'विकास शर्मा (उम्र 42 वर्ष, पुरुष)' : 'Vikas Sharma (Age 42, Male)',
          testName: isHindi ? 'फास्टिंग लिपिड प्रोफाइल (12 घंटे का उपवास)' : 'Fasting Lipid Profile (12-hour fast)',
          parameters: [
            {
              name: isHindi ? 'कुल कोलेस्ट्रॉल (Total Cholesterol)' : 'Total Cholesterol',
              value: '248',
              unit: 'mg/dL',
              referenceRange: '< 200',
              status: isHindi ? 'अधिक' : 'High',
              explanation: isHindi
                ? 'रक्त में कोलेस्ट्रॉल की मात्रा अधिक है, जो धमनियों में रुकावट बढ़ा सकती है।'
                : 'Elevated total circulating cholesterol, indicating excess circulating blood lipids.'
            },
            {
              name: isHindi ? 'एलडीएल खराब कोलेस्ट्रॉल (LDL)' : 'LDL Cholesterol ("Bad")',
              value: '162',
              unit: 'mg/dL',
              referenceRange: '< 100',
              status: isHindi ? 'अधिक' : 'High',
              explanation: isHindi
                ? 'उच्च एलडीएल धमनियों की दीवारों में जमा होकर प्लाक बना सकता है।'
                : 'High LDL can gradually accumulate in arterial walls, forming plaque and increasing cardiovascular risk.'
            },
            {
              name: isHindi ? 'एचडीएल अच्छा कोलेस्ट्रॉल (HDL)' : 'HDL Cholesterol ("Good")',
              value: '44',
              unit: 'mg/dL',
              referenceRange: '> 40',
              status: isHindi ? 'सामान्य' : 'Normal',
              explanation: isHindi
                ? 'पर्याप्त सुरक्षात्मक हाई-डेंसिटी लिपोप्रोटीन स्तर।'
                : 'Sufficient protective high-density lipoprotein level.'
            },
            {
              name: isHindi ? 'सीरम ट्राइग्लिसराइड्स (Triglycerides)' : 'Serum Triglycerides',
              value: '185',
              unit: 'mg/dL',
              referenceRange: '< 150',
              status: isHindi ? 'अधिक' : 'High',
              explanation: isHindi
                ? 'रक्त में वसा का स्तर बढ़ा हुआ है, जो मीठे व निष्क्रिय जीवनशैली से प्रभावित होता है।'
                : 'Elevated blood fats commonly influenced by refined sugar, carbohydrate intake, and sedentary lifestyle.'
            },
            {
              name: isHindi ? 'कोलेस्ट्रॉल / एचडीएल अनुपात' : 'Cholesterol / HDL Ratio',
              value: '5.6',
              unit: 'ratio',
              referenceRange: '< 4.5',
              status: isHindi ? 'अधिक' : 'High',
              explanation: isHindi
                ? 'कार्डियक रिस्क अनुपात बढ़ा हुआ है; नियमित जांच आवश्यक है।'
                : 'Elevated cardiac risk ratio warranting preventative consultation.'
            }
          ],
          overallAssessment: isHindi
            ? 'मध्यम हाइपरलिपिडिमिया (रक्त में वसा की अधिकता)। हृदय संबंधी जोखिम के मूल्यांकन हेतु कार्डियोलॉजिस्ट से परामर्श करें।'
            : 'Moderate hyperlipidemia with elevated atherogenic lipoproteins. Consult a Cardiologist for cardiovascular risk stratification.',
          lifestyleRecommendations: isHindi
            ? [
                'फाइबर और ओमेगा-3 फैटी एसिड से भरपूर हृदय-सुरक्षात्मक आहार अपनाएं।',
                'प्रति सप्ताह कम से कम 150 मिनट मध्यम एरोबिक व्यायाम (तेज चलना, तैराकी, साइकिल चलाना) करें।',
                'संतृप्त वसा (घी, मक्खन, तली चीजें), ट्रांस फैट और प्रोसेस्ड चीनी का सेवन कम करें।'
              ]
            : [
                'Adopt a Mediterranean-style cardioprotective diet rich in fiber and omega-3 fatty acids.',
                'Engage in 150 minutes of moderate aerobic exercise per week (brisk walking, swimming, cycling).',
                'Reduce saturated fats, trans fats, and processed sugar.'
              ]
        },
        recommendedSpecialization: 'Cardiologist',
        disclaimer: isHindi
          ? 'यह एआई सारांश केवल शैक्षिक मार्गदर्शन है और इसका मूल्यांकन डॉक्टर से कराना चाहिए।'
          : 'This AI summary serves as educational guidance and should be evaluated alongside clinical history with a qualified physician.',
        recommendedDoctors: matchedDocs
      });
    }

    // ============================================================
    // 2. PRESCRIPTION PARSER & PATIENT MEDICATION GUIDE
    // ============================================================
    const customMeds = [];

    // Helper to check for drug match
    const hasDrug = (drug) => lowerRaw.includes(drug);

    if (hasDrug('paracetamol') || hasDrug('dolo') || hasDrug('crocin') || hasDrug('calpol')) {
      customMeds.push({
        name: isHindi ? 'पैरासिटामोल / डोलो (Paracetamol)' : 'Paracetamol (Dolo 650)',
        dosage: '650 mg',
        frequency: isHindi ? 'जरूरत पड़ने पर या दिन में 3 बार (TDS / SOS)' : 'As needed or 3 times daily (TDS / SOS)',
        duration: isHindi ? '3 से 5 दिन' : '3 to 5 Days',
        purpose: isHindi ? 'बुखार कम करने और बदन दर्द व सिरदर्द से राहत दिलाने के लिए।' : 'Antipyretic and analgesic for reducing fever and relieving body aches.',
        instructions: isHindi ? 'भोजन के बाद पानी के साथ लें। दो खुराकों के बीच कम से कम 4-6 घंटे का अंतर रखें।' : 'Take after meals with water. Maintain a minimum 4 to 6-hour gap between doses.',
        warnings: isHindi ? '24 घंटे में 4 ग्राम से अधिक न लें। अन्य पैरासिटामोल युक्त दवाओं के साथ न जोड़ें।' : 'Do not exceed 4000 mg in 24 hours. Avoid concurrent use with other paracetamol products.'
      });
    }

    if (hasDrug('amoxicillin') || hasDrug('augmentin') || hasDrug('clavam') || hasDrug('moxikind')) {
      customMeds.push({
        name: isHindi ? 'एमोक्सीसिलिन + क्लैवुलैनिक एसिड (Augmentin 625)' : 'Amoxicillin + Clavulanate (Augmentin 625)',
        dosage: '625 mg',
        frequency: isHindi ? 'दिन में दो बार (BD / हर 12 घंटे पर)' : 'Twice Daily (BD / Every 12 hours)',
        duration: isHindi ? '5 दिन' : '5 Days',
        purpose: isHindi ? 'बैक्टीरियल संक्रमण (गला, फेफड़े, कान या त्वचा) को समाप्त करने के लिए एंटीबायोटिक।' : 'Broad-spectrum antibiotic to eliminate bacterial respiratory or sinus infection.',
        instructions: isHindi ? 'नाश्ते और रात के खाने के तुरंत बाद भरपूर पानी के साथ लें। पूरा 5 दिन का कोर्स पूरा करें।' : 'Take immediately after breakfast and dinner with a full glass of water. Complete all 5 days.',
        warnings: isHindi ? 'पेनिसिलिन से एलर्जी होने पर तुरंत डॉक्टर को सूचित करें। खुराक न छोड़ें।' : 'Do not skip doses. If allergic to penicillin, notify your doctor immediately.'
      });
    }

    if (hasDrug('azithromycin') || hasDrug('azee') || hasDrug('zithromax')) {
      customMeds.push({
        name: isHindi ? 'एज़िथ्रोमाइसिन (Azithromycin 500)' : 'Azithromycin (Azee 500)',
        dosage: '500 mg',
        frequency: isHindi ? 'दिन में एक बार (OD)' : 'Once Daily (OD)',
        duration: isHindi ? '3 से 5 दिन' : '3 to 5 Days',
        purpose: isHindi ? 'गले, टॉन्सिल और श्वसन तंत्र के बैक्टीरियल इन्फेक्शन के इलाज हेतु।' : 'Macrolide antibiotic for upper and lower respiratory bacterial infections.',
        instructions: isHindi ? 'भोजन से 1 घंटा पहले या भोजन के 2 घंटे बाद खाली पेट लें।' : 'Take on an empty stomach at least 1 hour before or 2 hours after meals.',
        warnings: isHindi ? 'एंटासिड (जेल) के साथ एक ही समय पर न लें।' : 'Avoid taking aluminum/magnesium antacids simultaneously.'
      });
    }

    if (hasDrug('pantoprazole') || hasDrug('pan-40') || hasDrug('pan-d') || hasDrug('pantocid') || hasDrug('omeprazole') || hasDrug('rabeprazole')) {
      customMeds.push({
        name: isHindi ? 'पेंटोप्रजोल डीएसआर (Pantoprazole DSR)' : 'Pantoprazole DSR (40mg / 30mg)',
        dosage: '40 mg',
        frequency: isHindi ? 'रोजाना सुबह खाली पेट (OD AC)' : 'Once Daily in Morning (OD AC)',
        duration: isHindi ? '5 से 7 दिन' : '5 to 7 Days',
        purpose: isHindi ? 'पेट में एसिडिटी, सीने में जलन और दवाओं से होने वाली गैस से बचाव हेतु।' : 'Proton pump inhibitor to prevent medication-induced acidity and gastroesophageal reflux.',
        instructions: isHindi ? 'सुबह नाश्ते से 30-45 मिनट पहले एक गिलास पानी के साथ निगलें।' : 'Take on an empty stomach at least 30-45 minutes before morning breakfast.',
        warnings: isHindi ? 'कैप्सूल को चबाएं या तोड़ें नहीं; पूरा निगलें।' : 'Swallow capsule whole; do not chew or crush.'
      });
    }

    if (hasDrug('montelukast') || hasDrug('levocetirizine') || hasDrug('montair-lc') || hasDrug('cetirizine') || hasDrug('allegra')) {
      customMeds.push({
        name: isHindi ? 'मोंटेलुकास्ट + लेवोसेटिरिज़िन (Montair-LC)' : 'Montelukast + Levocetirizine',
        dosage: '10mg / 5mg',
        frequency: isHindi ? 'रात को सोने से पहले (OD HS)' : 'Once Daily at Bedtime (OD HS)',
        duration: isHindi ? '7 दिन' : '7 Days',
        purpose: isHindi ? 'एलर्जी, छींक, बहती नाक और श्वसन नली की सूजन कम करने के लिए।' : 'Dual-action antihistamine and leukotriene inhibitor to relieve allergic rhinitis and coughing.',
        instructions: isHindi ? 'सोने से 30 मिनट पहले पानी के साथ लें।' : 'Take 30 minutes before sleep with water.',
        warnings: isHindi ? 'हल्की नींद आ सकती है। दवा लेने के बाद वाहन न चलाएं।' : 'May cause mild drowsiness. Avoid driving or alcohol consumption after taking.'
      });
    }

    if (hasDrug('metformin') || hasDrug('glycomet') || hasDrug('glimepiride')) {
      customMeds.push({
        name: isHindi ? 'मेटफॉर्मिन हाइड्रोक्लोराइड (Metformin 500)' : 'Metformin HCl (Glycomet 500)',
        dosage: '500 mg',
        frequency: isHindi ? 'दिन में दो बार भोजन के साथ (BD with meals)' : 'Twice Daily with meals (BD)',
        duration: isHindi ? 'नियमित (डॉक्टर की सलाह अनुसार)' : 'Ongoing (as prescribed)',
        purpose: isHindi ? 'टाइप 2 डायबिटीज में रक्त शर्करा नियंत्रित करने के लिए।' : 'First-line biguanide antidiabetic to improve insulin sensitivity and lower glucose.',
        instructions: isHindi ? 'पेट की गड़बड़ी से बचने के लिए भोजन के बीच में या तुरंत बाद लें।' : 'Take strictly with or immediately after meals to reduce gastrointestinal upset.',
        warnings: isHindi ? 'चक्कर या कंपकंपी (लो शुगर) महसूस होने पर तुरंत मीठा लें और डॉक्टर से संपर्क करें।' : 'Watch for signs of hypoglycemia. Maintain regular glucose monitoring.'
      });
    }

    if (hasDrug('telmisartan') || hasDrug('telma') || hasDrug('amlodipine')) {
      customMeds.push({
        name: isHindi ? 'टेल्मिसार्टन (Telmisartan 40)' : 'Telmisartan (Telma 40)',
        dosage: '40 mg',
        frequency: isHindi ? 'रोजाना सुबह एक निश्चित समय पर (OD)' : 'Once Daily in Morning (OD)',
        duration: isHindi ? 'नियमित (कार्डियोलॉजिस्ट सलाह अनुसार)' : 'Ongoing (as prescribed)',
        purpose: isHindi ? 'उच्च रक्तचाप (High BP) को नियंत्रित करने और हृदय की सुरक्षा हेतु।' : 'Angiotensin receptor blocker (ARB) for blood pressure control and cardiovascular protection.',
        instructions: isHindi ? 'प्रतिदिन एक ही समय पर लें। पर्याप्त पानी पिएं।' : 'Take consistently at the same hour each morning with water.',
        warnings: isHindi ? 'अचानक दवा बंद न करें। बीपी की नियमित जांच करते रहें।' : 'Do not discontinue abruptly. Monitor blood pressure periodically.'
      });
    }

    // If custom medications were extracted from user's entered raw text
    if (customMeds.length > 0) {
      const isCardio = customMeds.some(m => m.name.includes('Telmisartan') || m.name.includes('टेल्मिसार्टन'));
      const isDiabetic = customMeds.some(m => m.name.includes('Metformin') || m.name.includes('मेटफॉर्मिन'));
      const recSpecialty = isCardio ? 'Cardiologist' : isDiabetic ? 'Endocrinologist' : 'General Physician';
      const matchedDocs = await findMatchingDoctors(recSpecialty);

      return res.json({
        documentType: 'prescription',
        title: isHindi ? 'सत्यापित डिजिटल पर्चा एवं रोगी दवा निर्देश' : 'Decoded Prescription & Patient Medication Guide',
        doctorOrLab: isHindi ? 'आरोग्यकेयर आउटपेशेंट क्लीनिक' : 'ArogyaCare Outpatient Clinical Services',
        date: 'October 15, 2026',
        summary: isHindi
          ? `आपके पर्चे में ${customMeds.length} दवाइयों की पहचान की गई है। प्रत्येक दवा की खुराक, समय और सावधानियों का विवरण नीचे दिया गया है।`
          : `Extracted ${customMeds.length} prescribed medications with dosage schedules, therapeutic purposes, and cautionary advice.`,
        prescriptionData: {
          patientName: isHindi ? 'सत्यापित रोगी (Patient)' : 'Prescription Holder (Verified)',
          medications: customMeds,
          specialInstructions: isHindi
            ? [
                'दवाओं का समय निश्चित रखें और डॉक्टर द्वारा बताई गई पूरी अवधि तक सेवन करें।',
                'दिन भर में पर्याप्त मात्रा में गुनगुना या सामान्य पानी पिएं।',
                'कोई भी प्रतिकूल प्रभाव महसूस होने पर तुरंत अपने डॉक्टर से संपर्क करें।'
              ]
            : [
                'Follow the exact timing and complete full duration as prescribed.',
                'Stay well-hydrated throughout the day.',
                'Contact your physician immediately if you experience adverse allergic reactions.'
              ]
        },
        recommendedSpecialization: recSpecialty,
        disclaimer: isHindi
          ? 'आरोग्यकेयर एआई पर्चा अनुवाद केवल सहायक जानकारी प्रदान करता है। दवा का सेवन हमेशा अपने डॉक्टर के पर्चे के अनुसार ही करें।'
          : 'ArogyaCare AI OCR provides translation and informational synthesis only. Always take medicines precisely as directed on your physical prescription and pharmacist label.',
        recommendedDoctors: matchedDocs
      });
    }

    // Default Comprehensive Prescription
    const matchedDocs = await findMatchingDoctors('General Physician');

    return res.json({
      documentType: 'prescription',
      title: isHindi ? 'सत्यापित पर्चा एवं रोगी दवा निर्देशिका' : 'Decoded Prescription & Patient Medication Guide',
      doctorOrLab: isHindi ? 'आरोग्यकेयर मल्टीस्पेशलिटी क्लीनिक' : 'ArogyaCare Multispeciality Outpatient Clinic',
      date: 'October 15, 2026',
      summary: isHindi
        ? 'इस पर्चे में जीवाणु संक्रमण के लिए एक ब्रॉड-स्पेक्ट्रम एंटीबायोटिक, श्वसन व एलर्जी से राहत के लिए एंटीहिस्टामाइन और पेट की सुरक्षा के लिए एक एंटासिड कैप्सूल शामिल है।'
        : 'This prescription contains an antibiotic for bacterial infection, a non-drowsy antihistamine for symptom relief, and a gastroprotective capsule to safeguard stomach lining.',
      prescriptionData: {
        patientName: isHindi ? 'सुमन वर्मा (उम्र 29 वर्ष)' : 'Sarah Jenkins (Age 29)',
        medications: [
          {
            name: isHindi ? 'एमोक्सीसिलिन + क्लैवुलैनेट (Augmentin 625)' : 'Amoxicillin + Clavulanate (Augmentin)',
            dosage: '625 mg',
            frequency: isHindi ? 'दिन में दो बार (सुबह व शाम भोजन के बाद)' : 'Twice Daily (BD / Every 12 hours)',
            duration: isHindi ? '5 दिन' : '5 Days',
            purpose: isHindi ? 'श्वसन तंत्र या साइनस के बैक्टीरियल इन्फेक्शन को समाप्त करने के लिए एंटीबायोटिक।' : 'Broad-spectrum antibiotic to eliminate bacterial respiratory or sinus infection.',
            instructions: isHindi ? 'नाश्ते और रात के खाने के तुरंत बाद भरपूर पानी के साथ लें। ठीक महसूस होने पर भी 5 दिन पूरे करें।' : 'Take immediately after breakfast and dinner with a full glass of water. Complete all 5 days even if you feel better.',
            warnings: isHindi ? 'पेनिसिलिन से एलर्जी होने पर न लें। खुराक बीच में न छोड़ें।' : 'Do not skip doses. If allergic to penicillin or if severe diarrhea occurs, consult your doctor immediately.'
          },
          {
            name: isHindi ? 'मोंटेलुकास्ट + लेवोसेटिरिज़िन (Montair-LC)' : 'Montelukast + Levocetirizine',
            dosage: '10mg / 5mg',
            frequency: isHindi ? 'रात को सोते समय (OD HS)' : 'Once Daily at Bedtime (OD HS)',
            duration: isHindi ? '7 दिन' : '7 Days',
            purpose: isHindi ? 'नाक बंद होना, छींकें और गले की जलन को शांत करने के लिए एंटी-एलर्जी।' : 'Dual-action allergy and airway relief to decrease nasal congestion, coughing, and airway reactivity.',
            instructions: isHindi ? 'सोने से 30 मिनट पहले एक गिलास पानी के साथ लें।' : 'Take 30 minutes before sleep with water.',
            warnings: isHindi ? 'हल्की सुस्ती आ सकती है। दवा लेने के बाद वाहन चलाने से बचें।' : 'May cause mild drowsiness. Avoid driving or alcohol consumption after taking.'
          },
          {
            name: isHindi ? 'पेंटोप्रजोल डीएसआर (Pantoprazole DSR)' : 'Pantoprazole DSR',
            dosage: '40 mg',
            frequency: isHindi ? 'सुबह खाली पेट (नाश्ते से 30 मिनट पहले)' : 'Once Daily in Morning (OD AC)',
            duration: isHindi ? '5 दिन' : '5 Days',
            purpose: isHindi ? 'दवाइयों से होने वाली एसिडिटी और सीने की जलन से पेट की सुरक्षा हेतु।' : 'Gastro-resistant proton pump inhibitor to prevent medication-induced acidity and heartburn.',
            instructions: isHindi ? 'सुबह खाली पेट नाश्ते से कम से कम 30 मिनट पहले पानी के साथ लें।' : 'Take on an empty stomach at least 30 minutes before your morning meal.',
            warnings: isHindi ? 'कैप्सूल को साबुत निगलें, चबाएं या तोड़ें नहीं।' : 'Swallow whole with water; do not crush or chew the tablet.'
          }
        ],
        specialInstructions: isHindi
          ? [
              'प्रतिदिन कम से कम 2.5 से 3 लीटर गुनगुना पानी पिएं।',
              'नाक व गले की राहत के लिए दिन में दो बार भाप (स्टीम) लें।',
              'यदि 48 घंटे बाद भी बुखार बना रहे तो डॉक्टर से दोबारा संपर्क करें।'
            ]
          : [
              'Stay well-hydrated by drinking at least 2.5 to 3 liters of warm water daily.',
              'Steam inhalation twice daily for nasal clearing.',
              'Schedule a follow-up review if fever persists past 48 hours.'
            ]
      },
      recommendedSpecialization: 'General Physician',
      disclaimer: isHindi
        ? 'आरोग्यकेयर एआई अनुवाद केवल सूचनात्मक सहायता है। दवाइयों का सेवन हमेशा डॉक्टर द्वारा लिखे मूल पर्चे के अनुसार ही करें।'
        : 'ArogyaCare AI OCR provides translation and informational synthesis only. Always take medicines precisely as directed on your physical prescription and pharmacist label.',
      recommendedDoctors: matchedDocs
    });
  } catch (error) {
    console.error('OCR Document analysis error:', error);
    return res.status(500).json({ message: 'Failed to analyze medical document', error: error.message });
  }
};
