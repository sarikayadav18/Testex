const UserModel = require("../models/userModel");


const addTestToTeacher=app.post('/add-test-to-teacher', async (req, res) => {
    const { username, tests } = req.body;
  
    try {
      // Check if the user with the given username already exists
      const existingUser = await UserModel.findOne({ username });
  
      if (existingUser) {
        // User exists, update the existing user with new test details
        if (tests && tests.length > 0) {
          existingUser.tests.push(tests[0]); // Assuming only one test is added at a time
          await existingUser.save();
        } else {
          return res.status(400).json({ error: 'No tests provided for update.' });
        }
  
        res.status(200).json(existingUser);
      } else {
        // User does not exist, create a new user
        const newUser = await UserModel.create(req.body);
        res.status(201).json(newUser);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports=addTestToTeacher;