import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit} from 'react-icons/fa';
import NavigationBar from "../Navigation/NavigationBar";
import "./About.css";
const About = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axios
        .get(`http://localhost:8081/users/${userId}`)
        .then((response) => {
          setUserProfile(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, []);

  return (
    <div> <NavigationBar />
    <div className="profile">
     
      {userProfile ? (
        <div className="profile__main">
          <div className="profile__info">Profile Info</div>
          <div className="info">
            <p>
              <b>Firstname:</b> <div>{userProfile.firstname}</div>
            </p>
            <p>
              <b>Lastname:</b> <div>{userProfile.lastname}</div>
            </p>
            <p>
              <b>Username:</b> <div>{userProfile.username}</div>
            </p>
            <p>
              <b>Email:</b> <div>{userProfile.email}</div>
            </p>
            <p>
              <b>Contact No:</b> <div>{userProfile.contact_no}</div>
            </p>
            <Link to={`/editabout/${userProfile.user_id}`} id="Editabout"><FaEdit/></Link>
          </div>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div></div>
  );
};

export default About;