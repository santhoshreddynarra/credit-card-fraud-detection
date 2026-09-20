/**
 * Centralized Express Error Handling Middleware.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}: ${err.message}`);

  const statusCode = err.statusCode || res.statusCode !== 200 ? (err.statusCode || res.statusCode) : 500;
  
  res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
