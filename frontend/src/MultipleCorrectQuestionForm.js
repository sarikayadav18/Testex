import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MultipleCorrectQuestionForm = (props) => {
  const [question, setQuestion] = useState('');
  const [questionImage, setQuestionImage] = useState(null);
  const [options, setOptions] = useState([{ text: '', isCorrect: false, image: null }]);
  const [positiveMarks, setPositiveMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false, image: null }]);
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const handleQuestionImageChange = (e) => {
    const file = e.target.files[0];
    setQuestionImage(file);
  };

  const handleOptionChange = (index, key, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][key] = value;
    setOptions(updatedOptions);
  };
  const handleSave = async () => {
    const questionData = {
      questionType: 'multipleCorrect',
      questionText: question,
      questionImage: 'no img', // You need to handle image uploads separately
      options: options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect,
        image: 'no img', // You need to handle image uploads separately
      })),
      positiveMark: positiveMarks,
      negativeMark: negativeMarks,
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
      <h3>Multiple Correct Question</h3>

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

      {/* Options */}
      {options.map((option, index) => (
        <div key={index}>
          <TextField
            value={option.text}
            onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
            placeholder={`Option ${index + 1}`}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={option.isCorrect}
                onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
              />
            }
            label="Correct"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleOptionChange(index, 'image', e.target.files[0])}
          />

          {/* Delete Option Icon */}
          <IconButton onClick={() => handleDeleteOption(index)}>
            <Delete />
          </IconButton>
        </div>
      ))}

      {/* Add Option Button */}
      <Button variant="outlined" onClick={handleAddOption}>
        Add Option
      </Button>

      {/* Marks Input */}
      <TextField
        type="number"
        value={positiveMarks}
        onChange={(e) => setPositiveMarks(e.target.value)}
        label="Positive Marks"
      />

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

export default MultipleCorrectQuestionForm;