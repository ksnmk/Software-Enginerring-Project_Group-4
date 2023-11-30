import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './communication.css';
import NavigationBar from "../Navigation/NavigationBar";
import { FaEdit} from 'react-icons/fa';
function Raiseproblem() {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();


  useEffect(() => {
    axios.get("http://localhost:8081/getproblem")
    .then((res) => {
      const result = res.data.Result;
  
      if (res.data.Status === "Success") {
        setOriginalData(result);
        setData(result);
      } else {
        alert("Error");
      }
    })
    .catch((err) => console.log(err));
  
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const filteredResults = originalData.filter((item) =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  setData(filteredResults);

  };

  // Function to navigate to the solution form and pass the row ID
  const navigateToSolutionForm = (id) => {
    navigate(`/connectsolutionform/${id}`);
  };

  return (
    <>
    <NavigationBar />
      <div className="body">
        <div>
          <br />
        </div>
      </div>
      <div className="template_Container">
        <div className="row justify-content-center mb-3">
          <div className="col-lg-8 col-md-10 col-sm-12">
            <div className="input-group">
              <input
                id="searchStudent"
                type="text"
                className="form-control"
                placeholder="Seach your request"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
              />
              <button className="btn btn-success" id ="search" type="submit" onClick={handleSearch}>
                Search
              </button>
              <Link to="/connectproblemform">
                <button className="btn btn-primary" id="ask" >New Request</button>
              </Link>
            </div>
          </div>
        </div>
        <br></br>
        <center>
          <table className="gridTable">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Location</th>
                <th>Request</th>
                <th>Suggestion</th>

              </tr>
            </thead>
            <tbody>
              {data.map((val) => {
                return (
                  <tr key={val.id}>
                    <td>{val.id}</td>
                    <td>{val.name}</td>
                    <td>{val.location}</td>
                    <td>{val.problem}</td>
                    <td>{val.solution} <Link to={`/connectsolutionform/${val.id}`} id="Editsolution"><FaEdit/></Link></td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
        </center>
      </div>
    </>
  );
}

export default Raiseproblem;
