import React from 'react';
import './SolutionAnswerArea.css';

export default function SolutionAnswerArea({ teacherQuestion, studentQuestion }) {
  const renderOptions = () => {
    if (!teacherQuestion || !studentQuestion) {
      return null; // or handle the loading state appropriately
    }

    if (
      teacherQuestion.questionType === 'singleCorrect' ||
      teacherQuestion.questionType === 'multipleCorrect'
    ) {
      return teacherQuestion.options.map((option, index) => {
        const isTeacherCorrect = option.isCorrect;
        const studentOptions = studentQuestion.options || [];
        const isStudentCorrect = studentOptions[index]?.isCorrect;

        let optionColor = 'normal';

        if (isTeacherCorrect && isStudentCorrect) {
          optionColor = 'green';
        } else if (!isTeacherCorrect && isStudentCorrect) {
          optionColor = 'red';
        } else if (isTeacherCorrect && !isStudentCorrect) {
          optionColor = 'yellow';
        }

        return (
          <div key={index} className={`option ${optionColor}`}>
            {option.text}
          </div>
        );
      });}
 
      else if (teacherQuestion.questionType === 'integerType') {
        const teacherAnswer = teacherQuestion.integerAns;
        const studentAnswer = studentQuestion.integerAns;
      
        const teacherColor = 'green';
        const studentColor =
          typeof studentAnswer !== 'undefined'
            ? studentAnswer === teacherAnswer
              ? 'green'
              : 'red'
            : 'normal';
      
        return (
          <div>
            <div className={`answer ${teacherColor}`}>
              Teacher Answer: {teacherAnswer}
            </div>
            <div className={`answer ${studentColor}`}>
              Student Answer: {typeof studentAnswer !== 'undefined' ? studentAnswer : 'Not answered'}
            </div>
          </div>
        );
      } else if (teacherQuestion.questionType === 'decimalType') {
        const teacherLowDecimal = teacherQuestion.lowDecimal;
        const teacherHighDecimal = teacherQuestion.highDecimal;
      
        const studentLowDecimal = studentQuestion.lowDecimal;
        const studentHighDecimal = studentQuestion.highDecimal;
      
        const teacherColor = 'green';
        const studentColor =
          typeof studentLowDecimal !== 'undefined' && typeof studentHighDecimal !== 'undefined'
            ? studentLowDecimal >= teacherLowDecimal && studentHighDecimal <= teacherHighDecimal
              ? 'green'
              : 'red'
            : 'normal';
      
        return (
          <div>
            <div className={`range ${teacherColor}`}>
              Teacher Range: {teacherLowDecimal} - {teacherHighDecimal}
            </div>
            <div className={`range ${studentColor}`}>
              Student Range: {typeof studentLowDecimal !== 'undefined' ? studentLowDecimal : 'Not answered'} -{' '}
              {typeof studentHighDecimal !== 'undefined' ? studentHighDecimal : 'Not answered'}
            </div>
          </div>
        );
      }

    return null;
  };

  return <div>{renderOptions()}</div>;
}
