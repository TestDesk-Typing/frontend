


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import { GoClock } from 'react-icons/go';
import { HiBolt } from 'react-icons/hi2';
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import './AfterBanner.css';
import { useCookies } from 'react-cookie';

const AfterBanner = () => {
  const [tests, setTests] = useState([]);
  const [totalTests, setTotalTests] = useState([]);
  const [accessStatus, setAccessStatus] = useState({});
  const [selectedExam, setSelectedExam] = useState('CHSL'); // Default selection for CHSL
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(['session_id']);
  const [isStartButtonEnabled, setIsStartButtonEnabled] = useState(false);
  const selectedExamCategory = 'ssc'; // Fixed selected category as 'ssc'
  const [liveResults, setLiveResults] = useState({
    cgl: [],
    chsl: [],
    ntpc: [],
  }); // Holds live results for specific categories
  const [isResultsAvailable, setIsResultsAvailable] = useState(false); // Track if results are available

  useEffect(() => {
    const fetchSSCData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get-ssc-data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exam: 'SSC' })
        });
        const data = await response.json();
        setTests(data.combinedData);
        setTotalTests(data)
        handleUnlock();
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Error fetching data:", error);
      }
    };

    const fetchLiveResults = async () => {
      try {
        const cglResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/get-results-users-liveresult`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paper_code: 'CGL25-ENG-TYP01',
            exam: 'CGL',  // Static exam
            category: 'UR'  // Static category
          }),

        });
        const chslResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/get-results-users-liveresult`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paper_code: 'CHSL25-ENG-TYP01',
            exam: 'CHSL',  // Static exam
            category: 'UR'  // Static category
          }),
        });
        const ntpcResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/get-results-users-liveresult`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paper_code: 'RRB-TYPING-ENG-01',
            exam: 'NTPC',  // Static exam
            category: 'UR'  // Static category
          }),

        });

        // Parse responses and handle errors
        const cglData = cglResponse.ok ? await cglResponse.json() : [];
        const chslData = chslResponse.ok ? await chslResponse.json() : [];
        const ntpcData = ntpcResponse.ok ? await ntpcResponse.json() : [];

        setLiveResults({
          cgl: Array.isArray(cglData) ? cglData.slice(0, 10) : [],
          chsl: Array.isArray(chslData) ? chslData.slice(0, 10) : [],
          ntpc: Array.isArray(ntpcData) ? ntpcData.slice(0, 10) : [],
        });

        // Check availability of live results after 11:00 PM
        checkResultAvailability();
      } catch (error) {
        console.error("Error fetching live results:", error);
        setLiveResults({
          cgl: [],
          chsl: [],
          ntpc: [],
        });
        setIsResultsAvailable(false); // No results if an error occurs
      }
    };

    fetchLiveResults();
    fetchSSCData();
  }, []);

  const checkResultAvailability = () => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    // Check if it's after 11:00 PM
    if (currentHour >= 22) {
      setIsResultsAvailable(true);
    } else {
      setIsResultsAvailable(false);
    }
  };

  const handleUnlock = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/code-234`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
        body: JSON.stringify({ product_id: '999' }) // Static product_id
      });

      if (response.ok) {
        const { access } = await response.json();
        const isAccessible = access === "access";
        setIsStartButtonEnabled(isAccessible);
      }
    } catch (error) {
      console.error("Error checking unlock access:", error);
    }
  };

  // Add checkProductAccess function definition here
  const checkProductAccess = async (para) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/code-234`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
        body: JSON.stringify({ product_id: '999' }) // Use dynamic paper code if necessary
      });

      if (response.ok) {
        const { access } = await response.json();
        const isAccessible = access === "access";
        setAccessStatus(prevStatus => ({
          ...prevStatus,
          [para.paper_code]: isAccessible
        }));

        // Navigate based on access status
        if (isAccessible) {
          navigate(`/exam/${selectedExamCategory}/${para.examName}/${para.paper_code}/testselect`);
        } else {
          navigate(`/exam/${selectedExamCategory}/${para.examName}/${para.paper_code}/payment`);
        }
      } else {
        navigate(`/exam/${selectedExamCategory}/${para.examName}/${para.paper_code}/payment`);
      }
    } catch (error) {
      navigate(`/exam/${selectedExamCategory}/${para.examName}/${para.paper_code}/payment`);
    }
  };


  const handleGoToResult = () => {
    // Navigate to the '/typing-test-dest-results' page
    navigate('/typing-test-dest-results');
  };

  // Filter tests based on the selected exam type
  const filteredTests = tests?.filter(test => test?.examName === selectedExam);

  return (
    <div className="after-banner-container">
    {loading && <div className="loader"></div>}
      <div className="content-wrapper">
        <div className="test-section">
          <div className="header-section">
            <div className="title-wrapper">
              <h2>Typing Test for All SSC Exams</h2>
            </div>
            <div className="mock-tests">
              <span
                className={`mock-tests-para1 ${selectedExam === 'CHSL' ? 'active' : ''}`}
                onClick={() => setSelectedExam('CHSL')}
              >
                SSC CHSL ({totalTests?.totalChslCount})
              </span>
              <span
                className={`mock-tests-para1 ${selectedExam === 'CGL' ? 'active' : ''}`}
                onClick={() => setSelectedExam('CGL')}
              >
                SSC CGL ({totalTests?.totalCglCount})
              </span>
            </div>
          </div>

          <div className="test-list">
            {filteredTests?.slice(0, 10)?.map((test, index) => (
              <div key={index} className="test-item">
                <div className="test-list-user">
                  <div className="test-list-user-number">
                    <h5>{test.paper_code}</h5>
                    <div className="test-list-user-bolt">
                      <FaBolt className="icon-bolt" />
                      <p>49.3k Users</p>
                    </div>
                  </div>
                  <div className="test-list-user-duration">
                    <div className="AiOutlineQuestionCircle">
                      <HiBolt className="icon-question" />
                      <p>{filteredTests.length} Question(s)</p>
                    </div>
                    <div className="GoClock">
                      <GoClock className="icon-clock" />
                      <p>{selectedExam === 'CGL' ? '15 Mins' : '10 Mins'}</p>  {/* Conditional duration */}
                    </div>
                  </div>
                </div>
                <button
                  className="unlock-button"
                  onClick={() => checkProductAccess(test)}
                >
                  {isStartButtonEnabled ? (
                    <>
                      <FaUnlockAlt className="unlock-icon" /> Start
                    </>
                  ) : (
                    <>
                      <FaLock className="unlock-icon" /> Unlock Now
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Results Section */}
        <div className="results-section">
          <div className="results-header-live">
            <h4>Live Typing Results Today</h4>
            <button className="go-to-result-btn" onClick={handleGoToResult}>Go to Result</button>
          </div>

          <div className="result-item">
            <h5>SSC CHSL Results:</h5>
            {isResultsAvailable ? (
              liveResults.chsl?.length > 0 ? (
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveResults.chsl.map((result, idx) => (
                      <tr key={idx}>
                        <td>{result.rank}</td>
                        <td>{result.full_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-results">No results found for SSC CHSL today.</p>
              )
            ) : (
              <p className="no-results">Today live test results available after 10:00 PM.</p>
            )}
          </div>

          <div className="result-item">
            <h5>SSC CGL Results:</h5>
            {isResultsAvailable ? (
              liveResults.cgl?.length > 0 ? (
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveResults.cgl.map((result, idx) => (
                      <tr key={idx}>
                        <td>{result.rank}</td>
                        <td>{result.full_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-results">No results found for SSC CGL today.</p>
              )
            ) : (
              <p className="no-results">Today live test results available after 10:00 PM.</p>
            )}
          </div>

          <div className="result-item">
            <h5>RRB NTPC Results:</h5>
            {isResultsAvailable ? (
              liveResults.ntpc?.length > 0 ? (
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveResults.ntpc.map((result, idx) => (
                      <tr key={idx}>
                        <td>{result.rank}</td>
                        <td>{result.full_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-results">No results found for Railway NTPC English today.</p>
              )
            ) : (
              <p className="no-results">Today live test results available after 10:00 PM.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterBanner;

