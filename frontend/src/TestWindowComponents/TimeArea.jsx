import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import { setQuestionIndex, setTest } from '../store/slices/TestSlice';



const TimeArea = ({ testId,questionId}) => {
  const dispatch = useDispatch();
  const test = useSelector(state => state.test?.test?.test);
  const question = useSelector(state => state.test?.test?.test?.questions?.find(q => q._id === questionId));
  const  username  = useSelector(state => state.auth?.user?.username);
  const  userId  = useSelector(state => state.auth?.user?._id);
  const navigate=useNavigate();

  if (!test || test._id !== testId) {
    return null; // Handle case when test data is not loaded or doesn't match testId
  }

  const { startTime, duration } = test;
  const startTimeDate = new Date(startTime);
  const initialTime = duration * 60 * 1000 - (Date.now() - startTimeDate.getTime());
  console.log(initialTime)

  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
     handleEndTest();
     dispatch(setTest(null));// to remove test from redux after end
     dispatch(setQuestionIndex(0));

      return;
    }
    else if(Date.now()>(new Date(test.endTime)).getTime()){
        console.log((new Date(test.endTime)).getTime())
        console.log(Date.now());
        dispatch(setTest(null));
        dispatch(setQuestionIndex(0));
        navigate(`/result/${testId}`);
        return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1000);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, dispatch, testId]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const updateQuestion = async (username, questionId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/updateQuestion/${username}/${questionId}`, {
        method: 'PUT', // Adjust method as per your backend API
        headers: {
          'Content-Type': 'application/json',
        },
        // Optionally, send updated question data in the body if needed
        body: JSON.stringify({
          // Add relevant updated question data from Redux state if needed
          options:question.options,
          integerAns:question.integerAns,
          lowDecimal:question.lowDecimal,
          highDecimal:question.highDecimal,
          answered:question.answered,
          visited:true,
          markedForReview:question.markedForReview,


        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update question on the server.');
      }

      // Handle successful response or further actions if needed
    } catch (error) {
      console.error('Error updating question:', error);
      // Handle error scenarios, e.g., display error message
    }
  };
  const updateEndTime = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/updateEndTime/${userId}/${testId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update endTime');
      }

      const data = await response.json();
      
    } catch (error) {
      console.error('Error updating endTime:', error);
      // Handle error scenario
    }
  };
  const handleEndTest = async () => {
    await updateQuestion(username,questionId); 
    await updateEndTime();
    navigate(`/result/${testId}`); // Navigate to ResultPage.jsx
  };

  return (
    <div>
      <h2>Time Left: {formatTime(timeLeft)}</h2>
    </div>
  );
};

export default TimeArea;
