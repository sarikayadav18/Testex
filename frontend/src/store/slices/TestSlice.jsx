

import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  test: null,
  currentIndex: 0, // Initialize currentIndex to 0
};

const TestSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setTest(state, action) {
      state.test = action.payload;
    },
    selectOption(state, action) {
      const { questionId, optionId } = action.payload;
    
      
      const question = state.test?.test?.questions?.find(q => q._id === questionId);
      console.log(question)
      if (question) {
        question.options.forEach(option => {
          if (option._id === optionId) {
            option.isCorrect=(!option.isCorrect);
           
          }
          else {
            option.isCorrect=false;
          }
        });
      }
    
    },

   selectOptions(state, action) {
      const { questionId, optionId } = action.payload;
    
      
      const question = state.test?.test?.questions?.find(q => q._id === questionId);
      console.log(question)
      if (question) {
        question.options.forEach(option => {
          if (option._id === optionId) {
            option.isCorrect=(!option.isCorrect);
           
          }
          // else {
          //   option.isCorrect=false;
          // }
        });
      }
    
    },
    updateIntegerAnswer(state, action) {
      const { questionId, integerAns } = action.payload;
      const question = state.test?.test?.questions?.find(q => q._id === questionId);
      if (question) {
        question.integerAns = integerAns;
      }
    },
    updateDecimalAnswer(state, action) {
      const { questionId, lowDecimal, highDecimal } = action.payload;
      const question = state.test?.test?.questions?.find(q => q._id === questionId);
      if (question) {
        question.lowDecimal = lowDecimal;
        question.highDecimal = highDecimal;
      }
    }
    ,
    setQuestionIndex(state, action) {
      state.currentIndex = action.payload;
    },
    setVisited(state, action) {
      const questionId = action.payload;
      const question = state.test?.test?.questions?.find(q => q._id === questionId);
      question.visited=true;
      
    },
    setMarkedForReview(state, action) {
      const questionId = action.payload;
      const question = state.test?.test?.questions?.find(q => q._id === questionId);
      question.markedForReview=!question.markedForReview;
      
    },
    setAnswered(state, action) {
      const questionId = action.payload;
      const question = state.test?.test?.questions?.find(q => q._id === questionId);
      question.visited=true;
     let tct=0;
      if (question) {
        question.options.forEach(option => {
          if (option.isCorrect==true) {
            tct++;
          }
          
        });
      }
      if(tct>0)question.answered=true;
      else question.answered=false;

      if(question.integerAns || question.highDecimal || question.lowDecimal)question.answered=true;
      
      
    },
  
  },
});

// export const TestActions = TestSlice.actions;
export const { setTest, selectOption, setQuestionIndex,selectOptions,setAnswered,setMarkedForReview,setVisited } = TestSlice.actions;
export const TestActions=TestSlice.actions;
export { TestSlice };
