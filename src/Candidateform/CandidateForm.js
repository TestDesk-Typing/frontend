import React, { useState, useEffect } from 'react';
import './CandidateForm.css';
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import pic3 from "../i/NewCandidateImage.jpg";
import { useAuth } from '../AuthContext/AuthContext';
import Swal from 'sweetalert2';

const CandidateForm = () => {
  const { testcode, exam, testname } = useParams();
  const [isChecked, setIsChecked] = useState(false);
  const [cookies] = useCookies(['session_id']);
  const navigate = useNavigate();
  const { userDetails } = useAuth();

  const [responses, setResponses] = useState({});

  const questions = [
    {
      id: 'ques1',
      text: 'How was your experience with the support provided, including the usefulness of the mock typing tests, access to test-related instructions, and helpdesk support?'
    },
    {
      id: 'ques2',
      text: 'How was your experience navigating the typing test interface, including ease of use and accessibility of the typing portal?'
    },
    {
      id: 'ques3',
      text: 'How easy was it to access and locate the typing test portal on your system?'
    },
    {
      id: 'ques4',
      text: 'How clear were the instructions provided on the screen to begin the typing test, including guidance on starting and submitting the test?'
    },
    {
      id: 'ques5',
      text: 'How satisfied were you with the test environment provided by the platform (e.g., speed, reliability, absence of technical glitches)?'
    },
    {
      id: 'ques6',
      text: 'How was your experience with the responsiveness and functionality of the typing input area (e.g., text editor, real-time character count, etc.)?'
    },
    {
      id: 'ques7',
      text: 'Overall, how would you rate your experience of taking the typing test on this platform?'
    }
  ];

  useEffect(() => {
    const checkAccess = async () => {
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
              const { access } = await productResponse.json();
              if (access !== "access") {
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

    checkAccess();
  }, [cookies.session_id, navigate]);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleResponseChange = (questionId, responseValue) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: responseValue,
    }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      email_id: userDetails.email_id,
      testcode: testcode,
      testname: testname,
      date: new Date().toISOString(),
      responses,
      exam: exam,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/submitFeedback`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        Swal.fire({
          title: 'Success',
          text: 'Feedback submitted successfully!',
          icon: 'success',
          confirmButtonText: 'Continue',
          willClose: () => {
            navigate(`/${testcode}/${exam}/${testname}/result`);
          }
        });
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        Swal.fire({
          title: 'Failed',
          text: 'Failed to submit feedback. Please try again.',
          icon: 'error',
          confirmButtonText: 'Retry'
        });
      }
    } catch (error) {

      Swal.fire({
        title: 'Failed',
        text: "Error submitting feedback: ", error,
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    }
  };

  return (
    <div className="instruction-container">
      <div className="instruction-header"></div>

      <div className="instruction-content">
        <div className="instruction-left">
          <div className="sky-blue-color">Instructions</div>

          <form onSubmit={handleFeedbackSubmit} className="instructions-para">
            <div id="feedback-details-section">
              <span id="feedback-intro-text">
                Dear <span id="candidate-name">{userDetails.fullName}</span>,
                <br /><br />
                We solicit your valuable feedback to understand your views and your experience on the digital examination.
                <br />
                Your feedback will enable us to improve the overall candidate experience.
                <br /><br />
                For each question listed below, we request you to specify the performance rating as per the scale below.
              </span>
              <div className="rating-section">
                <div className="rating-option exceed-option">
                  <span className="rating-circle green">4</span>
                  <span className="rating-label">Exceeded expectations</span>
                </div>
                <div className="rating-option met-option">
                  <span className="rating-circle yellow">3</span>
                  <span className="rating-label">Met expectations</span>
                </div>
                <div className="rating-option improve-option">
                  <span className="rating-circle blue">2</span>
                  <span className="rating-label">Improvement needed</span>
                </div>
                <div className="rating-option failed-option">
                  <span className="rating-circle red">1</span>
                  <span className="rating-label">Failed to meet expectations</span>
                </div>
              </div>

              <table className="feedback-table" id="feedback-questions-table">
                <thead>
                  <tr>
                    <th className="center-text" id="table-header-serial">S.No</th>
                    <th style={{ width: '1%' }}></th>
                    <th id="table-header-questions">Questions</th>
                    <th id="table-header-response">Response</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => (
                    <tr key={question.id}>
                      <td className="center-text bold-text">{index + 1}.</td>
                      <td></td>
                      <td id={`question-${question.id}`}>{question.text}</td>
                      <td>
                        {question.id === 'ques8' ? (
                          <textarea
                            id="feedbackTextArea"
                            name="feedbackTextArea"
                            style={{ height: '50px', width: '95%', resize: 'none', overflow: 'auto' }}
                            onKeyDown={(e) => { }}
                            onChange={(e) => handleResponseChange(question.id, e.target.value)}
                          />
                        ) : (
                          <table className="response-options-table">
                            <tbody>
                              <tr>
                                <td className="bold-text">4</td>
                                <td className="bold-text">3</td>
                                <td className="bold-text">2</td>
                                <td className="bold-text">1</td>
                              </tr>
                              <tr>
                                <td>
                                  <input type="radio" name={question.id} value="4-Exceeded expectations" onChange={() => handleResponseChange(question.id, '4-Exceeded expectations')} checked={responses[question.id] === '4-Exceeded expectations'} />
                                </td>
                                <td>
                                  <input type="radio" name={question.id} value="3-Met expectations" onChange={() => handleResponseChange(question.id, '3-Met expectations')} checked={responses[question.id] === '3-Met expectations'} />
                                </td>
                                <td>
                                  <input type="radio" name={question.id} value="2-Improvement needed" onChange={() => handleResponseChange(question.id, '2-Improvement needed')} checked={responses[question.id] === '2-Improvement needed'} />
                                </td>
                                <td>
                                  <input type="radio" name={question.id} value="1-Failed to meet expectations" onChange={() => handleResponseChange(question.id, '1-Failed to meet expectations')} checked={responses[question.id] === '1-Failed to meet expectations'} />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="center-text bold-text">{questions.length + 1}.</td>
                    <td></td>
                    <td id={`question-ques37`}>Overall experience with the typing test:</td>
                    <td>
                      <textarea
                        id="overallFeedbackTextArea"
                        name="overallFeedbackTextArea"
                        style={{ height: '50px', width: '95%', resize: 'none', overflow: 'auto' }}
                        onChange={(e) => handleResponseChange('ques8', e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>

          <div className="nextbutton-submit">
            <button className="next-and-previ-submit" onClick={handleFeedbackSubmit}>
              Submit Feedback and Check Result
            </button>
          </div>
        </div>

        <div className="instruction-right">
          <div align="center" className="user_pic">
            <img width="100px" src={pic3} alt="Candidate" />
            <h5 id="candidateName">{userDetails.fullName}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;