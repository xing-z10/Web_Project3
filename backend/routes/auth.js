const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');

module.exports = (db) => {
  const router = express.Router();
  const col = db.collection('users');

  // POST /api/auth/register
  router.post('/register', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      const existing = await col.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ error: 'An account with that email already exists' });
      }
      const hash = await bcrypt.hash(password, 12);
      const result = await col.insertOne({
        email: email.toLowerCase(),
        password: hash,
        createdAt: new Date(),
      });
      const user = { _id: result.insertedId.toString(), email: email.toLowerCase() };
      req.login(user, (err) => {
        if (err) return res.status(500).json({ error: 'Login after registration failed' });
        res.status(201).json({ email: user.email });
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/auth/login
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials' });
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        res.json({ email: user.email });
      });
    })(req, res, next);
  });

  // POST /api/auth/logout
  router.post('/logout', (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Logged out' });
    });
  });

  // GET /api/auth/me — returns the current session user
  router.get('/me', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not authenticated' });
    res.json({ email: req.user.email });
  });

  return router;
};
