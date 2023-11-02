import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavigationBar from '../Navigation/NavigationBar';
import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  const { propertyId } = useParams();
  const [propertyDetails, setPropertyDetails] = useState(null);
  const userId = localStorage.getItem('userId'); // Get user_id from localStorage

  const [passportNumber, setPassportNumber] = useState('');
  const [usSinceDate, setUsSinceDate] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/property/${propertyId}`)
      .then((response) => {
        setPropertyDetails(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [propertyId]);

  const handleVerificationSubmit = () => {
    // Perform client-side validation for passport number and US since date
    if (!passportNumber || !usSinceDate) {
      alert('Passport number and US since date are required.');
      return;
    }

    // Send the verification data to the server
    axios
      .post(`http://localhost:8081/verify`, { user_id: userId,  propertyId, passportNumber, usSinceDate,})
      .then((response) => {
        setPaymentInfo(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!propertyDetails) {
    return <div className="propertydetailspage-loading-message">Loading...</div>;
  }

  return (
    <div>      <NavigationBar />

    <div className="propertydetailspage-container">
      <h2 className="propertydetailspage-title">Confirm & Pay</h2>
      <div className="propertydetailspage-details">
        <div className="propertydetailspage-image-container">
          <img
            src={`http://localhost:8081/${propertyDetails.image_path}`}
            alt="Property"
            className="propertydetailspage-image"
          />
        </div>
        <div className="propertydetailspage-info">
          <p>
            <strong>Property Type:</strong> {propertyDetails.property_type}
          </p>
          <p>
            <strong>Property Name:</strong> {propertyDetails.property_name}
          </p>
          <p>
            <strong>Location:</strong> {propertyDetails.location}
          </p>
          <p>
            <strong>Rent:</strong> {propertyDetails.rent}
          </p>
          <p>
            <strong>Bedrooms:</strong> {propertyDetails.bedrooms}
          </p>
          <p>
            <strong>Max Members:</strong> {propertyDetails.max_members}
          </p>
          <p>
            <strong>Contact:</strong> {propertyDetails.contact_no}
          </p>
          <p>
            <strong>Description:</strong> {propertyDetails.description}
          </p>
        </div>
      </div>
      {paymentInfo ? (
        <div className="propertydetailspage-payment-info">
          <h3>Payment Information:</h3>
          <p>
            <strong>Total Amount:</strong> {paymentInfo.totalAmount}
          </p>
          <p>
            <strong>Payment Method:</strong> {paymentInfo.paymentMethod}
          </p>
          <p>
            <strong>Payment Status:</strong> {paymentInfo.paymentStatus}
          </p>
        </div>
      ) : (
        <div className="propertydetailspage-verification">
          <h3>Verification</h3>
          <p>
            <strong>Passport Number:</strong>
            <input
              type="text"
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
            />
          </p>
          <p>
            <strong>Living in the US since:</strong>
            <input
              type="date"
              value={usSinceDate}
              onChange={(e) => setUsSinceDate(e.target.value)}
            />
          </p>
          <button onClick={handleVerificationSubmit} class="Connect">Submit Verification</button>
        </div>
      )}
    </div>
    </div>
  );
}

export default PropertyDetailsPage;
