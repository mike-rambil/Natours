const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleJWTExpiredError = () =>
  new AppError('Token has expired. Please login again!', 401);
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);
const handleDuplicateFieldsDB = (err) => {
  const value = (err.errmsg && err.errmsg.match(/["'](\\?.)*?\1/)) || [];
  const message =
    value.length > 0
      ? `Duplicate Field Value ${value[0]}. Please use another value.`
      : 'Duplicate field value. Please use another value.';
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // A) -- -- -- -- API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // B) -- -- -- -- Render Error Page
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};
const sendErrorProd = (err, req, res) => {
  // A) -- -- -- -- API
  if (req.originalUrl.startsWith('/api')) {
    // Operational trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Send generic error message to client since
    console.error('ERROR.!.!.!.!.!.!.!.!.!.!.!.!', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
  // B) -- -- -- -- Render Error Page
  if (req.originalUrl.startsWith('/api')) {
    // Operational trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        title: 'Something went wrong!',
        message: err.message,
      });
    }
    // Programming or other unknown error: don't send error details to client
    console.error('ERROR.!.!.!.!.!.!.!.!.!.!.!.!', err);
    return res.status(500).json({
      Title: 'Something went wrong!',
      message: 'Please try again later!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error;
    error.message = err.message;
    if (err.name === 'Cast Error') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'Validation Error') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
