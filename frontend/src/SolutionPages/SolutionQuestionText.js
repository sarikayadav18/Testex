
import React from 'react';
import '../TestPageComponents/QuestionTextArea.css'; // Import your CSS file

const SolutionQuestionTextArea = ({ question, questionNumber }) => {
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
    </div>
  );
};

export default SolutionQuestionTextArea;
