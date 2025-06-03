import { Button } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import parse from "html-react-parser";
import Header from "../component/Header"
import "../Typing/Result.css";
import { useCookies } from 'react-cookie';
import { useAuth } from "../AuthContext/AuthContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, ...registerables);

const TypingPerformanceDashboard = () => {
    const { testcode, exam, testname } = useParams();
    const category = 'UR';
    const [paragraph, setParagraph] = useState('');
    const [Originalparagraph, setOriginalParagraph] = useState('');
    const [wrongdep, setWrongdep] = useState('');
    const [grosspeed, setGrossSpeed] = useState('');
    const [wpm, setWpm] = useState('');
    const [accuracy, setAccuracy] = useState(0);
    const [wrongper, setWrongPer] = useState(0);
    const [actualdep, setActualDep] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [marks, setMarks] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [correctedword, setCorrectedword] = useState(0);
    const [totaltyped, setTotalTyped] = useState(0);
    const [Incorrectedword, setIncorrectedword] = useState(0);
    const [cookies] = useCookies(['session_id', 'SSDSD']);
    const { userDetails } = useAuth();

    let emailId = userDetails.email_id;

    if (cookies.userData) {
        try {
            let parsedUserData;
            if (typeof cookies.userData === 'string') {
                parsedUserData = JSON.parse(decodeURIComponent(cookies.userData));
            } else {
                parsedUserData = cookies.userData;
            }
            emailId = parsedUserData.email_id || '';
        } catch (error) {
            console.error('Error processing userData cookie:', error);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                        const dt = {
                            'paper_code': testcode,
                            'email_id': emailId,
                            'exam': exam,
                            'category': 'UR',
                            'testname': testname
                        };

                        const state_res = await fetch(`${process.env.REACT_APP_API_URL}/api/result-typing`, {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": `Bearer ${cookies.session_id}`
                            },
                            body: JSON.stringify(dt)
                        });

                        if (state_res.ok) {
                            const result = await state_res.json();
                            setParagraph(parse(result.paragraph));
                            setOriginalParagraph(result.oldparagraph);
                            setGrossSpeed(result.grossspeed);
                            setWrongdep(result.wrongdep);
                            setWpm(result.wpm);
                            setCorrectedword(result.correctedword);
                            setIncorrectedword(result.Incorrectedword);
                            setTotalTyped(result.totaltypedword);
                            setSpeed(result.speed);
                            setAccuracy(result.accuracy);
                            setWrongPer(result.wrong);
                            setMarks(result.marks);
                            setError(result.error < 0 ? 0 : result.error);
                        } else {
                            console.error("Failed to fetch performance status");
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
            <div className="typing-performance-container mt-5">
                <div className="performance-header">
                    <h2 className="performance-title">Your Typing Skill Test Report</h2>
                </div>

                <div className="performance-content">
                    <div className="performance-table-container">
                        <table className="performance-table">
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

                    <div className="performance-chart-container">
                        <h3 className="chart-title">Performance Overview</h3>
                        <div className="chart-wrapper">
                            <Pie data={pieChartData} />
                        </div>
                    </div>
                </div>

                <div className="performance-notes">
                    <p>
                        <strong>** Notes:</strong> In your Typed Paragraph:<br />
                        Mistakes like <span className="note-purple">"with"</span> typed as <span className="note-green">"wih"</span> and missed words are highlighted in <span className="note-purple">purple</span>.<br />
                        Omitted words or lines also appear in <span className="note-purple">purple</span>.<br />
                        Extra or incorrect entries, such as additional words or substitutions, are shown in <span className="note-green">green</span>.
                    </p>
                </div>

                <div className="dashboard-button-container">
                    <Button 
                        className="dashboard-button" 
                        onClick={() => navigate('/user-dashboard')}
                    >
                        Student dashboard
                    </Button>
                </div>

                <div className="paragraphs-container">
                    <div className="paragraph-box original-paragraph">
                        <h4>Original Paragraph</h4>
                        <div className="paragraph-content">{Originalparagraph}</div>
                    </div>
                    <div className="paragraph-box typed-paragraph">
                        <h4 className="paragraph-title">Detailed Typing Performance</h4>
                        <div className="paragraph-content">{paragraph}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TypingPerformanceDashboard;