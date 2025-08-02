import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Dropdown, Pagination, Spinner, Alert } from 'react-bootstrap';
import './UserResults.css';

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
  const [statusFilter, setStatusFilter] = useState('All');
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
    clearDateFilter();
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

  const parseCustomDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

const applyDateFilter = () => {
  const start = startDate
    ? new Date(startDate.split("-")[0], parseInt(startDate.split("-")[1]) - 1, parseInt(startDate.split("-")[2]))
    : null;

  const end = endDate
    ? new Date(endDate.split("-")[0], parseInt(endDate.split("-")[1]) - 1, parseInt(endDate.split("-")[2]), 23, 59, 59, 999)
    : null;

  const filtered = userResults.filter((result) => {
    const [day, month, year] = result.date.split("/").map(Number); // e.g. "2/8/2025"
    const resultDate = new Date(year, month - 1, day);

    const afterStart = !start || resultDate >= start;
    const beforeEnd = !end || resultDate <= end;
    const statusMatch = statusFilter === 'All' || result.status === statusFilter;

    return afterStart && beforeEnd && statusMatch;
  });

  setFilteredResults(filtered);
  setCurrentPage(1);
};


  useEffect(() => {
    applyDateFilter();
  }, [statusFilter]);

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('All');
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
    <Container className="user-results-container mt-4">
      <h2 className="text-center mb-4">Select an Exam and View Results</h2>

      <Row className="justify-content-center mb-4">
        <Col xs={12} className="d-flex flex-wrap justify-content-center gap-2">
          {Object.keys(examDropdownData).map((exam, index) => (
            <Dropdown key={index} className="me-2">
              <Dropdown.Toggle variant="primary" id={`dropdown-${index}`}>
                {exam}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.keys(examDropdownData[exam]).map((examName, subIndex) => (
                  <Dropdown.Item
                    key={subIndex}
                    onClick={() => handleExamNameSelect(examName, exam)}
                  >
                    {examName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ))}
        </Col>
      </Row>

      {selectedExamName && (
        <Card className="mb-4">
          <Card.Body>
            <Row className="g-3 align-items-center">
              <Col xs={12} md={3}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={3} className="d-flex align-items-end gap-2 mt-auto">
                <Button variant="primary" onClick={applyDateFilter}>
                  Apply Filter
                </Button>
                <Button variant="secondary" onClick={clearDateFilter}>
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col xs={12}>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : !selectedExamName ? (
            <Alert variant="info" className="text-center">
              Please select an exam to view results.
            </Alert>
          ) : filteredResults.length === 0 ? (
            <Alert variant="warning" className="text-center">
              No results available for the selected exam name.
            </Alert>
          ) : (
            <>
              {paginatedResults.map((result, index) => (
                <Card
                  key={index}
                  className={`mb-3 ${result.status === 'Pass' ? 'border-start border-success border-3' : 'border-start border-danger border-3'}`}
                >
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs={12} md={8}>
                        <p><strong>Date:</strong> {result.date}</p>
                        <p><strong>Test Name:</strong> {result.testname}</p>
                        <p><strong>Accuracy:</strong> {result.accuracy}%</p>
                        <span className={`badge ${result.status === 'Pass' ? 'bg-success' : 'bg-danger'}`}>
                          Status: {result.status}
                        </span>
                      </Col>
                      <Col xs={12} md={4} className="mt-3 mt-md-0 text-md-end">
                        <Button
                          variant="primary"
                          onClick={() => handleViewResult(result.testname, result.paper_code)}
                        >
                          View Results
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserResults;