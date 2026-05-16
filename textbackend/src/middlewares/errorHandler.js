function errorHandler(err, req, res, _next) {
  console.error(err);
  const status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 'P2002') {
    message = 'A record with this value already exists';
  }
  if (err.code === 'P2025') {
    message = 'Record not found';
  }

  res.status(status).json({ success: false, data: null, message, error: message });
}

module.exports = { errorHandler };
