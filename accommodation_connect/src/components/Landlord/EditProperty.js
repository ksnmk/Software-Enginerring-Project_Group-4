import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "./Landlord.css"
import LandlordNav from '../LandlordNav/LandlordNav';

function EditProperty() {
  const { propertyId } = useParams();
  const [formData, setFormData] = useState({
    property_type: '',
    property_name: '',
    location: '',
    rent: '',
    bedrooms: '',
    max_members: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch property data based on propertyId and pre-fill the form
    axios.get(`http://localhost:8081/properties/${propertyId}`)
      .then((response) => {
        const propertyData = response.data;
        setFormData(propertyData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [propertyId]);

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
    formDataToSend.append('property_type', formData.property_type);
    formDataToSend.append('property_name', formData.property_name);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('rent', formData.rent);
    formDataToSend.append('bedrooms', formData.bedrooms);
    formDataToSend.append('max_members', formData.max_members);
    formDataToSend.append('description', formData.description);
  
    if (image) {
      formDataToSend.append('image', image);
    }
  
    try {
      const response = await axios.put(`http://localhost:8081/properties/edit/${propertyId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        alert('Property updated successfully.');
        navigate('/propertydisplay'); // Navigate to the DisplayProperty page
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating the property.');
    }
  };

  return (
    <div>
      <LandlordNav />
      <div className="landlord-container">
        <h2>Edit Property</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="property_type">Property Type</label>
            <input type="text" id="property_type" name="property_type" value={formData.property_type} onChange={handleInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="property_name">Property Name</label>
            <input type="text" id="property_name" name="property_name" value={formData.property_name} onChange={handleInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="rent">Rent</label>
            <input type="number" id="rent" name="rent" value={formData.rent} onChange={handleInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="bedrooms">Bedrooms</label>
            <input type="number" id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="max_members">Max Members</label>
            <input type="number" id="max_members" name="max_members" value={formData.max_members} onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="image">Image Upload</label>
            <input type="file" id="image" name="image" accept="image/*" onChange={handleImageUpload}/>
          </div>
          <button type="submit" id="landlordSubmit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default EditProperty;
