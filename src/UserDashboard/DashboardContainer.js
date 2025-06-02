import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';
import UserOverallChart from './UserOverallChart';
import Profile from '../User/Profile'; 
import Settings from '../User/Settings'; 
import UserResults from '../User/UserResults';
import Invoice from '../User/Invoice';
import './DashboardContainer.css';
import DashboardHeader from './DashboardHeader';

const DashboardContainer = () => {
  const [activeComponent, setActiveComponent] = useState('UserOverallChart');
  const [cookies] = useCookies(['session_id']);
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleMenuClick = (component) => {
    setActiveComponent(component);
  };

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
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking access:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    checkAccess();
  }, []);

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
      default:
        return <UserOverallChart />;
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="container-fluid p-0 dashboard-container">
      <div className="row g-0">
        {/* Sidebar - using col-md-3 for medium screens and up */}
        <div className={`col-md-3 col-lg-2 d-md-block bg-dark sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <SidebarDashboard 
            onMenuClick={handleMenuClick} 
            isCollapsed={sidebarCollapsed}
            toggleCollapse={toggleSidebar}
          />
        </div>
        
        {/* Main content area */}
        <div className={`col-md-9 col-lg-10 ms-sm-auto px-0 main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          <DashboardHeader toggleSidebar={toggleSidebar} />
          
          <div className="right-content-container">
            {renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;