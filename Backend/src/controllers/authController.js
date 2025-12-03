const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

exports.signUp = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicateUser = await User.findOne({ username });
    if (duplicateUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      hashedPassword,
      displayName: `${firstName} ${lastName}`
    });

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};
