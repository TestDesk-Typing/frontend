import React, { useEffect, useRef } from "react";
import gameplay from "../i/gameplay.gif";
import "./SlidingNoticeBox.css";

const SlidingNoticeBox = () => {
  const noticeBoxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (noticeBoxRef.current) {
        if (window.scrollY > 100) {
          noticeBoxRef.current.style.display = "none";
        } else {
          noticeBoxRef.current.style.display = "block";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={noticeBoxRef} className="notice-box">
      <a href="/user-dashboard" className="notice-box-link">
        <img 
          src={gameplay} 
          alt="Typing Game Preview" 
          className="notice-box-image"
        />
        <span className="notice-box-text">
          🎮 Play the typing game!
        </span>
      </a>
    </div>
  );
};

export default SlidingNoticeBox;