import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dues() {
  const [helmetBit, setHelmetBit] = useState(null);
  const [userData, setUserData] = useState({
    latitude: 0,
    longitude: 0,
    location: '',
    riderSafety: 0,
  });
  const [avgSpeed, setAvgSpeed] = useState(0); // Random avg speed for page load
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 }); // Random coordinates

  useEffect(() => {
    // Generate random avg speed and random coordinates on initial load
    setAvgSpeed(Math.floor(Math.random() * 100) + 20);
    setCoordinates({
      latitude: (Math.random() * 180 - 90).toFixed(6),
      longitude: (Math.random() * 360 - 180).toFixed(6),
    });

    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); 
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHelmetBit(response.data.helmetBit);
        setUserData({
          location: response.data.location,
          riderSafety: response.data.riderSafety,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const checkForUpdates = async () => {
      setInterval(fetchUserData, 5000); // Poll every 5 seconds
    };

    fetchUserData();
    checkForUpdates();
  }, []);

  const riderStatus = userData.riderSafety === 0 ? 'SAFE' : 'COLLISION OCCURRED';

  return (
    <div className="dues">
      {helmetBit === 0 ? (
        <h2>Please wear helmet</h2>
      ) : (
        <div>
          {userData.riderSafety === 1 ? (
            <div className="collision-warning">
              <h1>COLLISION OCCURRED</h1>
            </div>
          ) : (
            <>
              <h2>User Location and Average Speed</h2>
              <p>Latitude: {coordinates.latitude}</p>
              <p>Longitude: {coordinates.longitude}</p>
              <p>Location: {userData.location}</p>
              <p>Average Speed: {avgSpeed} km/h</p> {/* Displaying random avg speed */}
              <p>Rider Status: {riderStatus}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Dues;
