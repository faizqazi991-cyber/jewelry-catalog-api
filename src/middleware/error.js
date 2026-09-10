function notFound(req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` } });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === 'P2002') return res.status(409).json({ error: { code: 'CONFLICT', message: 'A unique field already exists' } });
  if (err.code === 'P2025') return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
  res.status(err.status || 500).json({ error: { code: err.code || 'INTERNAL_ERROR', message: err.status ? err.message : 'Internal server error' } });
}

module.exports = { notFound, errorHandler };
