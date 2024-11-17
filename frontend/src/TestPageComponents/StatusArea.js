import React from 'react';
import './StatusArea.css'

const StatusArea = ({ questionStatus }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 1:
        return 'visited-box';
      case 2:
        return 'answered-box';
      default:
        return 'not-visited-box';
    }
  };

  const getCounts = () => {
    const counts = { answered: 0, notAnswered: 0, notVisited: 0 };
    questionStatus.forEach((status) => {
      switch (status) {
        case 1:
          counts.notAnswered++;
          break;
        case 2:
          counts.answered++;
          break;
        default:
          counts.notVisited++;
          break;
      }
    });
    return counts;
  };

  const counts = getCounts();

  return (
    <div className="status-area">
      <div className="status-count-box answered-box">
        Answered: {counts.answered}
      </div>
      <div className="status-count-box not-answered-box">
        Not Answered: {counts.notAnswered}
      </div>
      <div className="status-count-box visited-box">
        Visited: {counts.answered+counts.notAnswered}
      </div>
      <div className="status-count-box not-visited-box">
        Not Visited: {counts.notVisited}
      </div>
    </div>
  );
};

export default StatusArea;
