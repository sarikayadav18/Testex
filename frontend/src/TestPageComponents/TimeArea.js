// TimeArea.js
import React, { useState, useEffect } from 'react';

const TimeArea = ({ duration }) => {
  const initialTimeInSeconds = duration * 60; // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const storedTime = localStorage.getItem('timeRemaining');
    return storedTime ? parseInt(storedTime, 10) : initialTimeInSeconds;
  });

  useEffect(() => {
    let timer;

    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          localStorage.setItem('timeRemaining', prevTime - 1);
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);

  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div
        style={{
          backgroundColor: '#f0f0f0',
          padding: '15px',
          borderRadius: '10px',
          display: 'inline-block',
        }}
      >
        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
          Remaining Time: {formatTime(timeRemaining)}
        </p>
      </div>
    </div>
  );
};

export default TimeArea;
