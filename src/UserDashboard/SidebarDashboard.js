import React from 'react';
import { FaTachometerAlt, FaUser, FaHome, FaCog, FaSignOutAlt, FaFileInvoice } from 'react-icons/fa';
import { TbReport, TbDeviceGamepad2 } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Nav, ListGroup } from 'react-bootstrap';
import './SidebarDashboard.css';

const SidebarDashboard = ({ onMenuClick, activeMenu }) => {
  const [cookies, , removeCookie] = useCookies(['session_id', 'SSIDCE', 'SSDSD']);

  const handleMenuClick = (menu) => {
    onMenuClick(menu);
  };

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

  return (
    <div className="sidebar-dashboard-container">
      <Nav className="flex-column sidebar-menu">
        <ListGroup variant="flush" className="w-100">
          {/* Home Link */}
          <ListGroup.Item 
            as={Link} 
            to="/" 
            action 
            className={`sidebar-item ${activeMenu === 'Home' ? 'active' : ''}`}
            onClick={() => handleMenuClick('Home')}
          >
            <FaHome className="icon me-2" /> Home
          </ListGroup.Item>

          {/* Typing Speed Chart */}
          <ListGroup.Item 
            action 
            className={`sidebar-item ${activeMenu === 'UserOverallChart' ? 'active' : ''}`}
            onClick={() => handleMenuClick('UserOverallChart')}
          >
            <FaTachometerAlt className="icon me-2" /> Typing Speed Chart
          </ListGroup.Item>

          {/* Your Typing Results */}
          <ListGroup.Item 
            action 
            className={`sidebar-item ${activeMenu === 'UserResults' ? 'active' : ''}`}
            onClick={() => handleMenuClick('UserResults')}
          >
            <TbReport className="icon me-2" /> Your Typing Results
          </ListGroup.Item>

          {/* Profile */}
          <ListGroup.Item 
            action 
            className={`sidebar-item ${activeMenu === 'Profile' ? 'active' : ''}`}
            onClick={() => handleMenuClick('Profile')}
          >
            <FaUser className="icon me-2" /> Profile
          </ListGroup.Item>

          {/* Settings */}
          <ListGroup.Item 
            action 
            className={`sidebar-item ${activeMenu === 'Settings' ? 'active' : ''}`}
            onClick={() => handleMenuClick('Settings')}
          >
            <FaCog className="icon me-2" /> Settings
          </ListGroup.Item>

          {/* Typing Game */}
          <ListGroup.Item 
            action 
            className={`sidebar-item ${activeMenu === 'TypingGame' ? 'active' : ''}`}
            onClick={() => handleMenuClick('TypingGame')}
          >
            <TbDeviceGamepad2 className="icon me-2" /> Type In Game
          </ListGroup.Item>

          {/* Invoice */}
          <ListGroup.Item 
            action 
            className={`sidebar-item ${activeMenu === 'Invoice' ? 'active' : ''}`}
            onClick={() => handleMenuClick('Invoice')}
          >
            <FaFileInvoice className="icon me-2" /> Invoice
          </ListGroup.Item>

          {/* Logout */}
          <ListGroup.Item 
            action 
            className="sidebar-item"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="icon me-2" /> Logout
          </ListGroup.Item>
        </ListGroup>
      </Nav>
    </div>
  );
};

export default SidebarDashboard;