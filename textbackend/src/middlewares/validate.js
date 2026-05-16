function validate(schema) {
  return (req, res, next) => {
    try {
      const data = { ...req.body, ...req.params, ...req.query };
      const result = schema.parse(data);
      req.validated = result;
      next();
    } catch (err) {
      // Handle Zod validation errors
      if (err.issues) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: err.issues
        });
      }
      return res.status(400).json({ success: false, error: err.message || 'Validation failed' });
    }
  };
}

module.exports = { validate };
