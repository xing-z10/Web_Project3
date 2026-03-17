const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const eventRoutes = require('./routes/event');
const preferenceRoutes = require('./routes/preference');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Test route
app.get('/test', (req, res) => res.json({ message: 'Server is working' }));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/preferences', preferenceRoutes);

// Connect to MongoDB then start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));