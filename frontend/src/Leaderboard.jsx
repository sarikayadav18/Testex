import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Leaderboard = () => {
  const { testId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/leaderboard/${testId}`);
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, [testId]);

  return (
    <div style={styles.leaderboard}>
      <h2>Leaderboard for Test {testId}</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Marks</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((student, index) => (
            <tr key={student.username}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{student.username}</td>
              <td style={styles.td}>{student.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  leaderboard: {
    margin: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f2f2f2',
  },
  td: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
};

export default Leaderboard;
