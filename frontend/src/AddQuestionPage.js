import React, { useState } from 'react';
import { useNavigate,useLocation,useParams } from 'react-router-dom';
import SingleCorrectQuestionForm from './SingleCorrectQuestionForm';
import MultipleCorrectQuestionForm from './MultipleCorrectQuestionForm';
import IntegerTypeQuestionForm from './IntegerTypeQuestionForm';
import DecimalTypeQuestionForm from './DecimalTypeQuestionForm';
import { useSelector } from 'react-redux';
const AddQuestion = ({userInfo}) => {
  const user = useSelector((state) => state.auth.user);
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const location = useLocation();
  const username=user.username;
  const testId=useParams();
  
  // Render the selected question type form based on the value of selectedQuestionType
  const renderQuestionForm = () => {
    switch (selectedQuestionType) {
      case 'singleCorrect':
        return <SingleCorrectQuestionForm username={username} testId={testId}/>;
      case 'multipleCorrect':
        return <MultipleCorrectQuestionForm username={username} testId={testId}/>;
      case 'integerType':
        return <IntegerTypeQuestionForm username={username} testId={testId}/>;
      case 'decimalType':
        return <DecimalTypeQuestionForm username={username} testId={testId}/>;
      default:
        return null;
    }
  };

  return (
    <div>
      <h3>Add Question</h3>

      {/* Dropdown to select question type */}
      <label>
        Select Question Type:
        <select
          value={selectedQuestionType}
          onChange={(e) => setSelectedQuestionType(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="singleCorrect">Single Correct</option>
          <option value="multipleCorrect">Multiple Correct</option>
          <option value="integerType">Integer Type</option>
          <option value="decimalType">Decimal Type</option>
        </select>
      </label>
      <br />

      {/* Render the question form based on the selected type */}
      {selectedQuestionType && renderQuestionForm()}
    </div>
  );
};

export default AddQuestion;

