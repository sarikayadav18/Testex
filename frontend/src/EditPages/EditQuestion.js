import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SingleCorrectQuestionFormEdit from './SingleCorrectQuestionFormEdit';
import MultipleCorrectQuestionFormEdit from './MultipleCorrectQuestionFormEdit';
import IntegerTypeQuestionFormEdit from './IntegerTypeQuestionFormEdit';
import DecimalTypeQuestionFormEdit from './DecimalTypeQuestionFormEdit';
import { useSelector } from 'react-redux';
const EditQuestion = ({ userInfo }) => {
  const user = useSelector((state) => state.auth.user);
  const { testId, questionId } = useParams();
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [questionDetails, setQuestionDetails] = useState(null);
  const username=user.username
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get-question/${username}/${testId}/${questionId}`);
        const data = await response.json();

        if (data.success) {
          setQuestionDetails(data.question);
          // Set the selectedQuestionType based on the fetched question details
          setSelectedQuestionType(data.question.questionType || '');
        } else {
          console.error('Failed to fetch question details:', data.error);
        }
      } catch (error) {
        console.error('Error fetching question details:', error);
      }
    };

    fetchQuestionDetails();
  }, [username, testId, questionId]);

  // Render the selected question type form based on the value of selectedQuestionType
  const renderQuestionForm = () => {
    switch (selectedQuestionType) {
      case 'singleCorrect':
        return <SingleCorrectQuestionFormEdit username={username} testId={testId} questionId={questionId} questionDetails={questionDetails} />;
      case 'multipleCorrect':
        return <MultipleCorrectQuestionFormEdit username={username} testId={testId} questionId={questionId} questionDetails={questionDetails} />;
      case 'integerType':
        return <IntegerTypeQuestionFormEdit username={username} testId={testId} questionId={questionId} questionDetails={questionDetails} />;
      case 'decimalType':
        return <DecimalTypeQuestionFormEdit username={username} testId={testId} questionId={questionId} questionDetails={questionDetails} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h3>Edit Question</h3>

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
}

export default EditQuestion;