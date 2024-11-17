
import React from 'react';
import './SolutionQuestionButtonArea.css';

const QuestionButtonArea = ({ questionsLength, setCurrentQuestionIndex, currentQuestionIndex, questionStatus }) => {
  let gridSize = Math.ceil(questionsLength / 5) * 5; // Calculate the nearest multiple of 5
  if(gridSize>questionsLength){
    gridSize=questionsLength
  }
  const renderGridCells = () => {
    const gridCells = [];
    
    for (let i = 0; i < gridSize; i++) {
      const questionIndex = i % questionsLength; // Use modulo to loop through questions
      // const status = questionStatus && questionStatus[questionIndex];

      gridCells.push(
        <div
          key={i}
          onClick={() => setCurrentQuestionIndex(questionIndex)}
          // className={`grid-cell ${currentQuestionIndex === questionIndex ? 'active' : getCellStatusClass(status)}`}
        >
          {questionIndex + 1}
        </div>
      );
    }

    return gridCells;
  };

  // const getCellStatusClass = (status) => {
  //   switch (status) {
  //     case 1:
  //       return 'answered';
  //     case 2:
  //       return 'visited';
  //     default:
  //       return 'grey';
  //   }
  // };

  return <div className="question-grid">{renderGridCells()}</div>;
};

export default QuestionButtonArea;
