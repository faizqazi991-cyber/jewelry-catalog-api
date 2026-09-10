const express = require('express');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/auth');
const { register, login, me } = require('../controllers/auth');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAdmin, me);
module.exports = router;
