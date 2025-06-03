

import { Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import parse from "html-react-parser";
import Header from "../component/Header"
import './Result.css';
import { useCookies } from 'react-cookie';
import { useAuth } from "../AuthContext/AuthContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2'; // Import Pie from react-chartjs-2

// Register the components globally
ChartJS.register(ArcElement, Tooltip, Legend, ...registerables); // Register necessary components

const TypingPerformance = () => {
    // const { accuracy, wrongper, actualdep, speed, testcode, exam, testname } = useParams();
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
    let tracc = Math.round(accuracy * 3.6);
    let trwro = Math.round(wrongper * 3.6);
    let tract = Math.round(actualdep * 3.6);
    let trspe = Math.round(speed * 3.6);

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
                // console.log("session_id not found in cookies");
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
                            body: JSON.stringify({ product_id: '999' }) // Replace with actual product ID
                        });

                        if (productResponse.ok) {
                            const { access } = await productResponse.json();
                            if (access === "access") {
                                let dt = { 'paper_code': testcode, 'email_id': emailId, 'exam': exam, 'category': 'UR', 'testname': testname };
                                // console.log("Request data:", dt);
                                let state_res = await fetch(`${process.env.REACT_APP_API_URL}/api/result-typing`, {
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                        "Authorization": `Bearer ${cookies.session_id}`
                                    },
                                    body: JSON.stringify(dt)
                                });

                                // console.log("Response status:", state_res.status);

                                if (state_res.ok) {
                                    state_res = await state_res.json();
                                    // console.log("Response Data:", state_res);
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

    // Data for the pie chart
    const pieChartData = {
        labels: ['Correct keystrokes', 'Incorrect keystrokes'],
        datasets: [
            {
                data: [correctedword, Incorrectedword],
                backgroundColor: ['#4caf50', '#f44336'], // Green for correct, Red for incorrect
                hoverBackgroundColor: ['#66bb6a', '#ef5350']
            }
        ]
    };

    return (
        <>
            <Header />
            <div className="report-container">
                <div className="heading-container">
                    <h2 className="report-title">Your Typing Skill Test Report </h2>
                </div>

                <div className="content-container">
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
                            {exam === 'JCA' && (<tr>
                                <td>Marks Obtained</td>
                                <td>{marks}</td>
                            </tr>)}
                            <tr>
                                {/* <td>Test Result</td> */}
                                {/* <td style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        SSC-CGL22: More Try to Pass Under Error @5%, @20%, @25% or @30%
                    </td> */}
                            </tr>
                        </tbody>
                    </table>

                    <div className="chart-container">
                        <h3 className="chart-title">Performance Overview</h3>
                        <Pie data={pieChartData} /> {/* Use Pie component from react-chartjs-2 */}
                    </div>
                </div>
                <div className="info-typing-error">
                    <strong style={{ color: 'black' }}>
                        ** Notes:-&gt; In your Typed Paragraph:
                    </strong>
                    <strong style={{ color: 'black' }}>
                        Mistakes like
                    </strong>
                    <strong style={{ color: 'purple' }}> "with" </strong>
                    <strong style={{ color: 'black' }}> typed as </strong>
                    <strong style={{ color: 'green' }}> "wih" </strong>
                    <strong style={{ color: 'black' }}> and missed words are highlighted in </strong>
                    <strong style={{ color: 'purple' }}>purple</strong>.
                    <strong style={{ color: 'black' }}> Omitted words or lines also appear in </strong>
                    <strong style={{ color: 'purple' }}>purple</strong>.
                    <strong style={{ color: 'black' }}> Extra or incorrect entries, such as additional words or substitutions, are shown in </strong>
                    <strong style={{ color: 'green' }}>green</strong>.
                </div>
                <div className="butndash">
                    <Button className="student-dashboard" onClick={() => navigate(`/user-dashboard`)}>Student dashboard</Button>
                </div>
                <div className="row-container">
                    <div className="left-column">
                        <h4>Original Paragraph</h4>
                        <p>{Originalparagraph}</p> {/* Replace with your actual data */}
                    </div>
                    <div className="right-column">
                        {/* <h4>Paragraph</h4> */}
                        <h4 class="typing-result-description">Here is a detailed breakdown of your typing performance</h4>
                        <p>{paragraph}</p> {/* Replace with your actual data */}
                    </div>
                </div>




            </div>
        </>
    );
};

export default TypingPerformance;









