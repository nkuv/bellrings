const { User } = require('../models');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ username, password, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    // Plain text password comparison
    if (user.password !== password) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 