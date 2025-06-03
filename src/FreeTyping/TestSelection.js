import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // Import Helmet
import "./TestSelection.css";
import TypingHeader from "../component/Header";
import MainFooter from "../Footermain/Footer";

const TestSelection = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const [exams, setExams] = useState([]); // Store exam images from backend

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
        setExams(data); // Set the fetched exams
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
    return exam ? `${process.env.REACT_APP_API_URL}/${exam.imagePath}` : null;
  };

  return (
    <>
      {/* Helmet for General Free Typing Tests Page */}
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
      <div className="test-selection-container free-test-select">
        <h1>Free Typing Tests</h1>
        <p className="progress-check-free">
    Click on a category below to explore exams and start your free typing test.
  </p>
        <div className="categories free-test-select">
          {categories.map((category) => (
            <div
              className="category-card free-test-select"
              key={category.id}
              onClick={() => handleCardClick(category.id)}
            >
              <img
                src={getCategoryImage(category.id)}
                alt={category.title}
                className="category-image free-test-select"
              />
              <h3>{category.title}</h3>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <>
            {/* Helmet for Selected Category */}
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

            <div className="category-details free-test-select">
              <h2>{selectedCategory.title}</h2>
              <div className="tests-container free-test-select">
                {selectedCategory.tests.map((test) => (
                  <div className="test-row free-test-select" key={test.id}>
                    <div className="test-name free-test-select">{test.name}</div>
                    <div className="test-duration free-test-select">{test.duration}</div>
                    <div className="test-language free-test-select">
                      <select defaultValue="English" className="free-test-select">
                        <option value="English">English</option>
                      </select>
                    </div>
                    <div className="test-action free-test-select">
                      <button
                        className="free-test-select"
                        onClick={() => handleStartTest(test.id)}
                      >
                        Start Typing Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <MainFooter/>
    </>
  );
};

export default TestSelection;
