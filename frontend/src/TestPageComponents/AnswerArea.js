// import './AnswerArea.css'
// import React, { useState, useEffect, useRef } from 'react';

// const AnswerArea = ({ question, optionsRef, integerAnsRef, lowDecimalRef, highDecimalRef }) => {
//   const [options, setOptions] = useState([]);
//   const [rerenderCounter, setRerenderCounter] = useState(0);

//   useEffect(() => {
//     if (question.questionType !== 'integerType' && question.questionType !== 'decimalType') {
//       setOptions(question.options.map((option) => ({ ...option, selected: false })));
//     }
//   }, [question]);

//   useEffect(() => {
//     optionsRef.current = options;
//   }, [options, optionsRef]);

//   const handleSingleCorrectChange = (optionId) => {
//     setOptions((prevOptions) =>
//       prevOptions.map((option) => ({
//         ...option,
//         selected: option._id === optionId,
//         isCorrect:option._id === optionId
//       }))
//     );

//     // Update the isCorrect property of all options
//     optionsRef.current = optionsRef.current.map((option) => ({
//       ...option,
//       isCorrect: option._id === optionId,
//     }));

//     setRerenderCounter((prevCounter) => prevCounter + 1);
//   };

//   const handleMultipleCorrectChange = (optionId) => {
//     setOptions((prevOptions) =>
//       prevOptions.map((option) => ({
//         ...option,
//         selected: option._id === optionId ? !option.selected : option.selected,
//         isCorrect: option.selected || (option._id === optionId && !option.isCorrect),
//       }))
//     );
  
//     optionsRef.current = optionsRef.current.map((option) => ({
//       ...option,
//       isCorrect: option.selected || (option._id === optionId && !option.isCorrect),
//     }));
  
//     setRerenderCounter((prevCounter) => prevCounter + 1);
//   };
  
  

//   const handleIntegerChange = (e) => {
//     const value = e.target.value;
//     integerAnsRef.current = value;
//     setRerenderCounter((prevCounter) => prevCounter + 1);
//   };

//   const handleDecimalChange = (e) => {
//     const value = e.target.value;
//     lowDecimalRef.current = value;
//     highDecimalRef.current = value; // Assuming both low and high are the same for simplicity
//     setRerenderCounter((prevCounter) => prevCounter + 1);
//   };

//   return (
//     <div>
     
//       {question.questionType === 'singleCorrect' && (
//         <form>
//           {options.map((option) => (
//             <div key={option._id}>
//               <input
//                 type="radio"
//                 id={option._id}
//                 name="singleCorrect"
//                 checked={option.selected}
//                 onChange={() => handleSingleCorrectChange(option._id)}
//               />
//               <label htmlFor={option._id}>{option.text}</label>
//             </div>
//           ))}
//         </form>
//       )}
//       {question.questionType === 'multipleCorrect' && (
//         <form>
//           {options.map((option) => (
//             <div key={option._id}>
//               <input
//                 type="checkbox"
//                 id={option._id}
//                 checked={option.selected}
//                 onChange={() => handleMultipleCorrectChange(option._id)}
//               />
//               <label htmlFor={option._id}>{option.text}</label>
//             </div>
//           ))}
//         </form>
//       )}
//       {question.questionType === 'integerType' && (
//         <input type="number" onChange={handleIntegerChange} />
//       )}
//       {question.questionType === 'decimalType' && (
//         <input type="number" step="any" onChange={handleDecimalChange} />
//       )}
//     </div>
//   );
// };

// export default AnswerArea;


// AnswerArea.js
import './AnswerArea.css';
import React, { useState, useEffect, useRef } from 'react';

const AnswerArea = ({ question, optionsRef, integerAnsRef, lowDecimalRef, highDecimalRef }) => {
  const [options, setOptions] = useState([]);
  const [rerenderCounter, setRerenderCounter] = useState(0);

  useEffect(() => {
    if (question.questionType !== 'integerType' && question.questionType !== 'decimalType') {
      setOptions(question.options.map((option) => ({ ...option, selected: false })));
    }
  }, [question]);

  useEffect(() => {
    optionsRef.current = options;
  }, [options, optionsRef]);

  const handleSingleCorrectChange = (optionId) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => ({
        ...option,
        selected: option._id === optionId,
        isCorrect: option._id === optionId,
      }))
    );

    // Update the isCorrect property of all options
    optionsRef.current = optionsRef.current.map((option) => ({
      ...option,
      isCorrect: option._id === optionId,
    }));

    setRerenderCounter((prevCounter) => prevCounter + 1);
  };

  const handleMultipleCorrectChange = (optionId) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => ({
        ...option,
        selected: option._id === optionId ? !option.selected : option.selected,
        isCorrect: option.selected || (option._id === optionId && !option.isCorrect),
      }))
    );

    optionsRef.current = optionsRef.current.map((option) => ({
      ...option,
      isCorrect: option.selected || (option._id === optionId && !option.isCorrect),
    }));

    setRerenderCounter((prevCounter) => prevCounter + 1);
  };

  const handleIntegerChange = (e) => {
    const value = e.target.value;
    integerAnsRef.current = value;
    setRerenderCounter((prevCounter) => prevCounter + 1);
  };

  const handleDecimalChange = (e) => {
    const value = e.target.value;
    lowDecimalRef.current = value;
    highDecimalRef.current = value; // Assuming both low and high are the same for simplicity
    setRerenderCounter((prevCounter) => prevCounter + 1);
  };

  return (
    <div className="answer-area">
      {question.questionType === 'singleCorrect' && (
        <form>
          {options.map((option) => (
            <div key={option._id} className="answer-option">
              <div className="option-text">{option.text}</div>
              <div className="radio-input">
                <input
                  type="radio"
                  id={option._id}
                  name="singleCorrect"
                  checked={option.selected}
                  onChange={() => handleSingleCorrectChange(option._id)}
                />
              </div>
            </div>
          ))}
        </form>
      )}
      {question.questionType === 'multipleCorrect' && (
        <form>
          {options.map((option) => (
            <div key={option._id} className="answer-option">
              <div className="option-text">{option.text}</div>
              <div className="checkbox-input">
                <input
                  type="checkbox"
                  id={option._id}
                  checked={option.selected}
                  onChange={() => handleMultipleCorrectChange(option._id)}
                />
              </div>
            </div>
          ))}
        </form>
      )}
      {question.questionType === 'integerType' && (
        <input type="number" onChange={handleIntegerChange} />
      )}
      {question.questionType === 'decimalType' && (
        <input type="number" step="any" onChange={handleDecimalChange} />
      )}
    </div>
  );
};

export default AnswerArea;
