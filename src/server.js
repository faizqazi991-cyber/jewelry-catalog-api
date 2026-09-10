const app = require('./app');
const env = require('./config/env');
const prisma = require('./db');

const server = app.listen(env.PORT, () => console.log(`API running on port ${env.PORT}`));

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);
  server.close(async () => { await prisma.$disconnect(); process.exit(0); });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
