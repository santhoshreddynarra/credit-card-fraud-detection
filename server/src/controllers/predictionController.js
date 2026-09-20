const Prediction = require('../models/Prediction');
const mlService = require('../services/mlService');

const REQUIRED_FEATURES = [
  'Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9',
  'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19',
  'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27', 'V28', 'Amount'
];

/**
 * Validates transaction payload.
 */
const validateTransactionInput = (body) => {
  if (!body || typeof body !== 'object') {
    return { valid: false, message: 'Request body must be a JSON object.' };
  }

  const data = body.transactionData || body.features || body;

  const missing = [];
  const invalidTypes = [];
  const cleanData = {};

  for (const feature of REQUIRED_FEATURES) {
    if (data[feature] === undefined || data[feature] === null || data[feature] === '') {
      missing.push(feature);
    } else {
      const num = Number(data[feature]);
      if (isNaN(num)) {
        invalidTypes.push(feature);
      } else {
        cleanData[feature] = num;
      }
    }
  }

  if (missing.length > 0) {
    return { valid: false, message: `Missing required transaction feature(s): ${missing.join(', ')}` };
  }

  if (invalidTypes.length > 0) {
    return { valid: false, message: `Feature(s) must be valid numeric values: ${invalidTypes.join(', ')}` };
  }

  return { valid: true, cleanData };
};

/**
 * POST /api/predictions
 * Runs fraud prediction via Python ML service and persists result for authenticated user.
 */
const createPrediction = async (req, res, next) => {
  try {
    const validation = validateTransactionInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const transactionData = validation.cleanData;

    // Call Python ML inference service
    const mlResult = await mlService.predictFraud(transactionData);

    // Save prediction record to MongoDB belonging strictly to req.user.id
    const record = await Prediction.create({
      userId: req.user.id,
      transactionData,
      prediction: mlResult.prediction,
      fraudProbability: mlResult.fraud_probability,
      isFraud: mlResult.is_fraud
    });

    return res.status(201).json({
      success: true,
      prediction: mlResult.prediction,
      fraudProbability: mlResult.fraud_probability,
      fraud_probability: mlResult.fraud_probability,
      isFraud: mlResult.is_fraud,
      is_fraud: mlResult.is_fraud,
      riskLevel: mlResult.fraud_probability >= 0.5 ? 'High' : mlResult.fraud_probability >= 0.2 ? 'Medium' : 'Low',
      _id: record._id,
      createdAt: record.createdAt,
      data: {
        prediction: mlResult.prediction,
        fraudProbability: mlResult.fraud_probability,
        isFraud: mlResult.is_fraud,
        riskLevel: mlResult.fraud_probability >= 0.5 ? 'High' : mlResult.fraud_probability >= 0.2 ? 'Medium' : 'Low',
        _id: record._id,
        createdAt: record.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/predictions?limit=20&page=1
 * Retrieves recent prediction records belonging exclusively to req.user.id.
 */
const getPredictionHistory = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const skip = (page - 1) * limit;

    const query = { userId: req.user.id };

    const total = await Prediction.countDocuments(query);
    const predictions = await Prediction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      count: predictions.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: predictions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/predictions/stats
 * Aggregates statistics from MongoDB prediction records belonging exclusively to req.user.id.
 */
const getPredictionStats = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const userIdObj = new mongoose.Types.ObjectId(req.user.id);
    const query = { userId: userIdObj };

    const totalPredictions = await Prediction.countDocuments({ userId: req.user.id });
    const fraudPredictions = await Prediction.countDocuments({ userId: req.user.id, isFraud: true });
    const normalPredictions = totalPredictions - fraudPredictions;

    const avgResult = await Prediction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          avgFraudProbability: { $avg: '$fraudProbability' }
        }
      }
    ]);

    const avgFraudProbability = avgResult.length > 0 ? Number(avgResult[0].avgFraudProbability.toFixed(6)) : 0;

    const statsObj = {
      totalPredictions,
      fraudPredictions,
      normalPredictions,
      avgFraudProbability
    };

    return res.status(200).json({
      success: true,
      stats: statsObj,
      data: statsObj
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrediction,
  getPredictionHistory,
  getPredictionStats
};
