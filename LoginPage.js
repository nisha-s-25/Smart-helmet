import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    username: '',
    password: '',
    registerNumber: '',
    yearOfStudy: '',
    age: '',
    department: '',
    emergencyNumber: '' // New field for emergency number
  });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        registerNumber,
        password
      });
      localStorage.setItem('token', response.data.token); // Store the token
      alert(response.data.message);
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:5000/signup', signupData);
      alert('Signup successful! Please login.');
      setShowSignup(false);
    } catch (error) {
      alert('Error signing up: ' + error.response.data.message);
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter your register number"
        value={registerNumber}
        onChange={(e) => setRegisterNumber(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <p>Don't have an account? <span onClick={() => setShowSignup(true)}>Sign up</span></p>

      {showSignup && (
        <div className="signup-dialog">
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Username"
            value={signupData.username}
            onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          />
          <input
            type="text"
            placeholder="Register Number"
            value={signupData.registerNumber}
            onChange={(e) => setSignupData({ ...signupData, registerNumber: e.target.value })}
          />
          <input
            type="number"
            placeholder="Year of Study"
            value={signupData.yearOfStudy}
            onChange={(e) => setSignupData({ ...signupData, yearOfStudy: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age"
            value={signupData.age}
            onChange={(e) => setSignupData({ ...signupData, age: e.target.value })}
          />
          <input
            type="text"
            placeholder="Department"
            value={signupData.department}
            onChange={(e) => setSignupData({ ...signupData, department: e.target.value })}
          />
          <input
            type="text"
            placeholder="Emergency Phone Number"
            value={signupData.emergencyNumber}
            onChange={(e) => setSignupData({ ...signupData, emergencyNumber: e.target.value })}
          />
          <button onClick={handleSignup}>Sign Up</button>
          <button onClick={() => setShowSignup(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
