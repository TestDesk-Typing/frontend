


import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddTypingParagraph.css';
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
} from '@mui/material';
import './AddTypingParagraph.css';

const AddTypingParagraph = () => {
  const examData = {
    SSC: {
      examNames: {
        CHSL: ['CHSL24-ENG-TYP01', 'CHSL25-ENG-TYP01'],
        CGL: ['CGL24-ENG-TYP01', 'CGL25-ENG-TYP01'],
      },
    },
    DSSSB: {
      examNames: {
        'JSA-LDC-PA-JJA English': ['DSSSB-ENG-01', 'DSSSB-ENG-02-2025'],
        'JSA-LDC-PA-JJA Hindi': ['DSSSB-HIN-01', 'DSSSB-HIN-02-2025'],
      },
    },
    RRB: {
      examNames: {
        'NTPC Hindi': ['RRB-TYPING-HIN-01', 'RRB-TYPING-HIN-02-2025'],
        'NTPC English': ['RRB-TYPING-ENG-01', 'RRB-TYPING-ENG-02-2025'],
      },
    },
    'Supreme Court': {
      examNames: {
        JCA: ['SC-JCA-TYPING-01', 'SC-JCA-TYPING-02-2025'],
        SPA: ['SC-SPA-TYPING-01', 'SC-SPA-TYPING-02-2025'],
    PA: ['SC-PA-TYPING-01', 'SC-PA-TYPING-02-2025'],
    Legal: ['SC-Legal-TYPING-01', 'SC-Legal-TYPING-02-2025'],

      },
    },
    'Delhi Police': {
      examNames: {
        'DP HCM English': ['DELHI-POLICE-HCM-TYPING-ENG-01', 'DELHI-POLICE-HCM-TYPING-ENG-02-2025'],
        'DP HCM Hindi': ['DELHI-POLICE-HCM-TYPING-HIN-01', 'DELHI-POLICE-HCM-TYPING-HIN-02-2025'],
      },
    },
    'Delhi High Court': {
      examNames: {
        'SPA-PA': ['DHC-SPA-PA-01', 'DHC-SPA-PA-02-2025'],
      },
    },
    DRDO: {
      examNames: {
        'Admin Assistant English': ['DRDO-TYPING-ENG-01', 'DRDO-TYPING-ENG-02-2025'],
        'Stenographer English': ['DRDO-STENO-ENG-01', 'DRDO-STENO-ENG-02-2025'],
      },
    },
    EPFO: {
      examNames: {
        'Social Security Assistant English': ['EPFO-TYPING-ENG-01', 'EPFO-TYPING-ENG-02-2025'],
        'Stenographer English': ['EPFO-STENO-ENG-01', 'EPFO-STENO-ENG-02-2025'],
      },
    },
    BSF: {
      examNames: {
        HCM: ['BSF-TYPING-ENG-01', 'BSF-TYPING-ENG-02-2025'],
        'Stenographer English': ['BSF-STENO-ENG-01', 'BSF-STENO-ENG-02-2025'],
      },
    },
  };
  
  
  

  const [formData, setFormData] = useState({
    exam: '',
    examName: '',
    paper_code: '',
    testName: '',
    title: '',
    date: '',
    time: '',
    type: '',
    paragraph: '',
    status: '1',
  });

  const [cookies] = useCookies(['myadmin']);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleExamChange = (e) => {
    setFormData({
      ...formData,
      exam: e.target.value,
      examName: '',
      paper_code: '',
    });
  };

  const handleExamNameChange = (e) => {
    setFormData({
      ...formData,
      examName: e.target.value,
      paper_code: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = new Date(formData.date).toISOString().split('T')[0];

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/addTypingParagraph`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.myadmin}`,
      },
      body: JSON.stringify({ ...formData, date: formattedDate }),
    });

    if (response.ok) {
      toast.success('Typing paragraph added successfully');
      setFormData({
        exam: '',
        examName: '',
        paper_code: '',
        testName: '',
        title: '',
        date: '',
        time: '',
        type: '',
        paragraph: '',
        status: '1',
      });
    } else {
      toast.error('Failed to add typing paragraph');
    }
  };

  return (
    <>
      <ToastContainer />
      <h1 className="add-ebook-form">Add Typing Content</h1>
      <form className="add-ebook-form-add" onSubmit={handleSubmit}>
        <FormControl className="typing-paragraph-input" fullWidth margin="normal">
          <InputLabel id="exam-label">Exam</InputLabel>
          <Select
            labelId="exam-label"
            id="exam"
            name="exam"
            value={formData.exam}
            onChange={handleExamChange}
            required
          >
            <MenuItem value="">
              <em>Select Exam</em>
            </MenuItem>
            {Object.keys(examData).map((exam) => (
              <MenuItem key={exam} value={exam}>
                {exam}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {formData.exam && (
          <FormControl className="typing-paragraph-input" fullWidth margin="normal">
            <InputLabel id="examName-label">Exam Name</InputLabel>
            <Select
              labelId="examName-label"
              id="examName"
              name="examName"
              value={formData.examName}
              onChange={handleExamNameChange}
              required
            >
              <MenuItem value="">
                <em>Select Exam Name</em>
              </MenuItem>
              {Object.keys(examData[formData.exam]?.examNames || {}).map((examName) => (
                <MenuItem key={examName} value={examName}>
                  {examName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {formData.examName && (
          <FormControl className="typing-paragraph-input" fullWidth margin="normal">
            <InputLabel id="paper_code-label">Paper Code</InputLabel>
            <Select
              labelId="paper_code-label"
              id="paper_code"
              name="paper_code"
              value={formData.paper_code}
              onChange={handleChange}
              required
            >
              <MenuItem value="">
                <em>Select Paper Code</em>
              </MenuItem>
              {(examData[formData.exam]?.examNames[formData.examName] || []).map((code) => (
                <MenuItem key={code} value={code}>
                  {code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          fullWidth
          margin="normal"
          id="testName"
          label="Test Name"
          name="testName"
          value={formData.testName}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          id="title"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          id="date"
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          id="time"
          label="Time"
          type="number"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <FormControl className="typing-paragraph-input" fullWidth margin="normal">
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <MenuItem value="">
              <em>Select Type</em>
            </MenuItem>
            <MenuItem value="Previous">Previous</MenuItem>
            <MenuItem value="New">New</MenuItem>
          </Select>
        </FormControl>

        <textarea
  id="paragraph"
  className="typing-paragraph-textarea"
  name="paragraph" // Corrected 'name' property
  value={formData.paragraph} // Accessing 'paragraph' from formData
  onChange={handleChange} // Change handler remains same
  required
/>


        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ marginTop: 2, backgroundColor: '#6a11cb', '&:hover': { backgroundColor: '#2575fc' } }}
        >
          Add Typing Paragraph
        </Button>
      </form>
    </>
  );
};



export default AddTypingParagraph;
