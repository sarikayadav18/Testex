
import React, { useEffect, useRef, useState } from 'react';
import { useParams,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
const ResultPage = () => {
  const { testId } = useParams();
  const teacherTestRef = useRef(null);
  const studentTestRef = useRef(null);
  const [studentScore, setStudentScore] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const navigate = useNavigate(); // useNavigate hook for navigation
  const user = useSelector((state) => state.auth.user);
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
        const response = await fetch(`http://localhost:8000/api/getTestDetails/${user.username}/${testId}`);
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
  }, [user, testId]);

  useEffect(() => {
    // Marks correction logic
    if (dataLoaded && teacherTestRef.current && studentTestRef.current) {
      let obtainedMarks = 0;

      // console.log(studentTestRef.current);
      // console.log(teacherTestRef.current);

      studentTestRef.current.questions.forEach((studentQuestion) => {
        const correspondingTeacherQuestion = teacherTestRef.current.questions.find(
          (teacherQuestion) => teacherQuestion._id === studentQuestion._id
        );
        console.log(correspondingTeacherQuestion)

        if (correspondingTeacherQuestion) {
          // Correction logic for different question types
          switch (studentQuestion.questionType) {
            case 'singleCorrect':
              const selectedOption = studentQuestion.options.find((option) => option.isCorrect);

              if (selectedOption && selectedOption.isCorrect) {
                const correspondingTeacherOption = correspondingTeacherQuestion.options.find(
                  (teacherOption) => teacherOption._id === selectedOption._id && teacherOption.isCorrect
                );

                if (correspondingTeacherOption) {
                  obtainedMarks += correspondingTeacherQuestion.positiveMark;
                } else {
                  obtainedMarks -= Math.abs(correspondingTeacherQuestion.negativeMark);
                }
              } else {
                obtainedMarks -= Math.abs(correspondingTeacherQuestion.negativeMark);
              }
              break;
            case 'multipleCorrect':
              let f=0,cnt=0,totcrct=0;
              for(let i=0;i<correspondingTeacherQuestion.options.length;i++){
                if(correspondingTeacherQuestion.options[i].isCorrect===false){
                  if(studentQuestion.options[i].isCorrect===true){f=1;break;}
                }
                if(correspondingTeacherQuestion.options[i].isCorrect===true){
                  if(studentQuestion.options[i].isCorrect===true){cnt++;}
                }
                if(correspondingTeacherQuestion.options[i].isCorrect===true)totcrct++;
              }
              if(f===1){
                obtainedMarks-=Math.abs(correspondingTeacherQuestion.negativeMark);
              }else if(cnt===totcrct){
                obtainedMarks+=(Math.abs(correspondingTeacherQuestion.positiveMark));
              }
              else{
                obtainedMarks+=((cnt)*((Math.abs(correspondingTeacherQuestion.positiveMark))/(correspondingTeacherQuestion.options.length)));
              }
              break;

            case 'integerType':
              if (studentQuestion.integerAns === correspondingTeacherQuestion.integerAns) {
                obtainedMarks += correspondingTeacherQuestion.positiveMark;
              } else {
                obtainedMarks -= Math.abs(correspondingTeacherQuestion.negativeMark);
              }
              break;

            case 'decimalType':
              if (
                studentQuestion.lowDecimal >= correspondingTeacherQuestion.lowDecimal &&
                studentQuestion.highDecimal <= correspondingTeacherQuestion.highDecimal
              ) {
                obtainedMarks += correspondingTeacherQuestion.positiveMark;
              } else {
                obtainedMarks -= Math.abs(correspondingTeacherQuestion.negativeMark);
              }
              break;

            default:
              // Handle other question types if needed
              break;
          }
        }
      });

      setStudentScore(obtainedMarks);
    }
  }, [dataLoaded, teacherTestRef.current, studentTestRef.current]);

  const totalMarks = teacherTestRef.current?.questions.reduce((acc, q) => acc + q.positiveMark, 0) || 0;

  // console.log(studentTestRef.current);
  // console.log(teacherTestRef.current);

  const handleViewSolutionsClick = () => {
    // Assuming you have a route like '/solutions/:testId'
    navigate(`/solutions/${testId}`);
  };
  return (
    <div>
      <h1>Test Result</h1>
      {dataLoaded && studentScore !== null && teacherTestRef.current && studentTestRef.current ? (
        <>
          <p>Student Score: {studentScore}</p>
          <p>Total Marks: {totalMarks}</p>
          <p>Percentage: {(studentScore / totalMarks) * 100}%</p>
          <button onClick={handleViewSolutionsClick}>View Solutions</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ResultPage;
