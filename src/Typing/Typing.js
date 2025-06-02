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
  const keyboard = useRef();

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
        setEmailId(prev => prev.slice(0, -1));
      } else if (activeInput === 'password') {
        setPassword(prev => prev.slice(0, -1));
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
    setActiveInput(inputType);
    setShowKeyboard(!showKeyboard);
  };

  const userSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email_id: emailId, password })
    });

    if (response.ok) {
      const { message, session_id, userDetails } = await response.json();

      if (userDetails) {
        Swal.fire({
          title: 'Login Successful',
          text: message,
          icon: 'success',
          confirmButtonText: 'Continue',
          willClose: () => {
            setCookie("SSIDCE", emailId, { path: "/", maxAge: 24 * 60 * 60 });
            setCookie("session_id", session_id, { path: "/", maxAge: 24 * 60 * 60 });
            const userDetailsString = JSON.stringify(userDetails);
            setCookie("SSDSD", userDetailsString, { path: "/", maxAge: 24 * 60 * 60 });
            window.location.href = '/';
          }
        });
      } else {
        Swal.fire({
          title: 'Login Failed',
          text: 'User details not found',
          icon: 'error',
          confirmButtonText: 'Retry'
        });
      }
    } else {
      const { message } = await response.json();
      Swal.fire({
        title: 'Login Failed',
        text: message,
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
          console.error("Error fetching access:", error);
        }
      }
    };

    if (cookies.session_id) {
      checkAccess();
    }
  }, [cookies.session_id]);

  return (
    <div className="container-fluid p-0 typing-container">
      {/* Header */}
      <header className="bg-primary py-3">
        <div className="container">
          <div className="row">
            <div className="col">
              {/* Header content can go here */}
            </div>
          </div>
        </div>
      </header>

      {/* User Info Section */}
      <section className="user-info bg-dark text-white py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="system-name mb-3">
                <h6 className="mb-1">System Name:</h6>
                <h4 className="text-warning">Typing Test Name</h4>
                <small>
                  <a href="#" className="text-white text-decoration-none">
                    Kindly contact the invigilator if there are any discrepancies in the
                    Name and Photograph displayed on the screen or if the photograph is not
                    yours
                  </a>
                </small>
              </div>
            </div>
            
            <div className="col-md-5 text-md-end">
              <div className="user-name mb-3">
                <h6 className="mb-1">Candidate Name:</h6>
                <h4 className="text-warning">Your name</h4>
                <div className="mt-2">
                  <span className="me-2">Subject:</span>
                  <span className="text-warning">Typing test</span>
                </div>
              </div>
            </div>
            
            <div className="col-md-2 text-center">
              <img 
                src={pic3} 
                alt="Candidate" 
                className="img-thumbnail border-dark" 
                width="94"
                height="101"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="login-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="message-for-login text-center mb-4">
                <p className="mb-0">
                  If you are not logged in, <a href="/register" className="text-purple fw-bold">Signup</a>.
                  <a href="/forget-password" className="ms-2 text-primary text-decoration-none">
                    Forgot Password?
                  </a>
                </p>
              </div>

              <div className="card border-primary">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Login</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={userSubmit}>
                    <div className="mb-3 input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person-fill"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        placeholder="Username"
                        required
                      />
                      <button 
                        type="button" 
                        className="btn btn-light border"
                        onClick={() => toggleKeyboard('emailId')}
                      >
                        <img src={pic1} alt="Keyboard" width="20" />
                      </button>
                    </div>

                    <div className="mb-3 input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                      />
                      <button 
                        type="button" 
                        className="btn btn-light border"
                        onClick={() => toggleKeyboard('password')}
                      >
                        <img src={pic2} alt="Keyboard" width="20" />
                      </button>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary w-100 py-2"
                    >
                      Sign In
                    </button>
                  </form>

                  {showKeyboard && (
                    <div className="mt-3 keyboardContainer">
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
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-2 fixed-bottom">
        <div className="container">
          <div className="row">
            <div className="col text-center">
              Version : 17.07.00
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Typing;