import React, { useEffect, useState } from 'react';

function CyclingHistory() {
  const [cyclingHistory, setCyclingHistory] = useState({
    startTime: '0',
    endTime: '0',
    startLocation: '0',
    endLocation: '0'
  });

  useEffect(() => {
    const fetchCyclingHistory = async () => {
      const token = localStorage.getItem('token'); // Assuming you store the token in local storage
      try {
        const response = await fetch('http://localhost:5000/cycling-history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send the token in the headers
            'Content-Type': 'application/json'
          }
        });

        // Check if response is ok
        if (!response.ok) {
          throw new Error('Failed to fetch cycling history');
        }

        const data = await response.json();
        setCyclingHistory(data); // Set cycling history data
      } catch (error) {
        console.error('Error fetching cycling history:', error);
      }
    };

    fetchCyclingHistory();
  }, []);

  return (
    <div className="cycling-history">
      <h2>Cycling History</h2>
      <p>Start Time: {cyclingHistory.startTime !== '0' ? new Date(cyclingHistory.startTime).toLocaleString() : 'N/A'}</p>
      <p>End Time: {cyclingHistory.endTime !== '0' ? new Date(cyclingHistory.endTime).toLocaleString() : 'N/A'}</p>
      <p>Start Location: {cyclingHistory.startLocation !== '0' ? cyclingHistory.startLocation : 'N/A'}</p>
      <p>End Location: {cyclingHistory.endLocation !== '0' ? cyclingHistory.endLocation : 'N/A'}</p>
    </div>
  );
}

export default CyclingHistory;
