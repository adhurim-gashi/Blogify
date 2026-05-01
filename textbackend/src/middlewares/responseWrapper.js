function responseWrapper(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'success')) {
      return originalJson(body);
    }
    return originalJson({ success: true, data: body });
  };
  next();
}

module.exports = { responseWrapper };
