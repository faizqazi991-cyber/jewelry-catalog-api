const prisma = require('../db');
const env = require('../config/env');
const { hashPassword, comparePassword, signToken } = require('../utils/auth');

async function register(req, res) {
  const { email, password, registrationKey } = req.body;
  if (registrationKey !== env.ADMIN_REGISTRATION_KEY) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Invalid registration key' } });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists' } });
  const user = await prisma.user.create({ data: { email, passwordHash: await hashPassword(password), role: 'ADMIN' }, select: { id: true, email: true, role: true } });
  res.status(201).json({ data: { user, token: signToken(user) } });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.passwordHash))) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  const safeUser = { id: user.id, email: user.email, role: user.role };
  res.json({ data: { user: safeUser, token: signToken(safeUser) } });
}

async function me(req, res) {
  res.json({ data: { user: req.user } });
}

module.exports = { register, login, me };
