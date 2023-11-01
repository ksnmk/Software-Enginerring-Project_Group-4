import React, { useState } from 'react';
import axios from 'axios';
import './Report.css';
import NavigationBar from '../Navigation/NavigationBar';

function ReportForm() {
  const [formData, setFormData] = useState({
    user_id: localStorage.getItem('userId') || '',
    report_type: '',
    report_text: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/submit-report', formData);

      if (response.status === 201) {
        setSubmitted(true);
        setFormData({ user_id: '', report_type: '', report_text: '', });
        setTimeout(() => {
          setSubmitted(false);
          window.location.reload(); // Reload the page
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred while submitting the report.');
    }
  };

  return (
    <div>
      <NavigationBar />
      <br></br>
      <br></br>
      <div className="report-form">
        {submitted ? (
          <div className="success-animation">
            <div className="success-circle">
              <div className="success-checkmark">
                <div className="check-icon"></div>
              </div>
            </div>
            <div className="success-message">Submitted Successfully</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="report_type">Report Type</label>
              <select
                id="report_type"
                name="report_type"
                value={formData.report_type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a report type</option>
                <option value="Fraud">Fraud</option>
                <option value="Scam">Scam</option>
                <option value="Bug">Bug</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="report_text">Report Text</label>
              <textarea
                id="report_text"
                name="report_text"
                value={formData.report_text}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Submit Report</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReportForm;
