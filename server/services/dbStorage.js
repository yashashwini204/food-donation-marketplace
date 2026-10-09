const fs = require('fs');
const path = require('path');
const { getIsMongoConnected } = require('../config/db');
const User = require('../models/User');
const FoodListing = require('../models/FoodListing');
const Claim = require('../models/Claim');
const { getSeedData } = require('../data/seedData');

const DATA_FILE = path.join(__dirname, '..', 'data', 'db_store.json');

// Local in-memory / JSON persistence storage for resilient fallback
let memoryStore = {
  users: [],
  listings: [],
  claims: [],
};

// Initialize or load fallback data
const initFallbackStore = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      memoryStore = JSON.parse(raw);
    } else {
      memoryStore = getSeedData();
      saveFallbackStore();
    }
  } catch (err) {
    console.error('Error loading fallback db_store.json, resetting with fresh seeds:', err.message);
    memoryStore = getSeedData();
    saveFallbackStore();
  }
};

// Auto-seed real MongoDB collections if empty
const seedMongoIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('MongoDB collections are empty. Auto-seeding initial users, listings & claims...');
      const seeds = getSeedData();
      await User.insertMany(seeds.users);
      await FoodListing.insertMany(seeds.listings);
      await Claim.insertMany(seeds.claims);
      console.log('MongoDB successfully seeded with realistic sample data!');
    }
  } catch (err) {
    console.log('Notice: Auto-seed skipped or error:', err.message);
  }
};

const saveFallbackStore = () => {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save fallback db_store.json:', err.message);
  }
};

// Initialize fallback on module load
initFallbackStore();

// Generate MongoDB-like 24-char hex ID
const generateId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomHex = Math.random().toString(16).substring(2, 18).padEnd(16, '0');
  return (timestamp + randomHex).substring(0, 24);
};

// Service layer functions
const dbService = {
  // USERS
  async findUserByEmail(email) {
    if (getIsMongoConnected()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (getIsMongoConnected()) {
      return await User.findById(id).select('-password');
    }
    const user = memoryStore.users.find((u) => String(u._id) === String(id));
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  },

  async createUser(userData) {
    if (getIsMongoConnected()) {
      return await User.create(userData);
    }
    const newUser = {
      _id: generateId(),
      stats: { mealsRescued: 0, kgSaved: 0, co2SavedKg: 0, listingsCount: 0, claimsCount: 0 },
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...userData,
    };
    memoryStore.users.push(newUser);
    saveFallbackStore();
    return newUser;
  },

  async updateUserStats(userId, deltaStats) {
    if (getIsMongoConnected()) {
      return await User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            'stats.mealsRescued': deltaStats.mealsRescued || 0,
            'stats.kgSaved': deltaStats.kgSaved || 0,
            'stats.co2SavedKg': deltaStats.co2SavedKg || 0,
            'stats.listingsCount': deltaStats.listingsCount || 0,
            'stats.claimsCount': deltaStats.claimsCount || 0,
          },
        },
        { new: true }
      );
    }
    const userIndex = memoryStore.users.findIndex((u) => String(u._id) === String(userId));
    if (userIndex !== -1) {
      const u = memoryStore.users[userIndex];
      u.stats = u.stats || { mealsRescued: 0, kgSaved: 0, co2SavedKg: 0, listingsCount: 0, claimsCount: 0 };
      u.stats.mealsRescued += deltaStats.mealsRescued || 0;
      u.stats.kgSaved += deltaStats.kgSaved || 0;
      u.stats.co2SavedKg += deltaStats.co2SavedKg || 0;
      u.stats.listingsCount += deltaStats.listingsCount || 0;
      u.stats.claimsCount += deltaStats.claimsCount || 0;
      u.updatedAt = new Date().toISOString();
      saveFallbackStore();
      return u;
    }
    return null;
  },

  // LISTINGS
  async findListings(query = {}) {
    if (getIsMongoConnected()) {
      const mongoQuery = {};
      if (query.category && query.category !== 'All') {
        mongoQuery.category = query.category;
      }
      if (query.dietaryType && query.dietaryType !== 'All') {
        mongoQuery.dietaryType = query.dietaryType;
      }
      if (query.status && query.status !== 'All') {
        mongoQuery.status = query.status;
      }
      if (query.donorId) {
        mongoQuery.donor = query.donorId;
      }
      if (query.claimedBy) {
        mongoQuery.claimedBy = query.claimedBy;
      }
      if (query.isUrgent === 'true') {
        mongoQuery.isUrgent = true;
      }
      return await FoodListing.find(mongoQuery).sort({ createdAt: -1 });
    }

    // In-memory filter
    let results = [...memoryStore.listings];
    if (query.category && query.category !== 'All') {
      results = results.filter((item) => item.category === query.category);
    }
    if (query.dietaryType && query.dietaryType !== 'All') {
      results = results.filter((item) => item.dietaryType === query.dietaryType);
    }
    if (query.status && query.status !== 'All') {
      results = results.filter((item) => item.status === query.status);
    }
    if (query.donorId) {
      results = results.filter((item) => String(item.donor) === String(query.donorId));
    }
    if (query.claimedBy) {
      results = results.filter((item) => String(item.claimedBy) === String(query.claimedBy));
    }
    if (query.isUrgent === 'true') {
      results = results.filter((item) => item.isUrgent === true);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(s) ||
          item.donorName.toLowerCase().includes(s) ||
          (item.description && item.description.toLowerCase().includes(s)) ||
          item.pickupAddress.street.toLowerCase().includes(s)
      );
    }

    // Dynamic urgency update based on expiry time
    const now = Date.now();
    results.forEach((item) => {
      const diffMs = new Date(item.expiresAt).getTime() - now;
      if (diffMs > 0 && diffMs <= 3 * 3600000) {
        item.isUrgent = true;
      } else if (diffMs <= 0 && item.status === 'available') {
        item.status = 'expired';
      }
    });

    // Sort newest first
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return results;
  },

  async findListingById(id) {
    if (getIsMongoConnected()) {
      return await FoodListing.findById(id);
    }
    return memoryStore.listings.find((item) => String(item._id) === String(id)) || null;
  },

  async createListing(data) {
    if (getIsMongoConnected()) {
      return await FoodListing.create(data);
    }
    const newListing = {
      _id: generateId(),
      status: 'available',
      claimedBy: null,
      claimedByName: null,
      claimedAt: null,
      claimOtp: null,
      otpVerified: false,
      etaMinutes: null,
      volunteer: null,
      volunteerName: null,
      beneficiariesServed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    memoryStore.listings.unshift(newListing);
    saveFallbackStore();
    return newListing;
  },

  async updateListing(id, updateData) {
    if (getIsMongoConnected()) {
      return await FoodListing.findByIdAndUpdate(id, updateData, { new: true });
    }
    const idx = memoryStore.listings.findIndex((item) => String(item._id) === String(id));
    if (idx !== -1) {
      memoryStore.listings[idx] = {
        ...memoryStore.listings[idx],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      saveFallbackStore();
      return memoryStore.listings[idx];
    }
    return null;
  },

  async deleteListing(id) {
    if (getIsMongoConnected()) {
      return await FoodListing.findByIdAndDelete(id);
    }
    const idx = memoryStore.listings.findIndex((item) => String(item._id) === String(id));
    if (idx !== -1) {
      const deleted = memoryStore.listings.splice(idx, 1)[0];
      saveFallbackStore();
      return deleted;
    }
    return null;
  },

  // CLAIMS
  async createClaim(claimData) {
    if (getIsMongoConnected()) {
      return await Claim.create(claimData);
    }
    const newClaim = {
      _id: generateId(),
      status: 'reserved',
      pickedUpAt: null,
      deliveredAt: null,
      beneficiariesFed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...claimData,
    };
    memoryStore.claims.unshift(newClaim);
    saveFallbackStore();
    return newClaim;
  },

  async findClaims(filter = {}) {
    if (getIsMongoConnected()) {
      const q = {};
      if (filter.ngoId) q.ngo = filter.ngoId;
      if (filter.donorId) q.donor = filter.donorId;
      if (filter.volunteerId) q.volunteer = filter.volunteerId;
      return await Claim.find(q).sort({ createdAt: -1 });
    }
    let results = [...memoryStore.claims];
    if (filter.ngoId) {
      results = results.filter((c) => String(c.ngo) === String(filter.ngoId));
    }
    if (filter.donorId) {
      results = results.filter((c) => String(c.donor) === String(filter.donorId));
    }
    if (filter.volunteerId) {
      results = results.filter((c) => String(c.volunteer) === String(filter.volunteerId));
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findClaimById(id) {
    if (getIsMongoConnected()) {
      return await Claim.findById(id);
    }
    return memoryStore.claims.find((c) => String(c._id) === String(id)) || null;
  },

  async updateClaim(id, updateData) {
    if (getIsMongoConnected()) {
      return await Claim.findByIdAndUpdate(id, updateData, { new: true });
    }
    const idx = memoryStore.claims.findIndex((c) => String(c._id) === String(id));
    if (idx !== -1) {
      memoryStore.claims[idx] = {
        ...memoryStore.claims[idx],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      saveFallbackStore();
      return memoryStore.claims[idx];
    }
    return null;
  },

  // PLATFORM IMPACT ANALYTICS
  async getImpactAnalytics() {
    let listings = [];
    let users = [];
    let claims = [];

    if (getIsMongoConnected()) {
      listings = await FoodListing.find({});
      users = await User.find({});
      claims = await Claim.find({});
    } else {
      listings = memoryStore.listings;
      users = memoryStore.users;
      claims = memoryStore.claims;
    }

    let totalMealsRescued = 0;
    let totalKgRescued = 0;
    let activeDonations = 0;
    let completedRescues = 0;
    let totalBeneficiaries = 0;

    listings.forEach((item) => {
      if (item.status === 'delivered') {
        completedRescues += 1;
        totalMealsRescued += item.estimatedServings || 0;
        const kg = item.quantityUnit === 'kg' ? item.quantity : (item.quantity * 0.45);
        totalKgRescued += kg;
        totalBeneficiaries += item.beneficiariesServed || item.estimatedServings || 0;
      } else if (item.status === 'available' || item.status === 'reserved' || item.status === 'picked_up') {
        activeDonations += 1;
      }
    });

    // Add baseline seeded rescued metrics
    totalMealsRescued = Math.max(totalMealsRescued + 1450, 1500);
    totalKgRescued = Math.round(Math.max(totalKgRescued + 725, 750));
    // Carbon emission factor: ~2.5 kg CO2e saved per 1 kg food waste diverted from landfill
    const co2SavedKg = Math.round(totalKgRescued * 2.5);

    const activeDonors = users.filter((u) => u.role === 'donor').length;
    const verifiedNgos = users.filter((u) => u.role === 'ngo').length;
    const volunteerCouriers = users.filter((u) => u.role === 'volunteer').length;

    return {
      totalMealsRescued,
      totalKgRescued,
      co2SavedKg,
      activeDonations,
      completedRescues,
      totalBeneficiaries: Math.max(totalBeneficiaries + 1380, 1400),
      activeDonors,
      verifiedNgos,
      volunteerCouriers,
      topDonors: [
        { name: 'The Royal Orchid Banquet Hall', meals: 680, category: 'Buffet & Banquets', badge: 'Hero Donor 🏆' },
        { name: 'GreenValley Fresh Supermarket', meals: 520, category: 'Produce & Dairy', badge: 'Zero-Waste Champion 🌱' },
        { name: 'Artisan Daily Hearth & Bakery', meals: 380, category: 'Bakery & Bread', badge: 'Community Partner 🥖' },
        { name: 'TechPark Horizon Cafeteria', meals: 290, category: 'Corporate Catering', badge: 'Silver Rescuer 💼' },
      ],
      recentRescues: listings.filter((l) => l.status === 'delivered' || l.status === 'reserved').slice(0, 5),
    };
  },

  async resetToSeeds() {
    if (getIsMongoConnected()) {
      await User.deleteMany({});
      await FoodListing.deleteMany({});
      await Claim.deleteMany({});
      const seeds = getSeedData();
      await User.insertMany(seeds.users);
      await FoodListing.insertMany(seeds.listings);
      await Claim.insertMany(seeds.claims);
    }
    memoryStore = getSeedData();
    saveFallbackStore();
    return { message: 'Database successfully reset to seed data' };
  },
  seedMongoIfEmpty,
};

module.exports = dbService;
