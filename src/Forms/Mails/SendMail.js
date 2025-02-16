import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import { TextField, Button, Card, Typography, Box, CircularProgress } from "@mui/material";

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "white",
    borderColor: "#ccc",
    boxShadow: "none",
    "&:hover": { borderColor: "#888" },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "white",
    zIndex: 1000,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f0f0f0" : "white",
    color: "black",
  }),
};

const SendMail = () => {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [emailOptions, setEmailOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEmails = async (search = "") => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="grey.100" width="100%">
      <Card sx={{ p: 4, width: "100%", maxWidth: 800, boxShadow: 3 }}>
        <Typography variant="h5" textAlign="center" color="primary" gutterBottom>
          📧 Send Mail
        </Typography>

        <Box mb={3}>
          <Typography fontWeight="bold">To:</Typography>
          {loading ? <CircularProgress size={24} /> : (
            <Select
              isMulti
              options={emailOptions}
              value={selectedEmails}
              onChange={setSelectedEmails}
              onInputChange={setSearchTerm}
              placeholder="Search or select emails..."
              styles={customStyles}
            />
          )}
          <Box display="flex" gap={2} mt={2}>
            <TextField
              fullWidth
              type="email"
              label="Type email & press Add"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              variant="outlined"
            />
            <Button variant="outlined" onClick={handleAddEmail}>
              ➕ Add
            </Button>
          </Box>
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            variant="outlined"
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
          />
        </Box>

        <Button fullWidth variant="contained" color="primary" onClick={handleSendMail} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "🚀 Send Mail"}
        </Button>
      </Card>
    </Box>
  );
};

export default SendMail;
