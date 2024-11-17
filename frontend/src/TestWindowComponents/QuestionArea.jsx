import React from 'react';
import { useSelector } from 'react-redux';

const QuestionArea = ({ question }) => {
  const currentIndex=useSelector(state=>state.test?.currentIndex);
  return (
    <div className="question-area">
      {/* <h2>Question</h2> */}
     
      <div className="question-content">
      <h4>Q no. {currentIndex+1}</h4>
        <p>{question.questionText}</p>
        {/* Additional logic to render question image if available */}
        {question.questionImage!='no img' && (
          <img src={question.questionImage} alt="Question" className="question-image" />
        )}
      </div>
      
    </div>
  );
};

export default QuestionArea;
