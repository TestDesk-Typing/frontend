import React, { useEffect, useRef } from "react";

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
    <div
      ref={noticeBoxRef}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#ffecb3",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        zIndex: 1000,
        display: "block", // Initially visible
      }}
    >
      <a
        href="/typing-game"
        style={{
          textDecoration: "none",
          color: "#333",
          fontWeight: "bold",
        }}
      >
        🎮 To play the typing game, click here!
      </a>
    </div>
  );
};

export default SlidingNoticeBox;
