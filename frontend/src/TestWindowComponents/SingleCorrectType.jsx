import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TestActions } from '../store/slices/TestSlice';

const SingleCorrectType = ({ questionId }) => {
  const dispatch = useDispatch();
  
  // Selecting the question from Redux state based on questionId
  // const question=null;
  const question = useSelector(state => {
    
    return state.test?.test.test.questions.find(q => q._id === questionId);
  });
  console.log(useSelector((state)=>state.test.test.test.questions));

  if (!question) {
    return <div>Loading...</div>; // Add error handling or loading state if needed
  }

  const handleOptionChange = (optionId) => {
    dispatch(TestActions.selectOption({ questionId, optionId }));
  };

  return (
    <div>
      {/* <h2>{question.questionText}</h2> */}
      {question.options.map((option) => (
        <div key={option._id}>
          <label>
            <input
              type="checkbox"
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

export default SingleCorrectType;
