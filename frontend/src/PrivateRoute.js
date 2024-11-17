// PrivateRoute.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles, authenticated, userRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on the user's role when authenticated
    if (authenticated) {
      if (!allowedRoles.includes(userRole)) {
        navigate('/login'); // Redirect to login if the user's role is not allowed
      }
    }
  }, [authenticated, allowedRoles, userRole, navigate]);

  return authenticated ? element : null; // Render the component only if authenticated
};

export default PrivateRoute;