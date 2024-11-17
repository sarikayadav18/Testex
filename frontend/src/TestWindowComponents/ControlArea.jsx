import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAnswered, setMarkedForReview, setQuestionIndex, setTest, setVisited } from '../store/slices/TestSlice';

const ControlArea = ({questionId,currentIndex, questionsLength,testId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const  username  = useSelector(state => state.auth?.user?.username); //Assuming username is available in auth.user
  const  userId  = useSelector(state => state.auth?.user?._id); 
  const question = useSelector(state => state.test?.test?.test?.questions?.find(q => q._id === questionId));
  const answeredRef=useRef(question.answered);
  const visitedRef=useRef(question.visited);
  const markedForReviewRef=useRef(question.markedForReview);
  const handleNext = async () => {
    visitedRef.current=true;
    console.log("mai hun" ,question)
    let tct=0;
    question.options.forEach(option => {
      if(option.isCorrect){tct++;}

      
    });
    if(tct>0)answeredRef.current=true;
    else answeredRef.current=false;
    if(question.integerAns || question.highDecimal || question.lowDecimal)answeredRef.current=true;

    console.log(answeredRef.current)
    dispatch(setAnswered(questionId));
    dispatch(setVisited(questionId));
    if (currentIndex < questionsLength - 1) {
      const nextIndex = currentIndex + 1;
      dispatch(setQuestionIndex(nextIndex));
      await updateQuestion(username, questionId); // Call API to update question
    }
  };

  const handlePrevious = async () => {
    visitedRef.current=true;
    let tct=0;
    question.options.forEach(option => {
      if(option.isCorrect){tct++;}

      
    });
    if(tct>0)answeredRef.current=true;
    else answeredRef.current=false;
    if(question.integerAns || question.highDecimal || question.lowDecimal)answeredRef.current=true;

    dispatch(setAnswered(questionId));
    dispatch(setVisited(questionId));
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      dispatch(setQuestionIndex(previousIndex));
      await updateQuestion(username,questionId); // Call API to update question
    }
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
          answered:answeredRef.current,
          visited:visitedRef.current,
          markedForReview:markedForReviewRef.current,


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
    dispatch(setTest(null));
    dispatch(setQuestionIndex(0));
    navigate(`/result/${testId}`); // Navigate to ResultPage.jsx
  };
  const handleMarkForReview=async()=>{
    visitedRef.current=true;
    question.options.forEach(option => {
      if(option.isCorrect)answeredRef.current=true;
      
    });
    dispatch(setAnswered(questionId));
    dispatch(setVisited(questionId));

    markedForReviewRef.current=!markedForReviewRef.current;
    dispatch(setMarkedForReview(questionId));
    await updateQuestion(username,questionId);
  }

  return (
    <div style={styles.controlArea}>
      <button onClick={handlePrevious} >
        Previous
      </button>
      <button onClick={handleNext} >
        Next
      </button>
      <button onClick={handleMarkForReview} >
        Mark for Review
      </button>
      <button onClick={handleEndTest} >
        End Test
      </button>
    </div>
  );
};

const styles = {
  controlArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  },
};

export default ControlArea;

