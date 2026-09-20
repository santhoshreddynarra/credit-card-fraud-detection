const express = require('express');
const router = express.Router();
const {
  createPrediction,
  getPredictionHistory,
  getPredictionStats
} = require('../controllers/predictionController');

// Aggregate statistics route (must be before /:id routes if any)
router.get('/stats', getPredictionStats);

// Predict & Store prediction route
router.post('/', createPrediction);

// Prediction history list route
router.get('/', getPredictionHistory);

module.exports = router;
