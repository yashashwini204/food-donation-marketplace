const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ngoName: {
      type: String,
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['reserved', 'in_transit', 'delivered', 'cancelled'],
      default: 'reserved',
    },
    claimOtp: {
      type: String,
      required: true,
    },
    etaMinutes: {
      type: Number,
      default: 45,
    },
    transportType: {
      type: String,
      enum: ['Cargo Van', 'Car', 'Motorbike', 'Refrigerated Vehicle', 'Bicycle with Carrier'],
      default: 'Cargo Van',
    },
    notes: {
      type: String,
      default: '',
    },
    pickedUpAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    beneficiariesFed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Claim || mongoose.model('Claim', claimSchema);
