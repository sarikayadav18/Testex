// import './ControlArea.css'
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function ControlArea({
//   setCurrentQuestionIndex,
//   currentQuestionIndex,
//   questionsLength,
//   username,
//   questionId,
//   optionsRef,
//   integerAnsRef,
//   lowDecimalRef,
//   highDecimalRef,
//   testId,
//   questionStatus,
//   setQuestionStatus,
// }) {
//   const navigate = useNavigate();

//   const handleNext = () => {
//     setCurrentQuestionIndex((currentQuestionIndex) => Math.min(currentQuestionIndex + 1, questionsLength - 1));
//   };

//   const handleBack = () => {
//     setCurrentQuestionIndex((currentQuestionIndex) => Math.max(currentQuestionIndex - 1, 0));
//   };

//   const handleUpdateQuestion = async () => {
//     try {
//       let shouldUpdate = false;

//       if (optionsRef.current) {
//         let optionsLength = optionsRef.current.length;

//         for (let i = 0; i < optionsLength; i++) {
//           if (optionsRef.current[i].isCorrect === true) {
//             shouldUpdate = true;
//             break;
//           }
//         }
//       }

//       if (lowDecimalRef.current || highDecimalRef.current || integerAnsRef.current) {
//         shouldUpdate = true;
//       }

//       // Update the questionStatus based on the conditions
//       let updatedStatus = [...questionStatus];
//       updatedStatus[currentQuestionIndex] = shouldUpdate ? 2 : 1;
//       setQuestionStatus(updatedStatus);

//       if (shouldUpdate) {
//         const response = await fetch(`http://localhost:8000/api/updateQuestion/${username}/${questionId}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             options: optionsRef.current,
//             integerAns: parseInt(integerAnsRef.current, 10) || null,
//             lowDecimal: parseFloat(lowDecimalRef.current) || null,
//             highDecimal: parseFloat(highDecimalRef.current) || null,
//           }),
//         });

//         const data = await response.json();

//         if (data.success) {
//           console.log('Question updated successfully');
//         } else {
//           console.error('Failed to update question:', data.error);
//         }
//       }

//       handleNext();
//     } catch (error) {
//       console.error('Error updating question:', error);
//     }
//   };

//   const handleEndTest = async () => {
//     await handleUpdateQuestion();
//     navigate(`/result/${testId}`);
//   };

//   return (
//     <div className="control-area">
//     <button className="control-button" onClick={handleBack}>Back</button>
//     <button className="control-button" onClick={handleUpdateQuestion}>Save and Next</button>
//     <button className="control-button" onClick={handleEndTest}>End Test</button>
//   </div>
//   );
// }

// ControlArea.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ControlArea.css';
import {useSelector}from 'react-redux'
export default function ControlArea({
  setCurrentQuestionIndex,
  currentQuestionIndex,
  questionsLength,
  username,
  questionId,
  optionsRef,
  integerAnsRef,
  lowDecimalRef,
  highDecimalRef,
  testId,
  questionStatus,
  setQuestionStatus,
}) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const handleNext = () => {
    setCurrentQuestionIndex((currentQuestionIndex) => Math.min(currentQuestionIndex + 1, questionsLength - 1));
  };

  const handleBack = () => {
    setCurrentQuestionIndex((currentQuestionIndex) => Math.max(currentQuestionIndex - 1, 0));
  };

  const handleUpdateQuestion = async () => {
    try {
      let shouldUpdate = false;

      if (optionsRef.current) {
        let optionsLength = optionsRef.current.length;

        for (let i = 0; i < optionsLength; i++) {
          if (optionsRef.current[i].isCorrect === true) {
            shouldUpdate = true;
            break;
          }
        }
      }

      if (lowDecimalRef.current || highDecimalRef.current || integerAnsRef.current) {
        shouldUpdate = true;
      }

      // Update the questionStatus based on the conditions
      let updatedStatus = [...questionStatus];
      updatedStatus[currentQuestionIndex] = shouldUpdate ? 2 : 1;
      setQuestionStatus(updatedStatus);

      if (shouldUpdate) {
        const response = await fetch(`http://localhost:8000/api/updateQuestion/${username}/${questionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            options: optionsRef.current,
            integerAns: parseInt(integerAnsRef.current, 10) || null,
            lowDecimal: parseFloat(lowDecimalRef.current) || null,
            highDecimal: parseFloat(highDecimalRef.current) || null,
          }),
        });

        const data = await response.json();

        if (data.success) {
          console.log('Question updated successfully');
        } else {
          console.error('Failed to update question:', data.error);
        }
      }

      handleNext();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleEndTest = async () => {
    await handleUpdateQuestion();
    navigate(`/result/${testId}`);
  };

  const handleSaveMarkReview = () => {
    // Add functionality for "Save and Mark for Review"
    // ...
  };

  const handleMarkReviewNext = () => {
    // Add functionality for "Mark for Review and Next"
    // ...
  };

  const handleClear = () => {
    // Add functionality for "Clear"
    // ...
  };

  const handleNextQuestion = () => {
    // Add functionality for "Next"
    // ...
  };

  return (
    <div className="control-area">
      <div className="up">
        <button className="save-next-button" onClick={handleUpdateQuestion}>Save and Next</button>
        <button className="clear-button" onClick={handleClear}>Clear</button>
        <button className="save-mark-review-button" onClick={handleSaveMarkReview}>Save and Mark for Review</button>
        <button className="mark-review-next-button" onClick={handleMarkReviewNext}>Mark for Review and Next</button>
      </div>
      <div className="down">
        <button className="back-button" onClick={handleBack}>Back</button>
        <button className="next-button" onClick={handleNextQuestion}>Next</button>
        <button className="end-test-button" onClick={handleEndTest}>End Test</button>
      </div>
    </div>
  );
}