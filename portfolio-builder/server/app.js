// 1. FIRST REQUIRE CORE MODULES
const path = require('path');
const dotenv = require('dotenv');

// 2. CONFIGURE ENVIRONMENT VARIABLES
dotenv.config({ path: path.join(__dirname, '../.env') });

// 3. DEBUG LOG TO VERIFY ENV LOADING
console.log('Environment file path:', path.join(__dirname, '../.env'));
console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);

// 4. REQUIRE OTHER DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 5. REQUIRE ROUTES
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');

// 6. DATABASE CONNECTION
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
connectDB();

// 7. INITIALIZE EXPRESS APP
const app = express();

// 8. MIDDLEWARE
app.use(express.json());
// Add this RIGHT AFTER express.json() middleware
// Debug all registered routes
app._router.stack.forEach(middleware => {
  if (middleware.route) {
    console.log('Registered route:', middleware.route.path);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach(handler => {
      console.log('Router route:', handler.route?.path);
    });
  }
});


// Allow requests from frontend origin
// Replace your current CORS setup with:
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.options('*', cors());
// 9. ROUTES
// Add this before your routes
const staticFilesPath = path.join(__dirname, '../client/public');
console.log('Serving static files from:', staticFilesPath);

// Now use it
app.use(express.static(staticFilesPath));
const fs = require('fs');

// Check if directory exists
if (!fs.existsSync(staticFilesPath)) {
  console.error('ERROR: Static files directory does not exist:', staticFilesPath);
} else {
  console.log('Directory exists. Contents:', fs.readdirSync(staticFilesPath));
}
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  next();
});
app.use(express.static(path.join(__dirname, '../client')));
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// 10. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));