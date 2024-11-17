import React from 'react';


import SingleCorrectType from './SingleCorrectType';
import MultipleCorrectType from './MultipleCorrectType';
import IntegerType from './IntegerType';
import DecimalType from './DecimalType';

const AnswerArea = ({ questionId, questionType }) => {
  switch (questionType) {
    case 'singleCorrect':
      return <SingleCorrectType questionId={questionId} />;
    case 'multipleCorrect':
      return <MultipleCorrectType questionId={questionId} />;
    case 'integerType':
      return <IntegerType questionId={questionId} />;
    case 'decimalType':
      return <DecimalType questionId={questionId} />;
    default:
      return <div>Invalid question type</div>;
  }
};

export default AnswerArea;
