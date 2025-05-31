import { Row, Col, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import TypingTimer from "./TypingTimer";
import { useNavigate, useParams } from "react-router-dom";
import parse from "html-react-parser";
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
    // Function to prevent right-click
    const disableRightClick = (event) => {
      event.preventDefault();
    };

    // Function to prevent cut, copy, and paste
    const disableCutCopyPaste = (event) => {
      if (event.ctrlKey || event.metaKey) {
        // Allow Ctrl or Command key
        return;
      }

      event.preventDefault();
    };

    const disableKeyCombinations = (event) => {
      if (
        (event.ctrlKey && event.shiftKey && event.code === "KeyI") ||
        (event.ctrlKey && event.shiftKey && event.code === "KeyC") ||
        (event.ctrlKey && event.shiftKey && event.code === "KeyJ") ||
        (event.ctrlKey && event.shiftKey && event.code === "KeyS") ||
        (event.keyCode === 121 && event.shiftKey === true) ||
        (event.ctrlKey && event.code === "KeyU") ||
        (event.ctrlKey && event.code === "KeyP") || // Add Ctrl+P check

        (event.code === "F12")
      ) {
        event.preventDefault();
      }
    };

    // Add event listeners when the component mounts
    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("cut", disableCutCopyPaste);
    document.addEventListener("copy", disableCutCopyPaste);
    document.addEventListener("paste", disableCutCopyPaste);
    document.addEventListener("keydown", disableKeyCombinations);

    // Remove event listeners when the component unmounts
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("cut", disableCutCopyPaste);
      document.removeEventListener("copy", disableCutCopyPaste);
      document.removeEventListener("paste", disableCutCopyPaste);
      document.removeEventListener("keydown", disableKeyCombinations);
    };
  }, []);



  const fetchParagraph = async () => {
    let dt = { paper_code: testcode, examName: exam, testName: testname };
    // console.log(dt);
    let state_res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/typingParagraph-get`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookies.session_id}`,
        },
        body: JSON.stringify(dt),
      }
    );

    if (state_res.ok) {
      state_res = await state_res.json();
      setParagraph(state_res.paragraph);
      setoldParagraph(state_res.paragraph);
      setContentLength(state_res.paragraph.length);
      setMinute(state_res.time);
    } else {
      console.error("Failed to fetch paragraph", state_res.statusText);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userDetails) {
      // Additional logic if needed
    }
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
                body: JSON.stringify({ product_id: "999" }), // Replace with actual product ID
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
  }, [testcode, exam, cookies.session_id, userDetails, navigate]);
  // console.log("all details here => ", { testcode, exam, userDetails })
  // all details here => {
  //   "testcode": "SC-JCA-TYPING-02-2025",
  //   "exam": "JCA",
  //   "userDetails": {
  //       "id": "6738cf6ae62469acc03a12e8",
  //       "fullName": "prashant kumar sinha",
  //       "email_id": "meekuprashant@gmail.com",
  //       "mobile_number": "7209822149"
  //   }
  // }
  let d = paragraph;

  const handleMessageChange = (event) => {
    if (!typing) {
      setTyping(true);
    }

    // Get the user's input and replace multiple spaces with a single space
    let input = event.target.value;

    // Replace multiple spaces between words with a single space
    // input = input.replace(/\s+/g, " ").trimStart(); // trimStart prevents leading spaces

    // Update the state with the cleaned input
    setMessage(input);

    // console.log("User input:", input);
  };

  const rmTimeFun = (rTm) => {
    setrmTm(rTm);
  };


  // const messageSubmit = async () => {
  //   const originalParagraph = paragraph.trim(); // The original paragraph to compare against
  //   const userInput = message.trim(); // User's input

  //   // Use diffWords to compare the original and user input paragraphs word-by-word
  //   const diff = diffWords(originalParagraph, userInput);

  //   // Build the comparison result by mapping the diff output to formatted HTML
  //   const comparisonResult = diff
  //     .map((part) => {
  //       const text = part.value;
  //       if (part.added) {
  //         // Extra words in user input
  //         return `<span class="wrongword">${text}</span>`;
  //       } else if (part.removed) {
  //         // Missing words in user input
  //         return `<span class="missingword">${text}</span>`;
  //       } else {
  //         // Correct words
  //         return `<span class="correctword">${text}</span>`;
  //       }
  //     })
  //     .join(" ");

  //   // Combine the result array into a single string of HTML for rendering and submission
  //   const finalParagraph = comparisonResult;

  //   let correctChars = 0; // Count of correct characters
  //   let wrongChars = 0; // Count of wrong characters
  //   const totalDepressions = originalParagraph.length; // Total characters in the original paragraph
  //   const actualDepressions = message.length; // Total characters typed by the user

  //   // Count correct and wrong characters
  //   diff.forEach((part) => {
  //     if (!part.added && !part.removed) {
  //       // Correct characters
  //       correctChars += part.value.length;
  //     } else if (part.added) {
  //       // Extra (wrong) characters
  //       wrongChars += part.value.length;
  //     }
  //   });

  //   // Time and Speed Calculations
  //   if (rmTm !== undefined) {
  //     const timeParts = rmTm.split(":");
  //     const total_time = `00:${minute}:00`;
  //     const totalSecondsUsed =
  //       +timeParts[0] * 3600 + +timeParts[1] * 60 + +timeParts[2];
  //     const totalTestSeconds = +total_time.split(":")[1] * 60;
  //     const timeTaken = totalTestSeconds - totalSecondsUsed; // Time taken in seconds

  //     const netSpeed = Math.round((correctChars * 60) / (timeTaken * 5)); // Net speed in WPM
  //     const grossSpeed = Math.round((message.length * 60) / (timeTaken * 5)); // Gross speed in WPM

  //     const accuracy = ((correctChars / totalDepressions) * 100).toFixed(2);
  //     const wrongPercentage = (100 - accuracy).toFixed(2);

  //     // console.log(`Total correct depressions: ${correctChars}`);
  //     // console.log(`Total wrong depressions: ${wrongChars}`);
  //     // console.log(`Accuracy: ${accuracy}%, Wrong percentage: ${wrongPercentage}%`);

  //     // Prepare the result object
  //     const typing_performance_result = {
  //       email_id: cookies.SSIDCE,
  //       paper_code: testcode,
  //       student_paragraph: message,
  //       paragraph: finalParagraph, // Formatted comparison result with HTML
  //       accuracy: accuracy,
  //       wrong: wrongPercentage,
  //       grossspeed: grossSpeed,
  //       totaldepres: totalDepressions,
  //       accuratedep: correctChars,
  //       wrongdep: wrongChars,
  //       testname:testname,
  //       speed: netSpeed,
  //       time: rmTm,
  //       actual_depression: actualDepressions, // Add the actual depressions count
  //       oldparagraph:oldparagraph,
  //     };

  //     // Submit the result to the backend
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post-user-typing-result`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         Authorization: `Bearer ${cookies.session_id}`,
  //       },
  //       body: JSON.stringify(typing_performance_result), // Convert to JSON string
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       // console.log("Submission successful:", result);
  //       // navigate(
  //       //   `/typingperformance/${accuracy}/${wrongPercentage}/${correctChars}/${netSpeed}/${testcode}/${exam}/UR`
  //       // );


  //       navigate(
  //         `/${testcode}/${exam}/${testname}/feedback`
  //       );
  //     } else {
  //       console.error("Error submitting typing performance");
  //     }
  //   }
  // };

  const messageSubmit = async () => {
    const originalParagraph = paragraph.trim();
    const userInput = message.trim();

    // Truncate original paragraph to match the length of user input only if exam is JCA
    const trimmedOriginal =
      exam === "JCA" ? originalParagraph.substring(0, userInput.length) : originalParagraph;

    const diff = diffWords(trimmedOriginal, userInput);

    const comparisonResult = diff
      .map((part) => {
        const text = part.value;
        if (part.added) {
          return `<span class="wrongword">${text}</span>`;
        } else if (part.removed) {
          return `<span class="missingword">${text}</span>`;
        } else {
          return `<span class="correctword">${text}</span>`;
        }
      })
      .join(" ");

    const finalParagraph = comparisonResult;

    let correctChars = 0;
    let wrongChars = 0;
    const totalDepressions = trimmedOriginal.length;
    const actualDepressions = userInput.length;

    diff.forEach((part) => {
      if (!part.added && !part.removed) {
        correctChars += part.value.length;
      } else if (part.added) {
        wrongChars += part.value.length;
      }
    });

    if (rmTm !== undefined) {
      const timeParts = rmTm.split(":");
      const total_time = `00:${minute}:00`;
      const totalSecondsUsed =
        +timeParts[0] * 3600 + +timeParts[1] * 60 + +timeParts[2];
      const totalTestSeconds = +total_time.split(":")[1] * 60;
      const timeTaken = totalTestSeconds - totalSecondsUsed;

      const netSpeed = Math.round((correctChars * 60) / (timeTaken * 5));
      const grossSpeed = Math.round((actualDepressions * 60) / (timeTaken * 5));

      const accuracy = ((correctChars / totalDepressions) * 100).toFixed(2);
      const wrongPercentage = (100 - accuracy).toFixed(2);

      const typing_performance_result = {
        email_id: cookies.SSIDCE,
        paper_code: testcode,
        student_paragraph: message,
        paragraph: finalParagraph,
        accuracy: accuracy,
        wrong: wrongPercentage,
        grossspeed: grossSpeed,
        totaldepres: totalDepressions,
        accuratedep: correctChars,
        wrongdep: wrongChars,
        testname: testname,
        speed: netSpeed,
        time: rmTm,
        actual_depression: actualDepressions,
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
        const result = await response.json();
        navigate(`/${testcode}/${exam}/${testname}/feedback`);
      } else {
        console.error("Error submitting typing performance");
      }
    }
  };


  function parseTime(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (rmTm == "00:00:00") {
    messageSubmit();
  }

  const showProfile = () => {
    // Toggle profile details or modal
    setShowDetails(!showDetails);
  };

  return (
    <>
      <div className="xyte"></div>
      <div className="xyot">
        <div className="xyot-examname">{testname}</div>
        <div className="xypt-instructon">
          <FcInfo className="into" />
          <div className="test-instruct">View Instructions</div>
        </div>
      </div>
      <div className="cloumn-group">
        <div className="cloumn-group-left">
          <div className="cloumn-group-left-container">
            <div className="arrowbar">
              <BiSolidLeftArrow
                style={{ color: "#cacaca" }}
                className="left-arrao-group"
              />
              <div className="main-group">
                {" "}
                <div className="arrwo-down">
                  <div className="examheader2section" title="Group A">
                    <span>Group A</span>
                  </div>
                  <BiSolidDownArrow className="dow-arrow-icon" />
                </div>
                <div>
                  {/* <div className="examheader2section" title="Group B">
            {/* Add content for Group B or another section here if needed */}
                  {/* </div>  */}
                </div>
              </div>
            </div>
          </div>

          <div className="secure-time-panel">
            <div className="secure-section-details" id="unique-sections-field">
              <span className="secure-section-title">
                <b>Sections</b>
              </span>
            </div>
            <div className="secure-time-details">
              <div id="unique-show-time" style={{ float: "right" }}>
                <b>
                  Time Left:{" "}
                  <span id="unique-time-in-mins">
                    {" "}
                    {typing === true ? (
                      <TypingTimer
                        hoursMinSecs={hoursMinSecs}
                        rmTimeFun={rmTimeFun}
                      />
                    ) : (
                      ""
                    )}
                  </span>
                </b>
              </div>
              <div
                id="unique-show-time-for-opt-sec"
                style={{ float: "right", display: "none" }}
              >
                &nbsp;
              </div>
            </div>
          </div>
          <div className="my-subject-se">
            <div className="select-subject">
              <BiSolidLeftArrow
                style={{ color: "#cacaca" }}
                className="left-arrao-group-2"
              />
              <div id="mysection">
                <div
                  className="subject-name selectedsubject"
                  id="s0"
                  title="Section A"
                >
                  <span style={{ verticalAlign: "middle" }}>Section A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="column-group-right-unique">
          <div
            id="User_Hldr_Unique"
            onClick={showProfile}
            style={{ borderLeft: "1px solid rgb(195, 195, 193)" }}
          >
            <div className="singleImageDivUnique">
              <div className="profile_image_unique">
                <img
                  width="94"
                  height="101"
                  alt="Profile"
                  className="candidateImgUnique"
                  src={pic3}
                />
              </div>
              <div className="profile_details_unique">
                <div
                  id="Username_Unique"
                  className="candOriginalNameUnique"
                  title="Annamalai"
                >
                  {userDetails.fullName}
                </div>
              </div>
            </div>

            <div className="clear_unique"></div>
          </div>
        </div>
      </div>
      <div id="unique-question-inner-div">
        <div id="unique-subject-div"></div>
        <span className="unique-keyboard-layout" id="unique-keyboard-layout">
          Keyboard Layout: QWERTY
        </span>
        <div

          className="unique-left-container"
        >
          {/* <br /> */}
          <div id="unique-typing-div" className="unique-typing-question-div">
            <div id="unique-row-1" style={{}}>
              {d}
            </div>
          </div>
          <div id="unique-typing-div" className="unique-typing-question-div">
            <div class="textAreaDiv-typed-div" onpaste="return false">
              <textarea
                className="typedAnswer-typed-answr"
                style={{}}
                value={message}
                spellCheck="false"
                onChange={handleMessageChange}
                maxLength={contentLength}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="keyboard-selector-message">
          To set up the keyboard for Hindi typing,
          first go to Settings, then Time & Language, and select
          Language on your laptop. Install Hindi as a preferred language.
          After that, press <strong>Windows + Space</strong> to switch to the Hindi keyboard,
          but only switch when Hindi typing is required for the test.
        </div>
        <Button className="button-submit-typing" onClick={messageSubmit}>
          Submit
        </Button>
      </div>



      <div id="footer">Version : 17.07.00</div>
    </>
  );
};

export default TypingModule;
