
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
    // Function to prevent right-click
    const disableRightClick = (event) => {
      event.preventDefault();
    };
  
    // Function to prevent cut, copy, and paste
    const disableCutCopyPaste = (event) => {
      if (event.ctrlKey || event.metaKey) {
        // Allow Ctrl or Command key
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
        (event.ctrlKey && event.code === "KeyP") || // Add Ctrl+P check

        (event.code === "F12")  
      ) {
        event.preventDefault();
      }
    };
  
    // Add event listeners when the component mounts
    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("cut", disableCutCopyPaste);
    document.addEventListener("copy", disableCutCopyPaste);
    document.addEventListener("paste", disableCutCopyPaste);
    document.addEventListener("keydown", disableKeyCombinations);
  
    // Remove event listeners when the component unmounts
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("cut", disableCutCopyPaste);
      document.removeEventListener("copy", disableCutCopyPaste);
      document.removeEventListener("paste", disableCutCopyPaste);
      document.removeEventListener("keydown", disableKeyCombinations);
    };
  }, []);
  

  // console.log('userDetails:', userDetails);


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
              body: JSON.stringify({ product_id: '999' }) // Replace with actual product ID
            });

            if (productResponse.ok) {
              const { access: productAccess } = await productResponse.json();
              if (productAccess === "access") {
                // Fetch paragraphs if access is granted
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
          icon: 'info', // Use 'info' to indicate that it's informational, not an error
          title: 'Live Test Info',
          text: 'This feature will only be available during the live test. Please check your schedule!',
          confirmButtonText: 'Okay',
          allowOutsideClick: false, // Prevent accidental dismiss
          allowEscapeKey: true, // Allow dismiss using the Escape key
        });
      }
    };

    checkAccessAndFetchParagraphs();
  }, [cookies.session_id, navigate, paperCode]);



  const requestFullScreen = () => {
    const element = document.documentElement; // Fullscreen the entire document
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome and Safari
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE
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
    // console.log(`Starting test for ${selectedMonth} with paper code: ${selectedTestName}`);
    
    requestFullScreen();
    navigate(`/instruction/${paperCode}/${examName}/${selectedTestName}`); // Navigate to the test page
  };
    // const width = window.innerWidth;
    // const height = window.innerHeight;
  
   
  // Open the Typing Test in a new window with full-screen properties
//   const newWindow = window.open(
//     `/instruction/${paperCode}/${examName}/${selectedTestName}`,
//     '_blank', 
//     `width=${width},height=${height},top=0,left=0,scrollbars=yes,resizable=no`
//   );

//   // Store the reference to the new window
//   window.newWindowRef = newWindow;
// 

  // Filter paragraphs based on the selected month
  const filteredTests = paragraphs
  .filter(paragraph => {
    const testDate = new Date(paragraph.date);
    return testDate.toLocaleString('default', { month: 'long' }) === selectedMonth;
  })
  .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date in ascending order


  // Utility function to format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1) and pad
    const year = date.getFullYear(); // Get full year
    return `${day}-${month}-${year}`; // Return formatted date
  };

  

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
                <a href="#" style={{ color: 'white', textDecoration: 'none', border: '0 none' }} id="notMySystem">
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

      <div className="scrolling-message">
  <span>
    Live Test Schedule: Morning Session 9 AM TO 10 AM And Evening Session 7 PM TO 8 PM - Special For 2024 Typing Test
  </span>
</div>

      <div className='check-sub'>
        <div className='header-for-sub'>{paperCode}</div>
        <div className="payment-component">
          <div className="month-selector">
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="plan-select"
            >
              <option value="" disabled>Select a month</option>
              {months.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
          </div>
          {/* <div className="paper-code-selector">
            <select
              id="testName"
              value={selectedTestName}
              onChange={(e) => setSelectedTestName(e.target.value)}
              className="plan-select"
            >
              <option value="" disabled>Select a test</option>
              {filteredTests.map((test, index) => (
                <option key={index} value={test.testName}>
                  {test.testName} on {formatDate(test.date)}
                </option>
              ))}
            </select>
          </div> */}
          <div className="paper-code-selector">
  <select
    id="testName"
    value={selectedTestName}
    onChange={(e) => setSelectedTestName(e.target.value)}
    className="plan-select"
  >
    <option value="" disabled>Select a test</option>
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
            style={isToday ? { color: "green", fontWeight: "bold" } : {}}
          >
            {test.testName} on {formatDate(test.date)} {isToday ? "LIVE" : ""}
          </option>
        );
    })}
  </select>
</div>

          <button onClick={handleStartTest} className="check-button" disabled={!selectedMonth || !selectedTestName}>
            Start Test
          </button>
        </div>
      </div>

      <div className="message-for-exam-select">
  Select the months starting from <strong>September</strong> for all exams in <strong>2024</strong>, 
  except for <strong>SSC CGL</strong>, which starts from <strong>January 2024</strong>. 
  From <strong>2025</strong> onwards, all exams will start from <strong>January</strong>. 
  Today's test will be a live test, and the results will be displayed 
  on the <strong>Results</strong> page.
</div>



      <div id="footer">Version : 17.07.00</div>
    </>
  );
};

export default TypingTestSelector;

