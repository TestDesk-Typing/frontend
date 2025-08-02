// Typing.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './VirtualKeyboard.css';
import pic2 from '../i/keyboard.png';
import pic3 from "../i/NewCandidateImage.jpg";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import Swal from 'sweetalert2';
import './Typinglogin.css';

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

  useEffect(() => {
    return () => {
      keyboard.current = null;
    };
  }, []);

  const onChange = (input) => {
    if (activeInput === 'emailId') setEmailId(input);
    else if (activeInput === 'password') setPassword(input);
  };

  const onKeyPress = (button) => {
    if (button === "{backspace}") {
      if (activeInput === 'emailId') setEmailId(prev => prev.slice(0, -1));
      else if (activeInput === 'password') setPassword(prev => prev.slice(0, -1));
    } else if (button === "{clear}") {
      if (activeInput === 'emailId') setEmailId('');
      else if (activeInput === 'password') setPassword('');
    }
  };

  const toggleKeyboard = (inputType) => {
    if (activeInput === inputType && showKeyboard) {
      setShowKeyboard(false);
      setActiveInput(null);
      return;
    }

    setActiveInput(inputType);
    setShowKeyboard(true);

    const inputElement = inputType === 'emailId' ? emailInputRef.current : passwordInputRef.current;

    if (inputElement) {
      const rect = inputElement.getBoundingClientRect();
      setKeyboardPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX
      });
    }
  };

  const userSubmit = async (event = null, userData = null) => {
    event && event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email_id: userData ? userData?.email_id : emailId, password: userData ? userData?.password : password })
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.userDetails) {
        Swal.fire({
          title: 'Login Successful',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'Continue',
          willClose: () => {
            setCookie("SSIDCE", emailId, { path: "/", maxAge: 24 * 60 * 60 });
            setCookie("session_id", data.session_id, { path: "/", maxAge: 24 * 60 * 60 });
            setCookie("SSDSD", JSON.stringify(data.userDetails), { path: "/", maxAge: 24 * 60 * 60 });
            window.location.href = '/';
          }
        });
      } else {
        Swal.fire({ title: 'Login Failed', text: data.message || 'User not found', icon: 'error', confirmButtonText: 'Retry' });
      }
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        title: 'Login Failed',
        text: 'Network Error',
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      const data = await response.json();
      if (response.ok && data.userData) {
        setEmailId(data?.userData?.email_id);
        setPassword(data?.userData?.password);
        userSubmit(null, data.userData)
      } else {
        setIsLoading(false);
        Swal.fire({
          title: 'Login Failed',
          text: data.message || 'Google user not found',
          icon: 'error',
          confirmButtonText: 'Retry'
        });
      }
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        title: 'Login Failed',
        text: 'Google Login Failed',
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    }
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
          console.error("Access check error:", error);
        }
      }
    };

    checkAccess();
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
              <span className="fontawesome-user"></span>
              <input
                ref={emailInputRef}
                type="text"
                name="email"
                className="keyboardInput"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="Username"
                required
              />
              <div className='myimagekeyboard m-0'>
                <img
                  src={pic2}
                  alt="keyboard"
                  className="keyboardInputInitiator"
                  title="Virtual keyboard"
                  onClick={() => toggleKeyboard('emailId')}
                />
              </div>
            </div>

            <div className="mb-3 input-group">
              <span className="fontawesome-lock"></span>
              <input
                ref={passwordInputRef}
                type="password"
                className="keyboardInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <div className='myimagekeyboard m-0'>
                <img
                  src={pic2}
                  alt="keyboard"
                  className="keyboardInputInitiator"
                  title="Virtual keyboard"
                  onClick={() => toggleKeyboard('password')}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 login-button-primary mt-4" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border me-2" role="status" aria-hidden="true"
                    style={{ width: '1rem', height: '1rem', borderWidth: '0.15em' }}
                  ></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse);
            }}
            onError={() => {
              Swal.fire({ title: 'Login Failed', text: 'Google login failed', icon: 'error' });
            }}
            useOneTap
          />

          {showKeyboard && (
            <div
              ref={keyboardContainerRef}
              className="keyboardContainer position-absolute"
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
