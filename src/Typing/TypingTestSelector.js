// import React, { useState, useEffect } from 'react';
// import Swal from 'sweetalert2';
// import './TypingTestSelector.css';
// import pic3 from "../i/NewCandidateImage.jpg"; 
// import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../AuthContext/AuthContext';
// import { useCookies } from 'react-cookie';
// import { Container, Row, Col, Form, Button, Card, Image } from 'react-bootstrap';

// const TypingTestSelector = () => {
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const [selectedPaperCode, setSelectedPaperCode] = useState('');
//   const [selectedTestName, setSelectedTestName] = useState('');
//   const [paragraphs, setParagraphs] = useState([]);
//   const navigate = useNavigate();
//   const { exam, examName, paperCode } = useParams();
//   const { userDetails, isLoggedIn } = useAuth();
//   const [cookies] = useCookies(['session_id']);

//   const months = [
//     'January', 'February', 'March', 'April', 
//     'May', 'June', 'July', 'August', 
//     'September', 'October', 'November', 'December'
//   ];

//   const today = new Date();

//   useEffect(() => {
//     // Function to prevent right-click
//     const disableRightClick = (event) => {
//       event.preventDefault();
//     };
  
//     // Function to prevent cut, copy, and paste
//     const disableCutCopyPaste = (event) => {
//       if (event.ctrlKey || event.metaKey) {
//         // Allow Ctrl or Command key
//         return;
//       }
  
//       event.preventDefault();
//     };
  
//     const disableKeyCombinations = (event) => {
//       if (
//         (event.ctrlKey && event.shiftKey && event.code === "KeyI") ||
//         (event.ctrlKey && event.shiftKey && event.code === "KeyC") ||
//         (event.ctrlKey && event.shiftKey && event.code === "KeyJ") ||
//         (event.ctrlKey && event.shiftKey && event.code === "KeyS") ||
//         (event.keyCode === 121 && event.shiftKey === true) ||
//         (event.ctrlKey && event.code === "KeyU") ||
//         (event.ctrlKey && event.code === "KeyP") ||
//         (event.code === "F12")  
//       ) {
//         event.preventDefault();
//       }
//     };
  
//     // Add event listeners when the component mounts
//     document.addEventListener("contextmenu", disableRightClick);
//     document.addEventListener("cut", disableCutCopyPaste);
//     document.addEventListener("copy", disableCutCopyPaste);
//     document.addEventListener("paste", disableCutCopyPaste);
//     document.addEventListener("keydown", disableKeyCombinations);
  
//     // Remove event listeners when the component unmounts
//     return () => {
//       document.removeEventListener("contextmenu", disableRightClick);
//       document.removeEventListener("cut", disableCutCopyPaste);
//       document.removeEventListener("copy", disableCutCopyPaste);
//       document.removeEventListener("paste", disableCutCopyPaste);
//       document.removeEventListener("keydown", disableKeyCombinations);
//     };
//   }, []);
  

//   useEffect(() => {
//     const checkAccessAndFetchParagraphs = async () => {
//       if (!cookies.session_id) {
//         navigate('/login');
//         return;
//       }

//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/code-123`, {
//           method: 'POST',
//           headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//             "Authorization": `Bearer ${cookies.session_id}`
//           }
//         });

//         if (response.ok) {
//           const { access } = await response.json();
//           if (access === "access") {
//             const productResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/code-234`, {
//               method: 'POST',
//               headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json",
//                 "Authorization": `Bearer ${cookies.session_id}`
//               },
//               body: JSON.stringify({ product_id: '999' })
//             });

//             if (productResponse.ok) {
//               const { access: productAccess } = await productResponse.json();
//               if (productAccess === "access") {
//                 await fetchParagraphs();
//               } else {
//                 navigate('/login');
//               }
//             } else {
//               navigate('/login');
//             }
//           } else {
//             navigate('/login');
//           }
//         } else {
//           navigate('/login');
//         }
//       } catch (error) {
//         navigate('/login');
//       }
//     };

//     const fetchParagraphs = async () => {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/typingParagraphs-paperCode`, {
//           method: 'POST',
//           headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//             "Authorization": `Bearer ${cookies.session_id}`,
//           },
//           body: JSON.stringify({ paper_code: paperCode }),
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         setParagraphs(data);
//       } catch (error) {
//         console.error('Error fetching paragraphs:', error);
//         Swal.fire({
//           icon: 'info',
//           title: 'Live Test Info',
//           text: 'This feature will only be available during the live test. Please check your schedule!',
//           confirmButtonText: 'Okay',
//           allowOutsideClick: false,
//           allowEscapeKey: true,
//         });
//       }
//     };

//     checkAccessAndFetchParagraphs();
//   }, [cookies.session_id, navigate, paperCode]);

//   const requestFullScreen = () => {
//     const element = document.documentElement;
//     if (element.requestFullscreen) {
//       element.requestFullscreen();
//     } else if (element.mozRequestFullScreen) {
//       element.mozRequestFullScreen();
//     } else if (element.webkitRequestFullscreen) {
//       element.webkitRequestFullscreen();
//     } else if (element.msRequestFullscreen) {
//       element.msRequestFullscreen();
//     }
//   };

//   const handleStartTest = () => {
//     if (!selectedMonth || !selectedTestName) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Selection Required',
//         text: 'Please select both a month and a test before proceeding.',
//       });
//       return;
//     }
    
//     requestFullScreen();
//     navigate(`/instruction/${paperCode}/${examName}/${selectedTestName}`);
//   };

//   const filteredTests = paragraphs
//     .filter(paragraph => {
//       const testDate = new Date(paragraph.date);
//       return testDate.toLocaleString('default', { month: 'long' }) === selectedMonth;
//     })
//     .sort((a, b) => new Date(a.date) - new Date(b.date));

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   return (
//     <>
//       <div className="header-bar" style={{ backgroundColor: 'rgb(45, 112, 182)', height: '60px' }}></div>

//       <div className="scrolling-message">
//         <span>
//           Live Test Schedule: Morning Session 9 AM TO 10 AM And Evening Session 7 PM TO 8 PM - Special For 2025 Typing Test
//         </span>
//       </div>

//       <Container className="my-4">
//         <Card className="mb-4 shadow-sm">
//           <Card.Header className="py-3" style={{ backgroundColor: '#f8f9fa' }}>
//             <Row className="align-items-center">
//               <Col md={4} className="mb-2 mb-md-0">
//                 <div className="d-flex align-items-center">
//                   <div className="me-2 fw-bold">System Name:</div>
//                   <div>{paperCode}</div>
//                 </div>
//               </Col>
//               <Col md={4} className="text-center mb-2 mb-md-0">
//                 <div className="fw-bold">Subject:</div>
//                 <div>Typing test</div>
//               </Col>
//               <Col md={4} className="text-md-end">
//                 <div className="d-flex align-items-center justify-content-end">
//                   <div className="me-3 text-end">
//                     <div className="fw-bold">Candidate Name:</div>
//                     <div className="text-truncate" style={{ maxWidth: '150px' }} title={userDetails?.fullName}>
//                       {userDetails?.fullName || 'Your name'}
//                     </div>
//                   </div>
//                   <Image src={pic3} rounded width="60" height="65" alt="Candidate" />
//                 </div>
//               </Col>
//             </Row>
//           </Card.Header>
//           <Card.Body>
//             <div className="text-center mb-3">
//               <small className="text-muted">
//                 Kindly contact the invigilator if there are any discrepancies in the Name and Photograph displayed on the screen
//               </small>
//             </div>
//           </Card.Body>
//         </Card>

//         <Card className="mb-4 shadow-sm">
//           <Card.Header className="py-3" style={{ backgroundColor: '#f8f9fa' }}>
//             <h5 className="mb-0 text-center">{paperCode}</h5>
//           </Card.Header>
//           <Card.Body>
//             <Row className="justify-content-center">
//               <Col md={4} className="mb-3">
//                 <Form.Select 
//                   value={selectedMonth}
//                   onChange={(e) => setSelectedMonth(e.target.value)}
//                   className="form-select-lg"
//                 >
//                   <option value="" disabled>Select a month</option>
//                   {months.map((month, index) => (
//                     <option key={index} value={month}>{month}</option>
//                   ))}
//                 </Form.Select>
//               </Col>
//               <Col md={4} className="mb-3">
//                 <Form.Select
//                   value={selectedTestName}
//                   onChange={(e) => setSelectedTestName(e.target.value)}
//                   className="form-select-lg"
//                   disabled={!selectedMonth}
//                 >
//                   <option value="" disabled>Select a test</option>
//                   {filteredTests.map((test, index) => {
//                     const testDate = new Date(test.date);
//                     const today = new Date();
//                     const isToday =
//                       testDate.getDate() === today.getDate() &&
//                       testDate.getMonth() === today.getMonth() &&
//                       testDate.getFullYear() === today.getFullYear();

//                     return (
//                       <option
//                         key={index}
//                         value={test.testName}
//                         style={isToday ? { color: "green", fontWeight: "bold" } : {}}
//                       >
//                         {test.testName} on {formatDate(test.date)} {isToday ? "LIVE" : ""}
//                       </option>
//                     );
//                   })}
//                 </Form.Select>
//               </Col>
//               <Col md={4} className="mb-3 d-flex align-items-center">
//                 <Button 
//                   onClick={handleStartTest} 
//                   variant="primary" 
//                   size="lg" 
//                   className="w-100"
//                   disabled={!selectedMonth || !selectedTestName}
//                 >
//                   Start Test
//                 </Button>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>

//         <Card className="mb-4 shadow-sm">
//           <Card.Body>
//             <div className="text-center">
//               Select the months starting from <strong>September</strong> for all exams in <strong>2025</strong>, 
//               except for <strong>SSC CGL</strong>, which starts from <strong>January 2025</strong>. 
//               From <strong>2025</strong> onwards, all exams will start from <strong>January</strong>. 
//               Today's test will be a live test, and the results will be displayed 
//               on the <strong>Results</strong> page.
//             </div>
//           </Card.Body>
//         </Card>

//         <div className="text-center text-muted py-3">
//           Version : 17.07.00
//         </div>
//       </Container>
//     </>
//   );
// };

// export default TypingTestSelector;

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
    <>
      <div className="typing-test-container">
        <div className="header-bar" style={{ backgroundColor: 'rgb(45, 112, 182)' }}></div>
        
        <div className="scrolling-message">
          <span>
            Live Test Schedule: Morning Session 9 AM TO 10 AM And Evening Session 7 PM TO 8 PM - Special For 2025 Typing Test
          </span>
        </div>

        <div className="user-info-container">
          <div className="system-info">
            <div className="system-name">
              <div className="label">System Name :</div>
              <div className="value">{paperCode}</div>
              <div className="disclaimer">
                <a href="#" className="disclaimer-link">
                  Kindly contact the invigilator if there are any discrepancies in the
                  Name and Photograph displayed on the screen or if the photograph is not
                  yours
                </a>
              </div>
            </div>

            <div className="user-name">
              <div className="label">Candidate Name :</div>
              <div className="value">
                <span title={userDetails?.fullName} className="candidate-name">{userDetails?.fullName || 'Your name'}</span>
              </div>
              <div className="subject-info">
                <span className="label">Subject :</span>
                <span className="value">Typing test</span>
              </div>
            </div>
            
            <div className="user-pic">
              <img width="94" height="101" className="candidate-img" src={pic3} alt="Candidate" />
            </div>
          </div>
        </div>

        <div className="test-selector-container">
          <div className="test-header">{paperCode}</div>
          <div className="selection-panel">
            <div className="month-selector">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="form-select"
              >
                <option value="" disabled>Select a month</option>
                {months.map((month, index) => (
                  <option key={index} value={month}>{month}</option>
                ))}
              </select>
            </div>
            
            <div className="test-selector">
              <select
                value={selectedTestName}
                onChange={(e) => setSelectedTestName(e.target.value)}
                className="form-select"
                disabled={!selectedMonth}
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

            <button 
              onClick={handleStartTest} 
              className="start-button"
              disabled={!selectedMonth || !selectedTestName}
            >
              Start Test
            </button>
          </div>
        </div>

        <div className="exam-info-message">
          Select the months starting from <strong>September</strong> for all exams in <strong>2025</strong>, 
          except for <strong>SSC CGL</strong>, which starts from <strong>January 2025</strong>. 
          From <strong>2025</strong> onwards, all exams will start from <strong>January</strong>. 
          Today's test will be a live test, and the results will be displayed 
          on the <strong>Results</strong> page.
        </div>

        <div className="version-footer">Version : 17.07.00</div>
      </div>
    </>
  );
};

export default TypingTestSelector;