const AppError = require('../utils/appError');

const sendDevError = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // api error
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // rendering error
    console.error('**** ERROR ****', err);
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    });
  }
};

const sendProdError = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // 1) api error
    // A) operational, trusted error, send to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) programming or other unknown error, don't send detail to client
    // log error
    console.error('**** ERROR ****', err);

    // send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }

  // 2) rendering error
  // A) operational, trusted error, send to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong prod',
      msg: err.message
    });
  }
  // B) programming or other unknown error, don't send detail to client
  // log error
  console.error('**** ERROR ****', err);

  // send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later'
  });
};

const handleCastErrorDB = (err) => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(msg, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);

  const msg = `Duplicate field value: ${value[0]}. Please use another value`;
  return new AppError(msg, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((item) => item.message);

  const msg = `Invalid input data. ${errors.join(', ')}`;
  return new AppError(msg, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please login again', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendProdError(error, req, res);
  }
};
