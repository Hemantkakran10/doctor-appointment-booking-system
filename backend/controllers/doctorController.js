import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// @desc    Get all active doctors (with search)
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const search = req.query.search;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { hospital: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await Doctor.find(query).select('-password');
    return res.json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    return res.json(doctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile (fees, experience, specialization, isActive)
// @route   PUT /api/doctors/profile
// @access  Private/Doctor
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    doctor.fees = req.body.fees !== undefined ? req.body.fees : doctor.fees;
    doctor.experience = req.body.experience !== undefined ? req.body.experience : doctor.experience;
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.degree = req.body.degree || doctor.degree;
    doctor.isActive = req.body.isActive !== undefined ? req.body.isActive : doctor.isActive;

    const updatedDoctor = await doctor.save();
    return res.json({
      _id: updatedDoctor._id,
      name: updatedDoctor.name,
      email: updatedDoctor.email,
      specialization: updatedDoctor.specialization,
      degree: updatedDoctor.degree,
      experience: updatedDoctor.experience,
      fees: updatedDoctor.fees,
      isActive: updatedDoctor.isActive,
      slots_booked: updatedDoctor.slots_booked,
      role: updatedDoctor.role
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor's appointments
// @route   GET /api/doctors/appointments
// @access  Private/Doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ docId: req.user._id })
      .populate('userId', 'name email phone')
      .sort({ slotDate: 1, slotTime: 1 });
    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor's analytics
// @route   GET /api/doctors/analytics
// @access  Private/Doctor
export const getDoctorAnalytics = async (req, res) => {
  try {
    const appointments = await Appointment.find({ docId: req.user._id });
    
    const appointmentsHandled = appointments.length;
    const completedAppointments = appointments.filter(a => a.isCompleted && !a.cancelled);
    const totalEarnings = completedAppointments.reduce((sum, curr) => sum + curr.amount, 0);

    return res.json({
      appointmentsHandled,
      completedAppointmentsCount: completedAppointments.length,
      totalEarnings
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get smart AI-powered suggestions for doctors/specializations
// @route   GET /api/doctors/suggestions
// @access  Public
const fallbackSuggestions = (query, doctors) => {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  const suggestions = [];

  // 1. Synonym-based Specialization mapping
  const synonymMap = {
    'heart': 'Cardiologist',
    'cardio': 'Cardiologist',
    'cardiac': 'Cardiologist',
    'chest': 'Cardiologist',
    'skin': 'Dermatologist',
    'derm': 'Dermatologist',
    'acne': 'Dermatologist',
    'rash': 'Dermatologist',
    'child': 'Pediatrician',
    'kid': 'Pediatrician',
    'baby': 'Pediatrician',
    'pediatr': 'Pediatrician',
    'brain': 'Neurologist',
    'neuro': 'Neurologist',
    'nerve': 'Neurologist',
    'headache': 'Neurologist',
    'women': 'Gynecologist',
    'female': 'Gynecologist',
    'gyne': 'Gynecologist',
    'obgyn': 'Gynecologist',
    'pregnancy': 'Gynecologist',
    'bone': 'Orthopedic',
    'joint': 'Orthopedic',
    'fracture': 'Orthopedic',
    'ortho': 'Orthopedic',
    'fever': 'General Physician',
    'cough': 'General Physician',
    'general': 'General Physician',
    'physician': 'General Physician',
    'ear': 'ENT Specialist',
    'nose': 'ENT Specialist',
    'throat': 'ENT Specialist',
    'ent': 'ENT Specialist',
    'mental': 'Psychiatrist',
    'anxiety': 'Psychiatrist',
    'depression': 'Psychiatrist',
    'psych': 'Psychiatrist',
    'eye': 'Ophthalmologist',
    'vision': 'Ophthalmologist',
    'stomach': 'Gastroenterologist',
    'liver': 'Gastroenterologist'
  };

  // Find if query matches any synonym keys
  Object.keys(synonymMap).forEach(key => {
    if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
      const specName = synonymMap[key];
      // Make sure we have doctors in this specialization
      const hasDoc = doctors.some(d => d.specialization.toLowerCase() === specName.toLowerCase());
      if (hasDoc && !suggestions.some(s => s.text === specName)) {
        suggestions.push({
          text: specName,
          type: 'specialization',
          searchQuery: specName
        });
      }
    }
  });

  // 2. Direct Substring matches for Specializations
  doctors.forEach(doc => {
    const spec = doc.specialization;
    if (spec.toLowerCase().includes(normalizedQuery) && !suggestions.some(s => s.text.toLowerCase() === spec.toLowerCase())) {
      suggestions.push({
        text: spec,
        type: 'specialization',
        searchQuery: spec
      });
    }
  });

  // 3. Experience and Cost Intents
  const isCheapQuery = /cheap|low|budget|affordable|cost|price|fee/i.test(normalizedQuery);
  const isExpertQuery = /expert|experience|senior|old|practi/i.test(normalizedQuery);

  if (isCheapQuery) {
    // Find average fees
    const avgFees = doctors.reduce((sum, d) => sum + d.fees, 0) / (doctors.length || 1);
    const lowFeeDocs = doctors.filter(d => d.fees <= avgFees);
    lowFeeDocs.slice(0, 3).forEach(doc => {
      suggestions.push({
        text: `${doc.name} (Low consultation fee: ₹${doc.fees})`,
        type: 'intent',
        searchQuery: doc.name
      });
    });
  }

  if (isExpertQuery) {
    const expertDocs = doctors.filter(d => d.experience >= 8);
    expertDocs.slice(0, 3).forEach(doc => {
      suggestions.push({
        text: `${doc.name} (Expert: ${doc.experience}+ yrs exp)`,
        type: 'intent',
        searchQuery: doc.name
      });
    });
  }

  // 4. Name / Substring Match for Doctors
  doctors.forEach(doc => {
    const nameLower = doc.name.toLowerCase();
    
    // Check if query is in name or matches initials or word segments
    const nameWords = nameLower.split(/\s+/);
    const startsWithQuery = nameWords.some(word => word.startsWith(normalizedQuery)) || nameLower.includes(normalizedQuery);
    
    if (startsWithQuery) {
      if (!suggestions.some(s => s.searchQuery === doc.name)) {
        suggestions.push({
          text: `${doc.name} (${doc.specialization} - ${doc.hospital})`,
          type: 'doctor',
          searchQuery: doc.name
        });
      }
    }
  });

  // 4b. Hospital / Location Match
  doctors.forEach(doc => {
    if (doc.hospital && doc.hospital.toLowerCase().includes(normalizedQuery)) {
      if (!suggestions.some(s => s.searchQuery === doc.hospital)) {
        suggestions.push({
          text: `${doc.hospital} (${doc.name})`,
          type: 'location',
          searchQuery: doc.hospital
        });
      }
    }
  });

  // 5. Very simple fuzzy fallback for spelling mistakes
  if (suggestions.length === 0) {
    doctors.forEach(doc => {
      // Check specialization similarity
      const spec = doc.specialization.toLowerCase();
      let matchCount = 0;
      let qIdx = 0;
      for (let i = 0; i < spec.length && qIdx < normalizedQuery.length; i++) {
        if (spec[i] === normalizedQuery[qIdx]) {
          matchCount++;
          qIdx++;
        }
      }
      let score = matchCount / normalizedQuery.length;
      if (score >= 0.75 && !suggestions.some(s => s.searchQuery === doc.specialization)) {
        suggestions.push({
          text: doc.specialization,
          type: 'specialization',
          searchQuery: doc.specialization
        });
      }

      // Check name similarity
      const name = doc.name.toLowerCase().replace(/^dr\.\s+/i, '');
      matchCount = 0;
      qIdx = 0;
      for (let i = 0; i < name.length && qIdx < normalizedQuery.length; i++) {
        if (name[i] === normalizedQuery[qIdx]) {
          matchCount++;
          qIdx++;
        }
      }
      score = matchCount / normalizedQuery.length;
      if (score >= 0.75 && !suggestions.some(s => s.searchQuery === doc.name)) {
        suggestions.push({
          text: `${doc.name} (${doc.specialization})`,
          type: 'doctor',
          searchQuery: doc.name
        });
      }
    });
  }

  return suggestions.slice(0, 5);
};

export const getSuggestions = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json([]);
    }

    const doctors = await Doctor.find({ isActive: true }).select('name specialization degree experience fees');

    if (!process.env.GEMINI_API_KEY) {
      const fallback = fallbackSuggestions(query, doctors);
      return res.json(fallback);
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json"
        }
      });

      const doctorsContext = doctors.map(doc => ({
        id: doc._id,
        name: doc.name,
        specialization: doc.specialization,
        degree: doc.degree,
        experience: doc.experience,
        fees: doc.fees
      }));

      const prompt = `
You are an AI assistant for a clinic network appointment booking system.
The user is typing in a search bar to find doctors.
Based on their search query (which may contain partial words, typos, or natural language intent), generate up to 5 intelligent suggestions using the active doctors data.

User Query: "${query}"

Active Doctors Data:
${JSON.stringify(doctorsContext, null, 2)}

Instructions:
1. Support partial words (e.g. "rich" -> "Richard"), typos (e.g. "pediatrcin" -> "Pediatrician"), and natural language intents (e.g. "heart problem" -> "Cardiologist", "kids doc" -> "Pediatrician", "affordable" -> lowest fee doctor, "senior expert" -> doctor with highest experience).
2. For each suggestion, provide a display text, its type ("doctor", "specialization", or "intent"), and the exact searchQuery string that should be placed in the search box when clicked.
3. Return the result strictly as a JSON array of objects. No backticks or explanation text.

Object structure:
{
  "text": "Display text of suggestion (e.g. 'Dr. Richard Nader (Cardiologist)' or 'Pediatrician' or 'Dr. Jane Smith (Affordable: $100)')",
  "type": "doctor" | "specialization" | "intent",
  "searchQuery": "Search term to filter the list (e.g. 'Richard Nader' or 'Pediatrician')"
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let cleanedJson = text.trim();
      if (cleanedJson.startsWith("```")) {
        cleanedJson = cleanedJson.replace(/^```(json)?/, '').replace(/```$/, '').trim();
      }

      const suggestions = JSON.parse(cleanedJson);
      return res.json(Array.isArray(suggestions) ? suggestions.slice(0, 5) : []);
    } catch (apiError) {
      console.error("Gemini API suggestion call failed, falling back:", apiError);
      const fallback = fallbackSuggestions(query, doctors);
      return res.json(fallback);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
