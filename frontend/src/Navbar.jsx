import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store/slices/AuthSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.auth.isLogged);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');

    // Dispatch logout action
    dispatch(authActions.logout());

    // Redirect to login page
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };
  const handleHome = () => {
    user.role=='student'?navigate('/StudentHome'):navigate('/TeacherHome');
    
  };
  const handleGroups = () => {
    if(user.role === 'teacher')navigate('/teacher/groups');
    else if(user.role === 'student')navigate('/student/groups');
  };

  // Determine if current location is '/login' or '/signup'
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';

  return (
    <div style={styles.navbar}>
      <div style={styles.logo}>TESTex</div>
      <div style={styles.navLinks}>
        {isLogged && <button onClick={handleHome} style={styles.logoutButton}>Home</button>}
        {isLogged && user.role === 'teacher' && <button onClick={handleGroups} style={styles.logoutButton}>Groups</button>}
        {isLogged && user.role === 'student' && <button onClick={handleGroups} style={styles.logoutButton}>Groups</button>}
        {isLogged && <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>}
        {!isLogged && !isLoginPage && <button onClick={handleLogin} style={styles.logoutButton}>Login</button>}
        {!isLogged && !isSignupPage && <button onClick={handleSignup} style={styles.logoutButton}>Signup</button>}
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4b5c',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Navbar;
