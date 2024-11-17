
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Signup = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     role: '', // Add role field to your form
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:8000/signup', formData, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log('Signup successful');
//       const { role, username } = formData;

//       onLogin(role, { username });

//       if (role === 'teacher') {
//         navigate('/TeacherHome');
//       } else if (role === 'student') {
//         navigate('/StudentHome');
//       }
//     } catch (error) {
//       console.error('Signup failed:', error.message);

//       if (error.response && error.response.status === 400) {
//         setErrorMessage('Username already exists. Please choose a different username.');
//       } else {
//         setErrorMessage('Error during signup. Please try again.');
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Signup</h2>
//       <form onSubmit={handleSubmit}>
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
//         <label>
//           Role:
//           <select name="role" onChange={handleInputChange} required>
//             <option value="" disabled selected>Select role</option>
//             <option value="teacher">Teacher</option>
//             <option value="student">Student</option>
//           </select>
//         </label>
//         <br />
//         <button type="submit">Signup</button>
//       </form>

//       {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//     </div>
//   );
// };

// export default Signup;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from './store/slices/AuthSlice';
const Signup = ({ onLogin }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '', // Add role field to your form
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Signup successful');
      const { token, user } = response.data;

      // Store the JWT token in localStorage
      localStorage.setItem('token', token);

      onLogin(user.role, { username: user.username });
      dispatch(authActions.login({ user: user }));
      if (user.role === 'teacher') {
        navigate('/TeacherHome');
      } else if (user.role === 'student') {
        navigate('/StudentHome');
      }
    } catch (error) {
      console.error('Signup failed:', error.message);

      if (error.response && error.response.status === 400) {
        setErrorMessage('Username already exists. Please choose a different username.');
      } else {
        setErrorMessage('Error during signup. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
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
        <label>
          Role:
          <select name="role" onChange={handleInputChange} required>
            <option value="" disabled selected>Select role</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </label>
        <br />
        <button type="submit">Signup</button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default Signup;
