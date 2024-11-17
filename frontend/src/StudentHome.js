
// import './StudentHome.css';
// import React, { useState ,useEffect,useRef} from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// const StudentHome = ({ userInfo }) => {
//   const user = useSelector((state) => state.auth.user);

// const TestDetails=useRef('');
//   const [inputValue, setInputValue] = useState('');
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Clear the authentication token from local storage
//     localStorage.removeItem('token');
  
//     // Redirect to the login page
//     navigate('/login');
//   };

//   const addTestInStudent = async (testDetails) => {
    
//     try {
//       // Assuming you have an API endpoint to update the student's tests
//       const response = await fetch('http://localhost:8000/api/addTestInStudent', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           studentId: user.username, // Replace with the actual student ID
//           testDetails: testDetails,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         console.log('Student tests updated successfully');
//       } else {
//         console.error('Failed to update student tests:', data.error);
//       }
//     } catch (error) {
//       console.error('Error updating student tests:', error);
//     }
    
//   };
//   const fetchTestDetails = async () => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/getTest/${inputValue}`);
//       const data = await response.json();

//       if (data.success) {
//         TestDetails.current=data.test;
      
//       } else {
//         console.error('Failed to fetch test details:', data.error);
//       }
//     } catch (error) {
//       console.error('Error fetching test details:', error);
//     }
//   };




//   const handleJoin = async() => {
//     // Handle the join action with the inputValue
//     if (inputValue.trim() !== '') {
      
//       // Navigate to the test page with the joined test name
//     await  fetchTestDetails();
//     await addTestInStudent(TestDetails.current);
//     navigate(`/testpage/${inputValue}`);
//     } else {
//       // Display an error or inform the user that the input is empty
//       console.error('Please enter a test');
//     }
//   };


//   return (
//     <div>
//       <h2>Welcome, {user.username}!</h2>
//       <p>Your role: Student</p>

//       {/* Input field for joining */}
//       <label>
//         Join Test:
//         <input
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//         />
//       </label>
//       <button onClick={handleJoin}>Join</button>

//       {/* Other content for the StudentHome page */}

//       {/* Logout button */}
      
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// };

// export default StudentHome;
// import './StudentHome.css';
// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const StudentHome = () => {
//   const user = useSelector((state) => state.auth.user);
//   const TestDetails = useRef('');
//   const [inputValue, setInputValue] = useState('');
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Clear the authentication token from local storage
//     localStorage.removeItem('token');

//     // Redirect to the login page
//     navigate('/login');
//   };

//   const addTestInStudent = async (testDetails) => {
//     try {
//       // Assuming you have an API endpoint to update the student's tests
//       const response = await fetch('http://localhost:8000/api/addTestInStudent', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           studentId: user.username, // Replace with the actual student ID
//           testDetails: testDetails,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         console.log('Student tests updated successfully');
//       } else {
//         console.error('Failed to update student tests:', data.error);
//       }
//     } catch (error) {
//       console.error('Error updating student tests:', error);
//     }
//   };

//   const fetchTestDetails = async () => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/getTest/${inputValue}`);
//       const data = await response.json();

//       if (data.success) {
//         TestDetails.current = data.test;
//       } else {
//         console.error('Failed to fetch test details:', data.error);
//       }
//     } catch (error) {
//       console.error('Error fetching test details:', error);
//     }
//   };

//   const handleJoin = async () => {
//     // Handle the join action with the inputValue
//     if (inputValue.trim() !== '') {
//       // Navigate to the test page with the joined test name
//       await fetchTestDetails();
//       await addTestInStudent(TestDetails.current);
//       navigate(`/testpage/${inputValue}`);
//     } else {
//       // Display an error or inform the user that the input is empty
//       console.error('Please enter a test');
//     }
//   };

//   return (
//     <div>
//       <h2>Welcome, {user.username}!</h2>
//       <p>Your role: Student</p>

//       {/* Input field for joining */}
//       <label>
//         Join Test:
//         <input
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//         />
//       </label>
//       <button onClick={handleJoin}>Join</button>

//       {/* List of tests the user has attended */}
//       <div>
//         <h3>Attended Tests:</h3>
//         {user.tests.length > 0 ? (
//           <ul>
//             {user.tests.map((test) => (
//               <li key={test._id}>{test.testName}</li>
//             ))}
//           </ul>
//         ) : (
//           <p>No tests attended yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentHome;
import './StudentHome.css';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const StudentHome = () => {
  const user = useSelector((state) => state.auth.user);
  
  const TestDetails = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Handle the case where user is not available
      setErrorMessage('User not found. Please log in.');
    }
  }, [user]);

  const fetchTestDetails = async (testId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/getTest/${testId}`);
      if (response.data.success) {
        TestDetails.current = response.data.test;
        return response.data.test;
      } else {
        throw new Error(response.data.error || 'Failed to fetch test details');
      }
    } catch (error) {
      console.error('Error fetching test details:', error);
      throw error;
    }
  };

  const addTestInStudent = async (testDetails) => {
    try {
      const response = await axios.post('http://localhost:8000/api/addTestInStudent', {
        studentId: user.username,
        testDetails: testDetails,
      });

      if (response.data.success) {
        console.log('Student tests updated successfully');
      } else {
        throw new Error(response.data.error || 'Failed to update student tests');
      }
    } catch (error) {
      console.error('Error updating student tests:', error);
      throw error;
    }
  };
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get('http://localhost:8000/getUserByjwt', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(authActions?.login({ user: response.data }));
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  const handleJoin = async () => {
    if (inputValue.trim() === '') {
      setErrorMessage('Please enter a test ID');
      return;
    }

    try {
      const userData = await fetchUserData();

      if (userData) {
        const ongoingTest = userData.tests?.find(
          (test) => test.endTime && new Date(test.endTime).getTime() > Date.now()
        );
  
        if (ongoingTest && ongoingTest._id!=testId) {
          alert('Some other test is going on. End that first!');
          navigate(`/testDetails/${ongoingTest._id}`);
          return;
        }
      }
  
      const testDetails = await fetchTestDetails(inputValue);
      await addTestInStudent(testDetails);
      await fetchUserData();
     // navigate(`/testpage/${inputValue}`);
     navigate(`/testDetails/${inputValue}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleViewResult = (testId) => {
    navigate(`/result/${testId}`);
  };

  const handleViewSolution = (testId) => {
    navigate(`/solutions/${testId}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <p>Your role: Student</p>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <label>
        Join Test:
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </label>
      <button onClick={handleJoin}>Join</button>

      <h3>Your Tests:</h3>
      <ul>
        {user.tests && user.tests.length > 0 ? (
          user.tests.map((test) => (
            <li key={test._id}>
              {test.testName}
              <button onClick={() => handleViewResult(test._id)}>Your Score</button>
              {/* <button onClick={() => handleViewLeaderboard(test._id)}>Leaderboard</button> */}
              <button onClick={() => handleViewSolution(test._id)}>Solution</button>
            </li>
          ))
        ) : (
          <p>No tests available</p>
        )}
      </ul>
    </div>
  );
};

export default StudentHome;
