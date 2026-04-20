const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const eventRoutes = require('./routes/event');
const preferenceRoutes = require('./routes/preference');
const authRoutes = require('./routes/auth');

const app = express();

// Manual CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

const PORT = process.env.PORT || 5001;
const client = new MongoClient(process.env.MONGO_URI);

async function start() {
  await client.connect();
  const db = client.db('project3');
  console.log('MongoDB connected');

  const usersCol = db.collection('users');

  // ── Passport local strategy ────────────────────────────────────────────────
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await usersCol.findOne({ email: email.toLowerCase() });
        if (!user) return done(null, false, { message: 'No account found with that email' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Incorrect password' });
        return done(null, { _id: user._id.toString(), email: user.email });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await usersCol.findOne(
        { _id: new ObjectId(id) },
        { projection: { password: 0 } }
      );
      done(null, user ? { _id: user._id.toString(), email: user.email } : null);
    } catch (err) {
      done(err);
    }
  });

  // ── Session middleware ─────────────────────────────────────────────────────
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'eventhub-dev-secret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ client, dbName: 'project3' }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // ── Routes ─────────────────────────────────────────────────────────────────
  app.use('/api/auth', authRoutes(db));
  app.use('/api/events', eventRoutes(db));
  app.use('/api/preferences', preferenceRoutes(db));

  // Serve React frontend
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
