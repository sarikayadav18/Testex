import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DecimalTypeQuestionForm = (props) => {
  const [question, setQuestion] = useState('');
  const [questionImage, setQuestionImage] = useState(null);
  const [answerMin, setAnswerMin] = useState('');
  const [answerMax, setAnswerMax] = useState('');
  const [positiveMarks, setPositiveMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const navigate = useNavigate();

  const handleQuestionImageChange = (e) => {
    const file = e.target.files[0];
    setQuestionImage(file);
  };

  const handleSave = async () => {
    const questionData = {

      questionType: 'decimalType',
      questionText: question,
      questionImage: 'no img', // You need to handle image uploads separately
      
      positiveMark: positiveMarks,
      negativeMark: negativeMarks,
      
      lowDecimal:answerMin,
      highDecimal:answerMax,
      positiveMark:positiveMarks,
      negativeMark:negativeMarks,
    };

    try {
      const response = await fetch('http://localhost:8000/users-add-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username:props.username,
          role:'teacher',
          tests: [
            {
              testId:props.testId.testId,
              questions: [questionData],
            },
          ],
        }),
      });

      const result = await response.json();

      // if (result.success) {
      //   onSave && onSave(questionData);
      //   console.log('Question data saved:', questionData);
      // } else {
      //   console.error('Failed to save question data:', result.message);
      // }
      navigate(`/questions/${props.testId.testId}`);
    } catch (error) {
      console.error('Error sending question data:', error);
    }
  };

  return (
    <div>
      <h3>Decimal Type Question</h3>

      {/* Question Input */}
      <TextField
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        multiline
        rows={4}
        label="Question"
        placeholder="Enter question"
      />
      <input type="file" accept="image/*" onChange={handleQuestionImageChange} />

      {/* Answer Input Fields (Range for Decimal Numbers) */}
      <TextField
        type="number"
        value={answerMin}
        onChange={(e) => setAnswerMin(e.target.value)}
        label="Answer (Min)"
      />
      <TextField
        type="number"
        value={answerMax}
        onChange={(e) => setAnswerMax(e.target.value)}
        label="Answer (Max)"
      />

      {/* Positive Marks Input Field */}
      <TextField
        type="number"
        value={positiveMarks}
        onChange={(e) => setPositiveMarks(e.target.value)}
        label="Positive Marks"
      />

      {/* Negative Marks Input Field */}
      <TextField
        type="number"
        value={negativeMarks}
        onChange={(e) => setNegativeMarks(e.target.value)}
        label="Negative Marks"
      />

      {/* Save Button */}
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};

export default DecimalTypeQuestionForm;