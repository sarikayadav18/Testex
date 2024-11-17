const UserModel = require("../models/userModel");


const addQuestionInTest=app.post('/add-question-in-test', async (req, res) => {
    const { username, role, tests } = req.body;
  
    try {
      // Check if the user with the given username and role (teacher) already exists
      const existingUser = await UserModel.findOne({ username, role });
  
      if (existingUser) {
        // Teacher exists, find the corresponding test
        const existingTest = existingUser.tests.find(test => test.testName === tests[0].testName);
  
        if (existingTest) {
          // Test exists, update the existing test with new question details
          if (tests[0].questions && tests[0].questions.length > 0) {
            existingTest.questions.push(tests[0].questions[0]); // Assuming only one question is added at a time
            await existingUser.save();
          } else {
            return res.status(400).json({ error: 'No questions provided for update.' });
          }
        } else {
          // Test does not exist, add a new test with the provided questions
          existingUser.tests.push(tests[0]);
          await existingUser.save();
        }
  
        res.status(200).json(existingUser);
      } else {
        // Teacher does not exist, create a new user with a new test and questions
        const newUser = await UserModel.create(req.body);
        res.status(201).json(newUser);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  module.exports=addQuestionInTest
  