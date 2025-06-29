// File: AddMock.jsx
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Swal from 'sweetalert2';
import { Button } from '@mui/material';
import axios from 'axios';
import './AddMock.css';

// ✅ Correct worker setup
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const AddMock = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [fileType, setFileType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Clear backend jobs on page load
  useEffect(() => {
    clearPreviousJobs();
  }, []);

  const clearPreviousJobs = async () => {
    try {
      await axios.post('http://localhost:5000/api/clear-jobs');
      console.log('Previous jobs cleared successfully.');
    } catch (error) {
      console.error('Error clearing previous jobs:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileType(selectedFile.type);
    setQuestions([]);
    setCurrentIndex(0);
  };

  const extractText = async () => {
    if (!file) return;

    if (fileType === 'application/pdf') {
      await sendPdfToBackend(file);
    } else {
      Swal.fire('Error', 'Please upload a PDF file only.', 'error');
    }
  };

  const sendPdfToBackend = async (pdfFile) => {
    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
      const response = await axios.post('http://localhost:5000/api/ocr/pdf', formData);
      const { extractedText } = response.data;
      processExtractedText(extractedText);
    } catch (error) {
      Swal.fire('Error', 'OCR processing failed. Please try again.', 'error');
      console.error(error);
    }
  };

  const processExtractedText = (text) => {
    const questionBlocks = text.split(/\d+\./).filter(q => q.trim() !== '');
    const extractedQuestions = questionBlocks.map((block, index) => {
      const optionRegex = /A\)(.*?)B\)(.*?)C\)(.*?)D\)(.*?)Answer:\s*([A-D])\s*Solution:\s*(.*)/;
      const match = block.match(optionRegex);
      if (match) {
        return {
          id: index + 1,
          question: block.split('A)')[0].trim(),
          options: [match[1].trim(), match[2].trim(), match[3].trim(), match[4].trim()],
          correct: ['A', 'B', 'C', 'D'].indexOf(match[5]),
          solution: match[6].trim(),
          imageReference: null,
        };
      } else {
        return null;
      }
    }).filter(q => q !== null);

    if (extractedQuestions.length > 0) {
      setQuestions(extractedQuestions);
      Swal.fire('Extraction Completed', `${extractedQuestions.length} questions extracted successfully!`, 'success');
    } else {
      Swal.fire('Error', 'No valid question patterns found in the PDF.', 'error');
    }
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="extractor-container">
      <h1>Question Extractor (Backend OCR with Auto Cleanup)</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={extractText} style={{ marginTop: '1rem' }}>
        Extract Questions
      </Button>

      {file && fileType === 'application/pdf' && (
        <div className="pdf-preview">
          <h3>PDF Preview</h3>
          <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} width={600} />
            ))}
          </Document>
        </div>
      )}

      {questions.length > 0 && (
        <div className="extracted-questions">
          <h3>Preview Question {currentIndex + 1} of {questions.length}</h3>
          <div className="question-block">
            <p><strong>Question:</strong> {questions[currentIndex].question}</p>
            <ol type="A">
              {questions[currentIndex].options.map((option, idx) => (
                <li key={idx}>{option}</li>
              ))}
            </ol>
            <p><strong>Correct Answer:</strong> {questions[currentIndex].options[questions[currentIndex].correct]}</p>
            <p><strong>Solution:</strong> {questions[currentIndex].solution}</p>
          </div>

          <div className="navigation-buttons">
            <Button variant="contained" onClick={goToPrevious} disabled={currentIndex === 0} style={{ marginRight: '10px' }}>
              Previous
            </Button>
            <Button variant="contained" onClick={goToNext} disabled={currentIndex === questions.length - 1}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMock;
