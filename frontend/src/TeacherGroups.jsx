import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Modal from 'react-modal';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// Set the app element for accessibility
Modal.setAppElement('#root');

const TeacherGroups = () => {
  const user = useSelector((state) => state.auth.user);
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/get-groups/teacher/${user._id}`);
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [user._id]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/create-groups', {
        name: newGroupName,
        teacherId: user._id,
      });
      setGroups([...groups, response.data]);
      setNewGroupName('');
      setSuccessMessage('Group created successfully');
      setErrorMessage('');
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage('Error creating group. Please try again.');
      setSuccessMessage('');
      console.error('Error creating group:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewGroupName('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const copyToClipboard = (groupId) => {
    navigator.clipboard.writeText(`${groupId}`); // Replace with your actual domain
    // Optionally provide feedback to the user
    alert(`Group ID link copied to clipboard`);
  };

  return (
    <div>
      <h2>Your Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group._id}>
            {group.name} 
            <Link to={`/group-details/${group._id}`} className="details-link">
              <button>View Details</button>
            </Link>
            <button onClick={() => copyToClipboard(group._id)}>Copy Group Link</button>
          </li>
        ))}
      </ul>

      <button onClick={openModal}>Create New Group</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create New Group"
        style={modalStyles}
        overlayClassName={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darken the background
          zIndex: 1000,
        }}
      >
        <h3>Create a New Group</h3>
        <form onSubmit={handleCreateGroup}>
          <label>
            Group Name:
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              required
            />
          </label>
          <button type="submit">Create Group</button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>

        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </Modal>
    </div>
  );
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

export default TeacherGroups;
