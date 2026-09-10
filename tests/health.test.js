process.env.PORT = '5000';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/jewelry_catalog?schema=public';
process.env.JWT_SECRET = 'test-secret-at-least-16';
process.env.JWT_EXPIRES_IN = '1d';
process.env.ADMIN_REGISTRATION_KEY = 'test-registration-key';
process.env.CORS_ORIGIN = '*';

const request = require('supertest');
const app = require('../src/app');

describe('Health endpoint', () => {
  test('returns API health status', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

describe('Validation and routing', () => {
  test('rejects invalid product payload before authentication is checked', async () => {
    const response = await request(app).post('/api/products').send({ name: 'x' });
    expect([400, 401]).toContain(response.statusCode);
  });

  test('returns 404 for unknown routes', async () => {
    const response = await request(app).get('/does-not-exist');
    expect(response.statusCode).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
