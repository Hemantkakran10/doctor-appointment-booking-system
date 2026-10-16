import express from 'express';
import {
  analyzeSymptoms,
  chatWithAI,
  analyzeMedicalDocument
} from '../controllers/aiController.js';

const router = express.Router();

// @route   POST /api/ai/symptom-analysis
// @desc    Intelligent symptom analysis and doctor specialization matching
// @access  Public
router.post('/symptom-analysis', analyzeSymptoms);

// @route   POST /api/ai/chat
// @desc    Conversational medical assistant chatbot
// @access  Public
router.post('/chat', chatWithAI);

// @route   POST /api/ai/ocr-analyze
// @desc    OCR-powered prescription explanation and medical report summarization
// @access  Public
router.post('/ocr-analyze', analyzeMedicalDocument);

export default router;
