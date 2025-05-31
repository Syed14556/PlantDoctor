import React, { useEffect, useState } from 'react';
import quizBgVideo from "../assets/quizbg.mp4";
import plantQuestions from '../data/plantQuestions.jsx';
import './quiz.css';

export default function PlantQuiz() {
  const [quiz, setQuiz] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const [initialLoading, setInitialLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const shuffled = [...plantQuestions].sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, 10);
    setTimeout(() => {
      setQuiz(picks);
      setInitialLoading(false);
    }, 1000);
  }, []);

  const correctIndex = quiz[currentQ]
    ? quiz[currentQ].options.findIndex(opt => opt === quiz[currentQ].answer)
    : -1;

  const handleOptionClick = (index) => {
    if (selected !== null || animating) return;
    setSelected(index);
    if (index === correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (animating) return;
    setFadeClass('fade-out');
    setAnimating(true);

    setTimeout(() => {
      setSelected(null);
      if (currentQ + 1 < quiz.length) {
        setCurrentQ(prev => prev + 1);
        setFadeClass('fade-in');
      } else {
        setShowResult(true);
        setFadeClass('fade-in');
      }
      setAnimating(false);
    }, 400); // matches CSS transition duration
  };

  const getEncouragement = () => {
    if (score === quiz.length) return "🌟 Perfect score! You’re a plant guru! 🌿";
    if (score >= quiz.length / 2) return "👍 Great job! Keep growing your knowledge! 🌱";
    return "🌻 Don’t give up! Every leaf counts! Try again!";
  };

  return (
    <div className="page-container">
      <div className="black-fade-overlay" />
      <video className="background-video" autoPlay loop muted playsInline>
        <source src={quizBgVideo} type="video/mp4" />
      </video>

      <div className="container">
        <div
          key={currentQ + (showResult ? '-result' : '')}
          className={`fancy-background ${fadeClass}`}
          style={{ minHeight: 320 }}
        >
          {initialLoading ? (
            <div className="loading-wrapper">
              <div className="spinner" />
              <p style={{ marginTop: 18, fontWeight: 600, color: "#388e3c" }}>
                Loading quiz...
              </p>
            </div>
          ) : !quiz.length ? (
            <div className="loading-wrapper">
              <div className="spinner" />
              <p style={{ marginTop: 18, fontWeight: 600, color: "#e53935" }}>
                Failed to load questions.
              </p>
            </div>
          ) : !showResult ? (
            <>
              <h2>🌿 Plant Quiz</h2>
              <div className="quiz-question">
                <h3>Q{currentQ + 1}: {quiz[currentQ].question}</h3>
                <div className="quiz-options">
                  {quiz[currentQ].options.map((opt, i) => {
                    let cls = "quiz-option";
                    if (selected !== null) {
                      if (i === correctIndex) cls += " correct";
                      else if (i === selected) cls += " wrong";
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(i)}
                        className={cls}
                        disabled={selected !== null || animating}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {selected !== null && (
                  <button className="quiz-next-btn" onClick={handleNext} disabled={animating}>
                    {currentQ + 1 === quiz.length ? "Finish" : "Next"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <h2>🎉 Quiz Complete!</h2>
              <p>Your Score: {score} / {quiz.length}</p>
              <p style={{ fontWeight: "bold", marginTop: 16 }}>
                {getEncouragement()}
              </p>
              <button onClick={() => {
                const reshuffled = [...plantQuestions].sort(() => Math.random() - 0.5);
                setQuiz(reshuffled.slice(0, 10));
                setCurrentQ(0);
                setSelected(null);
                setScore(0);
                setShowResult(false);
                setInitialLoading(true);
                setFadeClass('fade-in');
                setTimeout(() => setInitialLoading(false), 1000);
              }}>
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
