// TestFetch.js
import React, { useEffect } from 'react';
import {useSelector} from 'react-redux'
const TestFetch = ({ userInfo, testId, setTestDetails, setQuestions ,setOptions}) => {
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        console.log('Fetching data from the backend');
        const response = await fetch(`http://localhost:8000/api/getTestDetails/${user.username}/${testId}`);
        const data = await response.json();

        console.log('Fetched data:', data);

        if (data.success) {
          setTestDetails(data.test);
          setQuestions(data.test.questions);  // Update questions after setting test details
        //   setOptions(data.test.questions.options);
        } else {
          console.error('Failed to fetch test details:', data.error);
        }
      } catch (error) {
        console.error('Error fetching test details:', error);
      }
    };

    fetchTestDetails();
  }, [user, testId, setTestDetails, setQuestions]);

  return null;
};

export default TestFetch;

