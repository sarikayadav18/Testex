import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TestActions } from './store/slices/TestSlice';
import TestWindow from './TestWindow';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';

const TestDetails = () => {
  const dispatch = useDispatch();
  const { testId } = useParams();
  const username = useSelector((state) => state.auth.user?.username); // Ensure user and username exist
  const testDetails = useSelector((state) => state.test.test);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        if (username) {
          const response = await axios.get(`http://localhost:8000/api/getTestDetails/${username}/${testId}`);
         
          const endTime=(new Date(response.data.test.endTime)).getTime();

   
        if(endTime<Date.now()){
         // dispatch(setTest(null));
          navigate(`/result/${response.data.test._id}`);
         // return;
        }
        else
          dispatch(TestActions.setTest(response.data));
        } else {
          console.error('Username is null or undefined.');
        }
      } catch (error) {
        console.error('Failed to fetch test details:', error);
      }
    };

    if (username && testId) {
      fetchTestDetails();
    }
  }, [dispatch, username, testId]);

  // Handle initial loading state or if username is not available yet
  if (!username) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {testDetails ? (
      <TestWindow testId={testId}/>
      ) : (
        <div>Loading test details...</div>
      )}
    </div>
  );
};

export default TestDetails;
