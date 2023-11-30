import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../Navigation/NavigationBar';

import './communication.css';
function SolutionForm() {
  const { id } = useParams();
  const [solution, setSolution] = useState('');
  const navigate = useNavigate();

  const updateSolution = () => {
    axios.put(`http://localhost:8081/updatesolution/${id}`, { solution })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  const handleUpdateSolution = () => {
    updateSolution();
    navigate(`/connect`);
  };
  

  return (<div>
    <NavigationBar /><center>
      <br></br><br></br><br></br>
    <div className='p-1 rounded w-25 border addform'>
      <h1>Response Form</h1><br></br>
      <h4>Please Submit your response here</h4><br></br>
      <textarea
    value={solution}
    className="form-control"
    style={{ padding: '5px 200px 100px 10px' }}  // Adjusted padding
    onChange={(e) => setSolution(e.target.value)}
/><br></br>

      <button className="btn btn-success" onClick={handleUpdateSolution}>Update Response</button>
      
    </div>
    </center>
    </div>
  );
}

export default SolutionForm;
