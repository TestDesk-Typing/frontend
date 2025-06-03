import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExamList.css";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  // Static names for redirection and display
  const staticNames = {
    "SSC CHSL": {
      displayName: "SSC CHSL 2025 Dest Typing test",
      redirectName: "ssc-chsl-typing-test",
    },
    "DSSSB": {
      displayName: "DSSSB JJA / SPA / PA English Typing Tests",
      redirectName: "dsssb-jja-spa-pa-english-typing-tests",
    },
    "Delhi Police": {
      displayName: "Delhi Police Typing Test",
      redirectName: "delhi-police-typing-test",
    },
    "Delhi High Court": {
      displayName: "Delhi High Court PA SPA Typing Test",
      redirectName: "delhi-high-court-pa-spa-typing-test",
    },
    "DRDO": {
      displayName: "DRDO Assistant Typing Course",
      redirectName: "drdo-assistant-typing-course",
    },
    "EPFO": {
      displayName: "EPFO Typing Skill Tests",
      redirectName: "epfo-typing-skill-tests",
    },

    "BSF": {
      displayName: "BSF (HCM) Typing Skill Tests",
      redirectName: "bsf-hcm-typing-skill-tests",
    },
    "SSC": {
      displayName: "SSC CGL 2025 Dest Typing test",
      redirectName: "ssc-cgl-typing-test",
    },
    "Supreme Court": {
      displayName: "Supreme Court JCA Typing Test",
      redirectName: "supreme-court-jca-typing-test",
    },
    "RRB": {
      displayName: "RRB NTPC / GDCE typing test (Railway typing)",
      redirectName: "rrb-ntpc-typing-test",
    },
  };
  
  

  // Fetch exam data from the API
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/examImages`);
        const data = await response.json();
        // console.log("Fetched exams data:", data); // Log to confirm data structure
        setExams(data); // Set the fetched exams
      } catch (error) {
        console.error("Error fetching exams data:", error);
      }
    };
    fetchExams();
  }, []);

  // Handle click on exam card to redirect to the appropriate course page
  const handleCardClick = (govName) => {
    const staticData = staticNames[govName];
    if (staticData) {
      navigate(`/course-page/${staticData.redirectName}`);
    } else {
      console.error(`No mapping found for: ${govName}`);
    }
  };

  return (
    <div className="exam-list-container-examlist">
      <h2>All Courses</h2>
      <div className="exam-list-grid-examlist">
        {exams?.map((exam, index) => {
          // Log each exam and static mapping to debug
          // console.log("Exam govName:", exam.govName, "Static Data:", staticNames[exam.govName]);

          const staticData = staticNames[exam.govName];
          if (!staticData) return null; // Skip rendering if no mapping is found

          return (
            <div
              key={index}
              className="exam-card-examlist"
              onClick={() => handleCardClick(exam.govName)}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}/${exam.imagePath}`}
                alt={staticData.displayName}
                className="exam-image-examlist"
              />
              <h3 className="exam-title-examlist">{staticData.displayName}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExamList;
