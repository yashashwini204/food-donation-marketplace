const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name or representative name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['donor', 'ngo', 'volunteer', 'admin'],
      default: 'donor',
    },
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    orgType: {
      type: String,
      enum: [
        'restaurant',
        'hotel_banquet',
        'caterer',
        'supermarket',
        'bakery',
        'corporate_cafeteria',
        'ngo_shelter',
        'orphanage',
        'community_kitchen',
        'elderly_care',
        'volunteer_network',
        'other',
      ],
      default: 'restaurant',
    },
    phone: {
      type: String,
      default: '+1 (555) 019-2834',
    },
    address: {
      type: String,
      default: 'Downtown Food District',
    },
    city: {
      type: String,
      default: 'Metro City',
    },
    location: {
      lat: { type: Number, default: 37.7749 },
      lng: { type: Number, default: -122.4194 },
    },
    verified: {
      type: Boolean,
      default: true,
    },
    regNumber: {
      type: String,
      default: 'FSSAI-8829-REG',
    },
    avatar: {
      type: String,
      default: '',
    },
    stats: {
      mealsRescued: { type: Number, default: 0 },
      kgSaved: { type: Number, default: 0 },
      co2SavedKg: { type: Number, default: 0 },
      listingsCount: { type: Number, default: 0 },
      claimsCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
