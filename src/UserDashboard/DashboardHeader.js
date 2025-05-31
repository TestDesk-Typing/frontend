import React, { useState, useEffect, useRef } from 'react';
import './DashboardHeader.css'; // Ensure you create this CSS file with the provided styles
import { useCookies } from 'react-cookie';
import logo from "../i/newlogo.gif";
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { FaTimes, FaUserCircle } from 'react-icons/fa';
import ChatModal from '../ChatModal/ChatModal';
import { Button, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

const DashboardHeader = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['session_id', 'SSIDCE', 'SSDSD']); // Include cookies to remove
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State to track notification visibility
  const [hasNotification, setHasNotification] = useState(false);
  const notificationRef = useRef(null);
  const [showChatModal, setShowChatModal] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    navigate('/choose-exam');
  };

  const home = () => {
    navigate('/');
  }

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data.message); // Optional: Show success message
        // Redirect to home page after successful logout

        // Clear cookies after successful logout
        removeCookie('session_id');
        removeCookie('SSIDCE');
        removeCookie('SSDSD');
        // navigate("/");
        window.location.href = '/';
        // Optional: Redirect or perform any other necessary actions after successful logout
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData.error); // Handle error accordingly
      }
    } catch (error) {
      console.error('Error during logout:', error); // Handle network or other errors
    }
  };




  const checkExpiredSubscriptionsMessage = async () => {
    const email = cookies.SSIDCE; // Extract SSIDCE directly from cookies
    if (!email) {
      console.error("SSIDCE cookie is missing.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get-expired-subscriptions-message`, {
        method: 'POST', // Use POST method
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`, // Include session ID for authorization
        },
        body: JSON.stringify({ email }), // Include email in the request body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Check if expired subscription message exists
      if (data.expiredSubscription && data.expiredSubscription.message) {
        setMessage(data.expiredSubscription.message); // Update the message state with the expired subscription message
      } else {
        setMessage(''); // If no expired subscription message, reset the message state
      }
    } catch (err) {
      console.error('Error:', err.message); // Log any errors
    }
  };



  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get-notifications-header`);
      const data = await response.json();

      if (data.notifications && data.notifications.length > 0) {
        setNotifications(data.notifications);
        // Set the first message if it exists
        if (data.notifications[0]?.message) {
          setMessage(data.notifications[0].message);
        }
        setHasNotification(true);
      } else {
        setHasNotification(false);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };


  useEffect(() => {
    fetchNotifications();  // Fetch notifications without login check
  }, []);



  useEffect(() => {

    checkExpiredSubscriptionsMessage();
  }, [cookies.session_id]);



  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen); // Toggle notification visibility

    // Disable/Enable scrolling on body
    if (!isNotificationOpen) {
      document.body.style.overflow = 'hidden'; // Disable scroll
    } else {
      document.body.style.overflow = ''; // Enable scroll (default behavior)
    }
  };

  useEffect(() => {

    if (notifications.length > 0) {
      setHasNotification(true); // If there are notifications, set hasNotification to true
    } else {
      setHasNotification(false); // If no notifications, set hasNotification to false
    }

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
        document.body.style.overflow = ''; // Enable scroll when notification is closed
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  return (
    <div className="dashboard-header">
      <div className="dashboard-header-part2">
        <div className="typing-brand">
          <img onClick={home}
            src={logo}
            alt="Brand Logo"
            className="typing-brand-logo"
          />
        </div>
        {/* <div className="header-title">Dashboard</div> */}

        <div className="header-notification"><div
          className={`typing-help-item-notification ${hasNotification || message ? 'animated' : ''}`}
          onClick={handleNotificationClick}
        >
          <FaBell className="notification-icon-dash" />

          {/* Show red circle when there is a message or notifications */}
          {hasNotification || message ? (
            <span className="notification-badge"></span>
          ) : null}
        </div>

          {isNotificationOpen && (
            <div className="notification-content-overlay">
              <div className="notification-content" ref={notificationRef}>
                {/* Close button */}
                <button
                  className="close-button"
                  onClick={handleNotificationClick}
                >
                  <FaTimes />
                </button>
                <h2 className="notification-heading">📢 Notifications</h2>
                {/* Display main message if available */}
                {message ? (
                  <div className="static-notification">
                    <p>{message}</p>
                  </div>
                ) : (
                  // Default message when no message exists
                  <div className="static-notification">
                    <p>🔔 Stay updated with the latest news and tests!</p>
                  </div>
                )}

                {/* Display notifications if available */}
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="static-notification">
                      <p>{notification.notification}</p>
                    </div>
                  ))
                ) : (
                  // Show nothing if there are no notifications
                  <></>
                )}
              </div>
            </div>
          )}</div>

        <div className="header-account" onClick={toggleDropdown}>
          Give tests
        </div>
      </div>
      <div>
        <Button
          variant="contained"
          startIcon={<ChatIcon />}
          onClick={() => setShowChatModal(true)}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: 12,
            padding: "8px 20px",
            "&:hover": {
              backgroundColor: "#1976d2cc",
            },
          }}
          aria-label="Open chat"
        >
          Open Chat
        </Button>

        <ChatModal open={showChatModal} onClose={() => setShowChatModal(false)} />
      </div>
      <div className="dashboard-header-part2">
        <div className="header-logout" onClick={handleLogout}>Logout</div>
      </div>   </div>
  );
};

export default DashboardHeader;
