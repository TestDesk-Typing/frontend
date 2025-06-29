import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './TypingTestSelector.css';
import pic3 from "../i/NewCandidateImage.jpg";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import { useCookies } from 'react-cookie';

const TypingTestSelector = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedPaperCode, setSelectedPaperCode] = useState('');
  const [selectedTestName, setSelectedTestName] = useState('');
  const [paragraphs, setParagraphs] = useState([]);
  const navigate = useNavigate();
  const { exam, examName, paperCode } = useParams();
  const { userDetails, isLoggedIn } = useAuth();
  const [cookies] = useCookies(['session_id']);

  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const today = new Date();

  useEffect(() => {
    const disableRightClick = (event) => {
      event.preventDefault();
    };

    const disableCutCopyPaste = (event) => {
      if (event.ctrlKey || event.metaKey) {
        return;
      }
      event.preventDefault();
    };

    const disableKeyCombinations = (event) => {
      if (
        (event.ctrlKey && event.shiftKey && event.code === "KeyI") ||
        (event.ctrlKey && event.shiftKey && event.code === "KeyC") ||
        (event.ctrlKey && event.shiftKey && event.code === "KeyJ") ||
        (event.ctrlKey && event.shiftKey && event.code === "KeyS") ||
        (event.keyCode === 121 && event.shiftKey === true) ||
        (event.ctrlKey && event.code === "KeyU") ||
        (event.ctrlKey && event.code === "KeyP") ||
        (event.code === "F12")
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("cut", disableCutCopyPaste);
    document.addEventListener("copy", disableCutCopyPaste);
    document.addEventListener("paste", disableCutCopyPaste);
    document.addEventListener("keydown", disableKeyCombinations);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("cut", disableCutCopyPaste);
      document.removeEventListener("copy", disableCutCopyPaste);
      document.removeEventListener("paste", disableCutCopyPaste);
      document.removeEventListener("keydown", disableKeyCombinations);
    };
  }, []);

  useEffect(() => {
    const checkAccessAndFetchParagraphs = async () => {
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
              const { access: productAccess } = await productResponse.json();
              if (productAccess === "access") {
                await fetchParagraphs();
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

    const fetchParagraphs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/typingParagraphs-paperCode`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${cookies.session_id}`,
          },
          body: JSON.stringify({ paper_code: paperCode }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setParagraphs(data);
      } catch (error) {
        console.error('Error fetching paragraphs:', error);
        Swal.fire({
          icon: 'info',
          title: 'Live Test Info',
          text: 'This feature will only be available during the live test. Please check your schedule!',
          confirmButtonText: 'Okay',
          allowOutsideClick: false,
          allowEscapeKey: true,
        });
      }
    };

    checkAccessAndFetchParagraphs();
  }, [cookies.session_id, navigate, paperCode]);

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const handleStartTest = () => {
    if (!selectedMonth || !selectedTestName) {
      Swal.fire({
        icon: 'error',
        title: 'Selection Required',
        text: 'Please select both a month and a test before proceeding.',
      });
      return;
    }

    requestFullScreen();
    navigate(`/instruction/${paperCode}/${examName}/${selectedTestName}`);
  };

  const filteredTests = paragraphs
    .filter(paragraph => {
      const testDate = new Date(paragraph.date);
      return testDate.toLocaleString('default', { month: 'long' }) === selectedMonth;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="typing-test-selector-container">
      <div className="header-bar"></div>
      <div className="user-typing-info-container">
        <div className="info-section mt-0">
          <div className="info-item">
            <span className="info-label">System Name :</span>
            <br />
            <span className="info-value">{paperCode}</span>
          </div>
          <div className="disclaimer">
            Kindly contact the invigilator if there are any discrepancies in the
            Name and Photograph displayed on the screen or if the photograph is not yours
          </div>
        </div>

        <div className="info-section-one me-2">
          <div className="info-item">
            <span className="info-label">Candidate Name :</span>
            <br />
            <span className="info-value">{userDetails?.fullName || 'Your name'}</span>
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

      {/* Test Selection Section */}
      <div className="test-selection-container">
        <h2 className="test-selection-title ps-4 m-0">{paperCode}</h2>

        <div className="selection-controls">
          <div className="select-group">
            <label htmlFor="month-select">Select Month</label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-select"
            >
              <option value="">-- Select Month --</option>
              {months.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className="select-group">
            <label htmlFor="test-select">Select Test</label>
            <select
              id="test-select"
              value={selectedTestName}
              onChange={(e) => setSelectedTestName(e.target.value)}
              className="form-select"
              disabled={!selectedMonth}
            >
              <option value="">-- Select Test --</option>
              {filteredTests.map((test, index) => {
                const testDate = new Date(test.date);
                const today = new Date();
                const isToday =
                  testDate.getDate() === today.getDate() &&
                  testDate.getMonth() === today.getMonth() &&
                  testDate.getFullYear() === today.getFullYear();

                return (
                  <option
                    key={index}
                    value={test.testName}
                    className={isToday ? "live-test" : ""}
                  >
                    {test.testName} ({formatDate(test.date)}) {isToday && <span className="live-badge">LIVE</span>}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={handleStartTest}
            className="start-test-button"
            disabled={!selectedMonth || !selectedTestName}
          >
            Start Test
          </button>
        </div>
      </div>


      <div className="exam-info">
        <p>
          Select the months starting from <strong>September</strong> for all exams in <strong>2025</strong>,
          except for <strong>SSC CGL</strong>, which starts from <strong>January 2025</strong>.
          From <strong>2025</strong> onwards, all exams will start from <strong>January</strong>.
          Today's test will be a live test, and the results will be displayed
          on the <strong>Results</strong> page.
        </p>
      </div>
      {/* <div className="version-footer">
        Version: 17.07.00
      </div> */}
    </div>
  );
};

export default TypingTestSelector;