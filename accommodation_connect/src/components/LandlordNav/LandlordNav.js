import React from 'react';
import "./LandlordNav.css";
import { useNavigate } from 'react-router-dom';

function LandlordNav() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/Login');
  }

  return (
    <nav className="navbar">
      <a href="/landlordpage" className="nav-brand">Accomodation Connect</a>
      <ul className="nav-menu">
        <li><a href="/landlordpage">Add Property</a></li>
        <li><a href="/propertydisplay">Property</a></li>
        <li><a href="/notifications">Notification</a></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default LandlordNav;
