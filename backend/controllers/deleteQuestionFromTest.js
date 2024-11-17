const UserModel = require("../models/userModel");


const deleteQuestionFromTest=app.delete('/questions/:questionId/:username/:testName', async (req, res) => {
    const { questionId, username, testName } = req.params;
    console.log('Received request to delete question:', questionId);
  
    try {
      // Find the user by username
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ success: false, error: 'User not found.' });
      }
  
      // Find the test by its name
      const test = user.tests.find(t => t.testName === testName);
  
      if (!test) {
        return res.status(402).json({ success: false, error: 'Test not found.' });
      }
  
      // Find the index of the question in the test's questions array
      const questionIndex = test.questions.findIndex(q => q._id.toString() === questionId);
  
      if (questionIndex === -1) {
        return res.status(403).json({ success: false, error: 'Question not found in the specified test.' });
      }
  
      // Remove the question from the test
      test.questions.splice(questionIndex, 1);
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ success: true, message: 'Question deleted successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  module.exports=deleteQuestionFromTest;
  