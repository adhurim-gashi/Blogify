function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 'P2002') {
    const statusCode = 409;
    message = 'A record with this value already exists';
    return res.status(statusCode).json({ success: false, data: null, message, error: message });
  }
  if (err.code === 'P2025') {
    const statusCode = 404;
    message = 'Record not found';
    return res.status(statusCode).json({ success: false, data: null, message, error: message });
  }

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ success: false, data: null, message, error: message });
}

module.exports = { errorHandler };
