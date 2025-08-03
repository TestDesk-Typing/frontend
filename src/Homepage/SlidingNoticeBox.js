import React, { useEffect, useRef, useState } from "react";
import "./SlidingNoticeBox.css";

const SlidingNoticeBox = () => {
  const noticeBoxRef = useRef(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getNoticeBox`);
        const data = await response.json();
        setNotice(data);
      } catch (error) {
        console.error("Failed to fetch notice box:", error);
      }
    };

    fetchNotice();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (noticeBoxRef.current) {
        noticeBoxRef.current.style.display = window.scrollY > 100 ? "none" : "block";
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!notice || !notice.imageUrl) return null;

  return (
    <div ref={noticeBoxRef} className="notice-box">
      <a href={notice.linkUrl || "/"} className="notice-box-link">
        <img
          src={`${process.env.REACT_APP_API_URL}/${notice.imageUrl}`}
          alt="Notice Preview"
          className="notice-box-image"
        />
        <span className="notice-box-text">
          {notice.displayText || "Check this out!"}
        </span>
      </a>
    </div>
  );
};

export default SlidingNoticeBox;