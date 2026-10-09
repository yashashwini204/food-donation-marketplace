const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbService = require('../services/dbStorage');
const { protect, JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user (donor, ngo, volunteer)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, organizationName, orgType, phone, address, city, regNumber } = req.body;

    if (!name || !email || !password || !organizationName) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, password, and organization name' });
    }

    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await dbService.createUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'donor',
      organizationName,
      orgType: orgType || 'restaurant',
      phone: phone || '+1 (555) 000-0000',
      address: address || 'Main City',
      city: city || 'Metro City',
      regNumber: regNumber || 'REG-PENDING',
      verified: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(organizationName)}`,
    });

    const token = generateToken(newUser._id);
    const { password: _, ...userWithoutPass } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: userWithoutPass,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    const { password: _, ...userWithoutPass } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPass,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   POST /api/auth/demo-login
// @desc    Instant 1-Click Login for rapid evaluation across roles
router.post('/demo-login', async (req, res) => {
  try {
    const { role = 'donor' } = req.body;

    const emailMap = {
      donor: 'donor@demo.com',
      ngo: 'ngo@demo.com',
      volunteer: 'volunteer@demo.com',
      admin: 'admin@demo.com',
    };

    let user = null;
    const targetEmail = emailMap[role];
    if (targetEmail) {
      user = await dbService.findUserByEmail(targetEmail);
    }

    // If specific email not found, find any existing user with that role
    if (!user) {
      const User = require('../models/User');
      const { getIsMongoConnected } = require('../config/db');
      if (getIsMongoConnected()) {
        user = await User.findOne({ role });
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: `No active user found with role: ${role}` });
    }

    const token = generateToken(user._id);
    const userObj = user.toObject ? user.toObject() : user;
    const { password: _, ...userWithoutPass } = userObj;
    userWithoutPass.organizationName =
      userWithoutPass.organizationName ||
      userWithoutPass.organization ||
      userWithoutPass.orgName ||
      (userWithoutPass.role === 'ngo' ? 'City Hope Community Shelter' : 'GreenLeaf Bistro & Catering');

    res.json({
      success: true,
      message: `Signed in as ${user.name} (${user.role.toUpperCase()})`,
      token,
      user: userWithoutPass,
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ success: false, message: 'Error signing in as demo user' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
});

module.exports = router;
