// QuestionTextArea.js
import React from 'react';
import './QuestionTextArea.css'; // Import your CSS file
import SingleCorrectAnswerArea from './SingleCorrectAnswerArea';

const QuestionTextArea = ({ question, questionNumber }) => {
  if (!question) {
    return null; // Render nothing if no question is provided
  }

  const { questionType, questionText } = question;

  return (
    <div className="question-text-area">
      <div className="header">
        <div className="question-number">Question: {questionNumber}</div>
        <div className="question-type">{questionType}</div>
      </div>
      <p className="question-text">{questionText}</p>
      <SingleCorrectAnswerArea question={question}/>
    </div>
  );
};

export default QuestionTextArea;
