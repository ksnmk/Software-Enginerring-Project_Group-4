

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notification.css'; 
import LandlordNav from '../LandlordNav/LandlordNav';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const landlordId = localStorage.getItem('landlordId');
  const lastViewedTime = localStorage.getItem('lastViewedTime');

  useEffect(() => {
    axios
      .get(`http://localhost:8081/notifications/${landlordId}`)
      .then((response) => {
        const receivedNotifications = response.data;
        setNotifications(receivedNotifications);

        const newNotifications = receivedNotifications.filter(
          (notification) => new Date(notification.notification_time) > new Date(lastViewedTime)
        );
        setUnreadCount(newNotifications.length);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [landlordId, lastViewedTime]);

  const markNotificationsAsRead = () => {
    const currentTime = new Date().toISOString();
    localStorage.setItem('lastViewedTime', currentTime);
    setUnreadCount(0);
  };

  return (
    <div>
      <LandlordNav />
      <div className="notifications-page">
        <h1 className="notifications-title">Notifications ({unreadCount})</h1>
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li key={notification.notification_id} className="notification-item">
              {notification.message}
            </li>
          ))}
        </ul>
        <button className="mark-as-read-button" onClick={markNotificationsAsRead}>
          Mark as Read
        </button>
      </div>
    </div>
  );
}

export default NotificationsPage;
