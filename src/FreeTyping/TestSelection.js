import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import TypingHeader from "../component/Header";
import MainFooter from "../Footermain/Footer";
import "./TestSelection.css";

const TestSelection = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);

  const categories = [
    {
      id: "ssc-cgl",
      title: "SSC CGL Free Typing Tests",
      tests: [
        { id: "ssc-cgl-typing-test-01", name: "SSC CGL Free Typing Test 1", duration: "15 Minute" },
        { id: "ssc-cgl-typing-test-02", name: "SSC CGL Free Typing Test 2", duration: "15 Minute" },
        { id: "ssc-cgl-typing-test-03", name: "SSC CGL Free Typing Test 3", duration: "15 Minute" },
        { id: "ssc-cgl-typing-test-04", name: "SSC CGL Free Typing Test 4", duration: "15 Minute" },
        { id: "ssc-cgl-typing-test-05", name: "SSC CGL Free Typing Test 5", duration: "15 Minute" },
      ],
    },
    {
      id: "rrb",
      title: "RRB Free Typing Tests",
      tests: [
        { id: "rrb-typing-test-01", name: "RRB Typing Free Test 1", duration: "10 Minute" },
        { id: "rrb-typing-test-02", name: "RRB Typing Free Test 2", duration: "10 Minute" },
        { id: "rrb-typing-test-03", name: "RRB Typing Free Test 3", duration: "10 Minute" },
        { id: "rrb-typing-test-04", name: "RRB Typing Free Test 4", duration: "10 Minute" },
        { id: "rrb-typing-test-05", name: "RRB Typing Free Test 5", duration: "10 Minute" },
      ],
    },
    {
      id: "ssc-chsl",
      title: "SSC CHSL Free Typing Tests",
      tests: [
        { id: "ssc-chsl-typing-test-01", name: "SSC CHSL Free Typing Test 1", duration: "10 Minute" },
        { id: "ssc-chsl-typing-test-02", name: "SSC CHSL Free Typing Test 2", duration: "10 Minute" },
        { id: "ssc-chsl-typing-test-03", name: "SSC CHSL Free Typing Test 3", duration: "10 Minute" },
        { id: "ssc-chsl-typing-test-04", name: "SSC CHSL Free Typing Test 4", duration: "10 Minute" },
        { id: "ssc-chsl-typing-test-05", name: "SSC CHSL Free Typing Test 5", duration: "10 Minute" },
      ],
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/examImages`);
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error("Error fetching exams data:", error);
      }
    };
    fetchExams();
  }, []);

  const handleCardClick = (categoryId) => {
    setSelectedCategory(categories.find((cat) => cat.id === categoryId));
  };

  const handleStartTest = (testId) => {
    navigate(`/online-free-typing-test/${testId}`);
  };

  const getCategoryImage = (categoryId) => {
    const categoryMapping = {
      "ssc-cgl": "SSC",
      "rrb": "RRB",
      "ssc-chsl": "SSC CHSL",
    };

    const govName = categoryMapping[categoryId];
    const exam = exams.find((exam) => exam.govName === govName);
    return exam ? `${process.env.REACT_APP_API_URL}/${exam.imagePath}` : "https://via.placeholder.com/100";
  };

  return (
    <>
      <Helmet>
        <title>Free Typing Tests - Practice for SSC, RRB, CHSL | Testdesk</title>
        <meta
          name="description"
          content="Take free typing tests for SSC CGL, RRB, CHSL, and other exams. Improve typing speed and accuracy with real-time practice on Testdesk."
        />
        <meta
          name="keywords"
          content={`free typing test, online free typing test for ssc cgl, typing speed, typing accuracy, SSC typing test, typing practice, 
            SSC CGL typing test, CHSL typing test, RRB NTPC typing test, EPFO typing test, DSSSB typing test, 
            typing test online free, typing speed booster, government exam typing test, typing accuracy practice, 
            typing skill improvement, typing mock test, advanced typing tests, typing software for exams, 
            free typing practice, typing tests for beginners, professional typing tests, TCS interface typing test, 
            real typing exam simulation, typing speed and accuracy, Hindi typing test, English typing test, 
            typing tests for SSC exams, online typing skill development, typing speed challenge, 
            SSC skill test preparation, government typing exams, typing preparation for competitive exams, 
            free typing resources, fast typing test practice
          `}
        />
        <meta property="og:title" content="Free Typing Tests - Practice for SSC, RRB, CHSL | Testdesk" />
        <meta
          property="og:description"
          content="Boost your typing skills with free typing tests. Prepare for SSC, RRB, and CHSL exams with Testdesk's real-time typing practice."
        />
        <meta property="og:url" content="https://testdesk.in/online-free-typing-test" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://testdesk.in/logo.png" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://testdesk.in/online-free-typing-test" />
      </Helmet>

      <TypingHeader />

      <Container className="py-5 mt-5">
        <Row className="mb-4 text-center">
          <Col>
            <h1 className="fw-bold mb-3">Free Typing Tests</h1>
            <p className="lead text-muted">
              Click on a category below to explore exams and start your free typing test.
            </p>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          {categories.map((category) => (
            <Col key={category.id} md={6} lg={4}>
              <Card 
                className="h-100 category-card shadow-sm border-0"
                onClick={() => handleCardClick(category.id)}
              >
                <Card.Body className="d-flex flex-column align-items-center py-4">
                  <div className="mb-3">
                    <img
                      src={getCategoryImage(category.id)}
                      alt={category.title}
                      className="img-fluid rounded-circle"
                      width="100"
                      height="100"
                    />
                  </div>
                  <h3 className="h5 text-center">{category.title}</h3>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {selectedCategory && (
          <>
            <Helmet>
              <title>{`${selectedCategory.title} - Free Typing Practice | Testdesk`}</title>
              <meta
                name="description"
                content={`Explore ${selectedCategory.title} and prepare with free typing practice. Improve speed and accuracy for your exams.`}
              />
              <meta property="og:title" content={`${selectedCategory.title} - Free Typing Practice | Testdesk`} />
              <meta
                property="og:description"
                content={`Start free typing tests for ${selectedCategory.title}. Practice real-time to enhance your typing skills for exams.`}
              />
              <meta
                property="og:url"
                content={`https://testdesk.in/online-free-typing-test/${selectedCategory.id}`}
              />
              <link
                rel="canonical"
                href={`https://testdesk.in/online-free-typing-test/${selectedCategory.id}`}
              />
            </Helmet>

            <Row className="mb-4">
              <Col>
                <h2 className="text-center mb-4">{selectedCategory.title}</h2>
                <Card className="shadow-sm">
                  <Card.Body className="p-0">
                    {selectedCategory.tests.map((test) => (
                      <Row key={test.id} className="g-0 align-items-center border-bottom p-3 test-row">
                        <Col xs={12} md={4} className="mb-2 mb-md-0">
                          <div className="fw-medium">{test.name}</div>
                        </Col>
                        <Col xs={4} md={2} className="text-md-center mb-2 mb-md-0">
                          <div className="text-muted small">{test.duration}</div>
                        </Col>
                        <Col xs={4} md={3} className="mb-2 mb-md-0">
                          <Form.Select size="sm" className="w-auto mx-auto">
                            <option>English</option>
                          </Form.Select>
                        </Col>
                        <Col xs={4} md={3} className="text-md-end">
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleStartTest(test.id)}
                            className="w-100 w-md-auto"
                          >
                            Start Test
                          </Button>
                        </Col>
                      </Row>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>

      <MainFooter />
    </>
  );
};

export default TestSelection;