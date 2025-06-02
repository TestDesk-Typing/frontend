import React, { useState, useEffect } from 'react';
import './ExamSelect.css';
import { useNavigate } from 'react-router-dom';
import TypingHeader from '../component/Header';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { MdKeyboard } from "react-icons/md";
import { useCookies } from 'react-cookie';
import pic1 from '../i/sscLogo.webp';
import { Helmet } from 'react-helmet-async';
import { MdKeyboardArrowRight } from "react-icons/md";
import MainFooter from '../Footermain/Footer';
import { FaTelegram } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Spinner, Modal } from 'react-bootstrap';

const ExamSelect = () => {
  const [examList, setExamList] = useState([]);
  const [allTypingData, setAllTypingData] = useState([]);
  const [selectedExamCategory, setSelectedExamCategory] = useState(null);
  const [examType, setExamType] = useState('SSC');
  const [paragraphs, setParagraphs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [examImages, setExamImages] = useState({});
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
    fetchExamImages();
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
      .then((data) => setParagraphs(data))
      .catch((error) => console.error('Error fetching paragraphs:', error.message));
  };
  

  const handleExamHover = (examCategory) => {
    setExamType(examCategory.exam)
    setSelectedExamCategory(examCategory);
  };

  const handleExamClick = (examCategory, examName) => {
    setModalIsOpen(true);
    setSelectedExamCategory(examCategory);
    setLoading(true);
    fetchParagraphs(examName).finally(() => setLoading(false));
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
        body: JSON.stringify({ product_id: '999' })
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
    checkProductAccess(para);
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
        <meta property="og:title" content="Exam Selection - Prepare for SSC, CGL, DSSSB Typing Tests | Testdesk" />
        <meta
          property="og:description"
          content="Prepare for typing exams with Testdesk. Practice for SSC CHSL, CGL, DSSSB, EPFO, RRB, and more. Start your typing journey now!"
        />
        <meta property="og:image" content="https://testdesk.in/logo.png?v=1" />
        <meta property="og:url" content="https://testdesk.in/choose-exam" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Exam Selection - Prepare for SSC, CGL, DSSSB Typing Tests | Testdesk" />
        <meta
          name="twitter:description"
          content="Prepare for typing exams with Testdesk. Practice for SSC CHSL, CGL, DSSSB, EPFO, RRB, and more. Start your typing journey now!"
        />
        <meta name="twitter:image" content="https://testdesk.in/logo.png?v=1"  />
        <link rel="canonical" href="https://testdesk.in/choose-exam" />
      </Helmet>

      <TypingHeader />

      <Container fluid className="py-4 bg-light mt-5">
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="fw-bold">Explore all typing tests</h2>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <p className="text-muted mb-3 mb-md-0">
                  Get exam-ready with structured typing practice, skill-building exercises, and real-time feedback.
                </p>
                <Button 
                  variant="outline-primary" 
                  className="d-flex align-items-center telegram-btn"
                  onClick={handleRedirect}
                >
                  <FaTelegram className="me-2" />
                  Join Telegram
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={3} className="mb-4 mb-md-0">
              <Card className="h-100 shadow-sm">
                <Card.Body className="p-0">
                  <div className="list-group list-group-flush">
                    {examList.map((item, index) => (
                      <div 
                        key={index}
                        className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${selectedExamCategory?.exam === item.exam ? 'active' : ''}`}
                        onMouseEnter={() => handleExamHover(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          width="31"
                          height="31"
                          alt="Exam"
                          className="me-3 rounded-circle"
                          src={examImages[item.exam] ? `${process.env.REACT_APP_API_URL}/${examImages[item.exam]}` : pic1}
                        />
                        <span className="fw-medium">{item.exam} Exams</span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={9}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="p-3">
                  {loading && (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  )}
                  {!loading && selectedExamCategory && (
                    <Row xs={1} sm={2} lg={3} className="g-3">
                      {Array.from(new Set(selectedExamCategory.examNames)).map((examName, idx) => (
                        <Col key={idx}>
                          <Card 
                            className="h-100 exam-card-hover"
                            onClick={() => handleExamClick(selectedExamCategory, examName)}
                          >
                            <Card.Body className="d-flex align-items-center">
                              <div className="me-3">
                                <div className="bg-light rounded-circle p-2">
                                  <img 
                                    src={examImages[selectedExamCategory.exam] ? `${process.env.REACT_APP_API_URL}/${examImages[selectedExamCategory.exam]}` : pic1} 
                                    alt="Exam" 
                                    width="40" 
                                    height="40" 
                                    className="img-fluid"
                                  />
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-0 fw-bold">{selectedExamCategory.exam}</h6>
                                <p className="mb-0 text-muted small">{examName}</p>
                                <small className="text-primary">{examNameCounts[examName] || 0} typing tests</small>
                              </div>
                              <MdKeyboardArrowRight className="text-muted ms-2" size={20} />
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>

      <Modal show={modalIsOpen} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            <h4 className="mb-0 text-primary fw-bold">{selectedExamCategory?.exam}</h4>
            <small className="text-muted">Select a paper code to start the test</small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : paragraphs.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
              {Array.from(new Set(paragraphs.map(para => para.paper_code))).map((uniqueCode, idx) => {
                const para = paragraphs.find(p => p.paper_code === uniqueCode);
                return (
                  <div key={idx} className="col">
                    <Button 
                      variant="outline-primary" 
                      className="w-100 py-2"
                      onClick={() => handleParagraphClick(para)}
                    >
                      {para.paper_code}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p>No tests available for this exam.</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <MainFooter />
    </>
  );
};

export default ExamSelect;