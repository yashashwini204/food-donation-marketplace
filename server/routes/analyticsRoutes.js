const express = require('express');
const router = express.Router();
const dbService = require('../services/dbStorage');

// @route   GET /api/analytics/impact
// @desc    Get live platform impact statistics
router.get('/impact', async (req, res) => {
  try {
    const analytics = await dbService.getImpactAnalytics();
    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Impact analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving analytics' });
  }
});

// @route   POST /api/analytics/reset
// @desc    Reset mock database to initial rich seed state
router.post('/reset', async (req, res) => {
  try {
    const result = await dbService.resetToSeeds();
    res.json({
      success: true,
      message: 'Platform demo data successfully restored to fresh state',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset demo data' });
  }
});

module.exports = router;
