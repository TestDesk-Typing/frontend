import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import logo from "../i/newlogo.gif";
import { useNavigate } from 'react-router-dom';
import { FaBell, FaTimes, FaUserCircle } from 'react-icons/fa';
import ChatModal from '../ChatModal/ChatModal';
import { Button, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { Container, Navbar, Nav, Dropdown, Image } from 'react-bootstrap';
import './DashboardHeader.css'; // We'll update this CSS

const DashboardHeader = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['session_id', 'SSIDCE', 'SSDSD']);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const notificationRef = useRef(null);
  const [showChatModal, setShowChatModal] = useState(false);

  const toggleDropdown = () => {
    navigate('/choose-exam');
  };

  const home = () => {
    navigate('/');
  }

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
        removeCookie('session_id');
        removeCookie('SSIDCE');
        removeCookie('SSDSD');
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData.error);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const checkExpiredSubscriptionsMessage = async () => {
    const email = cookies.SSIDCE;
    if (!email) {
      console.error("SSIDCE cookie is missing.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get-expired-subscriptions-message`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.expiredSubscription && data.expiredSubscription.message) {
        setMessage(data.expiredSubscription.message);
      } else {
        setMessage('');
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get-notifications-header`);
      const data = await response.json();

      if (data.notifications && data.notifications.length > 0) {
        setNotifications(data.notifications);
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
    fetchNotifications();
  }, []);

  useEffect(() => {
    checkExpiredSubscriptionsMessage();
  }, [cookies.session_id]);

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    document.body.style.overflow = isNotificationOpen ? '' : 'hidden';
  };

  useEffect(() => {
    if (notifications.length > 0) {
      setHasNotification(true);
    } else {
      setHasNotification(false);
    }

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
        document.body.style.overflow = '';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Navbar bg="light" expand="lg" className="dashboard-header shadow-sm" fixed="top">
      <Container fluid>
        {/* Brand Logo */}
        <Navbar.Brand onClick={home} className="cursor-pointer">
          <Image src={logo} alt="Brand Logo" className="typing-brand-logo" />
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center navbar-menu">
          {/* Notification */}
          <div className="position-relative me-3">
            <div 
              className={`typing-help-item-notification ${hasNotification || message ? 'animated' : ''}`}
              onClick={handleNotificationClick}
            >
              <FaBell className="notification-icon-dash" />
              {(hasNotification || message) && (
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                  <span className="visually-hidden">New alerts</span>
                </span>
              )}
            </div>

            {isNotificationOpen && (
              <div className="notification-content-overlay">
                <div className="notification-content bg-white p-3 rounded shadow" ref={notificationRef}>
                  <button
                    className="btn-close position-absolute top-0 end-0 m-2"
                    onClick={handleNotificationClick}
                  />
                  <h5 className="mb-3">📢 Notifications</h5>
                  {message ? (
                    <div className="static-notification mb-2">
                      <p className="mb-0">{message}</p>
                    </div>
                  ) : (
                    <div className="static-notification mb-2">
                      <p className="mb-0">🔔 Stay updated with the latest news and tests!</p>
                    </div>
                  )}

                  {notifications.map((notification) => (
                    <div key={notification.id} className="static-notification mb-2">
                      <p className="mb-0">{notification.notification}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Button */}
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={() => setShowChatModal(true)}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: 12,
              padding: "8px 8px",
              "&:hover": {
                backgroundColor: "#1976d2cc",
              },
            }}
            className="me-3"
          >
            Chat
          </Button>

          {/* Give Tests Button */}
          <Nav.Link onClick={toggleDropdown} className="me-3">
            Give tests
          </Nav.Link>

          {/* Logout Button */}
          <Nav.Link onClick={handleLogout}>
            Logout
          </Nav.Link>
        </Nav>

        <ChatModal open={showChatModal} onClose={() => setShowChatModal(false)} />
      </Container>
    </Navbar>
  );
};

export default DashboardHeader;