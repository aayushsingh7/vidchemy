const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.customMessage || "Something went wrong, try again later",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
  });
};

export default globalErrorHandler;