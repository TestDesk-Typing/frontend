import React, { useState, useEffect } from 'react';
import './ExamResult.css';
import TypingHeader from '../component/Header';
import MainFooter from '../Footermain/Footer';
import { Helmet } from 'react-helmet-async';

const ExamResult = () => {
  const [examDropdownData, setExamDropdownData] = useState({});
  const [selectedExamName, setSelectedExamName] = useState('');
  const [selectedPaperCode, setSelectedPaperCode] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResultsAvailable, setIsResultsAvailable] = useState(false);  // Track if the results should be available

  const staticPaperCodes = {
    "CGL": "CGL25-ENG-TYP01",
    "JCA": "SC-JCA-TYPING-02-2025",
    "NTPC English": "RRB-TYPING-ENG-02-2025",
    "NTPC Hindi": "RRB-TYPING-HIN-02-2025",
    "CHSL": "CHSL25-ENG-TYP01",
    "JSA-LDC-PA-JJA English": "DSSSB-ENG-02-2025",
    "JSA-LDC-PA-JJA Hindi": "DSSSB-HIN-02-2025",
    "SPA": 'SC-SPA-TYPING-02-2025',
    "PA": 'SC-PA-TYPING-02-2025',
    "Legal": 'SC-Legal-TYPING-02-2025',
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    checkResultAvailability();  // Check time on component mount
  }, []);

  const checkResultAvailability = () => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    // Show results if the time is 11:00 PM or later
    if (currentHour >= 22) {
      setIsResultsAvailable(true);
    } else {
      setIsResultsAvailable(false);
    }
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/exams-user-for-result-live`);
        if (!response.ok) {
          throw new Error('Failed to fetch exams');
        }

        const data = await response.json();

        setExamDropdownData(data);
        // const dropdownData = data.reduce((acc, item) => {
        //   if (!acc[item.exam]) acc[item.exam] = [];
        //   if (!acc[item.exam].some((entry) => entry.examName === item.examName)) {
        //     acc[item.exam].push({ examName: item.examName, paper_code: item.paper_code });
        //   }
        //   return acc;
        // }, {});
        // setExamDropdownData(dropdownData);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);

  const handleExamNameSelect = (examName) => {
    setSelectedExamName(examName);

    const paperCode = staticPaperCodes[examName] || Object.values(examDropdownData)
      .flat()
      .find((item) => item.examName === examName)?.paper_code;

    setSelectedPaperCode(paperCode);

    if (paperCode) {
      fetchResults(paperCode, examName); // Pass examName along with paper_code
    } else {
      setExamResults([]);
      setFilteredResults([]);
    }
  };

  const fetchResults = async (paper_code, exam, category = 'UR') => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get-results-users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paper_code, exam, category }), // Include the category in the request
      });

      if (!response.ok) throw new Error('Failed to fetch results');

      const data = await response.json();
      setExamResults(data);
      setFilteredResults(data); // Initialize filtered results
    } catch (error) {
      console.error('Error fetching results:', error);
      setExamResults([]);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = examResults.filter((result) =>
      result.full_name.toLowerCase().includes(query)
    );
    setFilteredResults(filtered);
  };

  return (
    <>
      <TypingHeader />
      <Helmet>
        <title>Exam Results - Testdesk</title>
        <meta
          name="description"
          content="View the latest live typing test results for exams like SSC CGL, CHSL, RRB, and more. Check your rank, speed, and accuracy."
        />
        <meta
          name="keywords"
          content="typing test results, exam results, SSC CGL typing, RRB NTPC typing, typing practice, typing speed results, online typing test"
        />
        <meta property="og:title" content="Exam Results - Testdesk" />
        <meta
          property="og:description"
          content="View the latest live typing test results for exams like SSC CGL, CHSL, RRB, and more. Check your rank, speed, and accuracy."
        />
        <meta property="og:image" content="https://testdesk.in/logo.png?v=1" />
        <meta property="og:url" content="https://testdesk.in/typing-test-dest-results" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Exam Results - Testdesk" />
        <meta name="twitter:description" content="View the latest live typing test results for exams like SSC CGL, CHSL, RRB, and more. Check your rank, speed, and accuracy." />
        <meta name="twitter:image" content="https://testdesk.in/logo.png?v=1" />
        <link rel="canonical" href="https://testdesk.in/typing-test-dest-results" />
      </Helmet>

      <div className="exam-result-container">
        <h2 className='myhead'>Today Live Typing Test Results</h2>

        {/* Only show the exam content if results are available */}
        {isResultsAvailable ? (
          <>
            <nav className="horizontal-nav">
              {Object.keys(examDropdownData).map((exam, index) => (
                <div className="horizontal-nav-item" key={index}>
                  <button className="nav-btn">{exam}</button>
                  <div className="dropdown-menu">
                    {examDropdownData[exam].map((item, subIndex) => (
                      <span
                        key={subIndex}
                        onClick={() => handleExamNameSelect(item.examName)}
                        className="dropdown-item"
                      >
                        {item.examName}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            {selectedPaperCode && (
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by full name..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            )}

            <div className="exam-results">
              {loading ? (
                <div className="loader">Loading...</div>
              ) : selectedExamName && !selectedPaperCode ? (
                <p className="no-results-message">No results available for the selected exam name.</p>
              ) : selectedPaperCode && filteredResults.length === 0 ? (
                <p className="no-results-message">No results found for this exam.</p>
              ) : selectedPaperCode && filteredResults.length > 0 ? (
                <table className="result-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Full Name</th>
                      <th>Speed</th>
                      <th>Accuracy</th>
                      <th>Wrong</th>
                      <th>Status</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result, index) => (
                      <tr key={index}>
                        <td>{result.rank}</td>
                        <td>{result.full_name}</td>
                        <td>{result.speed} WPM</td>
                        <td>{result.accuracy}%</td>
                        <td>{result.wrong}%</td>
                        <td className={result.status === 'Pass' ? 'pass' : 'fail'}>
                          {result.status === 'Fail' ? 'Try More!' : result.status}
                        </td>
                        <td className="failure-reason">
                          {result.failureReason || 'Good Job!'} {/* Show failure reason or 'N/A' for Pass */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="select-exam-message">Select an exam and exam name to see results.</p>
              )}
            </div>
          </>
        ) : (
          <p className="no-results-message">Results will be available after 10:00 PM.</p>
        )}
      </div>
      <MainFooter />
    </>
  );
};

export default ExamResult;
