const express = require('express');
const router = express.Router();
const dbService = require('../services/dbStorage');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Generate 4-digit OTP for secure handoff
const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// @route   GET /api/listings
// @desc    Get all listings with optional filtering
router.get('/', async (req, res) => {
  try {
    const listings = await dbService.findListings(req.query);
    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error('Fetch listings error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching listings' });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await dbService.findListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Food listing not found' });
    }
    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error('Fetch single listing error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching listing' });
  }
});

// @route   POST /api/listings
// @desc    Create a new excess food listing (Donor only)
router.post('/', protect, authorizeRoles('donor', 'admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      quantity,
      quantityUnit,
      estimatedServings,
      dietaryType,
      allergens,
      storageCondition,
      cookedOrPackedAt,
      expiresAt,
      pickupWindowStart,
      pickupWindowEnd,
      pickupAddress,
      contactPerson,
      contactPhone,
      handlingNotes,
      foodSafetyVerified,
      images,
    } = req.body;

    if (!title || !quantity || !estimatedServings || !expiresAt || !pickupWindowEnd) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, quantity, estimated servings, expiry time, and pickup window',
      });
    }

    // Determine if expires within 3 hours
    const expiryTime = new Date(expiresAt).getTime();
    const isUrgent = expiryTime - Date.now() <= 3 * 3600000;

    // Use default realistic food image if none provided
    const defaultImagesByCategory = {
      'Cooked Meals': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      'Bakery & Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      'Fresh Produce': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80',
      'Packaged & Dry Goods': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      'Dairy & Desserts': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80',
      'Mixed Buffet Surplus': 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
    };

    const finalImages =
      images && images.length > 0
        ? images
        : [defaultImagesByCategory[category] || defaultImagesByCategory['Cooked Meals']];

    const newListing = await dbService.createListing({
      donor: req.user._id,
      donorName: req.user.organizationName || req.user.name,
      donorOrgType: req.user.orgType || 'restaurant',
      title,
      description: description || 'Excess food prepared today, packed fresh and safe for immediate NGO distribution.',
      category: category || 'Cooked Meals',
      quantity: Number(quantity),
      quantityUnit: quantityUnit || 'meals',
      estimatedServings: Number(estimatedServings),
      dietaryType: dietaryType || 'Vegetarian',
      allergens: allergens || ['None reported'],
      storageCondition: storageCondition || 'Hot (Keep > 60°C)',
      cookedOrPackedAt: cookedOrPackedAt || new Date().toISOString(),
      expiresAt,
      pickupWindowStart: pickupWindowStart || new Date().toISOString(),
      pickupWindowEnd,
      pickupAddress: pickupAddress || {
        street: req.user.address || '123 Market Street',
        city: req.user.city || 'Metro City',
        landmark: 'Near Main Entrance',
        lat: req.user.location?.lat || 37.7749,
        lng: req.user.location?.lng || -122.4194,
      },
      contactPerson: contactPerson || req.user.name,
      contactPhone: contactPhone || req.user.phone,
      handlingNotes: handlingNotes || 'Bring suitable food storage containers.',
      foodSafetyVerified: Boolean(foodSafetyVerified),
      images: finalImages,
      isUrgent,
      status: 'available',
    });

    // Increment donor listings count
    await dbService.updateUserStats(req.user._id, { listingsCount: 1 });

    res.status(201).json({
      success: true,
      message: 'Excess food listing published successfully! Nearby NGOs notified.',
      data: newListing,
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ success: false, message: 'Server error creating listing' });
  }
});

// @route   POST /api/listings/:id/claim
// @desc    NGO claims an available excess food listing
router.post('/:id/claim', protect, authorizeRoles('ngo', 'admin'), async (req, res) => {
  try {
    const listing = await dbService.findListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Listing is already ${listing.status}. Cannot be claimed again.`,
      });
    }

    const { etaMinutes = 45, transportType = 'Cargo Van', notes = '' } = req.body;
    const otp = generateOtp();

    // Update listing status to reserved with OTP
    const updatedListing = await dbService.updateListing(req.params.id, {
      status: 'reserved',
      claimedBy: req.user._id,
      claimedByName: req.user.organizationName || req.user.name,
      claimedAt: new Date().toISOString(),
      claimOtp: otp,
      etaMinutes: Number(etaMinutes),
      otpVerified: false,
    });

    // Create a matching claim transaction record
    const newClaim = await dbService.createClaim({
      listing: listing._id,
      ngo: req.user._id,
      ngoName: req.user.organizationName || req.user.name,
      donor: listing.donor,
      status: 'reserved',
      claimOtp: otp,
      etaMinutes: Number(etaMinutes),
      transportType,
      notes,
    });

    res.json({
      success: true,
      message: 'Food listing successfully reserved! Secure Pickup OTP generated.',
      data: {
        listing: updatedListing,
        claim: newClaim,
        pickupOtp: otp,
      },
    });
  } catch (error) {
    console.error('Claim listing error:', error);
    res.status(500).json({ success: false, message: 'Server error processing claim' });
  }
});

// @route   POST /api/listings/:id/verify-pickup
// @desc    Donor or Volunteer validates the NGO's OTP during handover
router.post('/:id/verify-pickup', protect, async (req, res) => {
  try {
    const listing = await dbService.findListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ success: false, message: 'Please provide the 4-digit pickup OTP' });
    }

    if (listing.claimOtp !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Verification OTP! Please check with the NGO representative.',
      });
    }

    // Mark as picked up / in transit
    const updatedListing = await dbService.updateListing(req.params.id, {
      status: 'picked_up',
      otpVerified: true,
    });

    res.json({
      success: true,
      message: 'OTP Verified! Food handover confirmed. Transport in progress.',
      data: updatedListing,
    });
  } catch (error) {
    console.error('Verify pickup error:', error);
    res.status(500).json({ success: false, message: 'Server error verifying OTP' });
  }
});

// @route   POST /api/listings/:id/complete
// @desc    Mark food rescue as delivered & record beneficiaries fed
router.post('/:id/complete', protect, async (req, res) => {
  try {
    const listing = await dbService.findListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const { beneficiariesServed, distributionNotes } = req.body;
    const servedCount = Number(beneficiariesServed) || listing.estimatedServings || 50;

    const updatedListing = await dbService.updateListing(req.params.id, {
      status: 'delivered',
      beneficiariesServed: servedCount,
    });

    // Calculate environmental & meal metrics
    const kg = listing.quantityUnit === 'kg' ? listing.quantity : listing.quantity * 0.45;
    const co2Kg = Math.round(kg * 2.5);

    // Update stats for donor
    if (listing.donor) {
      await dbService.updateUserStats(listing.donor, {
        mealsRescued: servedCount,
        kgSaved: Math.round(kg),
        co2SavedKg: co2Kg,
        claimsCount: 1,
      });
    }

    // Update stats for NGO
    if (listing.claimedBy) {
      await dbService.updateUserStats(listing.claimedBy, {
        mealsRescued: servedCount,
        kgSaved: Math.round(kg),
        co2SavedKg: co2Kg,
        claimsCount: 1,
      });
    }

    res.json({
      success: true,
      message: `Rescue mission marked as completed! ${servedCount} people fed, ${co2Kg} kg CO2 emissions prevented.`,
      data: updatedListing,
    });
  } catch (error) {
    console.error('Complete rescue error:', error);
    res.status(500).json({ success: false, message: 'Server error completing rescue' });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete or cancel a listing
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await dbService.findListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (String(listing.donor) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await dbService.deleteListing(req.params.id);
    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting listing' });
  }
});

module.exports = router;
