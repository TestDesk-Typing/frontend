import React, { useState, useEffect, useRef } from 'react';
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
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const mainContentRef = useRef(null);
  const sidebarRef = useRef(null);

  // The minimum distance required to register as a swipe
  const minSwipeDistance = 50;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleMenuClick = (component) => {
    setActiveComponent(component);
    // Auto-close sidebar on mobile when menu item is clicked
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
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

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchEnd - touchStart; // Reverse direction
    const isRightSwipe = distance > minSwipeDistance;
    const isLeftSwipe = distance < -minSwipeDistance;

    if (isRightSwipe && sidebarCollapsed) {
      setSidebarCollapsed(false);
    } else if (isLeftSwipe && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  };


  // Add event listeners when component mounts
  useEffect(() => {
    const mainContent = mainContentRef.current;
    const sidebar = sidebarRef.current;

    if (mainContent) {
      mainContent.addEventListener('touchstart', onTouchStart, { passive: true });
      mainContent.addEventListener('touchmove', onTouchMove, { passive: true });
      mainContent.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    // Add touch area for closed sidebar (10px edge)
    if (sidebar) {
      sidebar.addEventListener('touchstart', onTouchStart, { passive: true });
      sidebar.addEventListener('touchmove', onTouchMove, { passive: true });
      sidebar.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    return () => {
      if (mainContent) {
        mainContent.removeEventListener('touchstart', onTouchStart);
        mainContent.removeEventListener('touchmove', onTouchMove);
        mainContent.removeEventListener('touchend', onTouchEnd);
      }
      if (sidebar) {
        sidebar.removeEventListener('touchstart', onTouchStart);
        sidebar.removeEventListener('touchmove', onTouchMove);
        sidebar.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [touchStart, touchEnd, sidebarCollapsed]);

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
    <div className="container-fluid p-0 dashboard-container mt-5">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar ${window.innerWidth < 768
            ? (sidebarCollapsed ? '' : 'show')
            : (sidebarCollapsed ? 'collapsed' : '')
          }`}
      >
        <SidebarDashboard
          onMenuClick={handleMenuClick}
          isCollapsed={sidebarCollapsed}
          toggleCollapse={toggleSidebar}
        />
      </div>

      {/* Mobile backdrop */}
      {!sidebarCollapsed && window.innerWidth < 768 && (
        <div
          className="sidebar-backdrop show"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main content */}
      <div
        ref={mainContentRef}
        className={`main-content ${window.innerWidth >= 768 && sidebarCollapsed ? 'expanded' : ''
          }`}
      >
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <div className="right-content-container">
          {renderComponent()}
        </div>
      </div>
    </div>
  );


};

export default DashboardContainer;