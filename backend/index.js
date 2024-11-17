const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path'); // Added to handle path more reliably
let questions = require('./data');
const app = express();
const port = 8000;
const secretKey = 'yourSecretKey'; // Replace with a strong secret key
const jwt =require('jsonwebtoken')
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/quizApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to the database`);
  })
  .catch((e) => {
    console.error(`Couldn't connect to the database`, e); // Log the error
  });


// Option Schema
const optionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
  image: String,
});

// Question Schema
const questionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: ['singleCorrect', 'multipleCorrect', 'integerType', 'decimalType'],
  },
  questionText: String,
  questionImage: String,
  options: [optionSchema],
  positiveMark: Number,
  negativeMark: Number,
  partialMark: Number,
  integerAns: Number,
  lowDecimal: Number,
  highDecimal: Number,
  visited:Boolean,
  answered:Boolean,
  markedForReview:Boolean,


});

// Test Schema
const testSchema = new mongoose.Schema({
  testName: String,
  
  duration: Number,
  startTime: Date,
  endTime: Date,
  numberOfAttempt:{type: Number,default: 0,},

  questions: [questionSchema],
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ['teacher', 'student'],
  },
  
  tests: [testSchema],
});

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tests: [testSchema]
});

// Models
const UserModel = mongoose.model('User', userSchema);
const TestModel = mongoose.model('Test', testSchema);
const QuestionModel = mongoose.model('Question', questionSchema);
const OptionModel = mongoose.model('Option', optionSchema);
const Group = mongoose.model('Group', groupSchema);


app.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword, role });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, secretKey);

    res.status(201).json({ message: 'User created successfully', token, user:newUser });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: 'Error creating user' });
  }
});
  
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await UserModel.findOne({ username });
  
      console.log('User from database:', user);
  
      if (user && bcrypt.compareSync(password, user.password)) {
        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, secretKey);
  
        res.status(200).json({ message: 'Login successful', token,user });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ message: 'Error during login' });
    }
  });

  app.get('/getUserByjwt', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      const user = await UserModel.findById(decoded.id).select('-password');
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  });

app.post('/users-add-test', async (req, res) => {
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
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

app.post('/users-add-question', async (req, res) => {
  const { username, role, tests } = req.body;

  try {
    // Check if the user with the given username and role (teacher) already exists
    const existingUser = await UserModel.findOne({ username, role });

    if (existingUser) {
      // Teacher exists, find the corresponding test using testId
      const existingTest = existingUser.tests.find(test => test._id.toString() === tests[0].testId);

      if (existingTest) {
        // Test exists, push the new questions to the existing test
        if (tests[0].questions && tests[0].questions.length > 0) {
          const sanitizedQuestions = tests[0].questions.map(question => {
            // Ensure that each question object doesn't have an _id field
            const { _id, ...sanitizedQuestion } = question;
            return sanitizedQuestion;
          });

          existingTest.questions.push(...sanitizedQuestions);
          await existingUser.save();
        } else {
          return res.status(400).json({ error: 'No questions provided for update.' });
        }
      } else {
        return res.status(404).json({ error: 'Test not found.' });
      }

      res.status(200).json(existingUser);
    } else {
      // Teacher does not exist, return an error
      return res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/questions/:questionId/:username/:testId', async (req, res) => {
  const { questionId, username, testId } = req.params;
  console.log('Received request to delete question:', questionId);

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found.' });
    }

    // Find the test by its ID
    const test = user.tests.find(t => t._id.toString() === testId);

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




app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/getQuestions/:username/:testId', async (req, res) => {
  try {
    const { username, testId } = req.params;
    

    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Find the test by test id
    const test = user.tests.find(t => t._id.toString() === testId);

    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }

    // Return the questions array
    res.status(200).json({ success: true, questions: test.questions ,testName:test.testName,duration:test.duration});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


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

app.get('/api/getTests/:username', async (req, res) => {
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

app.get('/get-question/:username/:testId/:questionId', async (req, res) => {
  const { username, testId, questionId } = req.params;
  console.log(`Received request to fetch details for question ${questionId} in test ${testId} for user ${username}`);

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    // Find the test by its ID
    const test = user.tests.find(t => t._id.toString() === testId);

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

app.put('/questions/:questionId/:username/:testId', async (req, res) => {
  const { questionId, username, testId } = req.params;
  const updatedQuestionData = req.body.question;

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found.' });
    }

    // Find the test by its ID
    const test = user.tests.find(t => t._id.toString() === testId);

    if (!test) {
      return res.status(402).json({ success: false, error: 'Test not found.' });
    }

    // Find the question in the test's questions array
    const question = test.questions.find(q => q._id.toString() === questionId);

    if (!question) {
      return res.status(403).json({ success: false, error: 'Question not found in the specified test.' });
    }

    // Update the question details
    Object.assign(question, updatedQuestionData);

    // Save the updated user
    await user.save();

    res.status(200).json({ success: true, message: 'Question updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


app.get('/api/getTest/:testId', async (req, res) => {
  try {
    const { testId } = req.params;

    // Find the user with the matching test
    const user = await UserModel.findOne({ 'tests._id': testId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }

    // Find the specific test within the user's tests array
    const test = user.tests.find(t => t._id.toString() === testId);


    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }
    const tempTest=test;
    tempTest.questions.forEach(question => {
      question.options.forEach(option=>{
        option.isCorrect=false;
      })
      question.lowDecimal=null
      question.highDecimal=null
      question.integerAns=null
      question.visited=false;
      question.answered=false;
      question.markedForReview=false;
      
    });

    // Return the test details
    res.status(200).json({ success: true,test:tempTest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post('/api/addTestInStudent', async (req, res) => {
  const { studentId, testDetails } = req.body;
  testDetails.startTime=Date.now();
  testDetails.endTime=(testDetails.startTime+(testDetails.duration)*60000);

  try {
    // Find the student by their userId
    console.log(testDetails._id.toString())
 
   const student = await UserModel.findOne({ username: studentId })

   if(student){
    const exist=student.tests.find(t => t._id.toString() ===testDetails._id.toString())
    if(exist){
      return res.status(200).json({ success: true, message: 'Student tests updated successfully' });
    }
   }

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Update the tests array for the found student
    student.tests.push(testDetails);

    // Save the updated student in the database
    

    
    await student.save();

    return res.status(200).json({ success: true, message: 'Student tests updated successfully' });
  } catch (error) {
    console.error('Error updating student tests:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
// Endpoint to fetch test details by username and test ID
app.get('/api/getTestDetails/:username/:testId', async (req, res) => {
  try {
    const { username, testId } = req.params;

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.json({ success: false, error: 'User not found' });
    }

    const test = user.tests.find(test => test._id.toString() === testId);
    if (!test) {
      return res.json({ success: false, error: 'Test not found' });
    }

    res.json({ success: true, test });
  } catch (error) {
    console.error('Error fetching test details:', error);
    res.json({ success: false, error: 'Internal server error' });
  }
});

// Endpoint to update a question
app.put('/api/updateQuestion/:username/:questionId', async (req, res) => {
  const { username, questionId } = req.params;
  const { options, integerAns, lowDecimal, highDecimal ,answered,visited,markedForReview} = req.body;

  try {
    const student = await UserModel.findOne({ username });

    if (student) {
      const test = student.tests.find((t) => t.questions.some((q) => q._id.equals(questionId)));

      if (test) {
        const question = test.questions.find((q) => q._id.equals(questionId));

        if (question) {
          // Update the question fields
          question.options = options || question.options;
          question.integerAns = integerAns !== undefined ? integerAns : question.integerAns;
          question.lowDecimal = lowDecimal !== undefined ? lowDecimal : question.lowDecimal;
          question.highDecimal = highDecimal !== undefined ? highDecimal : question.highDecimal;
          question.answered = answered !== undefined ? answered : question.answered;
          question.visited = visited !== undefined ? visited : question.visited;
          question.markedForReview = markedForReview !== undefined ? markedForReview : question.markedForReview;

          await student.save();

          res.json({ success: true, message: 'Question updated successfully' });
        } else {
          res.json({ success: false, error: 'Question not found for the provided questionId' });
        }
      } else {
        res.json({ success: false, error: 'Test not found containing the provided questionId' });
      }
    } else {
      res.json({ success: false, error: 'Student not found for the provided username' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


app.get('/api/getTestById/:testId', async (req, res) => {
  try {
    const { testId } = req.params;

    // Find the user with the matching test
    const user = await UserModel.findOne({ 'tests._id': testId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }

    // Find the specific test within the user's tests array
    const test = user.tests.find(t => t._id.toString() === testId);


    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }
  
    res.status(200).json({ success: true,test:test });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.put('/update-test-info/:username/:testId', async (req, res) => {
  const { username, testId } = req.params;
  const { testName, duration } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const testToUpdate = user.tests.id(testId);

    if (!testToUpdate) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Update the test information
    testToUpdate.testName = testName;
    testToUpdate.duration = duration;

    // Save the user with the updated test information
    await user.save();

    res.status(200).json({ success: true, test: testToUpdate });
  } catch (error) {
    console.error('Error updating test information:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
});

app.post('/create-groups', async (req, res) => {
  const { name, teacherId } = req.body;

  try {
    // Validate teacher
    const teacher = await UserModel.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    // Create the group
    const group = new Group({
      name,
      teachers: [teacherId],
      students: [],
      tests: []
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error.message);
    res.status(500).json({ message: 'Error creating group' });
  }
});
// Fetch all groups for a teacher
app.get('/get-groups/teacher/:teacherId', async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Validate teacher
    const teacher = await UserModel.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    // Find all groups the teacher is part of
    const groups = await Group.find({ teachers: teacherId }).populate('teachers').populate('students').populate('tests');

    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error.message);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});
// GET endpoint to fetch group details by groupId
app.get('/groups/:groupId', async (req, res) => {
  const { groupId } = req.params;

  try {
    // Fetch the group details by groupId
    const group = await Group.findById(groupId)
      .populate('teachers', 'username') // Populate teachers with username only
      .populate('students', 'username') // Populate students with username only
      .populate('tests', 'testName'); // Populate tests with testName only

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group details:', error.message);
    res.status(500).json({ message: 'Error fetching group details' });
  }
});
// Route to get groups by student ID
app.get('/get-groups/student/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    // Validate student
    const student = await UserModel.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    // Find all groups the student is part of
    const groups = await Group.find({ students: studentId })
      .populate('teachers')
      .populate('students')
      .populate('tests');

    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error.message);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});
app.post('/groups/join', async (req, res) => {
  const { groupId, studentId } = req.body;

  try {
    // Validate student
    const student = await UserModel.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    // Validate group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(400).json({ message: 'Invalid group ID' });
    }

    // Add student to the group if not already a member
    if (!group.students.includes(studentId)) {
      group.students.push(studentId);
      await group.save();
    }

    res.status(200).json({ message: 'Joined group successfully', group });
  } catch (error) {
    console.error('Error joining group:', error.message);
    res.status(500).json({ message: 'Error joining group' });
  }
});
app.post('/groups/:groupId/add-test', async (req, res) => {
  const { groupId } = req.params;
  const { teacherId,testId } = req.body;

  try {
    const group = await Group.findById(groupId);
    const teacher = await UserModel.findById(teacherId);

    if (!group) {
      return res.status(404).send('Group not found');
    }

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).send('Teacher not found');
    }

    const test = teacher.tests.find(test => test._id.toString() === testId);

    if (!test) {
      return res.status(404).send('Test not found in teacher\'s tests');
    }

    group.tests.push(test);
    await group.save();

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
// Get all tests created by a specific teacher
app.get('/tests/teacher/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await UserModel.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher.tests);
  } catch (error) {
    console.error('Error fetching teacher tests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/groups/:groupId/remove-test', async (req, res) => {
  const { groupId } = req.params;
  const { testId } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).send('Group not found');
    }

    group.tests = group.tests.filter(test => test._id.toString() !== testId);
    await group.save();

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
app.post('/api/updateEndTime/:userId/:testId', async (req, res) => {
  const { userId, testId } = req.params;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: `User with ID ${userId} not found` });
    }

    const test = user.tests.find(test => test._id.toString() === testId);

    if (!test) {
      return res.status(404).json({ error: `Test with ID ${testId} not found for this user` });
    }

    // Calculate current time as endTime
    const endTime = new Date();

    // Update endTime in the test object
    test.endTime = endTime;

    // Save updated user object
    await user.save();

    res.json({ message: 'endTime updated successfully', endTime });
  } catch (error) {
    console.error('Error updating endTime:', error);
    res.status(500).json({ error: 'Server error, could not update endTime' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});