
// import './QuestionPage.css'
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import { useNavigate,useLocation } from 'react-router-dom';
// import { useParams } from 'react-router-dom';

// const QuestionPage = ({userInfo}) => {
//   const [questions, setQuestions] = useState([]);
//   const [testInfo, setTestInfo] = useState({});
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { state } = location;
//   const username = userInfo.username;
//   // const testName=state.testName;
//   const { testId } = useParams();
  
  
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
        
//         const response = await fetch(`http://localhost:8000/api/getQuestions/${username}/${testId}`);
//         const data = await response.json();
        
//         if (data.success) {
//           setQuestions(data.questions || []);
//           setTestInfo({ testName: data.testName, duration: data.duration });
//           console.log(questions);
//         } else {
//           console.error('Invalid data received from the server');
//         }
//       } catch (error) {
//         console.error('Error fetching questions:', error);
//       }
//     };

//     fetchQuestions();
//   }, [testId, username]);  // Add testName and username to the dependency array

//   const handleEdit = (question) => {
//     // Implement your logic for handling the edit action
//     console.log(`Edit button clicked for question: \n`);
//     console.log(question)
//     navigate(`/edit-question/${testId}/${question._id}`);
//     // Redirect or open a modal for editing, etc.
//     // You can use navigate(`/edit-question/${questionId}`) if you have a separate edit page
//   };
//   const handleDelete = async (questionId) => {
//     console.log(questionId._id)
//     console.log(typeof(questionId._id))
//     try {
//       console.log('Question ID:', questionId);

//       const deleteResponse = await fetch(`http://localhost:8000/questions/${questionId._id}/${username}/${testId}`, {
//         method: 'DELETE',
//       });

//       const deleteData = await deleteResponse.json();

//       if (deleteData.success) {
//         const updatedQuestions = questions.filter((question) => question._id !== questionId._id);
//         setQuestions(updatedQuestions);
//       } else {
//         console.error('Failed to delete question:', deleteData.message);
//       }
//     } catch (error) {
//       console.error('Error deleting question:', error);
//     }
//   };

//   const renderOptions = (options) => {
//     return (
//       <ul>
//         {options.map((option, optionIndex) => (
//           <li key={optionIndex}>
//             {option.text} - {option.isCorrect ? 'Correct' : 'Incorrect'}
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   const renderQuestion = (question, index) => {
//     const questionNumber = index + 1;

//     return (
//       <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <div>
//           <h3>{`Question ${questionNumber}: ${question.questionText}`}</h3>
//           {question.questionType === 'singleCorrect' && renderOptions(question.options)}
//           {question.questionType === 'multipleCorrect' && renderOptions(question.options)}
//           {question.questionType === 'integerType' && <p>Answer: {question.integerAns}</p>}
//           {question.questionType === 'decimalType' && (
//             <p>
//               Answer Range: {question.lowDecimal} to {question.highDecimal}
//             </p>
//           )}
//         </div>
//         <span
//           style={{
//             cursor: 'pointer',
//             color: 'red',
//           }}
//           onClick={() => window.confirm('Are you sure you want to delete this question?') && handleDelete(question)}
//         >
//           <DeleteIcon />
//         </span>
//         <span
//           style={{
//             cursor: 'pointer',
//             color: 'blue',
//             marginLeft: '10px',
//           }}
//           onClick={() => handleEdit(question)}
//         >
//           <EditIcon />
//         </span>
//       </li>
//     );
//   };
//   const handleAddQuestionClick = () => {
//     navigate(`/add-question/${testId}` );
//   };
//   return (
//     <div>
//       <h2>Questions</h2>
//       <p>Test Name: {testInfo.testName}</p>
//       <p>Duration: {testInfo.duration}</p>
//       <ul>{questions.map((question, index) => renderQuestion(question, index))}</ul>

//       {/* <Link to="/add-question">
//         <button>Add Question</button>
//       </Link> */}
//       <button onClick={handleAddQuestionClick}>Add Question</button>
//     </div>
//   );
// };

// export default QuestionPage;
import './QuestionPage.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const QuestionPage = ({ userInfo }) => {
  const user = useSelector((state) => state.auth.user);
  const [questions, setQuestions] = useState([]);
  const [testInfo, setTestInfo] = useState({});
  const [editedTestInfo, setEditedTestInfo] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const username = user.username;
  const { testId } = useParams();
  const [isEditingTestInfo, setIsEditingTestInfo] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/getQuestions/${username}/${testId}`);
        const data = await response.json();

        if (data.success) {
          setQuestions(data.questions || []);
          setTestInfo({ testName: data.testName, duration: data.duration });
          setEditedTestInfo({ testName: data.testName, duration: data.duration })
        } else {
          console.error('Invalid data received from the server');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [testId, username]);

  const handleEdit = (question) => {
    console.log(`Edit button clicked for question: \n`);
    console.log(question);
    navigate(`/edit-question/${testId}/${question._id}`);
  };

  const handleDelete = async (questionId) => {
    try {
      const deleteResponse = await fetch(`http://localhost:8000/questions/${questionId._id}/${username}/${testId}`, {
        method: 'DELETE',
      });

      const deleteData = await deleteResponse.json();

      if (deleteData.success) {
        const updatedQuestions = questions.filter((question) => question._id !== questionId._id);
        setQuestions(updatedQuestions);
      } else {
        console.error('Failed to delete question:', deleteData.message);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleEditTestInfo = () => {
    setEditedTestInfo({testName:testInfo.testName,duration:testInfo.duration})
    setIsEditingTestInfo(!isEditingTestInfo);
  };

  // const handleSaveTestInfo = () => {
  //   // Implement logic to save the edited testInfo to the backend
  //   // After saving, you might want to refetch the questions or update the local state
  //   setTestInfo({ testName: editedTestInfo.testName, duration: editedTestInfo.duration });
  //   setIsEditingTestInfo(false); // Set editing status back to false
  // };
  const handleSaveTestInfo = async () => {
    setTestInfo({ testName: editedTestInfo.testName, duration: editedTestInfo.duration });
    setIsEditingTestInfo(false); // Set editing status back to false
    try {
      const response = await fetch(`http://localhost:8000/update-test-info/${username}/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testName: editedTestInfo.testName,
          duration: editedTestInfo.duration,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Optionally, you can update the local state or perform any other actions
        console.log('Test information updated successfully:', data.test);
      } else {
        console.error('Failed to update test information:', data.message);
      }
    } catch (error) {
      console.error('Error updating test information:', error);
    }
  };
  const renderOptions = (options) => {
    return (
      <ul>
        {options.map((option, optionIndex) => (
          <li key={optionIndex}>
            {option.text} - {option.isCorrect ? 'Correct' : 'Incorrect'}
          </li>
        ))}
      </ul>
    );
  };

  const renderQuestion = (question, index) => {
    const questionNumber = index + 1;

    return (
      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>{`Question ${questionNumber}: ${question.questionText}`}</h3>
          {question.questionType === 'singleCorrect' && renderOptions(question.options)}
          {question.questionType === 'multipleCorrect' && renderOptions(question.options)}
          {question.questionType === 'integerType' && <p>Answer: {question.integerAns}</p>}
          {question.questionType === 'decimalType' && (
            <p>
              Answer Range: {question.lowDecimal} to {question.highDecimal}
            </p>
          )}
        </div>
        <span
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={() => window.confirm('Are you sure you want to delete this question?') && handleDelete(question)}
        >
          <DeleteIcon />
        </span>
        <span
          style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
          onClick={() => handleEdit(question)}
        >
          <EditIcon />
        </span>
      </li>
    );
  };

  const handleAddQuestionClick = () => {
    navigate(`/add-question/${testId}`);
  };
  const handleHome = () => {
    navigate(`/TeacherHome`);
  };
  const handleInputChange = (field, value) => {
    setEditedTestInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  return (
    <div>
      <h2>Questions</h2>
      <p>
        Test Name:
        {isEditingTestInfo ? (
          <input
            type="text"
            value={editedTestInfo.testName}
            onChange={(e) => handleInputChange('testName', e.target.value)}
          />
        ) : (
          testInfo.testName
        )}
        <span style={{ marginLeft: '5px', cursor: 'pointer', color: 'blue' }} onClick={handleEditTestInfo}>
          <EditIcon />
        </span>
      </p>
      <p>
        Duration:
        {isEditingTestInfo ? (
          <input
            type="text"
            value={editedTestInfo.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
          />
        ) : (
          testInfo.duration
        )}
        <span style={{ marginLeft: '5px', cursor: 'pointer', color: 'blue' }} onClick={handleEditTestInfo}>
          <EditIcon />
        </span>
      </p>
      {isEditingTestInfo && (
        <button onClick={handleSaveTestInfo}>Save Changes</button>
      )}
      <button onClick={handleAddQuestionClick}>Add Question</button>
      <button onClick={handleHome}>Save Test</button>
      <ul>{questions.map((question, index) => renderQuestion(question, index))}</ul>
      
    </div>
  );
};

export default QuestionPage;
