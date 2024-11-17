const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    console.log('User from database:', user);

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Error during login' });
  }
};

module.exports = login;
