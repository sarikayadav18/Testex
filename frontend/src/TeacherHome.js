import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSelector } from 'react-redux';

const TeacherHome = () => {
  const user = useSelector((state) => state.auth.user);
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/getTests/${user.username}`);
        const result = await response.json();

        if (result.success) {
          setTests(result.tests);
        } else {
          console.error('Failed to fetch tests:', result.message);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, [user]);

  const handleDeleteTest = async (testName) => {
    try {
      const deleteResponse = await fetch(`http://localhost:8000/delete-test/${user.username}/${testName}`, {
        method: 'DELETE',
      });

      const deleteData = await deleteResponse.json();

      if (deleteData.success) {
        // Update the state to reflect the deleted test
        setTests((prevTests) => prevTests.filter((test) => test.testName !== testName));
      } else {
        console.error('Failed to delete test:', deleteData.message);
      }
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const handleEditTest = (testId) => {
    // Perform the required actions when the Edit button is clicked
    console.log(`Edit button clicked for testId: ${testId}`);
    navigate(`/questions/${testId}`);
  };

  const handleCopyTestId = (testId) => {
    navigator.clipboard.writeText(testId)
      .then(() => {
        alert(`Test ID ${testId} copied to clipboard`);
      })
      .catch((error) => {
        console.error('Failed to copy test ID:', error);
      });
  };

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <p>Your role: Teacher</p>

      <Link to="/createMockTest">
        <button>Create Mock Test</button>
      </Link>

      {tests.length > 0 ? (
        <div>
          <h3>Your Tests:</h3>
          <ul>
            {tests.map((test) => (
              <li key={test._id} style={{ display: 'flex', alignItems: 'center' }}>
                {test.testName}
                <span
                  onClick={() => window.confirm('Are you sure you want to delete this test?') && handleDeleteTest(test.testName)}
                  style={{
                    cursor: 'pointer',
                    color: 'red',
                    marginLeft: '10px',
                  }}
                >
                  <DeleteIcon />
                </span>
                <span
                  onClick={() => handleEditTest(test._id)}
                  style={{
                    cursor: 'pointer',
                    color: 'blue',
                    marginLeft: '10px',
                  }}
                >
                  <EditIcon />
                </span>
                <span
                  onClick={() => handleCopyTestId(test._id)}
                  style={{
                    cursor: 'pointer',
                    color: 'green',
                    marginLeft: '10px',
                  }}
                >
                  <ContentCopyIcon />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No tests available.</p>
      )}
    </div>
  );
};

export default TeacherHome;
