const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const inventoryRoutes = require("./routes/Inventory")


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api",inventoryRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));


  // Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});


  
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});