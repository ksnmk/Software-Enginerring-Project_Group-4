import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import "./Landlord.css"
import LandlordNav from '../LandlordNav/LandlordNav';

function Landlord() {
  const [formData, setFormData] = useState({
    landlord_id: '', // Initialize landlord_id as an empty string
    property_type: '',
    property_name:'',
    location: '',
    rent: '',
    bedrooms: '',
    max_members: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Retrieve landlordId from localStorage when the component mounts
    const landlordId = localStorage.getItem('landlordId');
    if (landlordId) {
      setFormData((prevData) => ({
        ...prevData,
        landlord_id: landlordId, // Set landlordId in the component state
      }));
    }
  }, []); // Empty dependency array to run the effect only once

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('landlord_id', formData.landlord_id);
    formDataToSend.append('property_type', formData.property_type);
    formDataToSend.append('property_name', formData.property_name);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('rent', formData.rent);
    formDataToSend.append('bedrooms', formData.bedrooms);
    formDataToSend.append('max_members', formData.max_members);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('image', image);

    try {
      const response = await axios.post('http://localhost:8081/properties/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        alert('Property added successfully.');
        navigate('/propertydisplay'); // Navigate to the DisplayProperty page
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while adding the property.');
    }
  };

  return (
    <div>
    <LandlordNav />
    <div className="landlord-container">
      <h2>Add Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="property_type">Property Type</label>
          <input
            type="text"
            id="property_type"
            name="property_type"
            value={formData.property_type}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="property_name">Property Name</label>
          <input
            type="text"
            id="property_name"
            name="property_name"
            value={formData.property_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rent">Rent</label>
          <input
            type="number"
            id="rent"
            name="rent"
            value={formData.rent}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bedrooms">Bedrooms</label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="max_members">Max Members</label>
          <input
            type="number"
            id="max_members"
            name="max_members"
            value={formData.max_members}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image Upload</label>
          <input
            type="file"
            id="image"
            name="image"  // Change name to "image"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
        </div>
        <button type="submit" id="landlordSubmit">Submit</button>
      </form>
    </div>
    </div>
  );
}

export default Landlord;
