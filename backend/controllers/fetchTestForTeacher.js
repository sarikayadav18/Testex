const UserModel = require("../models/userModel");

const fetchTestForTeacher=app.get('/api/fetch-test-for-teacher/:username/:testName', async (req, res) => {
    try {
      const { username, testName } = req.params;
      console.log(username,testName);
  
      // Find the user by username
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      // Find the test by test name
      console.log(user);
      const test = user.tests.find(t => t.testName === testName);
  
      if (!test) {
        return res.status(404).json({ success: false, message: 'Test not found.' });
      }
  
      // Return the questions array
      res.status(200).json({ success: true, questions: test.questions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  module.exports=fetchTestForTeacher;