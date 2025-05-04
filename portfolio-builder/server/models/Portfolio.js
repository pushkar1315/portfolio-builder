const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  skills: [{
    name: String,
    level: Number
  }],
  projects: [{
    title: String,
    description: String,
    link: String,
    image: String
  }],
  contact: {
    email: String,
    phone: String,
    social: {
      github: String,
      linkedin: String,
      twitter: String
    }
  },
  theme: {
    type: String,
    default: 'light'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);