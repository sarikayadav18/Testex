const UserModel = require("../models/userModel");


app.get('/get-question/:username/:testName/:questionId', async (req, res) => {
    const { username, testName, questionId } = req.params;
    console.log(`Received request to fetch details for question ${questionId} in test ${testName} for user ${username}`);
  
    try {
      // Find the user by username
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found.' });
      }
  
      // Find the test by its name
      const test = user.tests.find(t => t.testName === testName);
  
      if (!test) {
        return res.status(404).json({ success: false, error: 'Test not found.' });
      }
  
      // Find the question by its ID
      const question = test.questions.find(q => q._id.toString() === questionId);
  
      if (!question) {
        return res.status(404).json({ success: false, error: 'Question not found.' });
      }
  
      // Return the details of the question
      res.status(200).json({ success: true, question });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  module.exports=getQuestionUsingUserNameTestNameQuestionId;