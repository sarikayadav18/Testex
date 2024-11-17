import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TestActions } from '../store/slices/TestSlice';

const DecimalType = ({ questionId }) => {
  const dispatch = useDispatch();

  // Selecting the question from Redux state based on questionId
  const question = useSelector(state =>
    state.test.test.test?.questions?.find(q => q._id === questionId)
  );

  if (!question) {
    return <div>Loading...</div>; // Add error handling or loading state if needed
  }

  const handleLowDecimalChange = (event) => {
    const lowDecimal = parseFloat(event.target.value);
    dispatch(TestActions.updateDecimalAnswer({ questionId, lowDecimal, highDecimal: question.highDecimal }));
  };

  const handleHighDecimalChange = (event) => {
    const highDecimal = parseFloat(event.target.value);
    dispatch(TestActions.updateDecimalAnswer({ questionId, lowDecimal: question.lowDecimal, highDecimal }));
  };

  return (
    <div>
      {/* <h2>{question.questionText}</h2> */}
      <label>Low Decimal:</label>
      <input
        type="number"
        step="0.01"
        value={question.lowDecimal || ''}
        onChange={handleLowDecimalChange}
      />
      <br />
      <label>High Decimal:</label>
      <input
        type="number"
        step="0.01"
        value={question.highDecimal || ''}
        onChange={handleHighDecimalChange}
      />
    </div>
  );
};

export default DecimalType;
