import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavigationBar from '../Navigation/NavigationBar';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/displayproperties')
      .then((response) => {
        setProperties(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSearch = () => {
    const result = properties.filter(property => property.location.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredProperties(result);
  }
  const handleInputChange = (e) => {
  setSearchTerm(e.target.value);
  const result = properties.filter(property => 
    property.location.toLowerCase().includes(e.target.value.toLowerCase())
  );
  setFilteredProperties(result);
}


  return (
    <div>
      <NavigationBar />
      <div className="homepage">
        <h1>Welcome to Accomodation Connect!</h1>
        <div className="search-container">
          <input type="text" placeholder="Search by location..." className="location-input" value={searchTerm} onChange={handleInputChange} />
          <button type='button' className="search-button" onClick={handleSearch}>Search</button>
        </div>
        <div className="homepage-property-list">
          {(filteredProperties.length ? filteredProperties : properties).map((property) => (
            <div key={property.property_id} className="homepage-property-card">
              <img src={`http://localhost:8081/${property.image_path}`} alt="Property" className="homepage-property-image" />
              <p className="homepage-property-info"><strong>Property Type:</strong> {property.property_type}</p>
              <p className="homepage-property-info"><strong>Location:</strong>{property.location}</p>
              <p className="homepage-property-info"><strong>Contact Number:</strong> {property.contact_no}</p>
              <p className="homepage-property-info">Rent: {property.rent}$</p>
              <p className="homepage-property-description">Max Members: {property.max_members}</p>
              <Link to={`/property/${property.property_id}`}>
                <button type='submit' className="Connect">Connect</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
