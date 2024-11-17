import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setQuestionIndex } from '../store/slices/TestSlice';

const QuestionButtonArea = ({ testId }) => {
  const dispatch = useDispatch();
  const test = useSelector(state => state.test?.test?.test);

  if (!test || test._id !== testId) {
    return null; // Handle case when test data is not loaded or doesn't match testId
  }

  const questions = test.questions;

  const handleQuestionClick = (index) => {
    dispatch(setQuestionIndex(index));
  };

  const renderQuestionButton = (question, index) => {
    let buttonColor = 'red'; // Default color for notVisited and notAnswered questions
    let dotColor = ''; // Dot color

    if (question.answered) {
      buttonColor = 'green'; // Answered
    } else if (question.visited && !question.answered) {
      buttonColor = 'orange'; // Visited and notAnswered
    } else if (!question.visited) {
      buttonColor = 'gray'; // Not visited
    }

    // Check if question is marked for review to show dot
    if (question.markedForReview) {
      dotColor = 'black'; // Dot color
    }

    return (
      <button
        key={question._id}
        style={{
          backgroundColor: buttonColor,
          margin: '5px',
          padding: '10px',
          border: 'none',
          cursor: 'pointer',
          position: 'relative', // Ensure positioning for dot
        }}
        onClick={() => handleQuestionClick(index)}
      >
        {index + 1}
        {question.markedForReview && ( // Render dot if markedForReview is true
          <span
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              height: '8px',
              width: '8px',
              borderRadius: '50%',
              backgroundColor: dotColor,
            }}
          />
        )}
      </button>
    );
  };

  const renderQuestionButtons = () => {
    return questions.map((question, index) => renderQuestionButton(question, index));
  };

  return (
    <div style={styles.buttonArea}>
      <h3>Question Navigation</h3>
      <div style={styles.buttonGrid}>
        {renderQuestionButtons()}
      </div>
    </div>
  );
};

const styles = {
  buttonArea: {
    border: '1px solid #ccc',
    padding: '10px',
    marginTop: '10px',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
    gap: '5px',
  },
};

export default QuestionButtonArea;
