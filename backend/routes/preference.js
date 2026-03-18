const express = require('express');

module.exports = (db) => {
  const router = express.Router();
  const col = db.collection('preference');

  // GET /api/preferences/:email
  router.get('/:email', async (req, res) => {
    try {
      const pref = await col.findOne({ email: req.params.email.toLowerCase() });
      if (!pref) return res.status(404).json({ error: 'Preference not found' });
      res.json(pref);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/preferences
  router.post('/', async (req, res) => {
    try {
      const doc = { ...req.body, email: req.body.email.toLowerCase() };
      const result = await col.insertOne(doc);
      const pref = await col.findOne({ _id: result.insertedId });
      res.status(201).json(pref);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PUT /api/preferences/:email
  router.put('/:email', async (req, res) => {
    try {
      const { _id: _omit, ...update } = req.body; // eslint-disable-line no-unused-vars
      const pref = await col.findOneAndUpdate(
        { email: req.params.email.toLowerCase() },
        { $set: update },
        { returnDocument: 'after' }
      );
      if (!pref) return res.status(404).json({ error: 'Preference not found' });
      res.json(pref);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PUT /api/preferences/:email/comparison
  router.put('/:email/comparison', async (req, res) => {
    try {
      const { comparison_1, comparison_2, comparison_3 } = req.body;
      const pref = await col.findOneAndUpdate(
        { email: req.params.email.toLowerCase() },
        { $set: { comparison_1, comparison_2, comparison_3 } },
        { returnDocument: 'after' }
      );
      if (!pref) return res.status(404).json({ error: 'Preference not found' });
      res.json(pref);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETE /api/preferences/:email
  router.delete('/:email', async (req, res) => {
    try {
      const result = await col.deleteOne({ email: req.params.email.toLowerCase() });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Preference not found' });
      res.json({ message: 'Preference deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
