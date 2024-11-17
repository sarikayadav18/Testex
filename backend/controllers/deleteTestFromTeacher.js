const UserModel = require("../models/userModel");

app.delete('/delete-test/:username/:testName', async (req, res) => {
    const { username, testName } = req.params;
    console.log(`Received request to delete test: ${testName} for user: ${username}`);
  
    try {
      // Find the user by username
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found.' });
      }
  
      // Find the test by its name
      const testIndex = user.tests.findIndex(test => test.testName === testName);
  
      if (testIndex === -1) {
        return res.status(404).json({ success: false, error: 'Test not found.' });
      }
  
      // Remove the test from the user's tests array
      user.tests.splice(testIndex, 1);
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ success: true, message: 'Test deleted successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  module.exports=deleteTestFromTeacher;
  