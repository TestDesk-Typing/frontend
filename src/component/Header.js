import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import './TypingHeader.css';
import logo from "../i/newlogo.gif";
import fb from "../i/fb.svg";
import insta from "../i/insta.svg";
import tg from "../i/tg.svg";
import youtube from "../i/youtube.svg";
import { FaBell } from 'react-icons/fa';

import { useCookies } from "react-cookie";
import Loading from '../Loading';
import { Helmet } from 'react-helmet-async';

const TypingHeader = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const [cookies] = useCookies(["session_id"]);
  const { userDetails } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false); // State for mobile menu
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State to track notification visibility
  const [hasNotification, setHasNotification] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [defaultMessage] = useState('🔔 You have new notifications! Stay up to date with the latest updates and tests.');

  const checkAccess = async () => {
    if (cookies.session_id) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/code-123`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${cookies.session_id}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.access === "access") {
            setIsLoggedIn(true); // If access is granted, set isLoggedIn to true
          } else {
            setIsLoggedIn(false); // If access is denied, set isLoggedIn to false
          }
        } else {
          setIsLoggedIn(false); // If response is not ok, set isLoggedIn to false
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setIsLoggedIn(false); // On error, set isLoggedIn to false
      }
    } else {
      setIsLoggedIn(false); // If no session_id, set isLoggedIn to false
    }

    setLoading(false); // Stop loading once the API call completes
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




  // Call checkAccess when the component mounts
  useEffect(() => {
    checkAccess();
    checkExpiredSubscriptionsMessage();
  }, [cookies.session_id]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // const toggleSearch = () => {
  //   setSearchOpen(!isSearchOpen);
  // };

  const handleHelpClick = () => {
    navigate('/help');
  };

  const handleFreeClick = () => {
    navigate('/online-free-typing-test');
  };

  const handleBuyNowClick = () => {
    navigate('/ssc-typing-test/buy-now');
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const performSearch = () => {
    alert(`Searching for: ${searchQuery}`);
    // Here you can implement the actual search functionality
  };

  const home = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  const examclick = () => {
    navigate('/choose-exam');
  };

  const toggleDropdownmobile = () => {
    navigate('/choose-exam');
  };


  const handleresultClick = () => {
    navigate('/typing-test-dest-results');
  };
  const handleDashboardClick = () => {
    navigate('/user-dashboard');
  };
  const handleHomeClick = () => {
    navigate('/');
  };

  const handleyoutubeClick = () => {
    window.location.href = "https://www.youtube.com/@Testdesktyping"; // Redirect to YouTube
  };

  const handleRedirect = () => {
    // Redirect to the Telegram link
    window.location.href = "https://t.me/+4qa-d1bgP7pmYTVl";
  }


  // Close search pop-up on outside click
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

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen); // Toggle the notification open/close
  };

  return (
    <>

      <header className="typing-header-container">
        <div className="typing-header-content">
          <div className="typing-brand" onClick={home}>
            <img src={logo} alt="Brand Logo" className="typing-brand-logo" />
          </div>

          <div className="typing-nav-menu">
            <div className="typing-nav-item typing-help-item" onClick={handleHomeClick}>Home</div>
            <div className="typing-nav-item" onClick={toggleDropdown}>
              Typing Test Links
              <div className={`typing-dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                <div className="typing-dropdown-item" onClick={examclick}>SSC Typing Test</div>
                <div className="typing-dropdown-item" onClick={examclick}>DSSSB Typing Test</div>
                <div className="typing-dropdown-item" onClick={examclick}>Delhi Police Typing Test</div>
                <div className="typing-dropdown-item" onClick={examclick}>Delhi High Court Typing Test</div>
                <div className="typing-dropdown-item" onClick={examclick}>Railways Typing Test</div>
                <div className="typing-dropdown-item" onClick={examclick}>DRDO Typing Test</div>
                <div className="typing-dropdown-item" onClick={examclick}>EPFO Typing Test</div>
                <div className="typing-dropdown-item" onClick={examclick}>BSF Typing Test</div>
                <div className="typing-dropdown-item" onClick={examclick}>Supreme Court Typing Test</div>
              </div>

            </div>

            <div className="typing-nav-item typing-buy-now-item" onClick={handleBuyNowClick}>Buy Now</div>
            <div className="typing-nav-item" onClick={handleresultClick}>Typing results</div>
            <div className="typing-nav-item typing-help-item" onClick={handleFreeClick}>Free Typing Tests</div>
            <div className="typing-nav-item typing-help-item" onClick={handleHelpClick}>Help</div>
          </div>
          <div className='socalIcon'>
            <div className="typing-help-item-social" onClick={handleRedirect}>
              <img src={tg} alt="Telegram Icon" className="social-icon-header" />
            </div>
            <div className="typing-help-item-social" onClick={handleyoutubeClick}>
              <img src={youtube} alt="YouTube Icon" className="social-icon-header" />
            </div>
            {cookies.session_id && (
              <div
                className={`typing-help-item-notification ${hasNotification || message ? 'animated' : ''}`}
                onClick={handleNotificationClick}
              >
                <FaBell className="notification-icon" />

                {/* Show red circle when there is a message or notifications */}
                {hasNotification || message ? (
                  <span className="notification-badge"></span>
                ) : null}
              </div>
            )}

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
            )}



          </div>

          <div className="typing-auth-buttons">
            {isLoggedIn ? (
              <div className="typing-dashboard" onClick={handleDashboardClick}>
                <FaUserCircle className="user-icon" />
                Dashboard
              </div>
            ) : (
              <>
                <button className="typing-btn typing-login-btn" onClick={handleLoginClick}>Login</button>
                <button className="typing-btn typing-signup-btn" onClick={handleSignUpClick}>Sign Up</button>

              </>
            )}
          </div>

          {/* Hamburger menu for mobile */}
          <div className="hamburger" onClick={toggleMenu}>
            &#9776;
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={`mobile-menu ${isMenuOpen ? "show" : ""}`}>
            <div className="typing-nav-item typing-help-item" onClick={handleHomeClick}>Home</div>
            <div className="typing-nav-item" onClick={toggleDropdownmobile}>Typing Test Links</div>
            <div className="typing-nav-item typing-buy-now-item" onClick={handleBuyNowClick}>Buy Now</div>
            <div className="typing-nav-item" onClick={handleresultClick}>Typing results</div>
            <div className="typing-nav-item typing-help-item" onClick={handleFreeClick}>Free Typing Tests</div>
            <div className="typing-nav-item typing-help-item" onClick={handleHelpClick}>Help</div>
          </div>
        )}


      </header>
      {loading && <Loading />}
    </>
  );
};

export default TypingHeader;


