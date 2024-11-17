// Option Schema
const mongoose = require('mongoose');
const { Schema } = mongoose;

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
  MarkedForReview:Boolean,
  Answerd:Boolean,
});

// Test Schema
const testSchema = new mongoose.Schema({
  testName: String,
  duration: Number,
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

// Models
const UserModel = mongoose.model('User', userSchema);
const TestModel = mongoose.model('Test', testSchema);
const QuestionModel = mongoose.model('Question', questionSchema);
const OptionModel = mongoose.model('Option', optionSchema);

module.exports = UserModel;
