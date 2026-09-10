const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const { notFound, errorHandler } = require('./middleware/error');
const env = require('./config/env');

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',').map(x => x.trim()) }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

app.get('/', (req, res) => res.json({
  name: 'Jewelry Catalog API',
  status: 'running',
  version: '1.0.0',
  documentation: '/docs',
  health: '/health'
}));
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'jewelry-catalog-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const openapiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
if (fs.existsSync(openapiPath)) app.use('/docs', swaggerUi.serve, swaggerUi.setup(yaml.load(fs.readFileSync(openapiPath, 'utf8'))));

app.use(notFound);
app.use(errorHandler);
module.exports = app;
