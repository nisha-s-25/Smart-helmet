import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const updateLocationAndSpeed = async () => {
      if (!token) return;

      // Simulating random location and speed
      const speed = Math.floor(Math.random() * 100); // Random speed between 0 and 100
      const latitude = 37.7749 + (Math.random() - 0.5) * 0.01; // Slightly modify latitude
      const longitude = -122.4194 + (Math.random() - 0.5) * 0.01; // Slightly modify longitude

      try {
        await axios.post('http://localhost:5000/update-location', 
          { speed, latitude, longitude }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error updating location and speed:', error);
      }
    };

    const intervalId = setInterval(updateLocationAndSpeed, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h2>User Dashboard</h2>
      {userInfo ? (
        <div className="user-info">
          <p>Name: {userInfo.username}</p>
          <p>Reg No: {userInfo.registerNumber}</p>
          <p>Year: {userInfo.yearOfStudy}</p>
          <p>Department: {userInfo.department}</p>
        </div>
      ) : (
        <p>No user information available.</p>
      )}
      <div className="actions">
        <Link to="/dues">Rider Status</Link>
        <Link to="/complaints">Complaints</Link>
      </div>
    </div>
  );
}

export default Dashboard;
