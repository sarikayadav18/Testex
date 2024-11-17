import React from 'react';
import { useSelector } from 'react-redux';

const QuestionStatusArea = ({ testId }) => {
  const test = useSelector(state => state.test?.test?.test);
  
  if (!test || test._id !== testId) {
    return null; // Handle case when test data is not loaded or doesn't match testId
  }

  const questions = test.questions;
  const totalQuestions = questions.length;
  
  // Calculate counts
  const answeredCount = questions.filter(q => q.answered).length;
  const visitedCount = questions.filter(q => q.visited).length;
  const markedForReviewCount = questions.filter(q => q.markedForReview).length;

  return (
    <div style={styles.statusArea}>
      <p>Total Questions: {totalQuestions}</p>
      <p>Answered: {answeredCount}</p>
      <p>Visited: {visitedCount}</p>
      <p>Marked for Review: {markedForReviewCount}</p>
    </div>
  );
};

const styles = {
  statusArea: {
    border: '1px solid #ccc',
    padding: '10px',
    marginTop: '10px',
  },
};

export default QuestionStatusArea;
