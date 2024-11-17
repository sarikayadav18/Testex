import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import TimeArea from './TestPageComponents/TimeArea';
import QuestionTextArea from './TestPageComponents/QuestionTextArea';
import AnswerArea from './TestPageComponents/AnswerArea';
import ControlArea from './TestPageComponents/ControlArea';
import QuestionButtonArea from './TestPageComponents/QuestionButtonArea';
import StatusArea from './TestPageComponents/StatusArea';
import TestFetch from './TestPageComponents/TestFetch';
import './TestPage.css'
import { useSelector } from 'react-redux';
const TestPage = (props) => {
  const user = useSelector((state) => state.auth.user);
  const { testId } = useParams();
  const { userInfo } = props;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testDetails, setTestDetails] = useState(null);
  const [questionStatus, setQuestionStatus] = useState([]);

  const optionsRef = useRef(null);
  const integerAnsRef = useRef(null);
  const lowDecimalRef = useRef(null);
  const highDecimalRef = useRef(null);

  if (!testDetails) {
    return (
      <TestFetch
        userInfo={user}
        testId={testId}
        setTestDetails={setTestDetails}
        setQuestions={setQuestions}
      >
        Loading...
      </TestFetch>
    );
  }

  // Initialize questionStatus array with 0 for each question
  if (questions.length > 0 && questionStatus.length === 0) {
    setQuestionStatus(Array(questions.length).fill(0));
  }
  console.log(questionStatus)

  return (
    <div className="test-page-container">
      <div className="left-container">
        <div className="up-part">
    
         <h1>Exam Name: {testDetails.testName}</h1>
          <p>Candidate Username: {user.username}</p>
          <QuestionTextArea question={questions[currentQuestionIndex]} questionNumber={currentQuestionIndex + 1} />
        </div>
        <div className="middle-part">
          <AnswerArea
            question={questions[currentQuestionIndex]}
            optionsRef={optionsRef}
            integerAnsRef={integerAnsRef}
            lowDecimalRef={lowDecimalRef}
            highDecimalRef={highDecimalRef}
          />
        </div>
        <div className="down-part">
          <ControlArea
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            currentQuestionIndex={currentQuestionIndex}
            questionsLength={questions.length}
            username={userInfo.username}
            questionId={questions[currentQuestionIndex]._id}
            optionsRef={optionsRef}
            integerAnsRef={integerAnsRef}
            lowDecimalRef={lowDecimalRef}
            highDecimalRef={highDecimalRef}
            testId={testId}
            questionStatus={questionStatus}
            setQuestionStatus={setQuestionStatus}
          />
        </div>
      </div>

      <div className="right-container">
        <div className="up-part">
          <TimeArea duration={testDetails.duration} />
        </div>
        <div className="middle-part">
          <StatusArea questionStatus={questionStatus} />
        </div>
        <div className="down-part">
          <QuestionButtonArea
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            questionsLength={questions.length}
            currentQuestionIndex={currentQuestionIndex}
            questionStatus={questionStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default TestPage;