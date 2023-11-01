import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DisplayProperty.css';
import LandlordNav from '../LandlordNav/LandlordNav';

function DisplayProperty() {
  const [properties, setProperties] = useState([]);
  const landlordId = localStorage.getItem('landlordId');
  const navigate = useNavigate();

  useEffect(() => {
    if (landlordId) {
      // Fetch property information for a specific landlord_id from the server
      axios
        .get(`http://localhost:8081/properties?landlord_id=${landlordId}`)
        .then((response) => {
          setProperties(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [landlordId]); // Add landlordId as a dependency to run the effect when it changes

  const handleEdit = (propertyId) => {
    navigate(`/edit-property/${propertyId}`); 
  };

  const handleDelete = async (propertyId) => {
    try {
      const response = await axios.delete(`http://localhost:8081/propertiesdelete/${propertyId}`);
      if (response.status === 200) {
        alert('Property deleted successfully.');
        window.location.reload();
      } else {
        alert('Failed to delete the property.');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('An error occurred while deleting the property.');
    }
  };

  return (
    <div>
      <LandlordNav />
      <div className="disproperty-list">
        {properties.map((property) => (
          <div key={property.property_id} className="disproperty-card">
            <div className="disproperty-image">
              <img src={`http://localhost:8081/${property.image_path}`} alt="Property" />
            </div>
            <div className="disproperty-details">
              <h3>Property ID: {property.property_id}</h3>
              <p>Property Type: {property.property_type}</p>
              <p>Property Name: {property.property_name}</p>
              <p>Location: {property.location}</p>
              <p>Rent: {property.rent}</p>
              <p>Bedrooms: {property.bedrooms}</p>
              <p>Max Members: {property.max_members}</p>
              <p>Description: {property.description}</p>
              <button onClick={() => handleEdit(property.property_id)}>Edit</button>
              <button onClick={() => handleDelete(property.property_id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayProperty;
