function responseWrapper(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'success')) {
      const normalized = { ...body };
      if (!Object.prototype.hasOwnProperty.call(normalized, 'data')) {
        normalized.data = null;
      }
      if (!Object.prototype.hasOwnProperty.call(normalized, 'message')) {
        normalized.message = normalized.error || (normalized.success ? 'OK' : 'Request failed');
      }
      return originalJson(normalized);
    }
    return originalJson({ success: true, data: body, message: 'OK' });
  };
  next();
}

module.exports = { responseWrapper };
