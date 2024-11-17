import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TestActions } from '../store/slices/TestSlice';

const IntegerType = ({ questionId }) => {
  const dispatch = useDispatch();

  // Selecting the question from Redux state based on questionId
  const question = useSelector(state => 
    state.test.test.test?.questions?.find(q => q._id === questionId)
  );

  if (!question) {
    return <div>Loading...</div>; // Add error handling or loading state if needed
  }

  const handleInputChange = (event) => {
    const integerAns = parseInt(event.target.value, 10);
    dispatch(TestActions.updateIntegerAnswer({ questionId, integerAns }));
  };

  return (
    <div>
      {/* <h2>{question.questionText}</h2> */}
      <input
        type="number"
        value={question.integerAns || ''}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default IntegerType;
