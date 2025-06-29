import React, { useState } from 'react';
import './MCQTest.css';

const questions = [
  {
    id: 1,
    question: "Which American general of WWII went on to become the US president?",
    options: [
      "Franklin D Roosevelt",
      "Dwight D. Eisenhower",
      "Harry S Truman",
      "Woodrow Wilson"
    ],
    correct: 1,
    solution: "Dwight D. Eisenhower was a five-star general in WWII and later became the 34th president of the USA."
  },
  {
    id: 2,
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correct: 2,
    solution: "Paris is the capital city of France."
  }
];

const Sidebar = ({ current, setCurrent, answers, marked, questions }) => {
  const total = questions.length;
  const visited = answers.reduce((a, ans) => a + (ans !== null ? 1 : 0), 0);
  const markedOnly = marked.filter(idx => answers[idx] === null).length;
  const answeredMarked = marked.filter(idx => answers[idx] !== null).length;

  return (
    <div className="sidebar">
      <div className="legend">
        <div><span className="legend-box answered"></span> Answered</div>
        <div><span className="legend-box not-answered"></span> Not Answered</div>
        <div><span className="legend-box not-visited"></span> Not Visited</div>
        <div><span className="legend-box marked"></span> Marked for Review</div>
        <div><span className="legend-box answered-marked"></span> Answered & Marked</div>
      </div>
      <h4>Section A</h4>
      <p>Choose a Question</p>
      <div className="palette">
        {questions.map((q, idx) => {
          const isAnswered = answers[idx] !== null;
          const isMarked = marked.includes(idx);
          let className = 'btn';
          if (idx === current) className += ' current';
          if (isMarked && isAnswered) className += ' answered-marked';
          else if (isMarked) className += ' marked';
          else if (isAnswered) className += ' answered';
          else className += ' not-visited';
          return (
            <button key={idx} className={className} onClick={() => setCurrent(idx)}>
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Instructions = () => (
  <div className="instructions">
    <h2>Instructions</h2>
    <ul>
      <li>Each question has one correct answer.</li>
      <li>Click "Mark for Review" to come back later.</li>
      <li>Use the sidebar to navigate between questions.</li>
      <li>Click "Submit" when you're done.</li>
    </ul>
  </div>
);

const QuestionCard = ({ question, index, answer, onAnswer, onNext, onPrev, onMark }) => (
  <div className="question-card">
    <h3>Question {index + 1}</h3>
    <p>{question.question}</p>
    <ul>
      {question.options.map((opt, i) => (
        <li key={i}>
          <label>
            <input
              type="radio"
              checked={answer === i}
              onChange={() => onAnswer(index, i)}
            />
            {opt}
          </label>
        </li>
      ))}
    </ul>
    <div className="nav-buttons">
      <button onClick={onPrev}>Previous</button>
      <button onClick={onNext}>Next</button>
      <button onClick={onMark}>Mark for Review</button>
    </div>
  </div>
);

const ResultPage = ({ questions, answers }) => {
  const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].correct ? 1 : 0), 0);

  return (
    <div className="result">
      <h2>Result Summary</h2>
      <p>Total Questions: {questions.length}</p>
      <p>Correct Answers: {score}</p>
      <h3>Solutions</h3>
      <ol>
        {questions.map((q, i) => (
          <li key={i}>
            <p><strong>Q:</strong> {q.question}</p>
            <p><strong>Your Answer:</strong> {q.options[answers[i]] || 'Not Answered'}</p>
            <p><strong>Correct Answer:</strong> {q.options[q.correct]}</p>
            <p><strong>Solution:</strong> {q.solution}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

const MCQTest = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [marked, setMarked] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="mcq-test-container">
      <Sidebar
        current={current}
        setCurrent={setCurrent}
        answers={answers}
        marked={marked}
        questions={questions}
      />
      <div className="main-content">
        {!submitted ? (
          <>
            <Instructions />
            <QuestionCard
              question={questions[current]}
              index={current}
              answer={answers[current]}
              onAnswer={handleAnswer}
              onNext={() => setCurrent((prev) => Math.min(prev + 1, questions.length - 1))}
              onPrev={() => setCurrent((prev) => Math.max(prev - 1, 0))}
              onMark={() => setMarked([...new Set([...marked, current])])}
            />
            <button className="submit-btn" onClick={handleSubmit}>Submit</button>
          </>
        ) : (
          <ResultPage questions={questions} answers={answers} />
        )}
      </div>
    </div>
  );
};

export default MCQTest;