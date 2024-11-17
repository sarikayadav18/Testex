import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

// Set the app element for accessibility
Modal.setAppElement('#root');

const StudentGroups = () => {
  const user = useSelector((state) => state.auth.user);
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupLink, setGroupLink] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/get-groups/student/${user._id}`);
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setErrorMessage('Error fetching groups');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [user._id]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGroupLink('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      const groupId = groupLink.split('/').pop(); // Extract groupId from the link
      const response = await axios.post('http://localhost:8000/groups/join', {
        groupId,
        studentId: user._id,
      });
      setGroups([...groups, response.data.group]);
      setSuccessMessage('Joined group successfully');
      setErrorMessage('');
      closeModal();
    } catch (error) {
      console.error('Error joining group:', error);
      setErrorMessage('Error joining group. Please try again.');
      setSuccessMessage('');
    }
  };

  const navigateToGroupDetails = (groupId) => {
    navigate(`/student/groups/${groupId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Add a loading indicator if group data is being fetched
  }

  return (
    <div style={containerStyle}>
      <h2>Your Groups</h2>
      {groups.length > 0 ? (
        <ul>
          {groups.map((group) => (
            <li key={group._id} style={groupItemStyle}>
              {group.name}
              <button
                onClick={() => navigateToGroupDetails(group._id)}
                style={viewDetailsButtonStyle}
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Join Groups</p>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <button onClick={openModal} style={modalButtonStyle}>Join New Group</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Join Group"
        style={modalStyles}
        overlayStyle={modalOverlayStyle}
      >
        <h3>Join a Group</h3>
        <form onSubmit={handleJoinGroup}>
          <label>
            Group Link:
            <input
              type="text"
              value={groupLink}
              onChange={(e) => setGroupLink(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <button type="submit" style={formButtonStyle}>Join Group</button>
          <button type="button" onClick={closeModal} style={formButtonStyle}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

const containerStyle = {
  position: 'relative',
  padding: '20px',
};

const modalButtonStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  cursor: 'pointer',
  backgroundColor: 'black',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  transition: 'background-color 0.3s',
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

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const formButtonStyle = {
  padding: '10px 20px',
  cursor: 'pointer',
  backgroundColor: 'black',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  marginRight: '10px',
};

const groupItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #ccc',
};

const viewDetailsButtonStyle = {
  padding: '5px 10px',
  cursor: 'pointer',
  backgroundColor: 'black',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};

export default StudentGroups;
