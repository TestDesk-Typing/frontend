import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";

const SendMail = () => {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [emailOptions, setEmailOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmails = async (search = "") => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/students-for-table`, {
        params: { search },
      });
      const emails = response.data.students.map((student) => ({
        value: student.email_id,
        label: student.email_id,
      }));
      setEmailOptions(emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmails(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleAddEmail = () => {
    if (customEmail && !selectedEmails.some((e) => e.value === customEmail)) {
      setSelectedEmails([...selectedEmails, { value: customEmail, label: customEmail }]);
      setCustomEmail("");
    }
  };

  const handleSendMail = async () => {
    if (!selectedEmails.length || !subject || !message) {
      Swal.fire({ icon: "error", title: "Oops...", text: "All fields are required!" });
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/send-mail`, {
        emails: selectedEmails.map((e) => e.value),
        subject,
        message,
      });
      Swal.fire({ icon: "success", title: "Mail Sent!", text: "Your email was sent successfully. 🚀", timer: 3000, showConfirmButton: false });
      setSelectedEmails([]);
      setSubject("");
      setMessage("");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Failed!", text: "Something went wrong while sending the email. 😢" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-center text-2xl font-bold text-blue-600 mb-4">📧 Send Mail</h3>

        <div className="mb-4">
          <label className="block font-semibold">To:</label>
          <Select
            isMulti
            options={emailOptions}
            value={selectedEmails}
            onChange={setSelectedEmails}
            onInputChange={setSearchTerm}
            className="border rounded mt-2"
            placeholder="Search or select emails..."
          />
          <div className="flex mt-2 gap-2">
            <input
              type="email"
              className="border rounded w-full p-2"
              placeholder="Type email & press Add"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
            />
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded" onClick={handleAddEmail}>
              ➕ Add
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Subject:</label>
          <input
            type="text"
            className="border rounded w-full p-2"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Message:</label>
          <textarea
            className="border rounded w-full p-2 h-32"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition" onClick={handleSendMail}>
          🚀 Send Mail
        </button>
      </div>
    </div>
  );
};

export default SendMail;
