console.log('Portfolio routes loaded successfully');

const express = require('express');
const auth = require('../middleware/auth');
const portfolioController = require('../controllers/portfolioController');
const router = express.Router();

// @route   GET api/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/', auth, portfolioController.getPortfolio);

// @route   PUT api/portfolio
// @desc    Create or update portfolio
// @access  Private
router.put('/', auth, portfolioController.updatePortfolio);

module.exports = router;


