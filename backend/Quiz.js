const mongoose = require('mongoose');
const { Schema } = mongoose;

const optionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  image: String, // You may add image field if needed
});

const questionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  questionImage: String, // You may add image field if needed
  options: [optionSchema],
  positiveMarks: {
    type: Number,
    required: true,
  },
  negativeMarks: {
    type: Number,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
  },
  answer: {
    type: Number, // For integerType and decimalType
  },
  answerMin: {
    type: Number, // For decimalType
  },
  answerMax: {
    type: Number, // For decimalType
  },
});

const quizSchema = new Schema([questionSchema]);

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
