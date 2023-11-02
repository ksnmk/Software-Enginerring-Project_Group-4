import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SeniorsContact.css';
import NavigationBar from '../Navigation/NavigationBar';

function SeniorsContact() {
  const [seniorsData, setSeniorsData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/seniorscontact')
      .then((response) => {
        setSeniorsData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Function to calculate the number of years from a given date
  const calculateYears = (date) => {
    const currentDate = new Date();
    const usSinceDate = new Date(date);
    const yearDiff = currentDate.getFullYear() - usSinceDate.getFullYear();

    return yearDiff;
  };

  return (
    <div>
      <NavigationBar />
      <div className="seniors-contact-container">
        <h2 className="seniors-contact-title">Seniors Contact Details</h2>
        <ul className="seniors-contact-list">
          {seniorsData.map((senior) => (
            <li key={senior.user_id} className="seniors-contact-item">
              <h3>{senior.firstname} {senior.lastname}</h3>
              <p><strong>Email:</strong> {senior.email}</p>
              <p><strong>Contact Number:</strong> {senior.contact_no}</p>
              <p><strong>US Since Date:</strong> {calculateYears(senior.us_since_date)} years</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SeniorsContact;
