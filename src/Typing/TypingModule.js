import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import TypingTimer from "./TypingTimer";
import { useNavigate, useParams } from "react-router-dom";
import { BiSolidLeftArrow, BiSolidDownArrow } from "react-icons/bi";
import { FcInfo } from "react-icons/fc";
import { useCookies } from "react-cookie";
import { diffWords } from "diff";
import "./Main.css";
import { useAuth } from "../AuthContext/AuthContext";
import pic3 from "../i/NewCandidateImage.jpg";

const TypingModule = () => {
  const { testcode, exam, UR, testname } = useParams();
  const [message, setMessage] = useState("");
  const [wpm, setWpm] = useState("");
  const [minute, setMinute] = useState("");
  const hoursMinSecs = { hours: 0, minutes: minute, seconds: 0 };
  const [rmTm, setrmTm] = useState();
  const navigate = useNavigate();
  const [paragraph, setParagraph] = useState("");
  const [typing, setTyping] = useState(false);
  const [contentLength, setContentLength] = useState("");
  const [cookies] = useCookies(["session_id"]);
  const [showDetails, setShowDetails] = useState(false);
  const [oldparagraph, setoldParagraph] = useState("");
  const { userDetails, isLoggedIn } = useAuth();

  useEffect(() => {
    const disableRightClick = (event) => event.preventDefault();
    const disableCutCopyPaste = (event) => {
      if (!(event.ctrlKey || event.metaKey)) event.preventDefault();
    };
    const disableKeyCombinations = (event) => {
      const blockedCombos = [
        (event.ctrlKey && event.shiftKey && event.code === "KeyI"),
        (event.ctrlKey && event.shiftKey && event.code === "KeyC"),
        (event.ctrlKey && event.shiftKey && event.code === "KeyJ"),
        (event.ctrlKey && event.shiftKey && event.code === "KeyS"),
        (event.keyCode === 121 && event.shiftKey === true),
        (event.ctrlKey && event.code === "KeyU"),
        (event.ctrlKey && event.code === "KeyP"),
        (event.code === "F12")
      ];
      if (blockedCombos.some(Boolean)) event.preventDefault();
    };

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("cut", disableCutCopyPaste);
    document.addEventListener("copy", disableCutCopyPaste);
    document.addEventListener("paste", disableCutCopyPaste);
    document.addEventListener("keydown", disableKeyCombinations);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("cut", disableCutCopyPaste);
      document.removeEventListener("copy", disableCutCopyPaste);
      document.removeEventListener("paste", disableCutCopyPaste);
      document.removeEventListener("keydown", disableKeyCombinations);
    };
  }, []);

  const fetchParagraph = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/typingParagraph-get`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${cookies.session_id}`,
          },
          body: JSON.stringify({ paper_code: testcode, examName: exam, testName: testname }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setParagraph(data.paragraph);
        setoldParagraph(data.paragraph);
        setContentLength(data.paragraph.length);
        setMinute(data.time);
      }
    } catch (error) {
      console.error("Failed to fetch paragraph", error);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      if (!cookies.session_id) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/code-123`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${cookies.session_id}`,
            },
          }
        );

        if (response.ok) {
          const { access } = await response.json();
          if (access === "access") {
            const productResponse = await fetch(
              `${process.env.REACT_APP_API_URL}/api/code-234`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${cookies.session_id}`,
                },
                body: JSON.stringify({ product_id: "999" }),
              }
            );

            if (productResponse.ok) {
              const { access } = await productResponse.json();
              if (access === "access") {
                fetchParagraph();
              } else {
                navigate("/login");
              }
            } else {
              navigate("/login");
            }
          } else {
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    };

    checkAccess();
  }, [testcode, exam, cookies.session_id, navigate]);

  const handleMessageChange = (event) => {
    if (!typing) setTyping(true);
    setMessage(event.target.value);
  };

  const rmTimeFun = (rTm) => setrmTm(rTm);

  const messageSubmit = async () => {
    const originalParagraph = paragraph.trim();
    const userInput = message.trim();
    let comparisonResult, correctChars, wrongChars, totalDepressions, accuracy, wrongPercentage, netSpeed, grossSpeed;

    if (exam === "JCA") {
      const typedLength = userInput.length;
      const originalSubstring = originalParagraph.substring(0, typedLength);
      const diff = diffWords(originalSubstring, userInput);

      comparisonResult = diff.map((part) => {
        const text = part.value;
        if (part.added) return `<span class="wrongword">${text}</span>`;
        if (part.removed) return `<span class="missingword">${text}</span>`;
        return `<span class="correctword">${text}</span>`;
      }).join(" ");

      correctChars = diff.reduce((acc, part) => (!part.added && !part.removed ? acc + part.value.length : acc), 0);
      wrongChars = diff.reduce((acc, part) => (part.added ? acc + part.value.length : acc), 0);
      totalDepressions = typedLength;
    } else {
      const diff = diffWords(originalParagraph, userInput);
      comparisonResult = diff.map((part) => {
        const text = part.value;
        if (part.added) return `<span class="wrongword">${text}</span>`;
        if (part.removed) return `<span class="missingword">${text}</span>`;
        return `<span class="correctword">${text}</span>`;
      }).join(" ");

      correctChars = diff.reduce((acc, part) => (!part.added && !part.removed ? acc + part.value.length : acc), 0);
      wrongChars = diff.reduce((acc, part) => (part.added ? acc + part.value.length : acc), 0);
      totalDepressions = originalParagraph.length;
    }

    if (rmTm !== undefined) {
      const timeParts = rmTm.split(":");
      const total_time = `00:${minute}:00`;
      const totalSecondsUsed = +timeParts[0] * 3600 + +timeParts[1] * 60 + +timeParts[2];
      const totalTestSeconds = +total_time.split(":")[1] * 60;
      const timeTaken = totalTestSeconds - totalSecondsUsed;

      grossSpeed = Math.round((message.length * 60) / (timeTaken * 5));
      netSpeed = Math.round((correctChars * 60) / (timeTaken * 5));
      accuracy = ((correctChars / totalDepressions) * 100).toFixed(2);
      wrongPercentage = (100 - accuracy).toFixed(2);

      const typing_performance_result = {
        email_id: cookies.SSIDCE,
        paper_code: testcode,
        student_paragraph: message,
        paragraph: comparisonResult,
        accuracy: accuracy,
        wrong: wrongPercentage,
        grossspeed: grossSpeed,
        totaldepres: totalDepressions,
        accuratedep: correctChars,
        wrongdep: wrongChars,
        testname: testname,
        speed: netSpeed,
        time: rmTm,
        actual_depression: message.length,
        oldparagraph: oldparagraph,
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post-user-typing-result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookies.session_id}`,
        },
        body: JSON.stringify(typing_performance_result),
      });

      if (response.ok) {
        navigate(`/${testcode}/${exam}/${testname}/feedback`);
      }
    }
  };

  if (rmTm === "00:00:00") {
    messageSubmit();
  }

  const showProfile = () => setShowDetails(!showDetails);

  return (
    <div className="typing-module-container">
      {/* Header Section */}
      <div className="typing-header-bar"></div>
      <div className="typing-exam-info">
        <div className="exam-name">{testname}</div>
        <div className="exam-instructions">
          <FcInfo className="info-icon" />
          <div className="instructions-text">View Instructions</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="typing-main-content">
        {/* Left Panel */}
        <div className="typing-left-panel">
          <div className="panel-header">
            <BiSolidLeftArrow className="arrow-icon" />
            <div className="group-section">
              <div className="group-header">
                <div className="group-title">Group A</div>
                <BiSolidDownArrow className="dropdown-icon" />
              </div>
            </div>
          </div>

          <div className="time-section">
            <div className="section-title">
              <b>Sections</b>
            </div>
            <div className="time-remaining">
              <b>
                Time Left:{" "}
                <span className="timer-display">
                  {typing && <TypingTimer hoursMinSecs={hoursMinSecs} rmTimeFun={rmTimeFun} />}
                </span>
              </b>
            </div>
          </div>

          <div className="subject-section">
            <BiSolidLeftArrow className="arrow-icon" />
            <div className="subject-title selected-subject">
              <span>Section A</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="typing-right-panel">
          <div className="user-profile" onClick={showProfile}>
            <div className="profile-image">
              <img src={pic3} alt="Profile" className="profile-pic" />
            </div>
            <div className="profile-details">
              <div className="user-name" title={userDetails?.fullName}>
                {userDetails?.fullName || 'Guest'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Typing Area */}
      <div className="typing-area-container">
        <div className="keyboard-info">Keyboard Layout: QWERTY</div>
        
        <div className="typing-content-area">
          {/* Original Paragraph */}
          <div className="original-paragraph">
            {paragraph}
          </div>
          
          {/* Typing Input */}
          <div className="typing-input-container">
            <textarea
              className="typing-input"
              value={message}
              spellCheck="false"
              onChange={handleMessageChange}
              maxLength={contentLength}
            ></textarea>
          </div>
        </div>

        {/* Keyboard Instructions */}
        <div className="keyboard-instructions">
          To set up the keyboard for Hindi typing,
          first go to Settings, then Time & Language, and select
          Language on your laptop. Install Hindi as a preferred language.
          After that, press <strong>Windows + Space</strong> to switch to the Hindi keyboard,
          but only switch when Hindi typing is required for the test.
        </div>

        {/* Submit Button */}
        <Button className="submit-button" onClick={messageSubmit}>
          Submit
        </Button>
      </div>

      {/* Footer */}
      <div className="typing-footer">Version : 17.07.00</div>
    </div>
  );
};

export default TypingModule;