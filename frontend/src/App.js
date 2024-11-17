

// // App.js
// import './App.css';
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
// import Signup from './Signup';
// import Login from './Login';
// import TeacherHome from './TeacherHome';
// import StudentHome from './StudentHome';
// import CreateMockTest from './CreateMockTest';
// import QuestionPage from './QuestionPage';
// import AddQuestionPage from './AddQuestionPage';
// import EditQuestion from './EditPages/EditQuestion';
// import TestPage from './TestPage'
// import ResultPage from './ResultPage';
// import SolutionPage from './SolutionPage';
// const App = () => {
//   const [userRole, setUserRole] = useState(null);
//   const [userInfo, setUserInfo] = useState({});
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//  const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       const { role, username } = JSON.parse(storedUser);
//       setUserRole(role);
//       setUserInfo({ username });
//       setAuthenticated(true);
//     }
//   }, []);

//   const handleLogin = (role, user) => {
//     setUserRole(role);
//     setUserInfo(user);
//     setAuthenticated(true);
//   };

//   return (
//     <Router>
//       <div>
//         <nav>
//           <ul>
//             <li><Link to="/signup">Signup</Link></li>
//             <li><Link to="/login">Login</Link></li>
//             <li><Link to="/questions">Questions</Link></li>
//           </ul>
//         </nav>

//         <hr />

//         <Routes>
//           <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
//           <Route path="/login" element={<Login onLogin={handleLogin} />} />

//           {authenticated && (
//             <>
//               <Route path="/TeacherHome" element={<TeacherHome userInfo={userInfo} />} />
//               <Route path="/StudentHome" element={<StudentHome userInfo={userInfo} />} />
//               <Route path="/CreateMockTest" element={<CreateMockTest userInfo={userInfo}/>} />
//               <Route path="/questions/:testName" element={<QuestionPage userInfo={userInfo}/>} />
//               <Route path="/add-question/:testName" element={<AddQuestionPage userInfo={userInfo}/>} />
//               <Route path="/edit-question/:testName/:questionId" element={<EditQuestion userInfo={userInfo}/>} />
//               <Route path="/testpage/:testId" element={<TestPage userInfo={userInfo} />}/>
//               <Route path="/result/:testId" element={<ResultPage username={userInfo.username} />}/>
//               <Route path="/solutions/:testId/" element={<SolutionPage username={userInfo.username}/>} />
//             </>
//           )}

//           <Route
//             path="/"
//             element={<Navigate to="/login" />}
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

// App.js
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { authActions } from './store/slices/AuthSlice.jsx';
import axios from 'axios';
import Signup from './Signup';
import Login from './Login';
import TeacherHome from './TeacherHome';
import StudentHome from './StudentHome';
import CreateMockTest from './CreateMockTest';
import QuestionPage from './QuestionPage';
import AddQuestionPage from './AddQuestionPage';
import EditQuestion from './EditPages/EditQuestion';
import TestPage from './TestPage'

import ResultPage from './ResultPage';
import SolutionPage from './SolutionPage';
import Navbar from './Navbar';
import TeacherGroups from './TeacherGroups'
import GroupDetailsPage from './GroupDetailsPage.jsx'
import StudentGroups from './StudentGroups.jsx'
import StudentGroupDetailsPage from './StudentGroupDetailsPage'
import TestDetails from './TestDetails.jsx';

const App = () => {
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [authenticated, setAuthenticated] = useState(false);
  const isLogged = (state) => {
    return state.auth.isLogged;
  }
  const loggedUser = useSelector((state) => state.auth.user);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get JWT token from local storage (assuming it's stored there after login)
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found');
        }

        // Make API call to backend to get user data
        const response = await axios.get('http://localhost:8000/getUserByjwt', {
          headers: {
            Authorization: `Bearer ${token}` // Attach JWT token to the request
          }
        });

        // setUserData(response.data);
        dispatch(authActions?.login({user:response.data}));
        setUserRole(loggedUser?.role);

        setUserInfo({username: loggedUser?.username});
        setAuthenticated(true);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUserData();
  }, [dispatch]);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { role, username } = JSON.parse(storedUser);
      setUserRole(role);
      setUserInfo({ username });
      setAuthenticated(true);
    }
  }, [dispatch]);

  const handleLogin = (role, user) => {
    setUserRole(role);
    setUserInfo(user);
    setAuthenticated(true);
  };

  return (
    <Router>
      <div className="app-container">
        
      {<Navbar />}
        <main>
          <Routes>
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {authenticated && (
              <>
            
                <Route exact path="/TeacherHome" element={<TeacherHome userInfo={userInfo} />} />
                <Route exact path="/StudentHome" element={<StudentHome userInfo={userInfo} />} />
                <Route exact path="/CreateMockTest" element={<CreateMockTest userInfo={userInfo} />} />
                <Route exact path="/questions/:testId" element={<QuestionPage userInfo={userInfo} />} />
                <Route exact path="/add-question/:testId" element={<AddQuestionPage userInfo={userInfo} />} />
                <Route exact path="/edit-question/:testId/:questionId" element={<EditQuestion userInfo={userInfo} />} />
                <Route exact path="/testpage/:testId" element={<TestPage userInfo={userInfo} />} />
               
                <Route exact path="/testdetails/:testId" element={<TestDetails />} />
                <Route exact path="/result/:testId" element={<ResultPage username={userInfo.username} />} />
                <Route exact path="/solutions/:testId/" element={<SolutionPage username={userInfo.username} />} />
                <Route exact path="/teacher/groups" element={<TeacherGroups />} />
                <Route exact path="/group-details/:groupId" element={<GroupDetailsPage />} />
                <Route exact path="/student/groups" element={<StudentGroups/>} />
                <Route path="/student/groups/:groupId" element={<StudentGroupDetailsPage/>} />
              </>
            )}

            <Route
              path="/"
              element={<Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;