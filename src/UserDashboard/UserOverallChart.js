import React, { useEffect, useState } from 'react';
import { CChart } from '@coreui/react-chartjs';
import { DayPicker } from 'react-day-picker';
import './UserOverallChart.css';
import { useAuth } from "../AuthContext/AuthContext";
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import BeforeChart from './BeforeChart';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const UserOverallChart = () => {
  const [speedData, setSpeedData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewOption, setViewOption] = useState('month');
  const { userDetails } = useAuth();
  const [cookies] = useCookies(['session_id', 'SSIDCE']);
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, [cookies.session_id]);

  const checkAccess = async () => {
    if (!cookies.session_id) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/code-123`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookies.session_id}`,
        },
      });

      if (response.ok) {
        const { access } = await response.json();
        if (access === "access") {
          fetchSpeedData();
        }
      } else {
        console.error('Access check failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error checking access:', error);
    }
  };

  const fetchSpeedData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/speed-data/${cookies.SSIDCE}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookies.session_id}`,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setSpeedData(data);
    } catch (error) {
      console.error('Error fetching speed data:', error);
    }
  };

  const calculateMonthlyAverages = () => {
    const start = startOfMonth(new Date(selectedYear, selectedMonth));
    const end = endOfMonth(new Date(selectedYear, selectedMonth));

    const dailyMap = {};
    speedData.forEach(item => {
      const date = new Date(item.testDate);
      if (isWithinInterval(date, { start, end })) {
        const day = date.getDate();
        if (!dailyMap[day]) {
          dailyMap[day] = { speed: [], grossSpeed: [], accuracy: [], keyEfficiency: [] };
        }
        dailyMap[day].speed.push(item.speed);
        dailyMap[day].grossSpeed.push(item.grossSpeed);
        dailyMap[day].accuracy.push(item.accuracy);
        dailyMap[day].keyEfficiency.push(item.keyEfficiency);
      }
    });

    const labels = [];
    const speed = [];
    const grossSpeed = [];
    const accuracy = [];
    const keyEfficiency = [];

    for (let day = 1; day <= end.getDate(); day++) {
      labels.push(day.toString());
      const avg = (arr) => arr?.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
      const d = dailyMap[day] || {};
      speed.push(avg(d.speed));
      grossSpeed.push(avg(d.grossSpeed));
      accuracy.push(avg(d.accuracy));
      keyEfficiency.push(avg(d.keyEfficiency));
    }

    return { labels, speed, grossSpeed, accuracy, keyEfficiency };
  };

  const calculateYearlyAverages = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map = new Array(12).fill(null).map(() => ({ speed: [], grossSpeed: [], accuracy: [], keyEfficiency: [] }));

    speedData.forEach(item => {
      const date = new Date(item.testDate);
      if (date.getFullYear() === selectedYear) {
        const m = date.getMonth();
        map[m].speed.push(item.speed);
        map[m].grossSpeed.push(item.grossSpeed);
        map[m].accuracy.push(item.accuracy);
        map[m].keyEfficiency.push(item.keyEfficiency);
      }
    });

    const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    return {
      labels: months,
      speed: map.map(d => avg(d.speed)),
      grossSpeed: map.map(d => avg(d.grossSpeed)),
      accuracy: map.map(d => avg(d.accuracy)),
      keyEfficiency: map.map(d => avg(d.keyEfficiency)),
    };
  };

  const averages = calculateMonthlyAverages();
  const yearly = calculateYearlyAverages();

  return (
    <>
      <BeforeChart />
      <div className="user-dashboard">
        <div className="chart-container-user-speed">
          <div className='user-performnce'>
            <h2 className="overall-speed-heading-one">User performance</h2>
            <h6 className="overall-speed-heading">Year-wise and Month-wise performance</h6>
          </div>

          {viewOption === 'month' && (
            averages.labels.length > 0 ? (
              <CChart
                type="line"
                data={{
                  labels: averages.labels,
                  datasets: [
                    {
                      label: 'Net Speed (WPM)',
                      borderColor: 'rgb(75, 192, 192)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      data: averages.speed,
                      fill: true,
                    },
                    {
                      label: 'Gross Speed (WPM)',
                      borderColor: 'rgb(255, 159, 64)',
                      backgroundColor: 'rgba(255, 159, 64, 0.2)',
                      data: averages.grossSpeed,
                      fill: true,
                    },
                    {
                      label: 'Accuracy (%)',
                      borderColor: 'rgb(153, 102, 255)',
                      backgroundColor: 'rgba(153, 102, 255, 0.2)',
                      data: averages.accuracy,
                      fill: false,
                    },
                    {
                      label: 'Key Efficiency (%)',
                      borderColor: 'rgb(54, 162, 235)',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      data: averages.keyEfficiency,
                      fill: false,
                    }
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      labels: {
                        color: 'rgba(0, 0, 0, 0.87)',
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: 'rgba(0, 0, 0, 0.87)',
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                    y: {
                      min: 0,
                      max: 130,
                      ticks: {
                        stepSize: 10,
                        color: 'rgba(0, 0, 0, 0.87)',
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                  },
                }}
              />
            ) : <p>No data available for the selected period.</p>
          )}

          {viewOption === 'year' && (
            <CChart
              type="line"
              data={{
                labels: yearly.labels,
                datasets: [
                  {
                    label: 'Net Speed (WPM)',
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    data: yearly.speed,
                    fill: true,
                  },
                  {
                    label: 'Gross Speed (WPM)',
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    data: yearly.grossSpeed,
                    fill: true,
                  },
                  {
                    label: 'Accuracy (%)',
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    data: yearly.accuracy,
                    fill: false,
                  },
                  {
                    label: 'Key Efficiency (%)',
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    data: yearly.keyEfficiency,
                    fill: false,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    labels: {
                      color: 'rgba(0, 0, 0, 0.87)',
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: 'rgba(0, 0, 0, 0.87)',
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                  y: {
                    min: 0,
                    max: 130,
                    ticks: {
                      stepSize: 10,
                      color: 'rgba(0, 0, 0, 0.87)',
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                },
              }}
            />
          )}
        </div>

        <div className="right-month-container">
          <div className="view-selector">
            <label>
              <input
                type="radio"
                value="month"
                checked={viewOption === 'month'}
                onChange={() => setViewOption('month')}
              /> Month
            </label>
            <label>
              <input
                type="radio"
                value="year"
                checked={viewOption === 'year'}
                onChange={() => setViewOption('year')}
              /> Year
            </label>
          </div>

          {viewOption === 'month' && (
            <div className="month-selector-dash">
              <div className="month-selector-both-select">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                  {Array.from({ length: 12 }, (_, index) => (
                    <option key={index} value={index}>
                      {format(new Date(selectedYear, index), 'MMMM')}
                    </option>
                  ))}
                </select>

                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                  {Array.from({ length: 10 }, (_, index) => (
                    <option key={index} value={2023 + index}>
                      {2023 + index}
                    </option>
                  ))}
                </select>
              </div>

              <DayPicker
                month={new Date(selectedYear, selectedMonth)}
                onDayClick={day => {
                  // Handle day click if needed
                }}
              />
            </div>
          )}

          {viewOption === 'year' && (
            <div className="year-selector-dash">
              <div className="month-selector-both-select">
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                  {Array.from({ length: 10 }, (_, index) => (
                    <option key={index} value={2023 + index}>
                      {2023 + index}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserOverallChart;