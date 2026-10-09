const express = require('express');
const router = express.Router();
const dbService = require('../services/dbStorage');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/claims
// @desc    Get claims relevant to logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'ngo') {
      filter.ngoId = req.user._id;
    } else if (req.user.role === 'donor') {
      filter.donorId = req.user._id;
    } else if (req.user.role === 'volunteer') {
      // Volunteers can see all active or volunteer-assigned claims
      filter.volunteerId = req.user._id;
    }

    const claims = await dbService.findClaims(filter);

    // Populate listing details
    const populated = await Promise.all(
      claims.map(async (c) => {
        const listing = await dbService.findListingById(c.listing);
        return {
          ...c,
          listingDetails: listing || null,
        };
      })
    );

    res.json({
      success: true,
      count: populated.length,
      data: populated,
    });
  } catch (error) {
    console.error('Fetch claims error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching claims' });
  }
});

// @route   GET /api/claims/:id
// @desc    Get claim by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const claim = await dbService.findClaimById(req.params.id);
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }
    const listing = await dbService.findListingById(claim.listing);
    res.json({
      success: true,
      data: {
        ...claim,
        listingDetails: listing || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching claim' });
  }
});

module.exports = router;
