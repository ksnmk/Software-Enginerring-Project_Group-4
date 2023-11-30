import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Editabout.css";
import NavigationBar from "../Navigation/NavigationBar";

function Editabout() {
  const [userData, setUserData] = useState({
    user_id: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    contact_no: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axios
        .get(`http://localhost:8081/users/${userId}`)
        .then((response) => {
            setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .put(`http://localhost:8081/users/${userId}`, userData)
        .then((response) => {
          if (response.data.Status === "Success") {
            // Data updated successfully
            // You can also show a success message to the user
          } else {
            console.error("Error updating user data");
          }
        })
        .catch((error) => {
          console.error("Error updating user data: ", error);
        });
    }
  };

  return (
    <div>
        <NavigationBar />
        <br></br>
      <h1 className="editabouth1">
        <center>Profile Page</center>
      </h1>
      <form className="editaboutform">
        <div>
          <label className="editaboutlabel">First Name</label>
          <input
            type="text"
            name="firstname"
            value={userData.firstname}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="editaboutlabel">Last Name</label>
          <input
            type="text"
            name="lastname"
            value={userData.lastname}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="editaboutlabel">Username</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
          />
        </div>
        <div >
          <label className="editaboutlabel">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="editaboutlabel">Contact No.</label>
          <input
            type="tel"
            name="contactno"
            value={userData.contact_no}
            onChange={handleInputChange}
          />
        </div><br></br><center>
        <button className="updateabout" onClick={handleSubmit}>
          Update Profile
        </button></center>
      </form>
    </div>
  );
}

export default Editabout;