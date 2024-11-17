
// // CreateMockTest.js
// import React, { useState } from 'react';
// import { TextField, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const CreateMockTest = ({userInfo}) => {
//   const [testName, setTestName] = useState('');
//   const [duration, setDuration] = useState('');
//   const [isNextEnabled, setIsNextEnabled] = useState(false);
//   const navigate = useNavigate();

//   const handleTestNameChange = (e) => {
//     setTestName(e.target.value);
//     checkNextButtonStatus(e.target.value, duration);
//   };

//   const handleDurationChange = (e) => {
//     const value = parseInt(e.target.value, 10); // Parse the input value as an integer
//     setDuration(value);
//     checkNextButtonStatus(testName, value);
//   };

//   const checkNextButtonStatus = (testName, duration) => {
//     setIsNextEnabled(testName.trim() !== '' && !isNaN(duration) && duration > 0);
//   };

//   const handleNextClick = () => {

//     navigate('/questions', { state: { testName, duration } });
//   };

//   return (
//     <div>
//       <h2>Create Mock Test</h2>

//       <label>
//         Test Name:
//         <TextField
//           type="text"
//           value={testName}
//           onChange={handleTestNameChange}
//         />
//       </label>
//       <br />

//       <label>
//         Duration (in minutes):
//         <TextField
//           type="number" // Use number type for integer input
//           value={duration}
//           onChange={handleDurationChange}
//         />
//       </label>
//       <br />

//       {/* Render Next button */}
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleNextClick}
//         disabled={!isNextEnabled}
//       >
//         Next
//       </Button>
//     </div>
//   );
// };

// export default CreateMockTest;


import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const CreateMockTest = ({ userInfo }) => {
  const user = useSelector((state) => state.auth.user);
  const [testName, setTestName] = useState('');
  const [duration, setDuration] = useState('');
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const navigate = useNavigate();
  // const testName = 'YourTestName'; // Replace with your actual testName
  // navigate(`/questions/${testName}`);
  const handleTestNameChange = (e) => {
    setTestName(e.target.value);
    checkNextButtonStatus(e.target.value, duration);
  };

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setDuration(value);
    checkNextButtonStatus(testName, value);
  };

  const checkNextButtonStatus = (testName, duration) => {
    setIsNextEnabled(testName.trim() !== '' && !isNaN(duration) && duration > 0);
  };

  const handleNextClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/users-add-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          role:'teacher',
          tests: [{ testName, duration, questions: [] }], // Assuming questions array is initially empty
        }),
      });

      const data = await response.json();

      if (data) {
        const testId=data.tests[data.tests.length-1]._id;
        console.log(testId);
        console.log('Test added successfully:', data);
        // navigate(`/questions/${testName}`);
        navigate(`/questions/${testId}`);

      } else {
        console.error('Error adding test 1:', data.error);
      }
    } catch (error) {
      console.error('Error adding test 2:', error);
    }
    // navigate(`/questions/${testName}`);
  };

  return (
    <div>
      <h2>Create Mock Test</h2>

      <label>
        Test Name:
        <TextField
          type="text"
          value={testName}
          onChange={handleTestNameChange}
        />
      </label>
      <br />

      <label>
        Duration (in minutes):
        <TextField
          type="number"
          value={duration}
          onChange={handleDurationChange}
        />
      </label>
      <br />

      <Button
        variant="contained"
        color="primary"
        onClick={handleNextClick}
        disabled={!isNextEnabled}
      >
        Next
      </Button>
    </div>
  );
};

export default CreateMockTest;