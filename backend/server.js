const express = require('express');
const connectDB = require('./config/db');  // เชื่อมต่อฐานข้อมูล
const cors = require('cors');
require('dotenv').config();

const app = express();

// เชื่อมต่อกับฐานข้อมูล
connectDB();

app.use(cors({
    origin: 'http://localhost:3000' // อนุญาตให้เข้าถึงจากโดเมนนี้
  }));

// Middleware สำหรับ JSON parsing
app.use(express.json({ extended: false }));

// ใช้ router จากไฟล์ auth.js
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
