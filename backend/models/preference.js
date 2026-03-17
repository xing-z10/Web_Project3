const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }],

    excludedCategories: [{
      type: String,
      enum: ['Music', 'Tech', 'Art', 'Food & Drink', 'Sports', 'Film', 'Market', 'Community', 'Other'],
    }],

    preferredCategories: [{
      type: String,
      enum: ['Music', 'Tech', 'Art', 'Food & Drink', 'Sports', 'Film', 'Market', 'Community', 'Other'],
    }],

    lastFilters: {
      city:     { type: String,  default: '' },
      isFree:   { type: Boolean, default: null },
      dateRange: {
        from: { type: Date, default: null },
        to:   { type: Date, default: null },
      },
      platform: { type: String, default: '' },
    },

    comparisonHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Preference', preferenceSchema, 'preference');