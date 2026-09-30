const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const configuredJwtSecret = process.env.JWT_SECRET;
const jwtSecret =
  configuredJwtSecret ||
  (process.env.NODE_ENV === 'production' ? null : crypto.randomBytes(64).toString('hex'));

if (!jwtSecret) {
  throw new Error('JWT_SECRET must be configured in production');
}

if (!configuredJwtSecret) {
  console.warn('JWT_SECRET is not configured; admin tokens will expire when the backend restarts.');
}

const hashPassword = (password) => bcrypt.hash(password, 12);

const verifyPassword = async (password, storedPassword) => {
  if (/^\$2[aby]\$/.test(storedPassword)) {
    return { valid: await bcrypt.compare(password, storedPassword), needsRehash: false };
  }

  return { valid: password === storedPassword, needsRehash: password === storedPassword };
};

const createAdminToken = (admin) =>
  jwt.sign(
    { username: admin.username },
    jwtSecret,
    { subject: String(admin._id), expiresIn: '1h', algorithm: 'HS256' }
  );

const requireAdmin = (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Admin authentication required' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      return res.status(401).json({ message: 'Invalid admin token' });
    }

    req.adminId = payload.sub;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
};

const matchesInitKey = (providedKey) => {
  const configuredKey = process.env.ADMIN_INIT_KEY;
  if (!configuredKey || configuredKey === 'your_initial_admin_key_here' || !providedKey) {
    return false;
  }

  const expected = Buffer.from(configuredKey);
  const provided = Buffer.from(providedKey);
  return expected.length === provided.length && crypto.timingSafeEqual(expected, provided);
};

module.exports = {
  createAdminToken,
  hashPassword,
  matchesInitKey,
  requireAdmin,
  verifyPassword
};
