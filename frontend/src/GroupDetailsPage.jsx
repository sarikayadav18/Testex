import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';

// Set the app element for accessibility
Modal.setAppElement('#root');

const GroupTests = ({ tests, onAddTestClick, onRemoveTestClick }) => {
  return (
    <div>
      <h3>Tests</h3>
      <button onClick={onAddTestClick} style={buttonStyle}>Add Test</button>
      <ul>
        {tests.length > 0 ? tests.map((test, index) => (
          <li key={test._id}>
            {index + 1}. {test.testName} 
            <button onClick={() => onRemoveTestClick(test._id)} style={removeButtonStyle}>Remove</button>
          </li>
        )) : (
          <p>No Tests in this Group</p>
        )}
      </ul>
    </div>
  );
};

const GroupMembers = ({ teachers, students }) => {
  return (
    <div>
      <h3>Teachers</h3>
      <ul>
        {teachers.map((teacher, index) => (
          <li key={teacher._id}>{index + 1}. {teacher.username}</li>
        ))}
      </ul>
      <h3>Students</h3>
      {students.length > 0 ? (
        <ul>
          {students.map((student, index) => (
            <li key={student._id}>{index + 1}. {student.username}</li>
          ))}
        </ul>
      ) : (
        <p>No students</p>
      )}
    </div>
  );
};

const GroupDetailsPage = () => {
  const { groupId } = useParams(); // Assuming you have groupId in the URL params
  const user = useSelector((state) => state.auth.user);
  const [group, setGroup] = useState(null);
  const [teacherTests, setTeacherTests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('members'); // To handle tab switching
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/groups/${groupId}`);
        setGroup(response.data);
      } catch (error) {
        console.error('Error fetching group details:', error);
        setErrorMessage('Error fetching group details');
      }
    };

    const fetchTeacherTests = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tests/teacher/${user._id}`);
        setTeacherTests(response.data);
      } catch (error) {
        console.error('Error fetching teacher tests:', error);
        setErrorMessage('Error fetching teacher tests');
      }
    };

    fetchGroupDetails();
    fetchTeacherTests();
  }, [groupId, user._id]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addTestToGroup = async (testId) => {
    try {
      const response = await axios.post(`http://localhost:8000/groups/${groupId}/add-test`, {
        testId,
        teacherId: user._id
      });
      setGroup(response.data);
      closeModal();
    } catch (error) {
      console.error('Error adding test to group:', error);
      setErrorMessage('Error adding test to group');
    }
  };

  const removeTestFromGroup = async (testId) => {
    try {
      const response = await axios.post(`http://localhost:8000/groups/${groupId}/remove-test`, {
        testId
      });
      setGroup(response.data);
    } catch (error) {
      console.error('Error removing test from group:', error);
      setErrorMessage('Error removing test from group');
    }
  };

  if (!group) {
    return <div>Loading...</div>; // Add a loading indicator if group data is being fetched
  }

  const availableTests = teacherTests.filter(
    (test) => !group.tests.some((groupTest) => groupTest._id === test._id)
  );

  return (
    <div>
      <h2>Group Details: {group.name}</h2>
      <div style={navStyles}>
        <button style={activeTab === 'members' ? activeButtonStyle : buttonStyle} onClick={() => setActiveTab('members')}>Members</button>
        <button style={activeTab === 'tests' ? activeButtonStyle : buttonStyle} onClick={() => setActiveTab('tests')}>Tests</button>
      </div>
      <hr />
      {activeTab === 'members' ? (
        <GroupMembers teachers={group.teachers} students={group.students} />
      ) : (
        <GroupTests tests={group.tests} onAddTestClick={openModal} onRemoveTestClick={removeTestFromGroup} />
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Test"
        style={modalStyles}
        overlayStyle={modalOverlayStyle}
      >
        <h3>Select a Test to Add</h3>
        <ul>
          {availableTests.map((test) => (
            <li key={test._id}>
              {test.testName}
              <button onClick={() => addTestToGroup(test._id)} style={modalButtonStyle}>Add</button>
            </li>
          ))}
        </ul>
        <button onClick={closeModal} style={modalButtonStyle}>Close</button>
      </Modal>
    </div>
  );
};

const navStyles = {
  display: 'flex',
  justifyContent: 'flex-start', // Align buttons to the left
  gap: '10px', // Add space between buttons
  marginBottom: '20px',
};

const buttonStyle = {
  padding: '10px 20px',
  cursor: 'pointer',
  backgroundColor: 'gray',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  transition: 'background-color 0.3s',
};

const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#222',
  textDecoration: 'underline',
  fontWeight: 'bold',
};

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    maxWidth: '400px',
    width: '100%',
  },
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darken the background
  zIndex: 1000,
};

const modalButtonStyle = {
  padding: '5px 10px',
  cursor: 'pointer',
  backgroundColor: 'black',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  marginLeft: '10px',
};

const removeButtonStyle = {
  padding: '5px 10px',
  cursor: 'pointer',
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  marginLeft: '10px',
};

export default GroupDetailsPage;
