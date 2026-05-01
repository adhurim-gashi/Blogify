function validate(schema) {
  return (req, res, next) => {
    try {
      const data = { ...req.body, ...req.params, ...req.query };
      const result = schema.parse(data);
      req.validated = result;
      next();
    } catch (err) {
      return res.status(400).json({ success: false, error: err.errors || err.message });
    }
  };
}

module.exports = { validate };
