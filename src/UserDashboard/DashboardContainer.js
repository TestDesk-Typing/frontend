

import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import SidebarDashboard from './SidebarDashboard';
import UserOverallChart from './UserOverallChart'; // Default component
import Profile from '../User/Profile'; 
import Settings from '../User/Settings'; 
import UserResults from '../User/UserResults';
import Invoice from '../User/Invoice'; 
// import OtherComponent from './OtherComponent'; 
import './DashboardContainer.css'; // Custom CSS
import DashboardHeader from './DashboardHeader';


const DashboardContainer = () => {
  // State to keep track of which component to render
  const [activeComponent, setActiveComponent] = useState('UserOverallChart');
  const [cookies] = useCookies(['session_id']); // Get cookies
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // Function to change the component on the right
  const handleMenuClick = (component) => {
    setActiveComponent(component);
  };

  // Function to check access
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

        if (!response.ok) {
          // If access check fails, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking access:', error);
        // Handle any network or unexpected errors here
        navigate('/login'); // Redirect to login on error
      }
    } else {
      // If no session_id, redirect to login
      navigate('/login');
    }
  };

  // Check access when component mounts
  useEffect(() => {
    checkAccess();
  }, []); // Empty dependency array to run only on mount

  // Render the appropriate component based on the activeComponent state
  const renderComponent = () => {
    switch (activeComponent) {
      case 'UserOverallChart':
        return <UserOverallChart />;
      case 'Profile':
        return <Profile />;
        case 'Settings':
          return <Settings />;
          case 'Invoice':
            return <Invoice />;
            case 'UserResults':
              return <UserResults />;
      //   case 'OtherComponent':
      //     return <OtherComponent />;
      default:
        return <UserOverallChart />;
    }
  };

  return (
    <div className="dashboard-container">
      <SidebarDashboard onMenuClick={handleMenuClick} />
      <DashboardHeader />
      <div className="right-content-container">
        {renderComponent()}
      </div>
    </div>
  );
};

export default DashboardContainer;

