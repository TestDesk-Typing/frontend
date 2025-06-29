import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext/AuthContext';
import './PaymentComponent.css';
import pic3 from "../i/NewCandidateImage.jpg";
import BuyTyping from './Payment';
import { useCookies } from 'react-cookie';

const PaymentComponent = () => {
  const { userDetails, isLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(null);
  const [plan, setPlan] = useState('30 Days');
  const [orderAmount, setOrderAmount] = useState(0);
  const [plans, setPlans] = useState([]);
  const [cookies] = useCookies(['session_id']);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { exam, examName, paperCode } = useParams();

  useEffect(() => {
    if (isLoggedIn && userDetails) {
      setEmail(userDetails.email);
      checkProductAccess('999');
    }
    setOrderAmount(getPrice());
  }, [isLoggedIn, userDetails]);

  useEffect(() => {
    setOrderAmount(getPrice());
  }, [plan]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getPlans`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${cookies.session_id}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPlans(data);
          setPlan(data[0]?.name || '30 Days');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [cookies.session_id]);

  const checkRegistration = async (emailToCheck) => {
    if (!emailToCheck) {
      Swal.fire({
        icon: 'error',
        title: 'Email Required',
        text: 'Please enter your email address',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/check-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${cookies.session_id}`
        },
        body: JSON.stringify({ email: emailToCheck }),
      });

      const data = await response.json();
      setIsRegistered(data.registered);
      setIsLoading(false);

      if (!data.registered) {
        Swal.fire({
          icon: 'error',
          title: 'Not Registered',
          text: 'You are not registered in our application. Please register first.',
          confirmButtonText: 'Register Now',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/register');
          }
        });
      }
    } catch (error) {
      console.error('Error checking registration:', error);
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while checking registration.',
      });
    }
  };

  const checkProductAccess = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/code-234`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
        body: JSON.stringify({ product_id: productId })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.access === "access") {
          navigate(`/exam/${exam}/${examName}/${paperCode}/testselect`);
        }
      }
    } catch (error) {
      console.error("Error checking product access", error);
    }
  };

  const handlePlanChange = (e) => {
    setPlan(e.target.value);
  };

  const getPrice = () => {
    const selectedPlan = plans.find((p) => p.name === plan);
    if (selectedPlan) {
      const cleanedAmount = selectedPlan.totalAmount.replace('₹', '').trim();
      return parseInt(cleanedAmount, 10);
    }
    return 0;
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <div className="header-content"></div>
      </div>

        <div className="user-typing-info-container">
          <div className="info-section mt-0">
            <div className="info-item">
              <span className="info-label">System Name :</span><br />
              <span className="info-value">Typing Test Name</span>
            </div>
            <div className="disclaimer">
              Kindly contact the invigilator if there are any discrepancies in the Name and Photograph displayed on the screen or if the photograph is not yours
            </div>
          </div>

          <div className="info-section-one me-2">
            <div className="info-item">
              <span className="info-label">Candidate Name :</span><br />
              <span className="info-value">{'Your name'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Subject :</span>
              <span className="info-label-value">Typing Test</span>
            </div>
          </div>

          <div className="user-image-container">
            <img src={pic3} alt="Candidate" className="user-image" />
          </div>
        </div>

      <div className="payment-content">
        <div className="payment-card">
          <div className="card-header">
            Select an option and pay to continue
          </div>

          <div className="card-body">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={() => checkRegistration(email)}
              className="check-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Checking...' : 'Check Registration'}
            </button>

            {isRegistered === true && (
              <div className="plan-section">
                <h3 className="section-title">Select Subscription Plan</h3>

                <div className="form-group">
                  <label htmlFor="plan" className="form-label">Available Plans</label>
                  <select
                    id="plan"
                    value={plan}
                    onChange={handlePlanChange}
                    className="form-select"
                    disabled={isLoading}
                  >
                    {plans.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} - {p.totalAmount}
                      </option>
                    ))}
                  </select>
                </div>

                <BuyTyping
                  userDetails={userDetails}
                  orderAmount={orderAmount}
                  buttonText={isLoading ? 'Processing...' : 'Pay Now'}
                  className="pay-btn"
                  disabled={isLoading}
                  examName={examName}
                  paperCode={paperCode}
                  exam={exam}
                  selectedPlan={plan}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <div className="footer">
        Version: 17.07.00
      </div> */}
    </div>
  );
};

export default PaymentComponent;