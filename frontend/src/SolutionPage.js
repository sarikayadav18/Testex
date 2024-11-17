// import React, { useEffect, useRef, useState } from 'react';
// import { useParams,useNavigate} from 'react-router-dom';
// import './SolutionPage.css'
// import SolutionQuestionTextArea from './SolutionPages/SolutionQuestionText';
// import SolutionAnswerArea from './SolutionPages/SolutionAnswerArea';
// import SolutionControlArea from './SolutionPages/SolutionControlArea';
// import SolutionQuestionButtonArea from './SolutionPages/SolutionQuestionButtonArea';
// import SolutionTestFetch from './SolutionPages/SolutionTestFetch';

// const SolutionPage = ({username}) => {
//     const { testId } = useParams();
//     const [teacherQuestions, setTeacherQuestions] = useState([]);
//     const [studentQuestions, setStudentQuestions] = useState([]);
//     const [questions, setQuestions] = useState([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const teacherTestRef = useRef(null);
//     const studentTestRef = useRef(null);
//     const [dataLoaded, setDataLoaded] = useState(false);
 

// //  useEffect(() => {
// //     if(dataLoaded && teacherTestRef.current && studentTestRef.current){
// //         setTeacherQuestions(teacherTestRef.current.questions)
// //         setStudentQuestions(studentTestRef.current.questions)
// //         setQuestions(teacherTestRef.current.questions)
// //     }

// //  }, [dataLoaded, teacherTestRef.current, studentTestRef.current]);
// useEffect(() => {
//     if (teacherTestRef.current && studentTestRef.current) {
//       const teacherQuestions = teacherTestRef.current.questions;
//       const studentQuestions = studentTestRef.current.questions;
  
//       if (teacherQuestions && studentQuestions) {
//         setTeacherQuestions(teacherQuestions);
//         setStudentQuestions(studentQuestions);
//         setQuestions(teacherQuestions);
//         setDataLoaded(true);
//       }
//     }
//   }, [teacherTestRef.current, studentTestRef.current]);
  


//   if (!dataLoaded) {
//     return (
//     <SolutionTestFetch
//        username={username}
//       testId={testId}
//       setDataLoaded={setDataLoaded}
//       teacherTestRef={teacherTestRef}
//       studentTestRef={studentTestRef}
//       >Loading...</SolutionTestFetch>)
//   }

 
// return (
//     <div>
//       <h1>Solutions</h1>
//       <p>Test ID: {testId}</p>
//       <p>Username: {username}</p>


//       {/* Display the current question in QuestionTextArea */}
//       <SolutionQuestionTextArea question={questions[currentQuestionIndex]} questionNumber={currentQuestionIndex + 1} />

//       {/* Render the options for the current question in AnswerArea */}

//     <SolutionAnswerArea
//        teacherQuestion={teacherQuestions[currentQuestionIndex]}
//        studentQuestion={studentQuestions[currentQuestionIndex]}
//      />

//       <SolutionControlArea
//        setCurrentQuestionIndex={setCurrentQuestionIndex} 
//        currentQuestionIndex={currentQuestionIndex}
//        questionsLength={questions.length}
//       />
//       <SolutionQuestionButtonArea 
//       setCurrentQuestionIndex={setCurrentQuestionIndex} 
//       questionsLength={questions.length} 
//       currentQuestionIndex={currentQuestionIndex}
//       />
      
//     </div>
//   );
// };

// export default SolutionPage;
// SolutionPage.js
import './SolutionPage.css';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SolutionQuestionTextArea from './SolutionPages/SolutionQuestionText';
import SolutionAnswerArea from './SolutionPages/SolutionAnswerArea';
import SolutionControlArea from './SolutionPages/SolutionControlArea';
import SolutionQuestionButtonArea from './SolutionPages/SolutionQuestionButtonArea';
import SolutionTestFetch from './SolutionPages/SolutionTestFetch';

const SolutionPage = () => {
  const user = useSelector((state) => state.auth.user);
  const { testId } = useParams();
  const [teacherQuestions, setTeacherQuestions] = useState([]);
  const [studentQuestions, setStudentQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const teacherTestRef = useRef(null);
  const studentTestRef = useRef(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (teacherTestRef.current && studentTestRef.current) {
      const teacherQuestions = teacherTestRef.current.questions;
      const studentQuestions = studentTestRef.current.questions;

      if (teacherQuestions && studentQuestions) {
        setTeacherQuestions(teacherQuestions);
        setStudentQuestions(studentQuestions);
        setQuestions(teacherQuestions);
        setDataLoaded(true);
      }
    }
  }, [teacherTestRef.current, studentTestRef.current]);

  if (!dataLoaded) {
    return (
      <SolutionTestFetch
        username={user.username}
        testId={testId}
        setDataLoaded={setDataLoaded}
        teacherTestRef={teacherTestRef}
        studentTestRef={studentTestRef}
      >
        Loading...
      </SolutionTestFetch>
    );
  }

  return (
    <div className="container">
      <div className="left-section">
        <h1>Solutions</h1>
      
        <p>Candidate Username: {user.username}</p>

        {/* Display the current question in QuestionTextArea */}
        <SolutionQuestionTextArea question={questions[currentQuestionIndex]} questionNumber={currentQuestionIndex + 1} />

        {/* Render the options for the current question in AnswerArea */}
        <SolutionAnswerArea teacherQuestion={teacherQuestions[currentQuestionIndex]} studentQuestion={studentQuestions[currentQuestionIndex]} />

        <SolutionControlArea
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          currentQuestionIndex={currentQuestionIndex}
          questionsLength={questions.length}
        />
      </div>

      <div className="right-section">
        {/* Right section for the clickable grid buttons */}
        <SolutionQuestionButtonArea
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          questionsLength={questions.length}
          currentQuestionIndex={currentQuestionIndex}
        />
      </div>
    </div>
  );
};

export default SolutionPage;
