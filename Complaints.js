import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:5000'; // Adjust as needed

function Complaints() {
  const [complaint, setComplaint] = useState('');
  const [complaintsList, setComplaintsList] = useState([]);

  // Fetch complaints when the component loads
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/complaints`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplaintsList(response.data.complaints);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  const handleComplaint = async () => {
    if (!complaint.trim()) {
      alert('Complaint cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${baseURL}/submit-complaint`,
        { complaintText: complaint },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update complaints list with new complaint
      setComplaintsList(response.data.updatedUser.complaints);
      setComplaint(''); // Clear the textarea after submission
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <div>
      <h2>Complaints</h2>
      <textarea
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        placeholder="Enter your complaint"
      />
      <button onClick={handleComplaint}>Submit Complaint</button>
      <h3>Submitted Complaints</h3>
      <ul>
        {complaintsList.map((comp, index) => (
          <li key={index}>{comp}</li>
        ))}
      </ul>
    </div>
  );
}

export default Complaints;
