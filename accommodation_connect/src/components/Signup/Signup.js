import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import { useNavigate ,Link} from 'react-router-dom';
function Signup() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    contactNo: '',
    password: '',
    confirmPassword: '',
    userType: '',
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const Navigate=useNavigate();
  const validateForm = () => {
    const newErrors = {};

    // Validate First Name (Required)
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First Name is required';
    }

    // Validate Username (Required)
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Validate Email (Required)
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = 'Invalid email address';
    }

    // Validate Contact No (Required and should contain only numbers)
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact No is required';
    } else if (!/^[0-9]{10}$/.test(formData.contactNo)) {
      newErrors.contactNo = 'Contact No must be 10 digits containing only numbers';
    }

    // Validate Password (Required and at least 8 characters long)
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Validate Confirm Password (Required and must match Password)
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate UserType (Required)
    if (!formData.userType) {
      newErrors.userType = 'User Type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(`http://localhost:8081/signup`, formData);
        if (response.status === 200) {
          console.log("Success");
          setError('Signup successful'); // Set a success message
          // You can use a timeout to display the success message for a few seconds before navigating
          setTimeout(() => {
            setError(''); // Clear the success message
            Navigate('/login'); // Navigate to the login page
          }, 3000); // Display the success message for 3 seconds (adjust as needed)
        }
      } catch (err) {
        setError('An error occurred during signup.');
        console.error(err);
      }
    }
  };  

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstname">First Name <span className="required">*</span></label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            placeholder='Enter firstname'
            required
          />
          {errors.firstname && <p className="error">{errors.firstname}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder='Enter lastname'
            value={formData.lastname}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username <span className="required">*</span></label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            placeholder='Enter username'
            onChange={handleInputChange}
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            placeholder='Enter email'
            onChange={handleInputChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="contactNo">Contact No <span className="required">*</span></label>
          <input
            type="text"
            id="contactNo"
            name="contactNo"
            placeholder='Enter phone number'
            value={formData.contactNo}
            onChange={handleInputChange}
            required
          />
          {errors.contactNo && <p className="error">{errors.contactNo}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password <span className="required">*</span></label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder='Enter password'
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder='Confirm Password'
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="userType">Signup as <span className="required">*</span></label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select User Type</option>
            <option value="user">User</option>
            <option value="landlord">Landlord</option>
          </select>
          {errors.userType && <p className="error">{errors.userType}</p>}
        </div>
        <button type="submit" id="signup1" className="btn btn-primary">Signup</button>
                <Link to='/login' type='button' id='loginButton'  className="btn btn-primary">
                  Login
                </Link>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Signup;
