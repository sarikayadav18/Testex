import React, { useState } from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const SingleCorrectQuestionFormEdit = ({ onSave, testId, username,questionId, questionDetails }) => {
  const [question, setQuestion] = useState(questionDetails.questionText);
  const [questionImage, setQuestionImage] = useState(null);
  const [options, setOptions] = useState(questionDetails.options);
  const [positiveMarks, setPositiveMarks] = useState(questionDetails.positiveMark);
  const [negativeMarks, setNegativeMarks] = useState(questionDetails.negativeMark);

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

    // If the selected option is correct, unselect all other options
    if (key === 'isCorrect' && value) {
      updatedOptions.forEach((opt, i) => (i !== index ? (opt.isCorrect = false) : null));
    }

    updatedOptions[index][key] = value;
    setOptions(updatedOptions);
  };
  const handleEdit = async () => {
    const questionData = {
      questionType: 'singleCorrect',
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
      const response = await fetch(`http://localhost:8000/questions/${questionId}/${username}/${testId}`, {
        method: 'PUT', // Use 'PATCH' if your server supports partial updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Notify parent component or perform any other action upon successful edit
        console.log('Question data edited:', questionData);
      } else {
        console.error('Failed to edit question data:', result.message);
      }
      navigate(`/questions/${testId}`);
    } catch (error) {
      console.error('Error sending question data:', error);
    }
  };

  return (
    <div>
      <h3>Single Correct Question</h3>

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

          <RadioGroup>
            <FormControlLabel
              value="correct"
              control={<Radio checked={option.isCorrect} onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)} />}
              label="Correct"
            />
          </RadioGroup>

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
      {/* <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button> */}
      <Button variant="contained" color="primary" onClick={handleEdit}>
        Edit and Save
      </Button>
    </div>
  );
}

export default SingleCorrectQuestionFormEdit