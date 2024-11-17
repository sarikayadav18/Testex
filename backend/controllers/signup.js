const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');


 const signup= async (req, res) => {
    const { username, password, role } = req.body;

    try {
      const existingUser = await UserModel.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = new UserModel({ username, password: hashedPassword, role });
      await newUser.save();

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error during signup:', error.message);
      res.status(500).json({ message: 'Error creating user' });
    }
  }
module.exports=signup;