// src/components/SingleCorrectQuestion.js

import React from 'react';
import { useDispatch } from 'react-redux';
import { TestActions } from '../store/slices/TestSlice';

const SingleCorrectAnswerArea = ({ question }) => {
  const dispatch = useDispatch();

  const handleOptionChange = (optionId) => {
    dispatch(TestActions.selectOption({ questionId: question._id, optionId }));
  };

  return (
    <div>
      {/* <h2>{question.questionText}</h2> */}
      {question && question.options.map((option) => (
        <div key={option._id}>
          <label>
            <input
              type="radio"
              name={`options-${question._id}`}
              value={option._id}
              checked={option.isCorrect}
              onChange={() => handleOptionChange(option._id)}
            />
            {option.text}
          </label>
        </div>
      ))}
    </div>
  );
};

export default SingleCorrectAnswerArea;
