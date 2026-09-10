function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Request validation failed', details: result.error.issues }
      });
    }
    if (source === 'query') {
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true
      });
    } else {
      req[source] = result.data;
    }
    next();
  };
}
module.exports = validate;
