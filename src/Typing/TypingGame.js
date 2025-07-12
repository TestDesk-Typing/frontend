import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { generate } from 'random-words';
import './TypingGame.css';
import { useCookies } from 'react-cookie';
import Swal from 'sweetalert2';

const Explosion = ({ position }) => (
  <div
    className="explosion"
    style={{ left: `${position.x}%`, top: `${position.y}vh` }}
  >
    {[...Array(8)].map((_, i) => (
      <div key={i} className={`particle particle-${i}`} />
    ))}
  </div>
);

const TypingGame = () => {
  const [fallingWords, setFallingWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [accuracy, setAccuracy] = useState({ hits: 0, misses: 0 });
  const [explosions, setExplosions] = useState([]);
  const [feedback, setFeedback] = useState({ show: false, text: '' });
  const [difficulty, setDifficulty] = useState('easy');
  const [showModal, setShowModal] = useState(false);
  const [cookies] = useCookies(['session_id']);
  const [userAccess, setUserAccess] = useState(false);

  const wordId = useRef(0);
  const explosionId = useRef(0);
  const inputRef = useRef(null);

  const generateWord = () => {
    let word;
    let maxLength;

    switch (difficulty) {
      case 'easy':
        maxLength = 4;
        break;
      case 'medium':
        maxLength = 6;
        break;
      case 'hard':
        maxLength = 10;
        break;
      default:
        maxLength = 4;
    }

    do {
      word = generate();
    } while (word.length > maxLength);

    return word;
  };

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/code-234`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${cookies.session_id}`,
          },
          body: JSON.stringify({ product_id: '999' })
        });

        const data = await response.json();
        console.log("Access check result:", data);

        if (data.access === "access") {
          setUserAccess(true);
        } else {
          setUserAccess(false)
          Swal.fire({
            title: 'Access Denied',
            text: 'You need to purchase a plan to access this feature.',
            icon: 'error',
            confirmButtonText: 'Buy Plan',
            showCloseButton: true
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/ssc-typing-test/buy-now';
            } else if (result.dismiss === Swal.DismissReason.close) {
              console.log('Quill should be closed now.');
            }
          });
        }
      } catch (error) {
        setUserAccess(false)
      }
    };

    if (cookies.session_id) {
      checkAccess();
    }
  }, [cookies.session_id]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      const newWord = {
        id: wordId.current++,
        text: generateWord(),
        x: Math.random() * 80,
        y: 0,
        speed: 1
      };

      setFallingWords(prev => [...prev, newWord]);
    }, 1500);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver, difficulty]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setFallingWords(prev =>
        prev.map(word => ({ ...word, y: word.y + word.speed }))
          .filter(word => word.y < 90)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    const missed = fallingWords.filter(word => word.y >= 85);
    if (missed.length > 0) {
      setAccuracy(prev => ({ ...prev, misses: prev.misses + missed.length }));
      setGameOver(true);
      setGameStarted(false);
      setShowModal(true);
    }
  }, [fallingWords]);

  const handleCorrectWord = (word) => {
    setExplosions(prev => [
      ...prev,
      { id: explosionId.current++, position: { x: word.x, y: word.y }, createdAt: Date.now() }
    ]);

    const basePoints = 5 + word.text.length * 2;
    const comboBonus = Math.floor(combo / 3);
    const totalPoints = basePoints + comboBonus;

    setScore(prev => prev + totalPoints);
    setCombo(prev => prev + 1);
    setMaxCombo(prev => Math.max(prev, combo + 1));
    setAccuracy(prev => ({ ...prev, hits: prev.hits + 1 }));

    setFeedback({ show: true, text: `+${totalPoints}` });
    setTimeout(() => setFeedback({ show: false, text: '' }), 800);

    setInputValue('');
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setInputValue(value);

    if (value.length > 0) {
      const matchedIndex = fallingWords.findIndex(word => word.text === value);
      if (matchedIndex >= 0) {
        const matchedWord = fallingWords[matchedIndex];
        setFallingWords(prev => prev.filter((_, i) => i !== matchedIndex));
        handleCorrectWord(matchedWord);
      }
    }
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setTimeout(() => {
      if (difficulty === 'easy') setDifficulty('medium');
      else if (difficulty === 'medium') setDifficulty('hard');
    }, 15000);

    return () => clearTimeout(timer);
  }, [gameStarted, gameOver, difficulty]);

  useEffect(() => {
    if (explosions.length > 0) {
      const timer = setInterval(() => {
        const now = Date.now();
        setExplosions(prev => prev.filter(exp => now - exp.createdAt < 500));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [explosions]);

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      setTimeout(() => {
        document.getElementById('typing-input').click();
        document.getElementById('typing-input').focus();
      }, 100);
    }
  }, [gameStarted]);

  const startGame = () => {
    setShowModal(false);
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setAccuracy({ hits: 0, misses: 0 });
    setFallingWords([]);
    setExplosions([]);
    setFeedback({ show: false, text: '' });
    setDifficulty('easy');
    setInputValue('');
    wordId.current = 0;
    explosionId.current = 0;

    setTimeout(() => {
      setGameStarted(true);
    }, 100);
  };

  const closeModal = () => {
    setShowModal(false);
    setGameStarted(false);
    setGameOver(false);
    setInputValue('');
  };

  const calculateAccuracy = () => {
    const total = accuracy.hits + accuracy.misses;
    return total > 0 ? Math.round((accuracy.hits / total) * 100) : 0;
  };

  const calculateTypingSpeed = () => {
    const minutes = ((accuracy.hits + accuracy.misses) * 1.5) / 60;
    return minutes > 0 ? Math.round((accuracy.hits / minutes)) : 0;
  };

  return (
    <div className="game-container" style={{ height: '100vh' }}>
      {userAccess ? (
        <>
          {!gameStarted ? (
            <div className="start-screen">
              <h1>Typing Master</h1>
              <Button variant="success" size="lg" onClick={startGame}>
                Start Game
              </Button>
            </div>
          ) : (
            <>
              <div className="game-header">
                <div>Score: {score}</div>
                <div>Combo: {combo}x (Max: {maxCombo}x)</div>
                <div>Accuracy: {calculateAccuracy()}%</div>
                <div>Level: {difficulty}</div>
              </div>

              {fallingWords.map(word => (
                <div
                  key={word.id}
                  className={`falling-word ${word.y > 70 ? 'danger' : ''}`}
                  style={{ left: `${word.x}%`, top: `${word.y}vh` }}
                >
                  {word.text}
                </div>
              ))}

              {explosions.map(exp => (
                <Explosion key={exp.id} position={exp.position} />
              ))}

              {feedback.show && (
                <div className="success-feedback">{feedback.text}</div>
              )}

              <input
                id="typing-input"
                ref={inputRef}
                type="text"
                className="typing-input"
                value={inputValue}
                onChange={handleInputChange}
                disabled={gameOver}
                autoFocus
              />
            </>
          )}

          <Modal show={showModal} centered>
            <Modal.Header>
              <Modal.Title>Game Over</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Final Score: {score}</div>
              <div>Typing Speed: {calculateTypingSpeed()} WPM</div>
              <div>Max Combo: {maxCombo}x</div>
              <div>Accuracy: {calculateAccuracy()}%</div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={startGame}>
                Play Again
              </Button>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : <div className="start-screen">
        <h1>Purchase a Plan To Play Game</h1>
      </div>}
    </div>
  );
};

export default TypingGame;
