// Login.js
// import './Login.css'
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });

//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     setErrorMessage('');
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('http://localhost:8000/login', formData, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const { role, username } = response.data.user;

//       // Store user information in localStorage
//       localStorage.setItem('user', JSON.stringify({ role, username }));
//       onLogin(role, { username });
//       navigate(role === 'teacher' ? '/TeacherHome' : '/StudentHome');
//     } catch (error) {
//       console.error('Login failed:', error.message);

//       if (error.response && error.response.status === 401) {
//         setErrorMessage('Invalid credentials. Please try again.');
//       } else {
//         setErrorMessage('Error during login. Please try again.');
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form>
//         <label>
//           Username:
//           <input type="text" name="username" onChange={handleInputChange} required />
//         </label>
//         <br />
//         <label>
//           Password:
//           <input type="password" name="password" onChange={handleInputChange} required />
//         </label>
//         <br />
//         <button type="button" onClick={handleLogin}>Login</button>
//       </form>

//       {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//     </div>
//   );
// };

// export default Login;
import './Login.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from './store/slices/AuthSlice';
const Login = ({ onLogin }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      const { token, user } = response.data;
      
      const { role, username } = user;
      console.log(token)
      // Store token in localStorage
      localStorage.setItem('token', token);
      onLogin(role, { username });
      dispatch(authActions.login({ user: user }));
      // Navigate based on the role of the user
      navigate(role === 'teacher' ? '/TeacherHome' : '/StudentHome');
    } catch (error) {
      console.error('Login failed:', error.message);

      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid credentials. Please try again.');
      } else {
        setErrorMessage('Error during login. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input type="text" name="username" onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" onChange={handleInputChange} required />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>Login</button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;

