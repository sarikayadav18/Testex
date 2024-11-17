import React, { useEffect, useRef, useState } from 'react';
import { useParams,useNavigate} from 'react-router-dom';
const SolutionTestFetch = ({ username, testId, studentTestRef, teacherTestRef ,setDataLoaded}) => {
  
  useEffect(() => {
    const fetchTeacherTest = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/getTestById/${testId}`);
        const data = await response.json();

        if (data.success) {
          teacherTestRef.current = data.test;
        } else {
          console.error('Failed to fetch teacher test details:', data.error);
        }
      } catch (error) {
        console.error('Error fetching teacher test details:', error);
      }
    };

    const fetchStudentTest = async () => {
      try {
        console.log('Fetching data from the backend');
        const response = await fetch(`http://localhost:8000/api/getTestDetails/${username}/${testId}`);
        const data = await response.json();

        console.log('Fetched data:', data);

        if (data.success) {
          studentTestRef.current = data.test;
        } else {
          console.error('Failed to fetch student test details:', data.error);
        }
      } catch (error) {
        console.error('Error fetching student test details:', error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchTeacherTest(), fetchStudentTest()]);
      setDataLoaded(true);
    };

    fetchData();
  }, [username, testId]);

  return null;
};

export default SolutionTestFetch;