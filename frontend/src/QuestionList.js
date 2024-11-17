// QuestionList.js
import React from 'react';

const QuestionList = ({ questions }) => (
  <div>
    <h3>Questions</h3>
    <ul>
      {questions.map((question, index) => (
        <li key={index}>
          {/* Render each question information */}
          <p>{question.question}</p>
          {/* Add more details as needed */}
        </li>
      ))}
    </ul>
  </div>
);

export default QuestionList;
