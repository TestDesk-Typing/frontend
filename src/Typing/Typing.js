import React, { useEffect, useRef, useState } from 'react'; // Added useRef import
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './Typinglogin.css';
import './VirtualKeyboard.css';
import pic1 from '../i/keyboard.png'; // Replace with the correct path to your keyboard image
import pic2 from '../i/keyboard.png'; // Replace with the correct path to your keyboard image
import pic3 from "../i/NewCandidateImage.jpg"; // Replace with the correct path to your candidate image
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import 'jbox/dist/jBox.all.min.css';
import Swal from 'sweetalert2';

const Typing = () => {
  const navigate = useNavigate();
  const { email_id } = useParams();
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie] = useCookies(["SSIDCE", "session_id"]);
  const [showModal, setShowModal] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [layout, setLayout] = useState("default");
  const keyboard = useRef(); // Create a reference for the keyboard


// console.log(process.env.REACT_APP_API_URL); 

  useEffect(() => {
    // Cleanup function to avoid memory leaks
    return () => {
      keyboard.current = null;
    };
  }, []);

  const onChange = (input) => {
    if (activeInput === 'emailId') {
      setEmailId(input);
    } else if (activeInput === 'password') {
      setPassword(input);
    }
  };

  const onKeyPress = (button) => {
    // console.log("Button pressed:", button);
    if (button === "{backspace}") {
      if (activeInput === 'emailId') {
        setEmailId(prev => prev.slice(0, -1));
      } else if (activeInput === 'password') {
        setPassword(prev => prev.slice(0, -1));
      }
    } else if (button === "{clear}") {
      if (activeInput === 'emailId') {
        setEmailId(''); // Clear email input
      } else if (activeInput === 'password') {
        setPassword(''); // Clear password input
      }
    }
  };

  const toggleKeyboard = (inputType) => {
    setActiveInput(inputType);
    setShowKeyboard(!showKeyboard);
  };

  const handleClose = () => {
    setShowModal(false);
  };



  
  const userSubmit = async (event) => {
    event.preventDefault();
  
    // Send login data to the backend
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email_id: emailId, password })
    });
  
    if (response.ok) {
      const { message, session_id, userDetails } = await response.json(); // Ensure userDetails is returned from the API
  
      if (userDetails) {
        // Display success modal using Swal2
        Swal.fire({
          title: 'Login Successful',
          text: message,
          icon: 'success',
          confirmButtonText: 'Continue',
          willClose: () => {
            // Save email_id, session_id, and userDetails in cookies
            setCookie("SSIDCE", emailId, { path: "/", maxAge: 24 * 60 * 60 });
            setCookie("session_id", session_id, { path: "/", maxAge: 24 * 60 * 60 });
            const userDetailsString = JSON.stringify(userDetails);
            setCookie("SSDSD", userDetailsString, { path: "/", maxAge: 24 * 60 * 60 });
  
            // Navigate to /home after modal closes
            // navigate('/');
            window.location.href = '/';
          }
        });
      } else {
        // If userDetails are not present in the response
        Swal.fire({
          title: 'Login Failed',
          text: 'User details not found',
          icon: 'error',
          confirmButtonText: 'Retry'
        });
      }
    } else {
      const { message } = await response.json();
  
      // Display error modal using Swal2
      Swal.fire({
        title: 'Login Failed',
        text: message,
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    }
  };
  
  
  
  

  
  
  const selIndexLang = (lang) => {
    // console.log(`Language selected: ${lang}`);
  };



  useEffect(() => {
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
  
          if (response.ok) {
            const { access } = await response.json();
            if (access === "access") {
              // Display success message using SweetAlert2
              Swal.fire({
                title: 'You are logged in!',
                text: 'Click here to navigate to home.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Go to Home',
                cancelButtonText: 'Stay Here'
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.href = '/';
                }
              });
            } else {
              // Show an alert if the user does not have access
              Swal.fire({
                title: 'Access Denied',
                text: 'You do not have typing access.',
                icon: 'error',
                confirmButtonText: 'Close'
              });
            }
          } else {
            const error = await response.json();
            console.error("Access check error:", error);
          }
        } catch (error) {
          console.error("Error fetching access:", error);
        }
      } else {
        // console.log("session_id not found in cookies");
      }
    };
  
    if (cookies.session_id) {
      checkAccess();
    } else {
      // console.log("Waiting for session_id to be set in cookies");
    }
  }, [cookies.session_id]);
  

  

  return (
    <>
      <div className="typing-container">
        <div id="wrapper">
          <div id="minwidth">
            <div id="header" style={{ backgroundColor: 'rgb(45, 112, 182)' }}>
              {/* Header content can go here */}
            </div>

            <div className="userInfo">
              <div className="system_info">
                <div className="system_name">
                  <div id="sysName" className="name1">System Name :</div>
                  <div className="details1" id="mockSysNum">Typing Test Name</div>
                  <div style={{ fontSize: '15px' }} className="details3">
                    <a
                      href="#"
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        border: '0 none'
                      }}
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
                    <span title="Annamalai" className="candOriginalName">Your name</span>
                  </div>
                  <div style={{ marginTop: '10px', textAlign: 'right' }}>
                    <span className="name2" id="subName">Subject :</span>
                    <span style={{ fontSize: '15px' }} className="details2" id="mockSubName">
                      Typing test
                    </span>
                  </div>
                </div>
                <div align="center" className="user_pic">
                  <img
                    width="94"
                    height="101"
                    align="absmiddle"
                    className="candidateImg"
                    src={pic3}
                    alt="Candidate"
                  />
                </div>
                <div className="clear"></div>
              </div>
            </div>
            <div className="message-for-login">
  <p>
    If you are not logged in, <a href="/register">Signup</a>. 
    <a 
      href="/forget-password" 
      style={{ marginLeft: '10px', color: '#007bff', textDecoration: 'none' }}
    >
      Forgot Password?
    </a>
  </p>
</div>

            <div id="login">
              <div className="form-header" id="LoginPageHeader">Login</div>
              <form name="form-login" onSubmit={userSubmit}>
                <div className='my-imput-login'>
                  <span className="fontawesome-user"></span>
                  <input
                  id="in"
                    type="text"
                    name="email"
                    className="mandat_input keyboardInput loginText"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)} // Update emailId
                    placeholder="Username"
                    required
                  />
                  <div className='myimagekeyboard'>
                    <img 
                      src={pic1}
                      alt="Display virtual keyboard interface" 
                      className="keyboardInputInitiator" 
                      title="Select keyboard layout" 
                      onClick={() => toggleKeyboard('emailId')} // Set active input to emailId
                    />
                  </div>
                </div>

                <div className='my-imput-login'>
                  <span className="fontawesome-lock"></span>
                  <input
                  id="pass"
                    type="password"
                    name="password"
                    className="mandat_input keyboardInput loginText forpass"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update password
                    placeholder="Password"
                    required
                  />
                  <div className='myimagekeyboard'>
                    <img 
                      src={pic2}
                      alt="Display virtual keyboard interface" 
                      className="keyboardInputInitiator" 
                      title="Select keyboard layout" 
                      onClick={() => toggleKeyboard('password')} // Set active input to password
                    />
                  </div>
                </div>

                <button type="submit" id="signInLabel" className="btn-submit btn-primary-submit btn-primary-blue-submit" style={{ lineHeight: '35px' }}>
                  Sign In
                </button>
              </form>

              {showKeyboard && (
  <div className="keyboardContainer" id="keyboardInputMaster">

    <Keyboard
      keyboardRef={(r) => (keyboard.current = r)}
      layoutName={layout}
      onChange={onChange}
      onKeyPress={onKeyPress}
    />
  </div>
)}


            </div>
            <div id="footer">Version : 17.07.00</div>
            
           

          </div>
        </div>
      </div>
    </>
  );
};

export default Typing;
