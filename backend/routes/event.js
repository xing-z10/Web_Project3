const express = require('express');

module.exports = (db) => {
  const router = express.Router();
  const col = db.collection('event');

  function toApiDoc(doc) {
    if (!doc) return null;
    const { location_city, location_venue, source, price, ...rest } = doc;
    return {
      ...rest,
      location: {
        address: location_venue || '',
        city: location_city || '',
      },
      isFree: price === 0,
      price: price || 0,
      sourceUrl: source || '',
      sourcePlatform: '',
    };
  }

  // GET /api/events/today
  // Frontend sends today's dateFrom and dateTo, backend matches against DB
  router.get('/today', async (req, res) => {
    try {
      const { city, category, dateFrom, dateTo } = req.query;
      const filter = {};

      if (dateFrom && dateTo) {
        filter.date = { $gte: new Date(dateFrom), $lt: new Date(dateTo) };
      }
      if (city) filter.location_city = { $regex: city, $options: 'i' };
      if (category) filter.category = { $regex: category, $options: 'i' };

      let results = await col.aggregate([
        { $match: filter },
        { $sample: { size: 3 } },
      ]).toArray();

      // Fallback 1: drop city filter
      if (results.length === 0 && city) {
        delete filter.location_city;
        results = await col.aggregate([
          { $match: filter },
          { $sample: { size: 3 } },
        ]).toArray();
      }

      // Fallback 2: drop category filter
      if (results.length === 0 && category) {
        delete filter.category;
        results = await col.aggregate([
          { $match: filter },
          { $sample: { size: 3 } },
        ]).toArray();
      }

      if (results.length === 0) return res.status(404).json({ error: 'No events found for today' });
      res.json(results.map(toApiDoc));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/events — list with optional filters + pagination
  router.get('/', async (req, res) => {
    try {
      const {
        city, category, isFree, dateFrom, dateTo,
        tags, search, random, page = 1, limit = 20,
      } = req.query;

      const filter = {};

      if (city) filter['location_city'] = { $regex: city, $options: 'i' };
      if (category) filter.category = { $regex: category, $options: 'i' };
      if (isFree !== undefined && isFree !== '') {
        filter.price = isFree === 'true' ? 0 : { $gt: 0 };
      }
      if (tags) {
        const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
        if (tagList.length) filter.tags = { $in: tagList };
      }
      if (dateFrom || dateTo) {
        filter.date = {};
        if (dateFrom) filter.date.$gte = new Date(dateFrom);
        if (dateTo) filter.date.$lte = new Date(dateTo);
      }
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location_venue: { $regex: search, $options: 'i' } },
          { location_city: { $regex: search, $options: 'i' } },
        ];
      }

      if (random === 'true') {
        const results = await col.aggregate([
          { $match: filter },
          { $sample: { size: 1 } },
        ]).toArray();
        return res.json(toApiDoc(results[0]) || null);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [events, total] = await Promise.all([
        col.find(filter).sort({ date: 1 }).skip(skip).limit(parseInt(limit)).toArray(),
        col.countDocuments(filter),
      ]);

      res.json({ events: events.map(toApiDoc), total, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/events/:id
  router.get('/:id', async (req, res) => {
    try {
      const event = await col.findOne({ _id: req.params.id });
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.json(toApiDoc(event));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/events
  router.post('/', async (req, res) => {
    try {
      const { title, date, category, location, sourceUrl } = req.body;
      if (!title || !date || !category || !location || !sourceUrl) {
        return res.status(400).json({ error: 'title, date, category, location, and sourceUrl are required' });
      }
      const doc = {
        title: req.body.title,
        category: req.body.category,
        date: new Date(req.body.date),
        time: req.body.time || '',
        location_city: req.body.location?.city || '',
        location_venue: req.body.location?.address || '',
        price: req.body.isFree ? 0 : (req.body.price || 0),
        source: req.body.sourceUrl || '',
        description: req.body.description || '',
        tags: req.body.tags || [],
        views: 0,
        saves: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await col.insertOne(doc);
      const created = await col.findOne({ _id: result.insertedId });
      res.status(201).json(toApiDoc(created));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PUT /api/events/:id
  router.put('/:id', async (req, res) => {
    try {
      const update = {};
      if (req.body.title) update.title = req.body.title;
      if (req.body.category) update.category = req.body.category;
      if (req.body.date) update.date = new Date(req.body.date);
      if (req.body.location?.city !== undefined) update.location_city = req.body.location.city;
      if (req.body.location?.address !== undefined) update.location_venue = req.body.location.address;
      if (req.body.price !== undefined) update.price = req.body.price;
      if (req.body.sourceUrl !== undefined) update.source = req.body.sourceUrl;
      update.updatedAt = new Date();

      const event = await col.findOneAndUpdate(
        { _id: req.params.id },
        { $set: update },
        { returnDocument: 'after' }
      );
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.json(toApiDoc(event));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETE /api/events/:id
  router.delete('/:id', async (req, res) => {
    try {
      const result = await col.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Event not found' });
      res.json({ message: 'Event deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/events/:id/view
  router.post('/:id/view', async (req, res) => {
    try {
      const event = await col.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { views: 1 } },
        { returnDocument: 'after' }
      );
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.json({ views: event.views });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};