const UserModel = require("../models/userModel");

const getTestsUsingUsername=app.get('/api/get-tests-using-username/:username', async (req, res) => {
    try {
      const { username } = req.params;
  
      // Find the user by username
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      // Return the tests array
      res.status(200).json({ success: true, tests: user.tests });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  module.exports=getTestsUsingUsername;