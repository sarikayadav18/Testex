import React, { createContext, useContext, useState } from 'react';

const QuestionDataContext = createContext();

export const useQuestionDataContext = () => {
  const context = useContext(QuestionDataContext);
  if (!context) {
    throw new Error("useQuestionDataContext must be used within a QuestionDataProvider");
  }
  return context;
};

export const QuestionDataProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);

  const saveQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  return (
    <QuestionDataContext.Provider value={{ questions, saveQuestion }}>
      {children}
    </QuestionDataContext.Provider>
  );
};