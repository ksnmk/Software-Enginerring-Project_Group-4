import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user', // Default user type is 'user'
  });

  const [userId, setUserId] = useState(null);
  const [landlordId, setLandlordId] = useState(null);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8; // Minimum password length is 8 characters
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmail(formData.email)) {
      setError('Invalid email address.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/login', formData);
      if (response.status === 200) {
        // Successful login, redirect based on userType
        if (formData.userType === 'user') {
          const userId = response.data.userId;
          localStorage.setItem('userId', userId); // Store userId in localStorage
          setUserId(userId); // Store userId in component state
          console.log('User ID:', userId); // Log userId for users
          navigate('/homepage'); // Redirect to the homepage for users
        } else {
          const landlordId = response.data.landlordId;
          localStorage.setItem('landlordId', landlordId); // Store landlordId in localStorage
          setLandlordId(landlordId); // Store landlordId in component state
          console.log('Landlord ID:', landlordId); // Log landlordId for landlords
          navigate('/landlordpage');
        }
      } else {
        setError('Invalid Credentials');
      }
    } catch (err) {
      setError('Invalid Credentials');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group"> <label htmlFor="email"> Email<span className="required">*</span> </label>
          <input type="email" name="email" value={formData.email} placeholder='Enter email' onChange={handleInputChange} required className="form-control" />
        </div>
        <div className="form-group"> <label htmlFor="password"> Password <span className="required">*</span>
          </label> <input type="password" name="password" value={formData.password} placeholder='Enter Password' onChange={handleInputChange} required className="form-control"/>
        </div>
        <div className="form-button" id="rb">
          <label>User Type : </label>
          <label> <input type="radio" name="userType" value="user" id="user" checked={formData.userType === 'user'} onChange={handleInputChange}/> User </label>
          <label>
            <input type="radio" name="userType" value="landlord" id="landlord" checked={formData.userType === 'landlord'}  onChange={handleInputChange}/> Landlord
          </label>
        </div>
        <button type="submit" className="btn btn-primary" id="login">
          Login
        </button>
        <button type="button" onClick={() => navigate('/signup')} className="btn btn-secondary" id="signup"> Sign Up </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
