const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donorName: {
      type: String,
      required: true,
    },
    donorOrgType: {
      type: String,
      default: 'restaurant',
    },
    title: {
      type: String,
      required: [true, 'Please provide listing title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'Cooked Meals',
        'Bakery & Bread',
        'Fresh Produce',
        'Packaged & Dry Goods',
        'Dairy & Desserts',
        'Beverages',
        'Mixed Buffet Surplus',
      ],
      default: 'Cooked Meals',
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: 1,
    },
    quantityUnit: {
      type: String,
      enum: ['kg', 'meals', 'boxes', 'trays', 'crates', 'liters'],
      default: 'meals',
    },
    estimatedServings: {
      type: Number,
      required: [true, 'Please estimate number of people this can feed'],
      min: 1,
    },
    dietaryType: {
      type: String,
      enum: ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Eggitarian', 'Jain Friendly'],
      default: 'Vegetarian',
    },
    allergens: {
      type: [String],
      default: ['None reported'],
    },
    storageCondition: {
      type: String,
      enum: [
        'Hot (Keep > 60°C)',
        'Cold / Refrigerated (< 4°C)',
        'Frozen (< -18°C)',
        'Room Temperature / Ambient',
      ],
      default: 'Hot (Keep > 60°C)',
    },
    cookedOrPackedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Please specify expiry timestamp'],
    },
    pickupWindowStart: {
      type: Date,
      default: Date.now,
    },
    pickupWindowEnd: {
      type: Date,
      required: [true, 'Please specify pickup end time'],
    },
    pickupAddress: {
      street: { type: String, required: true },
      city: { type: String, default: 'Metro City' },
      landmark: { type: String, default: '' },
      lat: { type: Number, default: 37.7749 },
      lng: { type: Number, default: -122.4194 },
    },
    contactPerson: {
      type: String,
      default: 'Duty Manager',
    },
    contactPhone: {
      type: String,
      default: '+1 (555) 987-6543',
    },
    handlingNotes: {
      type: String,
      default: 'Clean containers required. Insulated transport bags recommended.',
    },
    foodSafetyVerified: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'picked_up', 'delivered', 'expired', 'cancelled'],
      default: 'available',
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimedByName: {
      type: String,
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    claimOtp: {
      type: String,
      default: null,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    etaMinutes: {
      type: Number,
      default: null,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    volunteerName: {
      type: String,
      default: null,
    },
    beneficiariesServed: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.FoodListing || mongoose.model('FoodListing', foodListingSchema);
