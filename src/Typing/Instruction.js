import React, { useState, useEffect } from 'react';
import './Instruction.css';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import pic3 from "../i/NewCandidateImage.jpg"; 
import { useAuth } from '../AuthContext/AuthContext';

const Instruction = () => {
  const { testcode, exam, testname } = useParams();
  const [showNextStep, setShowNextStep] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [cookies] = useCookies(['session_id']);
  const navigate = useNavigate();
  const { userDetails, isLoggedIn } = useAuth();
  const [testTime, setTestTime] = useState(0);

  useEffect(() => {
    if (isLoggedIn && userDetails) {
      // User details available
    }
  }, [isLoggedIn, userDetails]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!cookies.session_id) {
        navigate('/login');
        return;
      }

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
          const { access } = await response.json();
          if (access === "access") {
            const productResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/code-234`, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${cookies.session_id}`
              },
              body: JSON.stringify({ product_id: '999' })
            });

            if (productResponse.ok) {
              const { access } = await productResponse.json();
              if (access !== "access") {
                navigate('/login');
              }
            } else {
              navigate('/login');
            }
          } else {
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    const fetchTestTime = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getTestDetails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${cookies.session_id}`,
          },
          body: JSON.stringify({ testcode, exam, testname }),
        });

        if (response.ok) {
          const data = await response.json();
          setTestTime(data.time);
        } else {
          setTestTime(0);
        }
      } catch (error) {
        setTestTime(0);
      }
    };

    fetchTestTime();
    checkAccess();
  }, [cookies.session_id, navigate, testcode, exam, testname]);

  const handleNextClick = () => setShowNextStep(true);
  const handlePreviousClick = () => setShowNextStep(false);
  const handleCheckboxChange = (e) => setIsChecked(e.target.checked);

  const handleReadyClick = () => {
    if (isChecked) {
      navigate(`/${testcode}/${exam}/${testname}/typing`);
    } else {
      alert("Please read and agree to the instructions before proceeding.");
    }
  };

  return (
    <div className="instruction-wrapper">
      <div className="instruction-header-bar"></div>
      
      <div className="instruction-main-container">
        <div className="instruction-content-container">
          {/* Left Content Section */}
          <div className="instruction-left-section">
            <div className="instruction-title">
              Instructions
            </div>
            
            {!showNextStep ? (
              <div className="instruction-text-content">
                <h5></h5>
                <br /><br />
                <p className="instruction-read-text">Please read instructions carefully</p>
                <br /><br />
                <p className="instruction-general-text">General instructions</p>
                <p>Total duration of examination is {testTime} minutes.</p>
                <p>The clock will be set at the server. The countdown timer in the top right corner of the screen will display the remaining time available for you to complete the typing test. When the timer reaches zero, the typing test will end automatically. You do not need to manually submit the test.</p>
                <br /><br />
                <p>Typing Test Instructions:</p>
                <br /><br />
                <p>This typing test consists of a paragraph that you must type accurately within the {testTime}-minute time limit. Errors will impact your final score.</p>
                <p>Ensure that you maintain proper speed and accuracy throughout the test to achieve the required typing standard.</p>
              </div>
            ) : (
              <div className="instruction-confirmation-section">
                <div className="instruction-checkbox-container">
                  <div className="instruction-checkbox-content">
                    <span className="instruction-checkbox-wrapper">
                      <input 
                        type="checkbox" 
                        className="instruction-checkbox" 
                        onChange={handleCheckboxChange} 
                      />
                    </span>
                    <span className="instruction-agreement-text">
                      I have read and understood the instructions. All computer hardware allotted to me is in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, Bluetooth devices, etc. / any prohibited material with me into the Examination Hall. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or disciplinary action, which may include a ban from future Tests / Examinations.
                    </span>
                  </div>
                </div>

                <div className="instruction-button-section">
                  <button className="instruction-previous-button" onClick={handlePreviousClick}>
                    <FaChevronLeft className="instruction-button-icon" />
                    <span>Previous</span>
                  </button>
                  <button className="instruction-ready-button" onClick={handleReadyClick}>
                    I am ready to begin
                  </button>
                </div>
              </div>
            )}

            {!showNextStep && (
              <div className="instruction-next-button-container">
                <button className="instruction-next-button" onClick={handleNextClick}>
                  Next <FaChevronRight className="instruction-button-icon" />
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar Section */}
          <div className="instruction-right-section">
            <div className="instruction-user-image-container">
              <img 
                width="94" 
                height="101" 
                className="instruction-user-image" 
                src={pic3} 
                alt="Candidate" 
              />
            </div>
            <p className="instruction-user-name">
              {userDetails ? userDetails.fullName : 'Guest'}
            </p>
          </div>
        </div>
      </div>
      
      {/* <div className="instruction-footer">
        Version : 17.07.00
      </div> */}
    </div>
  );
};

export default Instruction;