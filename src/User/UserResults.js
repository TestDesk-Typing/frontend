import React, { useState, useEffect } from 'react';
import './UserResults.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const RESULTS_PER_PAGE = 5;

const UserResults = () => {
  const [examDropdownData, setExamDropdownData] = useState({});
  const [selectedExamName, setSelectedExamName] = useState('');
  const [selectedPaperCode, setSelectedPaperCode] = useState(null);
  const [userResults, setUserResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(['session_id', 'SSIDCE']);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/exams-user-for-result`);
        if (!response.ok) throw new Error(`Failed to fetch exams: ${response.status}`);
        const data = await response.json();

        const dropdownData = data.reduce((acc, item) => {
          if (!acc[item.exam]) acc[item.exam] = {};
          if (!acc[item.exam][item.examName]) acc[item.exam][item.examName] = [];
          if (!acc[item.exam][item.examName].includes(item.paper_code)) {
            acc[item.exam][item.examName].push(item.paper_code);
          }
          return acc;
        }, {});
        setExamDropdownData(dropdownData);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };
    fetchExams();
  }, []);

  const handleExamNameSelect = (examName, exam) => {
    setSelectedExamName(examName);
    const paperCodes = examDropdownData[exam][examName] || [];
    setSelectedPaperCode(paperCodes);
    setCurrentPage(1);
    if (examName && paperCodes.length > 0) {
      fetchUserResults(paperCodes, examName);
    } else {
      setUserResults([]);
    }
  };

  const fetchUserResults = async (paper_codes, exam) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.session_id}`,
        },
        body: JSON.stringify({
          paper_code: paper_codes,
          email_id: cookies.SSIDCE,
          exam: exam,
          category: 'UR',
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch user results');

      const data = await response.json();
      const formattedResults = data.map((item) => ({
        date: item.date,
        testname: item.testname,
        accuracy: item.accuracy ? parseFloat(item.accuracy).toFixed(2) : 'N/A',
        paper_code: item.paper_code,
        status: item.status,
      }));
      setUserResults(formattedResults);
      setFilteredResults(formattedResults);
    } catch (error) {
      console.error('Error fetching user results:', error);
      setUserResults([]);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  };

  const applyDateFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = userResults.filter((result) => {
      const resultDate = new Date(result.date);
      return (!startDate || resultDate >= start) && (!endDate || resultDate <= end);
    });
    setFilteredResults(filtered);
    setCurrentPage(1);
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredResults(userResults);
    setCurrentPage(1);
  };

  const handleViewResult = (testname, paper_code) => {
    navigate(`/${paper_code}/${selectedExamName}/${testname}/typing-test-result`);
  };

  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);

  return (
    <div className="user-results-container">
      <h2>Select an Exam and View Results</h2>

      <nav className="horizontal-nav">
        {Object.keys(examDropdownData).map((exam, index) => (
          <div className="horizontal-nav-item" key={index}>
            <button className="nav-btn">{exam}</button>
            <div className="dropdown-menu">
              {Object.keys(examDropdownData[exam]).map((examName, subIndex) => (
                <span
                  key={subIndex}
                  onClick={() => handleExamNameSelect(examName, exam)}
                  className="dropdown-item"
                >
                  {examName}
                </span>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {selectedExamName && (
        <div className="filter-controls">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button onClick={applyDateFilter}>Apply Filter</button>
          <button onClick={clearDateFilter}>Clear</button>
        </div>
      )}

      <div className="results-list">
        {loading ? (
          <p className="loader">Loading...</p>
        ) : !selectedExamName ? (
          <p className="select-exam-message">Please select an exam to view results.</p>
        ) : filteredResults.length === 0 ? (
          <p className="no-results-message">No results available for the selected exam name.</p>
        ) : (
          <>
            {paginatedResults.map((result, index) => (
              <div
                className={`result-card ${result.status === 'Pass' ? 'pass' : 'fail'}`}
                key={index}
              >
                <div className="result-info">
                  <p><strong>Date:</strong> {result.date}</p>
                  <p><strong>Test Name:</strong> {result.testname}</p>
                  <p><strong>Accuracy:</strong> {result.accuracy}%</p>
                  <p className={result.status === 'Pass' ? 'pass-user' : 'fail-user'}>
                    <strong>Status:</strong> {result.status}
                  </p>
                </div>
                <div className="result-action">
                  <button
                    className="view-button"
                    onClick={() => handleViewResult(result.testname, result.paper_code)}
                  >
                    View Results
                  </button>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserResults;
