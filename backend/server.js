const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./models/db');
const analyticsRoutes = require('./routes/analytics');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase().catch(console.error);

// Routes
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))