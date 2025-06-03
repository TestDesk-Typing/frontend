
// Import Helmet
import React, { useState, useEffect } from 'react';
import './ExamSelect.css';
import { useNavigate } from 'react-router-dom';
import TypingHeader from '../component/Header';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { MdKeyboard } from "react-icons/md";
import { useCookies } from 'react-cookie';
import pic1 from '../i/sscLogo.webp';
import { Helmet } from 'react-helmet-async'; // Import Helmet
import { MdKeyboardArrowRight } from "react-icons/md";
import MainFooter from '../Footermain/Footer';
import { FaTelegram } from 'react-icons/fa';

const ExamSelect = () => {
  const [examList, setExamList] = useState([]);
  const [allTypingData, setAllTypingData] = useState([]);
  const [selectedExamCategory, setSelectedExamCategory] = useState(null);
  const [examType, setExamType] = useState('SSC');
  const [paragraphs, setParagraphs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [examImages, setExamImages] = useState({}); // To store images from the API
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(['session_id']);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // Fetch exams and their corresponding images
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/exams`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const groupedExams = data.reduce((acc, item) => {
          if (!acc[item.exam]) {
            acc[item.exam] = {
              exam: item.exam,
              examNames: [],
            };
          }
          acc[item.exam].examNames.push(item.examName);
          return acc;
        }, {});

        const exams = Object.values(groupedExams);
        setExamList(exams);

        // Set default exam to SSC if available
        const defaultExam = exams.find((exam) => exam.exam === 'SSC') || exams[0];
        if (defaultExam) {
          setSelectedExamCategory(defaultExam);
          fetchParagraphs(defaultExam.examNames[0]);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    const fetchExamImages = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/examImages`);
        const imageData = await response.json();

        // Map images by govName for easy lookup
        const imageMap = {};
        imageData.forEach(item => {
          imageMap[item.govName] = item.imagePath;
        });
        setExamImages(imageMap);
      } catch (error) {
        console.error("Error fetching exam images:", error);
      }
    };

    fetchExams();
    fetchExamImages(); // Fetch images
  }, []);

  useEffect(() => {
    const fetchAllTypingData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/typing/getalltypingdata`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ examType }),
        });
  
        setLoading(false)
        const data = await response.json();
        setAllTypingData(data);
      } catch (error) {
        setLoading(false)
        console.error("Error fetching all typing data:", error);
      }
    };
  
    fetchAllTypingData();
  }, [selectedExamCategory]);
  

  const fetchParagraphs = (examName) => {
    return fetch(`${process.env.REACT_APP_API_URL}/api/typingParagraphs-exam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ examName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setParagraphs(data)) // Assuming data contains the mapped response
      .catch((error) => console.error('Error fetching paragraphs:', error.message));
  };
  

  const handleExamHover = (examCategory) => {
    setExamType(examCategory.exam)
    setSelectedExamCategory(examCategory);
  };

  const handleExamClick = (examCategory, examName) => {
    setModalIsOpen(true); // Open modal immediately
    setSelectedExamCategory(examCategory);
    setLoading(true); // Show loading spinner
    fetchParagraphs(examName).finally(() => setLoading(false)); // Fetch data and hide spinner
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const checkProductAccess = async (para) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/code-234`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
        body: JSON.stringify({ product_id: '999' }) // Replace with actual product ID
      });

      if (response.ok) {
        const { access } = await response.json();
        if (access === "access") {
          navigate(`/exam/${selectedExamCategory.exam}/${para.examName}/${para.paper_code}/testselect`);
        } else {
          navigate(`/exam/${selectedExamCategory.exam}/${para.examName}/${para.paper_code}/payment`);
        }
      } else {
        console.error("Failed to check product access", response.statusText);
        navigate(`/exam/${selectedExamCategory.exam}/${para.examName}/${para.paper_code}/payment`);
      }
    } catch (error) {
      console.error("Error checking product access", error);
      navigate(`/exam/${selectedExamCategory.exam}/${para.examName}/${para.paper_code}/payment`);
    }
  };

  const handleParagraphClick = (para) => {
    checkProductAccess(para); // Call the access check before navigating
  };

  const countExamNames = () => {
    const counts = {};
    allTypingData.forEach(item => {
      const { examName } = item;
      counts[examName] = (counts[examName] || 0) + 1;
    });
    return counts;
  };

  const examNameCounts = countExamNames();

  const handleRedirect = () => {
    // Redirect to the Telegram link
    window.location.href = "https://t.me/+4qa-d1bgP7pmYTVl";
  }

  return (
    <>
     

      <Helmet>
        <title>Exam Selection - Prepare for SSC, CGL, DSSSB Typing Tests | Testdesk</title>
        <meta
          name="description"
          content="Select from a variety of typing exams such as SSC CHSL, CGL, DSSSB, EPFO, and RRB. Start your typing test preparation journey with Testdesk today!"
        />
        <meta
          name="keywords"
          content="typing exams, SSC typing, CGL typing, DSSSB typing, EPFO typing, typing test preparation, Testdesk exams"
        />
        <meta name="author" content="Testdesk" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags for Social Sharing */}
        <meta property="og:title" content="Exam Selection - Prepare for SSC, CGL, DSSSB Typing Tests | Testdesk" />
        <meta
          property="og:description"
          content="Prepare for typing exams with Testdesk. Practice for SSC CHSL, CGL, DSSSB, EPFO, RRB, and more. Start your typing journey now!"
        />
        <meta property="og:image" content="https://testdesk.in/logo.png?v=1" />
        <meta property="og:url" content="https://testdesk.in/choose-exam" />
        <meta property="og:type" content="website" />

        {/* Twitter Card for Social Sharing */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Exam Selection - Prepare for SSC, CGL, DSSSB Typing Tests | Testdesk" />
        <meta
          name="twitter:description"
          content="Prepare for typing exams with Testdesk. Practice for SSC CHSL, CGL, DSSSB, EPFO, RRB, and more. Start your typing journey now!"
        />
        <meta name="twitter:image" content="https://testdesk.in/logo.png?v=1"  />

        {/* Canonical URL */}
        <link rel="canonical" href="https://testdesk.in/choose-exam" />
      </Helmet>

      <TypingHeader />


      <div className='container-exam-selection'>

        
      <a href="https://t.me/yourTelegramLink" target="_blank" rel="noopener noreferrer" className="telegram-icon-link">
        <FaTelegram className="telegram-icon" />
      </a>
        <div className='heading-exam-select'>
  
  <h2>Explore all typing test</h2>


  <div className="heading-with-telegram">
  <p>Get exam-ready with structured typing practice, skill-building exercises, and real-time feedback.</p>
  <div className="join-now-container"  onClick={handleRedirect}>
    <a href="https://t.me/+4qa-d1bgP7pmYTVl" target="_blank" rel="noopener noreferrer" className="telegram-icon-link">
      <FaTelegram className="telegram-icon" />
    </a>
    <span className="join-now-text">Join Now</span>
  </div>
</div>
        </div>
        <div className="layout-section-exam">
          <div className="layout-section">
            <div className="exam-categories">
              <div className='new-category-select'>
                <div className="category-list">
                  {examList.map((item, index) => (
                    <div key={index} className="div-exam-name-image"
                        onMouseEnter={() => handleExamHover(item)}
                    >
                      <img
                        width="31"
                        height="31"
                        alt="Exam"
                        className="examselectimage"
                        src={examImages[item.exam] ? `${process.env.REACT_APP_API_URL}/${examImages[item.exam]}` : pic1} // Use image from API or default
                      />
                      <div 
                        className="category-item" 
                      >
                        {item.exam} Exams
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="exam-details">
            {loading && <div className="loader"></div>}
              <div className="exam-cards">
                {selectedExamCategory && 
                  Array.from(new Set(selectedExamCategory.examNames)).map((examName, idx) => (
                    <div 
                      key={idx} 
                      className="exam-card" 
                      onClick={() => handleExamClick(selectedExamCategory, examName)}
                    >
                      <div className="exam-cards-img">
                        <img className="myexamnameimg" src={examImages[selectedExamCategory.exam] ? `${process.env.REACT_APP_API_URL}/${examImages[selectedExamCategory.exam]}` : pic1} alt="Exam" />
                      </div>
                      <div className="exam-cards-count-test">
                        <div className="exam-cards-para">
                          <p>{selectedExamCategory.exam}</p>
                          <p className='examname'>{examName}</p>
                        </div>
                        <p className='exam-count'>{examNameCounts[examName] || 0} typing tests</p>
                      </div>
                      <MdKeyboardArrowRight className='right-exam-arrow'/>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`examselectmodal ${modalIsOpen ? 'open' : ''}`}>
        <div className="modal-content-review">
          <button className="close-button" onClick={closeModal}>
            <FaTimes />
          </button>
         
          <h2 className="exam-header header-highlight" style={{ marginBottom: "10px" }}>
  {selectedExamCategory?.exam}
</h2>
<span className="exam-instruction-for-select">
  Please select the code given below to open the typing test date-wise.
</span>


           <div className="modal-content">
  {loading ? (
    <div className="loader"></div> // Display spinner while loading
  ) : paragraphs.length > 0 ? (
              // Use a Set to ensure unique paper codes
              Array.from(new Set(paragraphs.map(para => para.paper_code))).map((uniqueCode, idx) => {
                const para = paragraphs.find(p => p.paper_code === uniqueCode);
                return (
                  <div
                    key={idx}
                    className="paragraph-item"
                    onClick={() => handleParagraphClick(para)}
                  >
                    <p>{para.paper_code}</p>
                  </div>
                );
              })
            ) : (
              <p>No paragraphs available for this exam.</p>
            )}
          </div>
        </div>
      </div>
      <MainFooter/>
    </>
  );
};

export default ExamSelect;