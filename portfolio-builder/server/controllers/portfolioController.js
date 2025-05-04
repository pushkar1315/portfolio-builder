const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
exports.getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('portfolio');
    
    if (!user.portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    
    res.json(user.portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Create or update portfolio
// @route   PUT /api/portfolio
// @access  Private
exports.updatePortfolio = async (req, res) => {
  const {
    name,
    title,
    bio,
    skills,
    projects,
    contact,
    theme
  } = req.body;

  const portfolioFields = {
    user: req.user.id,
    name,
    title,
    bio,
    skills,
    projects,
    contact,
    theme
  };

  try {
    let user = await User.findById(req.user.id);
    let portfolio = await Portfolio.findOne({ user: req.user.id });

    if (portfolio) {
      // Update
      portfolio = await Portfolio.findOneAndUpdate(
        { user: req.user.id },
        { $set: portfolioFields },
        { new: true }
      );
      return res.json(portfolio);
    }

    // Create
    portfolio = new Portfolio(portfolioFields);
    await portfolio.save();
    
    // Add portfolio to user
    user.portfolio = portfolio._id;
    await user.save();
    
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};