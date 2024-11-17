let questionData = {};

const saveQuestionData = (data) => {
  questionData = data;
};

const getQuestionData = () => {
  return questionData;
};

export { saveQuestionData, getQuestionData };