import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

const SendMail = () => {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [emailOptions, setEmailOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Fetch emails from the backend based on search term
  const fetchEmails = async (search = "") => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/students-for-table`, {
        params: { search }, // Pass the search term to the API
      });

      const emails = response.data.students.map((student) => ({
        value: student.email_id,
        label: student.email_id,
      }));

      setEmailOptions(emails); // Update email options
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  // Fetch emails on component mount
  useEffect(() => {
    fetchEmails();
  }, []);

  // Fetch emails on search term change (keyup in dropdown)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmails(searchTerm); // Call API with search term
    }, 300); // Add a small delay to avoid too many API calls

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout
  }, [searchTerm]);

  // Add custom email to the selected list
  const handleAddEmail = () => {
    if (customEmail && !selectedEmails.some((e) => e.value === customEmail)) {
      setSelectedEmails([...selectedEmails, { value: customEmail, label: customEmail }]);
      setCustomEmail("");
    }
  };

  // Send mail
  const handleSendMail = async () => {
    if (!selectedEmails.length || !subject || !message) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All fields are required!",
      });
      return;
    }

    const emails = selectedEmails.map((e) => e.value);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/send-mail`, {
        emails,
        subject,
        message,
      });

      Swal.fire({
        icon: "success",
        title: "Mail Sent!",
        text: "Your email was sent successfully. 🚀",
        timer: 3000,
        showConfirmButton: false,
      });

      // Clear input fields after sending mail
      setSelectedEmails([]);
      setSubject("");
      setMessage("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong while sending the email. 😢",
      });
    }
  };

  return (
    <div className="container justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-4 text-primary">📧 Send Mail</h3>

        {/* Email Multi-Select */}
        <div className="mb-3">
          <label className="form-label fw-bold">To:</label>
          <Select
            isMulti
            options={emailOptions}
            value={selectedEmails}
            onChange={setSelectedEmails}
            onInputChange={(inputValue) => setSearchTerm(inputValue)} // Capture search term
            className="border rounded"
            placeholder="Search or select emails..."
          />
          <div className="d-flex mt-2">
            <input
              type="email"
              className="form-control me-2"
              placeholder="Type email & press Add"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
            />
            <button className="btn btn-outline-secondary" onClick={handleAddEmail}>
              ➕ Add
            </button>
          </div>
        </div>

        {/* Subject Input */}
        <div className="mb-3">
          <label className="form-label fw-bold">Subject:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Message Textarea */}
        <div className="mb-3">
          <label className="form-label fw-bold">Message:</label>
          <textarea
            className="form-control"
            rows="5"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Send Button */}
        <button className="btn btn-primary w-100 fw-bold" onClick={handleSendMail}>
          🚀 Send Mail
        </button>
      </div>
    </div>
  );
};

export default SendMail;