
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
  const [orderAmount, setOrderAmount] = useState(0); // Ensure this is initialized as a number
  const [plans, setPlans] = useState([]); // To store fetched plans
  const [cookies] = useCookies(['session_id']);
  
  const navigate = useNavigate();
  const { exam, examName, paperCode } = useParams();

  useEffect(() => {
    if (isLoggedIn && userDetails) {
      setEmail(userDetails.email);
      checkProductAccess('999'); // Use actual product ID
    }

    // Set the initial order amount based on the default plan
    setOrderAmount(getPrice());  // Ensure it's set as an integer
  }, [isLoggedIn, userDetails]); 

  useEffect(() => {
    // Update the order amount whenever the plan changes
    setOrderAmount(getPrice());  // Ensure it's set as an integer
  }, [plan]);

  // Fetch plans from the API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getPlans`, {
          method: 'GET', 

        });

        if (response.ok) {
          const data = await response.json();
          setPlans(data);  // Store the plans fetched from the API
          setPlan(data[0]?.name || '30 Days'); // Default to the first plan if available
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      }
    };

    fetchPlans();
  }, [cookies.session_id]); // Run when session_id changes

  const checkRegistration = async (emailToCheck) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/check-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToCheck }),
      });
  
      const data = await response.json();
      setIsRegistered(data.registered);
  
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
        // console.log("Access Check Result:", result);
        if (result.access === "access") {
          navigate(`/exam/${exam}/${examName}/${paperCode}/testselect`);
        } else {
          navigate(`/exam/${exam}/${examName}/${paperCode}/payment`);
        }
      } else {
        console.error("Failed to check product access", response.statusText);
        navigate(`/exam/${exam}/${examName}/${paperCode}/payment`);
      }
    } catch (error) {
      console.error("Error checking product access", error);
      navigate(`/exam/${exam}/${examName}/${paperCode}/payment`);
    }
  };

  const handlePlanChange = (e) => {
    setPlan(e.target.value);
  };

  const getPrice = () => {
    const selectedPlan = plans.find((p) => p.name === plan);
    
    // Check if a valid plan is selected and parse the totalAmount as an integer
    if (selectedPlan) {
      const cleanedAmount = selectedPlan.totalAmount.replace('₹', '').trim(); // Remove the ₹ symbol and any extra spaces
      return parseInt(cleanedAmount, 10); // Convert the cleaned string to an integer
    }
  
    return 0; // Return 0 if no valid plan is found
  };
  

  const calculateSubscriptionDates = () => {
    const startDate = new Date(); 
    let expiryDate = new Date(startDate); 

    const selectedPlan = plans.find((p) => p.name === plan);
    if (selectedPlan) {
      switch (selectedPlan.name) {
        case '30 Days': expiryDate.setDate(startDate.getDate() + 30); break;
        case '25 Days': expiryDate.setDate(startDate.getDate() + 25); break;
        case '3 Days': expiryDate.setDate(startDate.getDate() + 3); break;
        case '90 Days': expiryDate.setDate(startDate.getDate() + 90); break;
        case '180 Days': expiryDate.setDate(startDate.getDate() + 180); break;
        case '365 Days': expiryDate.setDate(startDate.getDate() + 365); break;
        default: break;
      }
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
    };
  };

  const subscriptionDates = calculateSubscriptionDates();

  return (
    <>
      <div id="minwidth">
        <div id="header" style={{ backgroundColor: 'rgb(45, 112, 182)' }}></div>
        <div className="userInfo">
          <div className="system_info">
            <div className="system_name">
              <div id="sysName" className="name1">System Name :</div>
              <div className="details1" id="mockSysNum">{paperCode}</div>
              <div style={{ fontSize: '15px' }} className="details3">
                <a
                  href="#"
                  style={{ color: 'white', textDecoration: 'none', border: '0 none' }}
                  id="notMySystem"
                >
                  Kindly contact the invigilator if there are any discrepancies in the
                  Name and Photograph displayed on the screen or if the photograph is not
                  yours
                </a>
              </div>
            </div>
            
            <div className="user_name">
              <div id="indexCandName" className="name2">Candidate Name :</div>
              <div className="details2">
                <span title={userDetails?.fullName} className="candOriginalName">{userDetails?.fullName || 'Your name'}</span>
              </div>
              <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <span className="name2" id="subName">Subject :</span>
                <span style={{ fontSize: '15px' }} className="details2" id="mockSubName">Typing test</span>
              </div>
            </div>
            <div align="center" className="user_pic">
              <img width="94" height="101" align="absmiddle" className="candidateImg" src={pic3} alt="Candidate" />
            </div>
            <div className="clear"></div>
          </div>
        </div>
      </div>
      {/* <div className="scrolling-message">
  <span>
    Live Test Schedule: Morning Session 6 AM TO 7 AM And Evening Session 7 PM TO 8 PM - Special For 2024 Typing Test
  </span>
</div> */}
      <div className='check-sub'>
        <div className='header-for-sub'>Select an option and pay to continue.</div>
        <div className="payment-component">
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="email-input"
          />
          <button onClick={() => checkRegistration(email)} className="check-button">Check Registration</button>

          {isRegistered === true && (
            <div className="plan-selection">
              <h2>Select Plan:</h2>
              <select value={plan} onChange={handlePlanChange} className="plan-select">
                {plans.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} - {p.totalAmount}
                  </option>
                ))}
              </select>
              <BuyTyping
                userDetails={userDetails}
                orderAmount={orderAmount}  // This is now an integer
                buttonText="Pay Now"
                className="pay-button"
               
                examName={examName}
                paperCode={paperCode}
                exam={exam}
                selectedPlan={plan}
              />
            </div>
          )}
        </div>
      </div>
      <div id="footer">Version : 17.07.00</div>
    </>
  );
};

export default PaymentComponent;



