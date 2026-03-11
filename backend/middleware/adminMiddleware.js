const authenticate = require('./authMiddleware');

const authorizeAdmin = (req, res, next) => {
  // first ensure jwt is valid
  authenticate(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  });
};

module.exports = authorizeAdmin;