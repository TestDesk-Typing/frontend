// import React, { useEffect, useState } from 'react';
// import { CChart } from '@coreui/react-chartjs';
// import { DayPicker } from 'react-day-picker';
// import './UserOverallChart.css'; // Custom CSS for day picker styles
// import { useAuth } from "../AuthContext/AuthContext";
// import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
// import BeforeChart from './BeforeChart';
// import { useCookies } from 'react-cookie';
// import { useNavigate } from 'react-router-dom';

// const UserOverallChart = () => {
//   const [speedData, setSpeedData] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Month index (0-11)
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Year
//   const [viewOption, setViewOption] = useState('month'); // 'month' or 'year'
//   const { userDetails } = useAuth();
//   const [cookies] = useCookies(['session_id, SSIDCE']);
//   const navigate = useNavigate(); // Initialize useNavigate

//   useEffect(() => {
//     checkAccess();
//   }, [cookies.session_id]);

//   const checkAccess = async () => {
//     if (!cookies.session_id) {
//       navigate("/login");
//       return;
//     }
  
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/code-123`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${cookies.session_id}`,
//         },
//       });
  
//       if (response.ok) {
//         const { access } = await response.json();
//         if (access === "access") {
//           // If access is granted, fetch the speed data
//           fetchSpeedData();
//         }
//       } else {
//         console.error('Access check failed:', response.statusText);
//         // Optionally handle the case where access is denied
//       }
//     } catch (error) {
//       console.error('Error checking access:', error);
//     }
//   };
  
//   const fetchSpeedData = async () => {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/speed-data/${cookies.SSIDCE}`, {
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json",
//           "Authorization": `Bearer ${cookies.session_id}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setSpeedData(data);
//     } catch (error) {
//       console.error('Error fetching speed data:', error);
//     }
//   };
  



//   const calculateMonthlyAverages = () => {
//     const averages = { labels: [], data: [] };
//     const start = startOfMonth(new Date(selectedYear, selectedMonth));
//     const end = endOfMonth(new Date(selectedYear, selectedMonth));

//     // Create labels for the days in the month
//     for (let day = start.getDate(); day <= end.getDate(); day++) {
//       averages.labels.push(day.toString());
//     }

//     // Map to calculate average speeds
//     const speedMap = {};
//     speedData.forEach(item => {
//       const testDate = new Date(item.testDate);
//       if (isWithinInterval(testDate, { start, end })) {
//         const dayKey = testDate.getDate();
//         if (!speedMap[dayKey]) speedMap[dayKey] = [];
//         speedMap[dayKey].push(item.speed);
//       }
//     });

//     // Calculate averages
//     averages.data = averages.labels.map((_, index) => {
//       const speeds = speedMap[index + 1] || [];
//       return speeds.length ? Math.round(speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length) : 0;
//     });

//     return averages;
//   };

//   const calculateYearlyAverages = () => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const averages = new Array(12).fill(0);
//     const counts = new Array(12).fill(0);

//     speedData.forEach(item => {
//       const testDate = new Date(item.testDate);
//       const month = testDate.getMonth();
//       averages[month] += item.speed;
//       counts[month] += 1;
//     });

//     const yearlyAverages = averages.map((total, index) => (counts[index] ? Math.round(total / counts[index]) : 0));

//     return {
//       labels: months,
//       data: yearlyAverages,
//     };
//   };

//   const averages = calculateMonthlyAverages();
//   const yearlyAverages = calculateYearlyAverages();



// return (
//   <>  
//    <BeforeChart />
//   <div className="user-dashboard">
   
//     <div className="chart-container-user-speed">
//       <div className='user-performnce'><h2 className="overall-speed-heading-one">User performace</h2>
//       <h6 className="overall-speed-heading">Year-wise and Month-wise performace</h6> </div>
//     {viewOption === 'month' && (
//       <>
//         {averages.labels.length > 0 ? (
//           <CChart
//             type="line"
//             data={{
//               labels: averages.labels,
//               datasets: [{
//                 label: 'Average Speed (wpm)',
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 borderColor: 'rgb(75, 192, 192)',
//                 pointBackgroundColor: 'rgb(75, 192, 192)',
//                 pointBorderColor: '#fff',
//                 data: averages.data,
//                 fill: true,
//               }],
//             }}
//             options={{
//               plugins: {
//                 legend: {
//                   labels: {
//                     color: 'rgba(0, 0, 0, 0.87)',
//                   },
//                 },
//               },
//               hover: {
//                 mode: 'nearest',
//                 intersect: true,
//               },
//               scales: {
//                 x: {
//                   grid: {
//                     color: 'rgba(0, 0, 0, 0.1)',
//                   },
//                   ticks: {
//                     color: 'rgba(0, 0, 0, 0.87)',
//                   },
//                 },
//                 y: {
//                   min: 0,
//                   max: 60,
//                   ticks: {
//                     stepSize: 10,
//                     color: 'rgba(0, 0, 0, 0.87)',
//                     callback: value => Math.round(value),
//                   },
//                   grid: {
//                     color: 'rgba(0, 0, 0, 0.1)',
//                   },
//                 },
//               },
//             }}
//           />
//         ) : (
//           <p>No data available for the selected period.</p>
//         )}
//       </>
//     )}

//     {viewOption === 'year' && (
//       <div className="yearly-data">
//         <CChart
//           type="line"
//           data={{
//             labels: yearlyAverages.labels,
//             datasets: [{
//               label: 'Average Speed (wpm)',
//               backgroundColor: 'rgba(75, 192, 192, 0.5)',
//               borderColor: 'rgb(75, 192, 192)',
//               data: yearlyAverages.data,
//             }],
//           }}
//           options={{
//             plugins: {
//               legend: {
//                 labels: {
//                   color: 'rgba(0, 0, 0, 0.87)',
//                 },
//               },
//               tooltip: {
//                 backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                 titleColor: '#fff',
//                 bodyColor: '#fff',
//                 padding: 10,
//                 displayColors: false,
//                 callbacks: {
//                   label: function (tooltipItem) {
//                     return `Speed: ${tooltipItem.raw} wpm`;
//                   },
//                 },
//               },
//             },
//             scales: {
//               x: {
//                 grid: {
//                   color: 'rgba(0, 0, 0, 0.1)',
//                 },
//                 ticks: {
//                   color: 'rgba(0, 0, 0, 0.87)',
//                 },
//               },
//               y: {
//                 min: 0,
//                 max: 60,
//                 ticks: {
//                   stepSize: 10,
//                   color: 'rgba(0, 0, 0, 0.87)',
//                   callback: value => Math.round(value),
//                 },
//                 grid: {
//                   color: 'rgba(0, 0, 0, 0.1)',
//                 },
//               },
//             },
//           }}
//         />
//       </div>
//     )}
// </div>
// <div className="right-month-container">
//     <div className="view-selector">
//       <label>
//         <input
//           type="radio"
//           value="month"
//           checked={viewOption === 'month'}
//           onChange={() => setViewOption('month')}
//         />
//         Month
//       </label>
//       <label>
//         <input
//           type="radio"
//           value="year"
//           checked={viewOption === 'year'}
//           onChange={() => setViewOption('year')}
//         />
//         Year
//       </label>
//     </div>

//     {viewOption === 'month' && (
//       <div className="month-selector-dash">
//          <div className="month-selector-both-select">
//         <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
//           {Array.from({ length: 12 }, (_, index) => (
//             <option key={index} value={index}>
//               {format(new Date(selectedYear, index), 'MMMM')}
//             </option>
//           ))}
//         </select>

//         <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
//           {Array.from({ length: 10 }, (_, index) => (
//             <option key={index} value={2023 + index}>
//               {2023 + index}
//             </option>
//           ))}
//         </select></div>

//         <DayPicker
//           month={new Date(selectedYear, selectedMonth)} // Show the selected month
//           onDayClick={day => {
//             // console.log(`Selected Day: ${format(day, 'dd MMMM yyyy')}`);
//           }}
//         />
//       </div>
//     )}
//   </div>
//   </div></>
// );
// }

// export default UserOverallChart;


import React, { useEffect, useState } from 'react';
import { CChart } from '@coreui/react-chartjs';
import { DayPicker } from 'react-day-picker';
import './UserOverallChart.css'; // Custom CSS for day picker styles
import { useAuth } from "../AuthContext/AuthContext";
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import BeforeChart from './BeforeChart';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const UserOverallChart = () => {
  const [speedData, setSpeedData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Month index (0-11)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Year
  const [viewOption, setViewOption] = useState('month'); // 'month' or 'year'
  const { userDetails } = useAuth();
  const [cookies] = useCookies(['session_id, SSIDCE']);
  const navigate = useNavigate(); // Initialize useNavigate

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
          // If access is granted, fetch the speed data
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
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSpeedData(data);
    } catch (error) {
      console.error('Error fetching speed data:', error);
    }
  };

  const calculateMonthlyAverages = () => {
    const averages = { labels: [], data: [] };
    const start = startOfMonth(new Date(selectedYear, selectedMonth));
    const end = endOfMonth(new Date(selectedYear, selectedMonth));

    // Create labels for the days in the month
    for (let day = start.getDate(); day <= end.getDate(); day++) {
      averages.labels.push(day.toString());
    }

    // Map to calculate average speeds
    const speedMap = {};
    speedData.forEach(item => {
      const testDate = new Date(item.testDate);
      if (isWithinInterval(testDate, { start, end })) {
        const dayKey = testDate.getDate();
        if (!speedMap[dayKey]) speedMap[dayKey] = [];
        speedMap[dayKey].push(item.speed);
      }
    });

    // Calculate averages
    averages.data = averages.labels.map((_, index) => {
      const speeds = speedMap[index + 1] || [];
      return speeds.length ? Math.round(speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length) : 0;
    });

    return averages;
  };

  const calculateYearlyAverages = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const averages = new Array(12).fill(0);
    const counts = new Array(12).fill(0);

    speedData.forEach(item => {
      const testDate = new Date(item.testDate);
      const month = testDate.getMonth();
      const year = testDate.getFullYear();
      
      if (year === selectedYear) {  // Only consider data for the selected year
        averages[month] += item.speed;
        counts[month] += 1;
      }
    });

    const yearlyAverages = averages.map((total, index) => (counts[index] ? Math.round(total / counts[index]) : 0));

    return {
      labels: months,
      data: yearlyAverages,
    };
  };

  const averages = calculateMonthlyAverages();
  const yearlyAverages = calculateYearlyAverages();

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
            <>
              {averages.labels.length > 0 ? (
                <CChart
                  type="line"
                  data={{
                    labels: averages.labels,
                    datasets: [{
                      label: 'Average Speed (wpm)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgb(75, 192, 192)',
                      pointBackgroundColor: 'rgb(75, 192, 192)',
                      pointBorderColor: '#fff',
                      data: averages.data,
                      fill: true,
                    }],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        labels: {
                          color: 'rgba(0, 0, 0, 0.87)',
                        },
                      },
                    },
                    hover: {
                      mode: 'nearest',
                      intersect: true,
                    },
                    scales: {
                      x: {
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)',
                        },
                        ticks: {
                          color: 'rgba(0, 0, 0, 0.87)',
                        },
                      },
                      y: {
                        min: 0,
                        max: 60,
                        ticks: {
                          stepSize: 10,
                          color: 'rgba(0, 0, 0, 0.87)',
                          callback: value => Math.round(value),
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)',
                        },
                      },
                    },
                  }}
                />
              ) : (
                <p>No data available for the selected period.</p>
              )}
            </>
          )}

          {viewOption === 'year' && (
            <div className="yearly-data">
              <CChart
                type="line"
                data={{
                  labels: yearlyAverages.labels,
                  datasets: [{
                    label: 'Average Speed (wpm)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgb(75, 192, 192)',
                    data: yearlyAverages.data,
                  }],
                }}
                options={{
                  plugins: {
                    legend: {
                      labels: {
                        color: 'rgba(0, 0, 0, 0.87)',
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      padding: 10,
                      displayColors: false,
                      callbacks: {
                        label: function (tooltipItem) {
                          return `Speed: ${tooltipItem.raw} wpm`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                      ticks: {
                        color: 'rgba(0, 0, 0, 0.87)',
                      },
                    },
                    y: {
                      min: 0,
                      max: 60,
                      ticks: {
                        stepSize: 10,
                        color: 'rgba(0, 0, 0, 0.87)',
                        callback: value => Math.round(value),
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                  },
                }}
              />
            </div>
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
              />
              Month
            </label>
            <label>
              <input
                type="radio"
                value="year"
                checked={viewOption === 'year'}
                onChange={() => setViewOption('year')}
              />
              Year
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
                month={new Date(selectedYear, selectedMonth)} // Show the selected month
                onDayClick={day => {
                  // console.log(`Selected Day: ${format(day, 'dd MMMM yyyy')}`);
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
            </div></div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserOverallChart;
