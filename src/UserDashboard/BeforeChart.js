

import React, { useEffect, useState } from 'react';
import './BeforeChart.css';
import { useCookies } from 'react-cookie';
import { IoMdSpeedometer } from "react-icons/io";
import { FaCalendarDays, FaKeyboard } from "react-icons/fa6";
import { BsCalendarCheckFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import Loading from "../Loading" // Assuming Loading is in the components folder

const BeforeChart = () => {
  const [cookies] = useCookies(['session_id', 'SSIDCE']);
  const [speedData, setSpeedData] = useState([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState('Loading...');
  const [overallSpeed, setOverallSpeed] = useState(0);
  const [emailCount, setEmailCount] = useState(0);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  const navigate = useNavigate();

  const fetchSpeedData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/speed-data/${cookies.SSIDCE}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setSpeedData(data);

      const totalSpeed = data.reduce((sum, entry) => sum + entry.speed, 0);
      const averageSpeed = data.length > 0 ? Math.round(totalSpeed / data.length) : 0;
      setOverallSpeed(averageSpeed);
    } catch (error) {
      console.error('Error fetching speed data:', error);
    }
  };

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/access-typing/${cookies.SSIDCE}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setSubscriptionPlan(data.selectedPlan || 'No Plan');
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      setSubscriptionPlan('Error fetching data');
    }
  };

  const fetchEmailCount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/typing-performance/count/${cookies.SSIDCE}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setEmailCount(data.count);
    } catch (error) {
      console.error('Error fetching email count:', error);
    }
  };

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscription-info/${cookies.SSIDCE}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setSubscriptionInfo(data);
    } catch (error) {
      console.error('Error fetching subscription information:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Show loading
      await Promise.all([
        fetchSpeedData(),
        fetchSubscriptionData(),
        fetchEmailCount(),
        fetchSubscriptionInfo()
      ]);
      setLoading(false); // Hide loading when all data is fetched
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubscriptionClick = () => {
    if (subscriptionPlan === 'No Plan') {
      navigate('/ssc-typing-test/buy-now');
    }
  };

  const handlesubendClick = () => {
    if (subscriptionPlan === 'No Date') {
      navigate('/ssc-typing-test/buy-now');
    }
  };

  const handlegivetest = () => {
    navigate('/choose-exam');
  };

  // Render the Loading component when loading is true
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="before-chart-container">
      <div className="card-row">
        <div className="before-chart-card" onClick={handleSubscriptionClick}>
          <div className="before-chart-card-icon">
            <div className="card-icon">
              <FaCalendarDays className='days-user' />
            </div>
            <div className="card-content">
              <span className="card-title">Subscription</span>
              <span className="card-number">{subscriptionPlan}</span>
            </div>
          </div>
          <div className="card-footer">
            <span className="update-text">↻ Update Now</span>
          </div>
        </div>
        <div className="before-chart-card">
          <div className="before-chart-card-icon">
            <div className="card-icon">
              <IoMdSpeedometer className='speed-user' />
            </div>
            <div className="card-content">
              <span className="card-title">Your typing Speed</span>
              <span className="card-number">{overallSpeed} (WPM)</span>
            </div>
          </div>
          <div className="card-footer">
            <span className="update-text">↻ Update Now</span>
          </div>
        </div>
        <div className="before-chart-card" onClick={handlegivetest}>
          <div className="before-chart-card-icon">
            <div className="card-icon">
              <FaKeyboard className='typ-user' />
            </div>
            <div className="card-content">
              <span className="card-title">Total test given</span>
              <span className="card-number">{emailCount} tests</span>
            </div>
          </div>
          <div className="card-footer">
            <span className="update-text">↻ Update Now</span>
          </div>
        </div>
        <div className="before-chart-card" onClick={handlesubendClick}>
          <div className="before-chart-card-icon">
            <div className="card-icon">
              <BsCalendarCheckFill className='end-user' />
            </div>
            <div className="card-content">
              <span className="card-title">Subscription ends</span>
              <span className="card-number">{formatDate(subscriptionInfo?.subscriptionExpiryDate)}</span>
            </div>
          </div>
          <div className="card-footer">
            <span className="update-text">↻ Update Now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeChart;
