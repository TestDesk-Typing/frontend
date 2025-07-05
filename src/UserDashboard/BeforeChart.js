import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { IoMdSpeedometer } from "react-icons/io";
import { FaCalendarDays, FaKeyboard } from "react-icons/fa6";
import { BsCalendarCheckFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import Loading from "../Loading";
import { Card, Container, Row, Col } from 'react-bootstrap';
import './BeforeChart.css';

const BeforeChart = () => {
  const [cookies] = useCookies(['session_id', 'SSIDCE']);
  const [speedData, setSpeedData] = useState([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState('Loading...');
  const [overallSpeed, setOverallSpeed] = useState(0);
  const [emailCount, setEmailCount] = useState(0);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

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

      const totalSpeed = data.reduce((sum, entry) => sum + (entry?.speed ?? 0), 0);
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
      setLoading(true);
      await Promise.all([
        fetchSpeedData(),
        fetchSubscriptionData(),
        fetchEmailCount(),
        fetchSubscriptionInfo()
      ]);
      setLoading(false);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <Container fluid className="before-chart-container mt-4">
      <Row className="g-3">
        {/* Subscription Card */}
        <Col xs={12} sm={6} md={3}>
          <Card 
            className="h-100 before-chart-card" 
            onClick={handleSubscriptionClick}
          >
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <FaCalendarDays className="days-user" size={30} />
                <div className="text-end">
                  <Card.Title className="card-title mb-0">Subscription</Card.Title>
                  <Card.Text className="card-number">{subscriptionPlan}</Card.Text>
                </div>
              </div>
              <Card.Footer className="card-footer mt-auto">
                <small className="update-text">↻ Update Now</small>
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>

        {/* Typing Speed Card */}
        <Col xs={12} sm={6} md={3}>
          <Card className="h-100 before-chart-card">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <IoMdSpeedometer className="speed-user" size={30} />
                <div className="text-end">
                  <Card.Title className="card-title mb-0">Your typing Speed</Card.Title>
                  <Card.Text className="card-number">{overallSpeed} (WPM)</Card.Text>
                </div>
              </div>
              <Card.Footer className="card-footer mt-auto">
                <small className="update-text">↻ Update Now</small>
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Tests Card */}
        <Col xs={12} sm={6} md={3}>
          <Card 
            className="h-100 before-chart-card" 
            onClick={handlegivetest}
          >
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <FaKeyboard className="typ-user" size={30} />
                <div className="text-end">
                  <Card.Title className="card-title mb-0">Total test given</Card.Title>
                  <Card.Text className="card-number">{emailCount} tests</Card.Text>
                </div>
              </div>
              <Card.Footer className="card-footer mt-auto">
                <small className="update-text">↻ Update Now</small>
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>

        {/* Subscription End Card */}
        <Col xs={12} sm={6} md={3}>
          <Card 
            className="h-100 before-chart-card" 
            onClick={handlesubendClick}
          >
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <BsCalendarCheckFill className="end-user" size={30} />
                <div className="text-end">
                  <Card.Title className="card-title mb-0">Subscription ends</Card.Title>
                  <Card.Text className="card-number">{formatDate(subscriptionInfo?.subscriptionExpiryDate)}</Card.Text>
                </div>
              </div>
              <Card.Footer className="card-footer mt-auto">
                <small className="update-text">↻ Update Now</small>
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BeforeChart;