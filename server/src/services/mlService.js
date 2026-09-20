const axios = require('axios');

const getMlServiceUrl = () => {
  return (process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000').replace(/\/+$/, '');
};

/**
 * Sends transaction data to Python ML Service for inference.
 * @param {Object} transactionData - Key-value pair of 30 transaction features.
 * @returns {Promise<Object>} ML prediction result object.
 */
const predictFraud = async (transactionData) => {
  const baseUrl = getMlServiceUrl();
  const url = `${baseUrl}/predict`;

  try {
    const response = await axios.post(url, transactionData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Python API responded with an error status (e.g., 400 Bad Request)
      const message = error.response.data?.error || 'Python ML service returned an error.';
      const err = new Error(message);
      err.statusCode = error.response.status;
      throw err;
    } else if (error.request) {
      // Python API was unreachable or timed out
      const err = new Error('ML prediction service is currently unavailable or un-reachable.');
      err.statusCode = 530;
      throw err;
    } else {
      const err = new Error(`ML service request error: ${error.message}`);
      err.statusCode = 500;
      throw err;
    }
  }
};

/**
 * Checks health of the Python ML Service.
 * @returns {Promise<Object>} Health check response.
 */
const checkMlHealth = async () => {
  const baseUrl = getMlServiceUrl();
  const url = `${baseUrl}/health`;

  try {
    const response = await axios.get(url, { timeout: 3000 });
    return response.data;
  } catch (error) {
    return {
      status: 'unavailable',
      message: 'Python ML service health check failed'
    };
  }
};

module.exports = {
  predictFraud,
  checkMlHealth
};
