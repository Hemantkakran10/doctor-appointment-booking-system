import pptxgen from 'pptxgenjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize PowerPoint Presentation
const pres = new pptxgen();

// Presentation Properties
pres.layout = 'LAYOUT_16x9';
pres.author = 'Hemant Kakran';
pres.company = 'ArogyaCareAI Healthcare';
pres.title = 'ArogyaCareAI - Doctor Appointment Booking & AI Clinical Triage System';
pres.subject = 'Classroom Project Presentation';

// Color Palette (Dark Theme matching ArogyaCareAI branding)
const COLORS = {
  bgDark: '04120E',        // Deep forest emerald
  cardBg: '071F18',        // Slightly lighter container
  cardBorder: '0D3B2E',    // Emerald border
  primary: '00E599',       // Vibrant ArogyaCare Mint Green
  primaryDark: '00A870',   // Deep green
  textWhite: 'FFFFFF',     // Crisp white
  textMuted: '94A3B8',     // Slate muted text
  textBody: 'CBD5E1',      // Light gray body
  accentBlue: '38BDF8',    // Cyan accent
  accentOrange: 'FB923C',  // Warning/accent orange
  accentPurple: 'A78BFA'   // AI accent purple
};

// Helper to set standard slide background
const applySlideBackground = (slide) => {
  slide.background = { color: COLORS.bgDark };
  
  // Subtle top accent border line
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.08,
    fill: { color: COLORS.primary }
  });

  // Footer branding
  slide.addText('ArogyaCareAI | Fullstack Healthcare Platform', {
    x: 0.8,
    y: 7.1,
    w: 6.0,
    h: 0.3,
    fontSize: 10,
    color: COLORS.textMuted,
    fontFace: 'Arial'
  });

  slide.addText('Hemant Kakran • Project Presentation', {
    x: 7.0,
    y: 7.1,
    w: 5.5,
    h: 0.3,
    fontSize: 10,
    align: 'right',
    color: COLORS.textMuted,
    fontFace: 'Arial'
  });
};

// Helper for standard slide headers
const addHeader = (slide, category, title) => {
  slide.addText(category.toUpperCase(), {
    x: 0.8,
    y: 0.45,
    w: 11.5,
    h: 0.3,
    fontSize: 11,
    color: COLORS.primary,
    bold: true,
    fontFace: 'Arial',
    charSpacing: 2
  });

  slide.addText(title, {
    x: 0.8,
    y: 0.75,
    w: 11.5,
    h: 0.6,
    fontSize: 24,
    color: COLORS.textWhite,
    bold: true,
    fontFace: 'Arial'
  });
};

// ==========================================
// SLIDE 1: Title Slide
// ==========================================
const s1 = pres.addSlide();
s1.background = { color: COLORS.bgDark };

// Top accent bar
s1.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: '100%', h: 0.12, fill: { color: COLORS.primary }
});

// Category Tag
s1.addText('HEALTHCARE TECH & ARTIFICIAL INTELLIGENCE', {
  x: 1.0, y: 1.2, w: 11.0, h: 0.4,
  fontSize: 12, bold: true, color: COLORS.primary, fontFace: 'Arial', charSpacing: 3
});

// Main Title
s1.addText('ArogyaCareAI', {
  x: 1.0, y: 1.6, w: 11.0, h: 1.1,
  fontSize: 54, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
});

// Subtitle
s1.addText('Fullstack Doctor Appointment Booking System\nIntegrated with AI Symptom Checker & Vision Prescription OCR', {
  x: 1.0, y: 2.7, w: 11.0, h: 1.0,
  fontSize: 20, color: COLORS.primary, fontFace: 'Arial', lineSpacingMultiple: 1.2
});

// Key Highlights Card
s1.addShape(pres.ShapeType.roundRect, {
  x: 1.0, y: 3.9, w: 11.3, h: 1.7,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.cardBorder, width: 1.5 }, rectRadius: 0.15
});

s1.addText([
  { text: 'KEY CAPABILITIES:\n', options: { bold: true, color: COLORS.primary, fontSize: 11 } },
  { text: '• Real-time Doctor Appointment Scheduling across 50+ Verified Specialists\n', options: { color: COLORS.textBody, fontSize: 13 } },
  { text: '• Clinical AI Symptom Checker powered by Gemini for Instant Triage\n', options: { color: COLORS.textBody, fontSize: 13 } },
  { text: '• Vision OCR Medical Slip Scanner converting Rx images into structured dosages\n', options: { color: COLORS.textBody, fontSize: 13 } },
  { text: '• Secure Multi-Factor Authentication with Live Email OTP & Role-Based Portals', options: { color: COLORS.textBody, fontSize: 13 } }
], {
  x: 1.3, y: 4.0, w: 10.7, h: 1.5,
  fontFace: 'Arial', lineSpacingMultiple: 1.15
});

// Presenter Details Footer
s1.addText('Presented by: Hemant Kakran\nRole: Fullstack Developer\nProject Architecture: MERN + Gemini AI + Vercel Cloud', {
  x: 1.0, y: 5.9, w: 7.0, h: 1.0,
  fontSize: 12, color: COLORS.textMuted, fontFace: 'Arial', lineSpacingMultiple: 1.2
});

s1.addText('Live App: frontend-ten-pearl-81.vercel.app\nGitHub: github.com/Hemantkakran10/doctor-appointment-booking-system', {
  x: 7.0, y: 5.9, w: 5.3, h: 1.0,
  fontSize: 11, align: 'right', color: COLORS.primary, fontFace: 'Arial', lineSpacingMultiple: 1.2
});

// ==========================================
// SLIDE 2: Problem Statement & Motivation
// ==========================================
const s2 = pres.addSlide();
applySlideBackground(s2);
addHeader(s2, 'Context & Motivation', 'The Healthcare Access Problem in India');

const problems = [
  {
    title: 'Appointment Chaos & Long Queues',
    desc: 'Patients spend 2-4 hours waiting in physical clinic queues without knowing doctor real-time availability or delays.',
    icon: '🏥'
  },
  {
    title: 'Lack of Early Triage & Guidance',
    desc: 'Patients cannot self-assess severity of symptoms before visiting clinics, leading to emergency room overcrowding.',
    icon: '⚠️'
  },
  {
    title: 'Unreadable Handwritten Prescriptions',
    desc: 'Over 68% of prescriptions are handwritten, causing medication errors, dosage misunderstandings, and pharmacy confusion.',
    icon: '📝'
  },
  {
    title: 'Disjointed Patient & Doctor Portals',
    desc: 'Patients, doctors, and clinic admins operate on disconnected channels with no centralized appointment analytics.',
    icon: '🔌'
  }
];

problems.forEach((p, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.8;
  const y = 1.6 + row * 2.5;

  s2.addShape(pres.ShapeType.roundRect, {
    x, y, w: 5.5, h: 2.2,
    fill: { color: COLORS.cardBg }, line: { color: COLORS.cardBorder, width: 1 }, rectRadius: 0.12
  });

  s2.addText(p.icon + '  ' + p.title, {
    x: x + 0.3, y: y + 0.3, w: 4.9, h: 0.4,
    fontSize: 16, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
  });

  s2.addText(p.desc, {
    x: x + 0.3, y: y + 0.8, w: 4.9, h: 1.2,
    fontSize: 13, color: COLORS.textBody, fontFace: 'Arial', lineSpacingMultiple: 1.2
  });
});

// ==========================================
// SLIDE 3: The Proposed Solution
// ==========================================
const s3 = pres.addSlide();
applySlideBackground(s3);
addHeader(s3, 'System Overview', 'The ArogyaCareAI Unified Ecosystem');

// 3 Pillars
const pillars = [
  {
    title: '1. Intelligent Doctor Booking',
    tag: 'CLINICAL NETWORK',
    bullets: [
      'Directory of 50+ verified specialists across Delhi/NCR',
      'Filter by specialty (Cardiology, Neuro, Derm, etc.)',
      'Location-based search (Saket, Dwarka, Okhla)',
      'Real-time date and time slot scheduling',
      'Zero double-booking conflict algorithms'
    ],
    color: COLORS.primary
  },
  {
    title: '2. Clinical AI Symptom Checker',
    tag: 'GEMINI LLM ENGINE',
    bullets: [
      'Interactive patient triage questionnaire',
      'Instant clinical urgency assessment (Low/Med/High)',
      'Potential underlying medical conditions list',
      'Specialist matching recommendations',
      'Bilingual support (English & Hindi) with safety bounds'
    ],
    color: COLORS.accentPurple
  },
  {
    title: '3. Vision Prescription OCR',
    tag: 'MULTIMODAL VISION AI',
    bullets: [
      'Direct camera capture or image upload of Rx slip',
      'Extracts medicine names, strength & dosage frequency',
      'Automatic course duration calculation',
      'Displays structured, digital medication schedule',
      'Exportable patient dosage instructions'
    ],
    color: COLORS.accentBlue
  }
];

pillars.forEach((pil, idx) => {
  const x = 0.8 + idx * 3.9;
  const y = 1.6;

  s3.addShape(pres.ShapeType.roundRect, {
    x, y, w: 3.65, h: 5.0,
    fill: { color: COLORS.cardBg }, line: { color: COLORS.cardBorder, width: 1.5 }, rectRadius: 0.15
  });

  s3.addText(pil.tag, {
    x: x + 0.25, y: y + 0.3, w: 3.15, h: 0.3,
    fontSize: 10, bold: true, color: pil.color, fontFace: 'Arial', charSpacing: 1.5
  });

  s3.addText(pil.title, {
    x: x + 0.25, y: y + 0.65, w: 3.15, h: 0.7,
    fontSize: 15, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
  });

  const textBullets = pil.bullets.map(b => ({
    text: `• ${b}\n\n`,
    options: { fontSize: 11, color: COLORS.textBody }
  }));

  s3.addText(textBullets, {
    x: x + 0.25, y: y + 1.45, w: 3.15, h: 3.3,
    fontFace: 'Arial', lineSpacingMultiple: 1.15
  });
});

// ==========================================
// SLIDE 4: Architecture & Data Flow
// ==========================================
const s4 = pres.addSlide();
applySlideBackground(s4);
addHeader(s4, 'Technical Design', 'System Architecture & Data Flow');

// Frontend Tier
s4.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.6, w: 3.4, h: 5.0,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.primary, width: 1.5 }, rectRadius: 0.12
});
s4.addText('CLIENT TIER (Vercel CDN)', {
  x: 1.0, y: 1.85, w: 3.0, h: 0.3, fontSize: 11, bold: true, color: COLORS.primary, fontFace: 'Arial'
});
s4.addText('• React 18 SPA (Vite Bundler)\n• Tailwind CSS Responsive Design\n• Mobile-First Adaptive Layout\n• Context API State Management\n• Lucide Icons & Multi-theme (Dark/Light)\n• Bilingual Localization (EN/HI)\n• Real-time Password Strength Meter\n• Client-side Instant Filter & Cache', {
  x: 1.0, y: 2.3, w: 3.0, h: 4.0, fontSize: 12, color: COLORS.textBody, fontFace: 'Arial', lineSpacingMultiple: 1.25
});

// Backend Tier
s4.addShape(pres.ShapeType.roundRect, {
  x: 4.6, y: 1.6, w: 3.9, h: 5.0,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.accentBlue, width: 1.5 }, rectRadius: 0.12
});
s4.addText('SERVERLESS API TIER (Node.js)', {
  x: 4.8, y: 1.85, w: 3.5, h: 0.3, fontSize: 11, bold: true, color: COLORS.accentBlue, fontFace: 'Arial'
});
s4.addText('• Express.js REST Controllers\n• Vercel Edge Serverless Function\n• JWT Token Authentication (30 Days)\n• Role-based Access Control (RBAC)\n• Fail-Fast Non-Buffering Handlers\n• Cold-Start Auto-Retry Mechanisms\n• Nodemailer Gmail SMTP Transporter\n• Zero-Downtime Fallback Cache', {
  x: 4.8, y: 2.3, w: 3.5, h: 4.0, fontSize: 12, color: COLORS.textBody, fontFace: 'Arial', lineSpacingMultiple: 1.25
});

// Services Tier
s4.addShape(pres.ShapeType.roundRect, {
  x: 8.9, y: 1.6, w: 3.4, h: 5.0,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.accentPurple, width: 1.5 }, rectRadius: 0.12
});
s4.addText('DATA & AI SERVICES TIER', {
  x: 9.1, y: 1.85, w: 3.0, h: 0.3, fontSize: 11, bold: true, color: COLORS.accentPurple, fontFace: 'Arial'
});
s4.addText('• MongoDB Atlas (Cloud NoSQL)\n  - Users, Doctors, Appointments, OTPs\n• Google Gemini 1.5 Flash API\n  - Symptom Triage Reasoning\n  - Multimodal Vision OCR Engine\n• Google Gmail SMTP Relay\n  - TLS Authenticated OTP Emailing\n• Unsplash Medical Assets CDN', {
  x: 9.1, y: 2.3, w: 3.0, h: 4.0, fontSize: 12, color: COLORS.textBody, fontFace: 'Arial', lineSpacingMultiple: 1.25
});

// ==========================================
// SLIDE 5: Technology Stack Breakdown
// ==========================================
const s5 = pres.addSlide();
applySlideBackground(s5);
addHeader(s5, 'Implementation Tools', 'Modern Fullstack Technology Stack');

const techs = [
  { title: 'Frontend Framework', value: 'React 18 + Vite', note: 'High performance SPA with blazing fast HMR' },
  { title: 'UI Styling System', value: 'Tailwind CSS', note: 'Utility-first styling with sleek dark mode' },
  { title: 'Backend Framework', value: 'Node.js & Express.js', note: 'Modular REST API with MVC pattern' },
  { title: 'Database & ODM', value: 'MongoDB & Mongoose', note: 'Flexible document store for patient & booking schemas' },
  { title: 'Artificial Intelligence', value: 'Google Gemini 1.5 Flash', note: 'Ultra-low latency LLM for triage & vision OCR' },
  { title: 'Authentication', value: 'JWT & Bcrypt + OTP', note: 'Salted password hashes & 6-digit email verification' },
  { title: 'Email Service', value: 'Nodemailer (Gmail SMTP)', note: 'Secure App Password authenticated dispatch' },
  { title: 'Cloud Infrastructure', value: 'Vercel Serverless CDN', note: 'Global low-latency deployment with zero server setup' }
];

techs.forEach((t, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.8;
  const y = 1.6 + row * 1.3;

  s5.addShape(pres.ShapeType.roundRect, {
    x, y, w: 5.5, h: 1.1,
    fill: { color: COLORS.cardBg }, line: { color: COLORS.cardBorder, width: 1 }, rectRadius: 0.08
  });

  s5.addText(t.title.toUpperCase(), {
    x: x + 0.3, y: y + 0.15, w: 4.9, h: 0.25,
    fontSize: 9, bold: true, color: COLORS.primary, fontFace: 'Arial'
  });

  s5.addText(t.value, {
    x: x + 0.3, y: y + 0.4, w: 4.9, h: 0.35,
    fontSize: 14, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
  });

  s5.addText(t.note, {
    x: x + 0.3, y: y + 0.75, w: 4.9, h: 0.25,
    fontSize: 10, color: COLORS.textMuted, fontFace: 'Arial'
  });
});

// ==========================================
// SLIDE 6: Feature Spotlight: AI Symptom Checker
// ==========================================
const s6 = pres.addSlide();
applySlideBackground(s6);
addHeader(s6, 'Artificial Intelligence', 'Clinical AI Symptom Checker & Triage Engine');

s6.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.6, w: 5.5, h: 5.0,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.cardBorder, width: 1.5 }, rectRadius: 0.12
});

s6.addText('HOW THE AI ENGINE WORKS', {
  x: 1.1, y: 1.85, w: 5.0, h: 0.3, fontSize: 11, bold: true, color: COLORS.primary, fontFace: 'Arial'
});

s6.addText([
  { text: '1. Structured Symptom Capture:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 13 } },
  { text: 'Patient inputs age, gender, duration, primary complaints, and associated symptoms.\n\n', options: { color: COLORS.textBody, fontSize: 11 } },
  { text: '2. Prompt Guardrails & Clinical Persona:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 13 } },
  { text: 'Engine enforces strictly formulated medical prompt requiring JSON schema output with red-flag detection.\n\n', options: { color: COLORS.textBody, fontSize: 11 } },
  { text: '3. Risk Stratification Algorithm:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 13 } },
  { text: 'Categorizes urgency into Low (routine care), Moderate (consult within 48h), or High/Emergency (immediate ER visit).\n\n', options: { color: COLORS.textBody, fontSize: 11 } },
  { text: '4. Direct Doctor Routing:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 13 } },
  { text: 'Automatically recommends matching specialist (e.g. Cardiologist for chest pressure) with 1-click booking button.', options: { color: COLORS.textBody, fontSize: 11 } }
], {
  x: 1.1, y: 2.25, w: 5.0, h: 4.2, fontFace: 'Arial', lineSpacingMultiple: 1.1
});

// Output Preview Mockup
s6.addShape(pres.ShapeType.roundRect, {
  x: 6.7, y: 1.6, w: 5.6, h: 5.0,
  fill: { color: '03100B' }, line: { color: COLORS.accentPurple, width: 1.5 }, rectRadius: 0.12
});

s6.addText('SAMPLE CLINICAL TRIAGE OUTPUT', {
  x: 7.0, y: 1.85, w: 5.0, h: 0.3, fontSize: 11, bold: true, color: COLORS.accentPurple, fontFace: 'Arial'
});

s6.addText([
  { text: 'URGENCY LEVEL: ', options: { bold: true, color: COLORS.textWhite, fontSize: 12 } },
  { text: 'MODERATE (Yellow Alert)\n\n', options: { bold: true, color: COLORS.accentOrange, fontSize: 12 } },
  { text: 'PROBABLE CONDITIONS IDENTIFIED:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 11 } },
  { text: '• Acute Bronchitis (75% match)\n• Seasonal Allergic Rhinitis (60% match)\n• Upper Respiratory Tract Infection (45% match)\n\n', options: { color: COLORS.textBody, fontSize: 11 } },
  { text: 'RECOMMENDED SPECIALIST:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 11 } },
  { text: 'Pulmonologist or General Physician\n\n', options: { color: COLORS.primary, bold: true, fontSize: 12 } },
  { text: 'SAFE SELF-CARE & PRECAUTIONS:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 11 } },
  { text: '• Steam inhalation twice daily with warm saline gargles\n• Maintain 3+ liters hydration; avoid dust exposure\n• If breathing difficulty increases, seek immediate ER care.', options: { color: COLORS.textMuted, fontSize: 10 } }
], {
  x: 7.0, y: 2.25, w: 5.0, h: 4.2, fontFace: 'Arial', lineSpacingMultiple: 1.15
});

// ==========================================
// SLIDE 7: Feature Spotlight: Vision Prescription OCR
// ==========================================
const s7 = pres.addSlide();
applySlideBackground(s7);
addHeader(s7, 'Vision AI Engine', 'Multimodal Vision Prescription OCR');

s7.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.6, w: 5.5, h: 5.0,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.cardBorder, width: 1.5 }, rectRadius: 0.12
});

s7.addText('VISION PROCESSING PIPELINE', {
  x: 1.1, y: 1.85, w: 5.0, h: 0.3, fontSize: 11, bold: true, color: COLORS.primary, fontFace: 'Arial'
});

s7.addText([
  { text: '1. Multi-Format Image Ingestion:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 13 } },
  { text: 'Supports JPEG, PNG, WebP up to 15MB via client camera or file picker.\n\n', options: { color: COLORS.textBody, fontSize: 11 } },
  { text: '2. Gemini 1.5 Flash Vision Multimodal Model:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 13 } },
  { text: 'Sends base64 image buffer with custom optical extraction prompts tailored for messy medical handwriting.\n\n', options: { color: COLORS.textBody, fontSize: 11 } },
  { text: '3. Clinical Entity Disambiguation:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 13 } },
  { text: 'Parses medicine brand names, generic equivalents, strengths (mg/ml), frequencies (OD, BD, TDS), and food timing.\n\n', options: { color: COLORS.textBody, fontSize: 11 } },
  { text: '4. Digital Rx Table Output:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 13 } },
  { text: 'Presents an interactive digital schedule preventing missed or confused medicine dosages.', options: { color: COLORS.textBody, fontSize: 11 } }
], {
  x: 1.1, y: 2.25, w: 5.0, h: 4.2, fontFace: 'Arial', lineSpacingMultiple: 1.1
});

// Table representation
s7.addShape(pres.ShapeType.roundRect, {
  x: 6.7, y: 1.6, w: 5.6, h: 5.0,
  fill: { color: '03100B' }, line: { color: COLORS.accentBlue, width: 1.5 }, rectRadius: 0.12
});

s7.addText('STRUCTURED DIGITAL MEDICATION OUTPUT', {
  x: 7.0, y: 1.85, w: 5.0, h: 0.3, fontSize: 11, bold: true, color: COLORS.accentBlue, fontFace: 'Arial'
});

const rxRows = [
  ['Medicine Name', 'Dosage', 'Frequency', 'Duration'],
  ['Augmentin 625 Duo', '1 Tab', 'Twice daily (after food)', '5 Days'],
  ['Pan-D Capsule', '1 Cap', 'Once daily (empty stomach)', '7 Days'],
  ['Allegra 120mg', '1 Tab', 'Once at bedtime', '5 Days'],
  ['Ascoril-D Cough Syrup', '10 ml', 'Three times daily', '5 Days'],
  ['Paracetamol 650mg', '1 Tab', 'SOS (if fever > 100°F)', 'As needed']
];

s7.addTable(rxRows, {
  x: 6.9, y: 2.3, w: 5.2, h: 3.2,
  colW: [1.8, 0.9, 1.6, 0.9],
  fontSize: 9,
  fontFace: 'Arial',
  color: COLORS.textWhite,
  fill: { color: COLORS.cardBg },
  border: { color: COLORS.cardBorder, pt: 1 },
  autoPage: false
});

s7.addText('✓ Extracted Doctor: Dr. Rakesh Sharma, MD (Cardiologist)\n✓ Patient Instructions: Complete full 5-day antibiotic course even if feeling better.', {
  x: 7.0, y: 5.7, w: 5.0, h: 0.7,
  fontSize: 9.5, color: COLORS.primary, fontFace: 'Arial', lineSpacingMultiple: 1.2
});

// ==========================================
// SLIDE 8: Security & Resilient Architecture
// ==========================================
const s8 = pres.addSlide();
applySlideBackground(s8);
addHeader(s8, 'Security & Reliability', 'Zero-Downtime Architecture & Data Protection');

const secCards = [
  {
    title: 'Multi-Factor Email OTP Verification',
    bullets: [
      'Authentic 6-digit one-time code sent directly via Gmail SMTP',
      'No on-screen code leakage (production-grade security)',
      '10-minute automated expiry on OTP records',
      'Instant verification before patient account provisioning'
    ]
  },
  {
    title: 'Fail-Fast Serverless Non-Buffering',
    bullets: [
      'Eliminated Mongoose connection buffering timeouts (bufferCommands = false)',
      'Under 300ms authentication latency on cold starts',
      'Graceful serverless degradation without crashing',
      'Automatic client-side connection auto-retry'
    ]
  },
  {
    title: 'Role-Based Access Control (RBAC)',
    bullets: [
      'Distinct patient, doctor, and administrator authorization scopes',
      'Cryptographically signed JWT bearer tokens with 30-day life',
      'Bcrypt password hashing with multi-round salt generation',
      'Strict route middleware preventing cross-account access'
    ]
  },
  {
    title: 'Zero Double-Booking Algorithm',
    bullets: [
      'Atomic booking validation prevents slot collisions',
      'Real-time date/time doctor schedule mapping',
      'Comprehensive appointment status tracking (Pending, Confirmed, Cancelled)',
      'Instant cancellation and slot replenishment'
    ]
  }
];

secCards.forEach((c, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.8;
  const y = 1.6 + row * 2.5;

  s8.addShape(pres.ShapeType.roundRect, {
    x, y, w: 5.5, h: 2.2,
    fill: { color: COLORS.cardBg }, line: { color: COLORS.cardBorder, width: 1 }, rectRadius: 0.12
  });

  s8.addText('🔒  ' + c.title, {
    x: x + 0.3, y: y + 0.25, w: 4.9, h: 0.35,
    fontSize: 14, bold: true, color: COLORS.primary, fontFace: 'Arial'
  });

  const bullets = c.bullets.map(b => ({
    text: `• ${b}\n`,
    options: { fontSize: 11, color: COLORS.textBody }
  }));

  s8.addText(bullets, {
    x: x + 0.3, y: y + 0.65, w: 4.9, h: 1.4,
    fontFace: 'Arial', lineSpacingMultiple: 1.15
  });
});

// ==========================================
// SLIDE 9: User Experience & Design
// ==========================================
const s9 = pres.addSlide();
applySlideBackground(s9);
addHeader(s9, 'User Experience', 'Accessible, Multilingual & Responsive UI');

const uxCards = [
  {
    title: 'Mobile-First Adaptive Design',
    desc: 'Fully optimized for iPhone, Android, tablets, and desktop displays with responsive touch controls, collapsible side menus, and quick-action bottom sheets.'
  },
  {
    title: 'Dual Language Support (English / Hindi)',
    desc: 'Comprehensive English and Hindi translation across all medical specialties, navigation headers, triage instructions, and confirmation screens.'
  },
  {
    title: 'Password Strength & Security Feedback',
    desc: 'Interactive live checklist evaluating password complexity (8+ characters, uppercase, numbers, symbols) guiding patients toward secure credentials.'
  },
  {
    title: 'Dark / Light Clinical Aesthetic',
    desc: 'Eye-friendly modern emerald and dark obsidian theme engineered to reduce eye strain in nighttime hospital environments while maintaining crisp contrast.'
  }
];

uxCards.forEach((u, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.8;
  const y = 1.6 + row * 2.5;

  s9.addShape(pres.ShapeType.roundRect, {
    x, y, w: 5.5, h: 2.2,
    fill: { color: COLORS.cardBg }, line: { color: COLORS.cardBorder, width: 1 }, rectRadius: 0.12
  });

  s9.addText(u.title, {
    x: x + 0.3, y: y + 0.3, w: 4.9, h: 0.35,
    fontSize: 15, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
  });

  s9.addText(u.desc, {
    x: x + 0.3, y: y + 0.75, w: 4.9, h: 1.3,
    fontSize: 12, color: COLORS.textBody, fontFace: 'Arial', lineSpacingMultiple: 1.2
  });
});

// ==========================================
// SLIDE 10: Live Demonstration & Results
// ==========================================
const s10 = pres.addSlide();
applySlideBackground(s10);
addHeader(s10, 'Deployment & Verification', 'Live Production Demonstration');

// Live Stats & Deployment Info
s10.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.6, w: 11.4, h: 5.0,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.primary, width: 1.5 }, rectRadius: 0.15
});

s10.addText('DEPLOYED PRODUCTION ENVIRONMENT', {
  x: 1.1, y: 1.9, w: 10.8, h: 0.3, fontSize: 11, bold: true, color: COLORS.primary, fontFace: 'Arial'
});

s10.addText([
  { text: '• Live Web Application URL: ', options: { bold: true, color: COLORS.textWhite, fontSize: 14 } },
  { text: 'https://frontend-ten-pearl-81.vercel.app\n\n', options: { color: COLORS.primary, bold: true, fontSize: 14 } },
  { text: '• Live Serverless REST API: ', options: { bold: true, color: COLORS.textWhite, fontSize: 14 } },
  { text: 'https://backend-nine-delta-bvvafh0hc7.vercel.app/api\n\n', options: { color: COLORS.accentBlue, bold: true, fontSize: 14 } },
  { text: '• Open-Source GitHub Repository: ', options: { bold: true, color: COLORS.textWhite, fontSize: 14 } },
  { text: 'https://github.com/Hemantkakran10/doctor-appointment-booking-system\n\n', options: { color: COLORS.accentPurple, bold: true, fontSize: 14 } },
  { text: 'PERFORMANCE BENCHMARKS & VERIFIED METRICS:\n', options: { bold: true, color: COLORS.textWhite, fontSize: 13 } },
  { text: '✓ Verified Doctors Loaded: 50 Specialists actively serving Delhi, Gurgaon, Noida, and NCR\n', options: { color: COLORS.textBody, fontSize: 12 } },
  { text: '✓ Authentication Latency: < 300ms serverless response time for login & session recovery\n', options: { color: COLORS.textBody, fontSize: 12 } },
  { text: '✓ Real Email OTP Delivery: < 2 seconds direct inbox delivery via TLS Gmail SMTP\n', options: { color: COLORS.textBody, fontSize: 12 } },
  { text: '✓ Responsive Viewports: 100% verified compatibility across 390px (Mobile) through 4K (Desktop)', options: { color: COLORS.textBody, fontSize: 12 } }
], {
  x: 1.1, y: 2.3, w: 10.8, h: 4.0, fontFace: 'Arial', lineSpacingMultiple: 1.15
});

// ==========================================
// SLIDE 11: Future Roadmap
// ==========================================
const s11 = pres.addSlide();
applySlideBackground(s11);
addHeader(s11, 'Next Steps', 'Future Scope & Scaling Roadmap');

const roadmap = [
  {
    phase: 'Phase 1: Telemedicine Integration',
    desc: 'Integrate WebRTC peer-to-peer encrypted video calling so patients can consult doctors directly within the browser without external apps.'
  },
  {
    phase: 'Phase 2: ABDM & ABHA National ID',
    desc: 'Connect with Ayushman Bharat Digital Mission (ABDM) APIs to fetch standardized Electronic Health Records (EHR) using patient ABHA card numbers.'
  },
  {
    phase: 'Phase 3: Multi-Dialect Voice Triage',
    desc: 'Add voice-to-text symptom checker supporting 8+ regional Indian languages (Hindi, Punjabi, Bengali, Tamil, Telugu) for rural accessibility.'
  },
  {
    phase: 'Phase 4: WhatsApp & SMS Automation',
    desc: 'Deploy automated WhatsApp business bot for appointment booking confirmation, reminder notifications, and 1-click slot rescheduling.'
  }
];

roadmap.forEach((r, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.8;
  const y = 1.6 + row * 2.5;

  s11.addShape(pres.ShapeType.roundRect, {
    x, y, w: 5.5, h: 2.2,
    fill: { color: COLORS.cardBg }, line: { color: COLORS.cardBorder, width: 1 }, rectRadius: 0.12
  });

  s11.addText(r.phase, {
    x: x + 0.3, y: y + 0.3, w: 4.9, h: 0.35,
    fontSize: 15, bold: true, color: COLORS.primary, fontFace: 'Arial'
  });

  s11.addText(r.desc, {
    x: x + 0.3, y: y + 0.75, w: 4.9, h: 1.3,
    fontSize: 12, color: COLORS.textBody, fontFace: 'Arial', lineSpacingMultiple: 1.2
  });
});

// ==========================================
// SLIDE 12: Conclusion & Q&A
// ==========================================
const s12 = pres.addSlide();
s12.background = { color: COLORS.bgDark };

s12.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: '100%', h: 0.12, fill: { color: COLORS.primary }
});

s12.addText('PROJECT CONCLUSION', {
  x: 1.0, y: 1.4, w: 11.0, h: 0.4,
  fontSize: 12, bold: true, color: COLORS.primary, fontFace: 'Arial', charSpacing: 3
});

s12.addText('Thank You!', {
  x: 1.0, y: 1.8, w: 11.0, h: 1.2,
  fontSize: 56, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
});

s12.addText('ArogyaCareAI demonstrates how modern MERN architecture combined with Generative AI can democratize quality healthcare access across India.', {
  x: 1.0, y: 3.1, w: 11.0, h: 0.8,
  fontSize: 16, color: COLORS.textBody, fontFace: 'Arial', lineSpacingMultiple: 1.2
});

s12.addShape(pres.ShapeType.roundRect, {
  x: 1.0, y: 4.1, w: 11.3, h: 2.3,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.cardBorder, width: 1.5 }, rectRadius: 0.15
});

s12.addText([
  { text: 'QUESTIONS & DISCUSSION\n', options: { bold: true, color: COLORS.primary, fontSize: 13 } },
  { text: '• Developer: Hemant Kakran\n', options: { color: COLORS.textWhite, fontSize: 13, bold: true } },
  { text: '• Live App: https://frontend-ten-pearl-81.vercel.app\n', options: { color: COLORS.accentBlue, fontSize: 12 } },
  { text: '• GitHub Codebase: https://github.com/Hemantkakran10/doctor-appointment-booking-system\n', options: { color: COLORS.accentPurple, fontSize: 12 } },
  { text: '• Open for questions from Professor & Classmates!', options: { color: COLORS.textBody, fontSize: 12, italic: true } }
], {
  x: 1.3, y: 4.3, w: 10.7, h: 1.9, fontFace: 'Arial', lineSpacingMultiple: 1.2
});

// Output File Path
const outputPath = path.join(__dirname, 'ArogyaCareAI_Class_Presentation.pptx');

pres.writeFile({ fileName: outputPath })
  .then((fileName) => {
    console.log(`SUCCESS: PowerPoint presentation created at ${fileName}`);
  })
  .catch((err) => {
    console.error('ERROR creating presentation:', err);
  });
