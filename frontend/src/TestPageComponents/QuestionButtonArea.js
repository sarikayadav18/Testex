
// // import React from 'react';
// // import './QuestionButton.css'; // Import your CSS file

// // const QuestionButtonArea = ({ questionsLength, setCurrentQuestionIndex, currentQuestionIndex, questionStatus }) => {
// //   const renderButtons = () => {
// //     const buttons = [];
// //     for (let i = 0; i < questionsLength; i++) {
// //       const status = questionStatus && questionStatus[i];
// //       buttons.push(
// //         <div key={i}>
// //           <button
// //             onClick={() => setCurrentQuestionIndex(i)}
// //             className={currentQuestionIndex === i ? 'active' : getButtonStatusClass(status)}
// //           >
// //             {i + 1}
// //           </button>
// //         </div>
// //       );
// //     }
// //     return buttons;
// //   };

// //   const getButtonStatusClass = (status) => {
// //     switch (status) {
// //       case 1:
// //         return 'answered';
// //       case 2:
// //         return 'visited';
// //       default:
// //         return 'grey';
// //     }
// //   };

// //   return <div className="question-buttons">{renderButtons()}</div>;
// // };

// // export default QuestionButtonArea;
// // QuestionButtonArea.jsx
// import React from 'react';
// import './QuestionButton.css';

// const QuestionButtonArea = ({ questionsLength, setCurrentQuestionIndex, currentQuestionIndex, questionStatus }) => {
//   const renderButtons = () => {
//     const buttons = [];
//     const gridSize = Math.ceil(questionsLength / 5) * 5; // Calculate the nearest multiple of 5

//     for (let i = 0; i < gridSize; i++) {
//       const questionIndex = i % questionsLength; // Use modulo to loop through questions
//       const status = questionStatus && questionStatus[questionIndex];

//       buttons.push(
//         <div key={i}>
//           <button
//             onClick={() => setCurrentQuestionIndex(questionIndex)}
//             className={currentQuestionIndex === questionIndex ? 'active' : getButtonStatusClass(status)}
//           >
//             {questionIndex + 1}
//           </button>
//         </div>
//       );
//     }

//     return buttons;
//   };

//   const getButtonStatusClass = (status) => {
//     switch (status) {
//       case 1:
//         return 'answered';
//       case 2:
//         return 'visited';
//       default:
//         return 'grey';
//     }
//   };

//   return <div className="question-buttons">{renderButtons()}</div>;
// };

// export default QuestionButtonArea;

// QuestionButtonArea.jsx
import React from 'react';
import './QuestionButton.css';

const QuestionButtonArea = ({ questionsLength, setCurrentQuestionIndex, currentQuestionIndex, questionStatus }) => {
  let gridSize = Math.ceil(questionsLength / 5) * 5; // Calculate the nearest multiple of 5
  if(gridSize>questionsLength)gridSize=questionsLength
  const renderGridCells = () => {
    const gridCells = [];
    
    for (let i = 0; i < gridSize; i++) {
      const questionIndex = i % questionsLength; // Use modulo to loop through questions
      const status = questionStatus && questionStatus[questionIndex];

      gridCells.push(
        <div
          key={i}
          onClick={() => setCurrentQuestionIndex(questionIndex)}
          className={`grid-cell ${currentQuestionIndex === questionIndex ? 'active' : getCellStatusClass(status)}`}
        >
          {questionIndex + 1}
        </div>
      );
    }

    return gridCells;
  };

  const getCellStatusClass = (status) => {
    switch (status) {
      case 1:
        return 'answered';
      case 2:
        return 'visited';
      default:
        return 'grey';
    }
  };

  return <div className="question-grid">{renderGridCells()}</div>;
};

export default QuestionButtonArea;
