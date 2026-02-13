const User = require('../models/User');

// Dev bypass: accept "dummy-token" when Firebase is not configured
const DEV_DUMMY_TOKEN = 'dummy-token';
const DEV_USER_ID = 'dev-user-001';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    // Dev bypass: allow dummy-token when Firebase is disabled
    if (token === DEV_DUMMY_TOKEN) {
      let user = await User.findOne({ id: DEV_USER_ID });
      if (!user) {
        user = await User.create({
          id: DEV_USER_ID,
          email: 'dev@example.com',
          name: 'Dev User'
        });
      }
      req.user = user;
      req.firebaseUid = DEV_USER_ID;
      return next();
    }

    // Firebase verification (when configured)
    try {
      const { verifyIdToken } = require('../config/firebase');
      const decodedToken = await verifyIdToken(token);

      let user = await User.findOne({ id: decodedToken.uid });
      if (!user) {
        user = await User.create({
          id: decodedToken.uid,
          email: decodedToken.email || '',
          name: decodedToken.name || decodedToken.email || 'User'
        });
      }

      req.user = user;
      req.firebaseUid = decodedToken.uid;
      next();
    } catch (firebaseError) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticate };
