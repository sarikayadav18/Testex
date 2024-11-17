import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QuestionDataProvider } from './QuestionDataContext';
import store from './store/store.js'
import {Provider} from 'react-redux'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  // <React.StrictMode>
  <Provider store={store}>
    <QuestionDataProvider>
      <App />
    </QuestionDataProvider>
  </Provider>
  // </React.StrictMode>
);

