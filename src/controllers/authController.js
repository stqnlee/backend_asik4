const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing in .env');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    let role = 'user';
    const adminSecret = req.headers['x-admin-secret'];
    if (adminSecret && adminSecret === process.env.ADMIN_REGISTER_SECRET) {
      role = 'admin';
    }

    const user = await User.create({ email, password, role });
    const token = signToken(user._id);

    return res.status(201).json({
      message: 'Registered',
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err); 
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);

    return res.json({
      message: 'Logged in',
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};