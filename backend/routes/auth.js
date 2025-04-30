const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
require('dotenv').config();


const router = express.Router();

// ใช้คีย์ค่าคงที่สำหรับ encrypt และ decrypt
const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.SECRET_KEY, 'salt', 32);

const encryptPassword = (password) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

const decryptPassword = (encryptedPassword) => {
  const [ivHex, encrypted] = encryptedPassword.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Registration Route
router.post('/register', async (req, res) => {
  const { username, emailOrPhone, password } = req.body;

  try {
    // เช็คว่าข้อมูลที่ผู้ใช้กรอกเข้ามา(username emailOrPhone) ซ้ำหรือไม่
    let user = await User.findOne({ $or: [{ username }, { emailOrPhone }] });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // encrypt โดยใช้ aes
    const encryptedPassword = encryptPassword(password);

    user = new User({
      username,
      emailOrPhone,
      password: encryptedPassword,
    });

    // save ข้อมูลลงในฐานข้อมูล
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Decrypt password เพื่อนำมาเปรียบเทียบใช้ในการ login
    const decryptedPassword = decryptPassword(user.password);

    if (decryptedPassword !== password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    res.json({ msg: 'Logged in successfully', user: { username: user.username, emailOrPhone: user.emailOrPhone } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
