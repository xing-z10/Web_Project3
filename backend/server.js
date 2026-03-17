const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const eventRoutes = require('./routes/event');
const preferenceRoutes = require('./routes/preference');

const app = express();

// Manual CORS headers (no cors library)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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

  app.use('/api/events', eventRoutes(db));
  app.use('/api/preferences', preferenceRoutes(db));

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});