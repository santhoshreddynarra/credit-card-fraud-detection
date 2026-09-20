const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const predictionRoutes = require('./routes/predictionRoutes');
const errorHandler = require('./middleware/errorHandler');
const { checkMlHealth } = require('./services/mlService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const mlHealth = await checkMlHealth();
  res.status(200).json({
    status: 'ok',
    ml_service: mlHealth.status === 'healthy' ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/predictions', predictionRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`[Express] Server running on http://127.0.0.1:${PORT}`);
  console.log(`[Express] Connected to Python ML Service at: ${process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000'}`);
});

module.exports = app;
