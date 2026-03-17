const express = require('express');
const router = express.Router();
const Preference = require('../models/preference');

// GET /api/preferences/:email
router.get('/:email', async (req, res) => {
  try {
    const pref = await Preference.findOne({ email: req.params.email.toLowerCase() });
    if (!pref) return res.status(404).json({ error: 'Preference not found' });
    res.json(pref);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/preferences
router.post('/', async (req, res) => {
  try {
    const pref = await Preference.create(req.body);
    res.status(201).json(pref);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/preferences/:email
// Update any preference fields
router.put('/:email', async (req, res) => {
  try {
    const pref = await Preference.findOneAndUpdate(
      { email: req.params.email.toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    );
    if (!pref) return res.status(404).json({ error: 'Preference not found' });
    res.json(pref);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/preferences/:email/comparison
// Update comparison_1/2/3 with up to 3 event ids
router.put('/:email/comparison', async (req, res) => {
  try {
    const { comparison_1, comparison_2, comparison_3 } = req.body;
    const pref = await Preference.findOneAndUpdate(
      { email: req.params.email.toLowerCase() },
      { comparison_1, comparison_2, comparison_3 },
      { new: true, runValidators: true }
    );
    if (!pref) return res.status(404).json({ error: 'Preference not found' });
    res.json(pref);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/preferences/:email/favorites
// Toggle favorite — stores event id in comparison slots
router.put('/:email/favorites', async (req, res) => {
  try {
    const { eventId } = req.body;
    const pref = await Preference.findOne({ email: req.params.email.toLowerCase() });
    if (!pref) return res.status(404).json({ error: 'Preference not found' });

    // Use comparison_1/2/3 as favorite slots
    const slots = ['comparison_1', 'comparison_2', 'comparison_3'];
    const existingSlot = slots.find(s => pref[s] === eventId);

    if (existingSlot) {
      pref[existingSlot] = null; // Remove if already saved
    } else {
      const emptySlot = slots.find(s => !pref[s]);
      if (emptySlot) pref[emptySlot] = eventId;
    }

    await pref.save();
    res.json(pref);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/preferences/:email
router.delete('/:email', async (req, res) => {
  try {
    const pref = await Preference.findOneAndDelete({ email: req.params.email.toLowerCase() });
    if (!pref) return res.status(404).json({ error: 'Preference not found' });
    res.json({ message: 'Preference deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;