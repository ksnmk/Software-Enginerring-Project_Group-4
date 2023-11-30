import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavigationBar from '../Navigation/NavigationBar';
import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  const { propertyId } = useParams();
  const [propertyDetails, setPropertyDetails] = useState(null);
  const userId = localStorage.getItem('userId'); // Get user_id from localStorage
  const [landlordId, setLandlordId] = useState(null); // Set the landlordId
  const [userData, setUserData] = useState(null);

  const [passportNumber, setPassportNumber] = useState('');
  const [usSinceDate, setUsSinceDate] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);

  const [creditCardData, setCreditCardData] = useState({
    cardNo: '',
    validity: '',
    expiry: '',
    cvv: '',
    cardHolderName: '',
  });

  const [upiData, setUpiData] = useState({
    phoneNumber: '',
  });

  const [netBankingData, setNetBankingData] = useState({
    bankName: '',
    accountNo: '',
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8081/property/${propertyId}`)
      .then((response) => {
        setPropertyDetails(response.data);
        setLandlordId(response.data.landlord_id); // Set the landlordId from property details
      })
      .catch((error) => {
        console.error(error);
      });
  }, [propertyId]);

  useEffect(() => {
    // Fetch user data based on userId
    axios.get(`http://localhost:8081/users/${userId}`)
      .then((response) => {
        // Assuming your API response contains user data
        const userData = response.data;
        setUserData(userData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [userId]);


  // Handle changes in credit card details
const handleCreditCardChange = (e) => {
  const { name, value } = e.target;
  setCreditCardData({
    ...creditCardData,
    [name]: value,
  });
};

// Handle changes in UPI details
const handleUpiChange = (e) => {
  const { name, value } = e.target;
  setUpiData({
    ...upiData,
    [name]: value,
  });
};

// Handle changes in net banking details
const handleNetBankingChange = (e) => {
  const { name, value } = e.target;
  setNetBankingData({
    ...netBankingData,
    [name]: value,
  });
};

useEffect(() => {
  // Fetch bill payment status from your backend
  axios
    .get(`http://localhost:8081/billpayment/${propertyId}/${userId}`)
    .then((response) => {
      if (response.data.paymentStatus === 'Paid') {
        // Bill is paid
        setPaymentInfo({
          paymentStatus: 'Paid',
          paymentAmount: response.data.amount,
          paymentMethod: response.data.paymentMethod, // Add the payment method
          paymentTime: formatPaymentTime(response.data.paymentTime),     // Add the payment time
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}, [propertyId, userId]);

const sendNotificationToLandlord = (message) => {
  axios
    .post(`http://localhost:8081/notifyLandlord`, {
      senderId: userId,
      recipientId: landlordId, // You need to set the landlordId
      message,
    })
    .then((response) => {
      // Handle successful notification
    })
    .catch((error) => {
      console.error(error);
    });
};

  const handleVerificationSubmit = () => {
    // Perform client-side validation for passport number and US since date
    if (!passportNumber || !usSinceDate) {
      alert('Passport number and US since date are required.');
      return;
    }
    // Send the verification data to the server
    axios
      .post(`http://localhost:8081/verify`, {
        user_id: userId,
        propertyId,
        passportNumber,
        usSinceDate,
      })
      .then((response) => {
        // Update paymentInfo with data after successful verification
        setPaymentInfo({
          paymentStatus: 'Not Paid',
        });
        sendNotificationToLandlord(`Verification completed for property ${propertyDetails.property_name} from ${userData.firstname}.`);

      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePaymentMethodChange = (event) => {
    // Handle radio button selection for payment methods
    setPaymentInfo({
      ...paymentInfo,
      paymentMethod: event.target.value,
    });
  };

  const handlePaymentSubmit = () => {
    if (paymentInfo.paymentMethod === 'Credit/Debit Card') {
      axios
        .post(`http://localhost:8081/pay`, {
          user_id: userId,
          propertyId,
          paymentMethod: 'Credit/Debit Card',
          paymentData: creditCardData,
        })
        .then((response) => {
          setPaymentInfo({
            ...paymentInfo,
            paymentStatus: 'Paid',
          });
          sendNotificationToLandlord(`Payment of ${propertyDetails.rent} has been received for property ${propertyDetails.property_name} from ${userData.firstname}.`);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (paymentInfo.paymentMethod === 'UPI') {
      axios
        .post(`http://localhost:8081/pay`, {
          user_id: userId,
          propertyId,
          paymentMethod: 'UPI',
          paymentData: upiData,
        })
        .then((response) => {
          setPaymentInfo({
            ...paymentInfo,
            paymentStatus: 'Paid',
          });
          sendNotificationToLandlord(`Payment of ${propertyDetails.rent} has been received for property ${propertyDetails.property_name} from ${userData.firstname}.`);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (paymentInfo.paymentMethod === 'Net Banking') {
      axios
        .post(`http://localhost:8081/pay`, {
          user_id: userId,
          propertyId,
          paymentMethod: 'Net Banking',
          paymentData: netBankingData,
        })
        .then((response) => {
          setPaymentInfo({
            ...paymentInfo,
            paymentStatus: 'Paid',
          });
          sendNotificationToLandlord(`Payment of ${propertyDetails.rent} has been received for property ${propertyDetails.property_name} from ${userData.firstname}.`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  function formatPaymentTime(timestamp) {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    return new Date(timestamp).toLocaleString(undefined, options);
  }

  return (
    <div>
      <NavigationBar />
      <div className="propertydetailspage-container">
        <h2 className="propertydetailspage-title">Confirm & Pay</h2>
        {propertyDetails ? (
          <div className="propertydetailspage-details">
            <div className="propertydetailspage-image-container">
              {propertyDetails.image_path && (
                <img
                  src={`http://localhost:8081/${propertyDetails.image_path}`}
                  alt="Property"
                  className="propertydetailspage-image"
                />
              )}
            </div>
            <div className="propertydetailspage-info">
              <p>
                <strong>Property Type:</strong> {propertyDetails.property_type || 'N/A'}
              </p>
              <p>
                <strong>Property Name:</strong> {propertyDetails.property_name || 'N/A'}
              </p>
              <p>
                <strong>Location:</strong> {propertyDetails.location || 'N/A'}
              </p>
              <p>
                <strong>Rent:</strong> {propertyDetails.rent || 'N/A'}
              </p>
              <p>
                <strong>Bedrooms:</strong> {propertyDetails.bedrooms || 'N/A'}
              </p>
              <p>
                <strong>Max Members:</strong> {propertyDetails.max_members || 'N/A'}
              </p>
              <p>
                <strong>Description:</strong> {propertyDetails.description || 'N/A'}
              </p>
            </div>
          </div>
        ) : (
          <div className="propertydetailspage-loading-message">Loading...</div>
        )}
        {paymentInfo ? (
          paymentInfo.paymentStatus === 'Paid' ? (
            <div className="propertydetailspage-payment-info">
              <h3>Payment Information:</h3>
              <p>
                <strong>Total Amount:</strong> {propertyDetails.rent}
              </p>
              <p>
                <strong>Payment Status:</strong> {paymentInfo.paymentStatus}
              </p>
              <p>
                <strong>Paid on:</strong> {paymentInfo.paymentTime}
              </p>
              <p>Bill Paid</p>
            </div>
          ) : (
            <div className="propertydetailspage-payment">
              <h3>Payment</h3>
              <p>Select Payment Method:</p>
              <div className="payment-method">
                <label>
                  <input
                    type="radio"
                    value="Credit/Debit Card"
                    checked={paymentInfo.paymentMethod === 'Credit/Debit Card'}
                    onChange={handlePaymentMethodChange}
                  />
                  Credit/Debit Card
                </label>
                <br></br>
                <label>
                  <input
                    type="radio"
                    value="UPI"
                    checked={paymentInfo.paymentMethod === 'UPI'}
                    onChange={handlePaymentMethodChange}
                  />
                  UPI
                </label>
                <br></br>
                <label>
                  <input
                    type="radio"
                    value="Net Banking"
                    checked={paymentInfo.paymentMethod === 'Net Banking'}
                    onChange={handlePaymentMethodChange}
                  />
                  Net Banking
                </label>
                <br></br>
              </div>
              {paymentInfo.paymentMethod === 'Credit/Debit Card' && (
                <div className="credit-card-details">
                  <h4>Enter Credit Card Details:</h4>
                  <input
                    type="text"
                    name="cardNo"
                    placeholder="Card Number"
                    value={creditCardData.cardNo}
                    onChange={handleCreditCardChange}
                  />
                  <input
                    type="text"
                    name="validity"
                    placeholder="Validity"
                    value={creditCardData.validity}
                    onChange={handleCreditCardChange}
                  />
                  <input
                    type="text"
                    name="expiry"
                    placeholder="Expiry"
                    value={creditCardData.expiry}
                    onChange={handleCreditCardChange}
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV Number"
                    value={creditCardData.cvv}
                    onChange={handleCreditCardChange}
                  />
                  <input
                    type="text"
                    name="cardHolderName"
                    placeholder="Card Holder Name"
                    value={creditCardData.cardHolderName}
                    onChange={handleCreditCardChange}
                  />
                  <br></br>
                  <button className="Connect" onClick={handlePaymentSubmit}>Pay</button>
                </div>
              )}
              {paymentInfo.paymentMethod === 'UPI' && (
                <div className="upi-details">
                  <h4>Enter UPI Details:</h4>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={upiData.phoneNumber}
                    onChange={handleUpiChange}
                  />
                  <button className="Connect" onClick={handlePaymentSubmit}>Pay</button>
                </div>
              )}
              {paymentInfo.paymentMethod === 'Net Banking' && (
                <div className="net-banking-details">
                  <h4>Enter Net Banking Details:</h4>
                  <input
                    type="text"
                    name="bankName"
                    placeholder="Bank Name"
                    value={netBankingData.bankName}
                    onChange={handleNetBankingChange}
                  />
                  <input
                    type="text"
                    name="accountNo"
                    placeholder="Account Number"
                    value={netBankingData.accountNo}
                    onChange={handleNetBankingChange}
                  />
                  <button className="Connect" onClick={handlePaymentSubmit}>Pay</button>
                </div>
              )}
            </div>
          )
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
            <button onClick={handleVerificationSubmit} className="Connect">
              Submit Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyDetailsPage;
