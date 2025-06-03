import { Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import parse from "html-react-parser";
import Header from "../component/Header"
import './Result.css';
import { useCookies } from 'react-cookie';
import { useAuth } from "../AuthContext/AuthContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, ...registerables);

const TypingPerformance = () => {
    const { testcode, exam, testname } = useParams();
    const category = 'UR';
    const [paragraph, setParagraph] = useState('');
    const [Originalparagraph, setoriginalparagraph] = useState('');
    const [wrongdep, setWrongdep] = useState('');
    const [grosspeed, setGrossSpeed] = useState('');
    const [wpm, setWpm] = useState('');
    const [accuracy, setAccuracy] = useState(0);
    const [wrongper, setWrongPer] = useState(0);
    const [marks, setMarks] = useState('');
    const [actualdep, setActualDep] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [correctedword, setCorrectedword] = useState(0);
    const [totaltyped, settotaltyped] = useState(0);
    const [Incorrectedword, setIncorrectedword] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['session_id', 'SSDSD']);
    const { isLoggedIn, userDetails, logout } = useAuth();
    
    let emailId = userDetails.email_id;

    if (cookies.userData) {
        try {
            let parsedUserData;
            if (typeof cookies.userData === 'string') {
                const decodedUserData = decodeURIComponent(cookies.userData);
                parsedUserData = JSON.parse(decodedUserData);
            } else {
                parsedUserData = cookies.userData;
            }
            emailId = parsedUserData.email_id || '';
        } catch (error) {
            console.error('Error processing userData cookie:', error);
        }
    }

    let colr, testresult;

    if (wrongper < error) {
        colr = '#1cff1c';
        testresult = 'Pass';
    } else {
        colr = '#ff7a7a';
        testresult = 'Fail';
    }

    useEffect(() => {
        const fetchPerformanceStatus = async () => {
            if (!cookies.session_id) {
                navigate('/');
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
                            if (access === "access") {
                                let dt = { 'paper_code': testcode, 'email_id': emailId, 'exam': exam, 'category': 'UR', 'testname': testname };
                                let state_res = await fetch(`${process.env.REACT_APP_API_URL}/api/result-typing`, {
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                        "Authorization": `Bearer ${cookies.session_id}`
                                    },
                                    body: JSON.stringify(dt)
                                });

                                if (state_res.ok) {
                                    state_res = await state_res.json();
                                    setParagraph(parse(state_res.paragraph));
                                    setoriginalparagraph(state_res.oldparagraph);
                                    setGrossSpeed(state_res.grossspeed);
                                    setWrongdep(state_res.wrongdep);
                                    setWpm(state_res.wpm);
                                    setCorrectedword(state_res.correctedword);
                                    setIncorrectedword(state_res.Incorrectedword);
                                    settotaltyped(state_res.totaltypedword)
                                    setSpeed(state_res.speed)
                                    setAccuracy(state_res.accuracy)
                                    setWrongPer(state_res.wrong)
                                    setMarks(state_res.marks)

                                    const errorValue = state_res.error < 0 ? 0 : state_res.error;
                                    setError(errorValue);
                                } else {
                                    console.error("Failed to fetch performance status", state_res.statusText);
                                }
                            } else {
                                navigate('/');
                            }
                        } else {
                            navigate('/');
                        }
                    } else {
                        navigate('/');
                    }
                } else {
                    navigate('/');
                }
            } catch (error) {
                navigate('/');
            }
        };

        fetchPerformanceStatus();
    }, [testcode, emailId, exam, category, cookies.session_id, navigate]);

    const startTest = () => {
        navigate(`/typingparagraph/${exam}/${category}`);
    };

    const pieChartData = {
        labels: ['Correct keystrokes', 'Incorrect keystrokes'],
        datasets: [
            {
                data: [correctedword, Incorrectedword],
                backgroundColor: ['#4caf50', '#f44336'],
                hoverBackgroundColor: ['#66bb6a', '#ef5350']
            }
        ]
    };

    return (
        <>
            <Header />
            <div className="report-container mt-5">
                <div className="heading-container">
                    <h2 className="report-title">Your Typing Skill Test Report</h2>
                </div>

                <div className="content-container">
                    <div className="table-wrapper">
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Skill Test</th>
                                    <th>Your Response with Evaluation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Your Total Typed Keystrokes</td>
                                    <td>{totaltyped}</td>
                                </tr>
                                <tr>
                                    <td>Correct Keystrokes</td>
                                    <td>{correctedword}</td>
                                </tr>
                                <tr>
                                    <td>Incorrect Keystrokes</td>
                                    <td>{Incorrectedword}</td>
                                </tr>
                                <tr>
                                    <td>Gross (WPM)</td>
                                    <td>{grosspeed}</td>
                                </tr>
                                <tr>
                                    <td>NET (WPM)</td>
                                    <td>{speed}</td>
                                </tr>
                                <tr>
                                    <td>Accuracy (%)</td>
                                    <td>{accuracy}%</td>
                                </tr>
                                <tr>
                                    <td>Wrong Percentage</td>
                                    <td>{wrongper}%</td>
                                </tr>
                                {exam === 'JCA' && (
                                    <tr>
                                        <td>Marks Obtained</td>
                                        <td>{marks}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="chart-wrapper">
                        <div className="chart-container">
                            <h3 className="chart-title">Performance Overview</h3>
                            <div className="chart-inner">
                                <Pie data={pieChartData} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="info-typing-error">
                    <p>
                        <strong>** Notes:-&gt; In your Typed Paragraph:</strong><br />
                        <strong>Mistakes like</strong> <span style={{ color: 'purple' }}>"with"</span> <strong>typed as</strong> <span style={{ color: 'green' }}>"wih"</span> <strong>and missed words are highlighted in</strong> <span style={{ color: 'purple' }}>purple</span>.<br />
                        <strong>Omitted words or lines also appear in</strong> <span style={{ color: 'purple' }}>purple</span>.<br />
                        <strong>Extra or incorrect entries, such as additional words or substitutions, are shown in</strong> <span style={{ color: 'green' }}>green</span>.
                    </p>
                </div>

                <div className="butndash">
                    <Button className="student-dashboard" onClick={() => navigate(`/user-dashboard`)}>
                        Student dashboard
                    </Button>
                </div>

                <div className="paragraphs-container">
                    <div className="paragraph-box original-paragraph">
                        <h4>Original Paragraph</h4>
                        <div className="paragraph-content">{Originalparagraph}</div>
                    </div>
                    <div className="paragraph-box typed-paragraph">
                        <h4 className="typing-result-description">Here is a detailed breakdown of your typing performance</h4>
                        <div className="paragraph-content">{paragraph}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TypingPerformance;