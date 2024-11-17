import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SolutionControlArea({ setCurrentQuestionIndex,questionsLength }) {

  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentQuestionIndex((currentQuestionIndex) => Math.min(currentQuestionIndex + 1, questionsLength - 1));
  };

  const handleBack = () => {
    setCurrentQuestionIndex((currentQuestionIndex) => Math.max(currentQuestionIndex - 1, 0));
  };
  

  return (
    <div>
      <button onClick={handleBack}>Back</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}