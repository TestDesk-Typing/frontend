import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './VirtualKeyboard.css';
import pic1 from '../i/keyboard.png';
import pic2 from '../i/keyboard.png';
import pic3 from "../i/NewCandidateImage.jpg";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import 'jbox/dist/jBox.all.min.css';
import Swal from 'sweetalert2';
import LoadingSpinner from "../Loading";

const Typing = () => {
  const navigate = useNavigate();
  const { email_id } = useParams();
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie] = useCookies(["SSIDCE", "session_id"]);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [layout, setLayout] = useState("default");
  const keyboard = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const keyboardContainerRef = useRef(null);
  const [keyboardPosition, setKeyboardPosition] = useState({ top: 0, left: 0 });
  const [keyboardDirection, setKeyboardDirection] = useState('bottom'); // default position

  useEffect(() => {
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
    if (button === "{backspace}") {
      if (activeInput === 'emailId') {
        setEmailId(prev => prev?.slice(0, -1));
      } else if (activeInput === 'password') {
        setPassword(prev => prev?.slice(0, -1));
      }
    } else if (button === "{clear}") {
      if (activeInput === 'emailId') {
        setEmailId('');
      } else if (activeInput === 'password') {
        setPassword('');
      }
    }
  };

  const toggleKeyboard = (inputType) => {
    if (activeInput === inputType && showKeyboard) {
      // If clicking the same input again, just close the keyboard
      setShowKeyboard(false);
      setActiveInput(null);
      return;
    }

    setActiveInput(inputType);
    setShowKeyboard(true);

    let inputElement = null;
    if (inputType === 'emailId') {
      inputElement = emailInputRef.current;
    } else if (inputType === 'password') {
      inputElement = passwordInputRef.current;
    }

    if (inputElement) {
      const rect = inputElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let direction = 'bottom';
      if (rect.bottom + 250 > viewportHeight && rect.top > 250) {
        direction = 'top';
        setKeyboardPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
      } else if (rect.left + 300 > viewportWidth && rect.right > 300) {
        direction = 'left';
        setKeyboardPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
      } else if (rect.right + 300 > viewportWidth && rect.left > 300) {
        direction = 'right';
        setKeyboardPosition({ top: rect.top + window.scrollY, left: rect.right + window.scrollX });
      } else {
        direction = 'bottom';
        setKeyboardPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
      }

      setKeyboardDirection(direction);
    }
  };

  const userSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email_id: emailId, password })
    });

    if (response.ok) {
      const { message, session_id, userDetails } = await response.json();
      setIsLoading(false);
      if (userDetails) {
        Swal.fire({
          title: 'Login Successful',
          text: message,
          icon: 'success',
          confirmButtonText: 'Continue',
          willClose: () => {
            setCookie("SSIDCE", emailId, { path: "/", maxAge: 24 * 60 * 60 });
            setCookie("session_id", session_id, { path: "/", maxAge: 24 * 60 * 60 });
            setCookie("SSDSD", JSON.stringify(userDetails), { path: "/", maxAge: 24 * 60 * 60 });
            window.location.href = '/';
          }
        });
      } else {
        setIsLoading(false);
        Swal.fire({ title: 'Login Failed', text: 'User details not found', icon: 'error', confirmButtonText: 'Retry' });
      }
    } else {
      setIsLoading(false);
      const { message } = await response.json();
      Swal.fire({ title: 'Login Failed', text: message, icon: 'error', confirmButtonText: 'Retry' });
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      if (cookies.session_id) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/code-123`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${cookies.session_id}` }
          });
          if (response.ok) {
            const { access } = await response.json();
            if (access === "access") {
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
            }
          }
        } catch (error) {
          console.error("Error fetching access:", error);
        }
      }
    };

    if (cookies.session_id) {
      checkAccess();
    }
  }, [cookies.session_id]);

  return (
    <div className="typing-test-selector-container">
      <div className="header-bar"></div>
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

      <div className="message-for-login text-center mb-4">
        <p className="mb-0">
          If you are not logged in, <a href="/register" className="text-purple fw-bold">Signup</a>.
          <a href="/forget-password" className="ms-2 text-primary text-decoration-none">Forgot Password?</a>
        </p>
      </div>

      <div className="test-selection-container mt-2">
        <h2 className="test-selection-title ps-4 m-0">Login</h2>

        <div className="selection-controls">
          <form onSubmit={userSubmit}>
            <div className="mb-3 input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-person-fill"></i></span>
              <input
                ref={emailInputRef}
                type="text"
                className="form-control"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="Username"
                required
              />
              <button type="button" className="btn btn-light border" onClick={() => toggleKeyboard('emailId')}>
                <img src={pic1} alt="Keyboard" width="20" />
              </button>
            </div>

            <div className="mb-3 input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock-fill"></i></span>
              <input
                ref={passwordInputRef}
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button type="button" className="btn btn-light border" onClick={() => toggleKeyboard('password')}>
                <img src={pic2} alt="Keyboard" width="20" />
              </button>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 login-button-primary mt-4">Sign In</button>
          </form>

          {showKeyboard && (
            <div
              ref={keyboardContainerRef}
              className={`keyboardContainer position-absolute keyboard-${keyboardDirection}`}
              style={{ top: `${keyboardPosition.top}px`, left: `${keyboardPosition.left}px`, zIndex: 1000 }}
              id="keyboardInputMaster"
            >
              <Keyboard
                keyboardRef={(r) => (keyboard.current = r)}
                layoutName={layout}
                onChange={onChange}
                onKeyPress={onKeyPress}
              />
            </div>
          )}
        </div>
      </div>

      <footer className="bg-secondary text-white py-2 fixed-bottom">
        <div className="container">
          <div className="row">
            <div className="col text-center">Version : 17.07.00</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Typing;
