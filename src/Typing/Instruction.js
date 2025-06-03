import React, { useState, useEffect } from 'react';
import './Instruction.css'; // Keep your existing CSS intact
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie'; // Assuming you are using 'react-cookie'
import pic3 from "../i/NewCandidateImage.jpg"; 
import { useAuth } from '../AuthContext/AuthContext';

const Instruction = () => {
  const { testcode, exam, testname } = useParams();
  const [showNextStep, setShowNextStep] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [cookies] = useCookies(['session_id']); // Reading session_id from cookies
  const navigate = useNavigate();
  const { userDetails, isLoggedIn } = useAuth();
  const [testTime, setTestTime] = useState(0);

  useEffect(() => {
    if (isLoggedIn && userDetails) {
     
    }
  }, [isLoggedIn, userDetails]);

  // Check access for the user
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
              body: JSON.stringify({ product_id: '999' }) // Replace with actual product ID
            });

            if (productResponse.ok) {
              const { access } = await productResponse.json();
              if (access === "access") {
                // If access is granted, proceed
                // console.log("Access granted for the typing test.");
              } else {
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
          setTestTime(data.time); // Update the time dynamically
        } else {
          console.error('Failed to fetch test time.');
          setTestTime(0); // Default time in case of failure
        }
      } catch (error) {
        console.error('Error fetching test time:', error);
        setTestTime(0); // Default time in case of error
      }
    };

    fetchTestTime();

    checkAccess();
  }, [cookies.session_id, navigate]);

  const handleNextClick = () => {
    setShowNextStep(true);
  };

  const handlePreviousClick = () => {
    setShowNextStep(false);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleReadyClick = () => {
    if (isChecked) {
      // Navigate to the TypingModule route
      navigate(`/${testcode}/${exam}/${testname}/typing`);
    } else {
      alert("Please read and agree to the instructions before proceeding.");
    }
  };

// console.log(testTime)


  return (
    <>
      <div className="instruction-container">
        <div className="instruction-header">
          {/* Header content */}
        </div>

        <div className="instruction-content">
          {/* Left side - larger width */}
          <div className="instruction-left">
            <div className="sky-blue-color">Instructions</div>
            {!showNextStep ? (
              <div className="instructions-para">
                <h5></h5>
                <br /><br />
                <p className="read-inst">Please read instructions carefully</p>
                <br /><br />
                <p className="general-inst">General instructions</p>
                <p>Total duration of examination is {testTime} minutes.</p>
                <p>The clock will be set at the server. The countdown timer in the top right corner of the screen will display the remaining time available for you to complete the typing test. When the timer reaches zero, the typing test will end automatically. You do not need to manually submit the test.</p>
                <br /><br />
                <p>Typing Test Instructions:</p>
                <br /><br />
                <p>This typing test consists of a paragraph that you must type accurately within the {testTime}-minute time limit. Errors will impact your final score.</p>
                <p>Ensure that you maintain proper speed and accuracy throughout the test to achieve the required typing standard.</p>
              </div>
            ) : (
              <>
                <div className="instructions-para2"></div>
                <div className="nextbutton2">
                  <div className="understood1">
                    <div className="understood">
                      <span className="tb checkbox-container">
                        <input type="checkbox" className="discl-check" onChange={handleCheckboxChange} />
                      </span>
                      <span className="agree">
                        <span className="cusInstText1">
                          I have read and understood the instructions. All computer hardware allotted to me is in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, Bluetooth devices, etc. / any prohibited material with me into the Examination Hall. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or disciplinary action, which may include a ban from future Tests / Examinations.
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="btnsection">
                    <a className="previousbtn" onClick={handlePreviousClick} id="PreviousInst">
                      <FaChevronLeft className="next-button-arrow" />
                      <span id="previousbtn">Previous</span>
                    </a>
                    <span className="readylinkButton">
                      <button className="imaready" onClick={handleReadyClick}>
                        I am ready to begin
                      </button>
                    </span>
                  </div>
                </div>
              </>
            )}

            {!showNextStep && (
              <div className="nextbutton">
                <div className="next-and-previ" onClick={handleNextClick}>
                  Next <FaChevronRight className="next-button-arrow" />
                </div>
              </div>
            )}
          </div>

          {/* Right side - smaller width */}
          <div className="instruction-right">
            <div align="center" className="user_pic">
              <img width="94" height="101" align="absmiddle" className="candidateImg" src={pic3} alt="Candidate" />
            </div>
            {/* Check if userDetails is not null before accessing its properties */}
            <p className='userName-declare'>{userDetails ? userDetails.fullName : 'Guest'}</p>
          </div>
        </div>
      </div>
      <div id="footer">Version : 17.07.00</div>
    </>
  );
};

export default Instruction;
