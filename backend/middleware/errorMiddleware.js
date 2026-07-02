/**
 * notFound
 *
 * Middleware that handles requests to routes that do not exist.
 * Must be registered AFTER all valid routes in app.js.
 * Creates an Error object with the requested URL and passes it
 * to the next middleware (errorHandler) with a 404 status code.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found — ${req.originalUrl}`);
  res.status(404);
  next(error); // Forward to errorHandler below
};

/**
 * errorHandler
 *
 * Global error-handling middleware for the entire Express app.
 * Express recognises a middleware as an error handler when it
 * accepts FOUR arguments: (err, req, res, next).
 *
 * Behaviour:
 *  - Uses the status code already set on res (default to 500 if still 200).
 *  - Returns a consistent JSON error envelope.
 *  - In production, hides the stack trace for security.
 */
export const errorHandler = (err, req, res, next) => {
  // If the status is still 200 (success), override to 500 (server error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Include stack trace only in development for easier debugging
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
