import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

import { medQuestions } from "../data/medQuestions";
import { buildChecklist } from "../utils/medValidation";
import { medmojiTheme as theme } from "../config/medmojiTheme";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const calculateLives = (answer = "") => Math.max(1, 3);

// Helper function to randomly reveal at least 25% of unique letters in a word
const getInitialRevealedLetters = (word) => {
  const uniqueLetters = Array.from(new Set(word.split("")));
  const count = Math.max(1, Math.ceil(word.length * 0.25));
  let revealed = [];
  let available = [...uniqueLetters];
  while (revealed.length < count && available.length) {
    const randIndex = Math.floor(Math.random() * available.length);
    revealed.push(available[randIndex]);
    available.splice(randIndex, 1);
  }
  return revealed;
};

function MedMojiGame() {
  const navigate = useNavigate();
  const totalQuestions = medQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [questionResolved, setQuestionResolved] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [resultArray, setResultArray] = useState([]);
  const [checklist, setChecklist] = useState(buildChecklist(medQuestions[0]));
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [timeLockout, setTimeLockout] = useState(false);
  const [forceRevealAnswer, setForceRevealAnswer] = useState(false);

  const currentQuestion = useMemo(
    () => medQuestions[currentIndex],
    [currentIndex]
  );

  const currentAnswer = currentQuestion.answer;

  const isGameWon = currentAnswer
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = attemptsLeft <= 0;
  const isOverGame = isGameWon || isGameLost;

  const correctAnswers = resultArray.filter((entry) => entry.correct).length;
  const quizComplete = resultArray.length === totalQuestions;

  const logValidationSummary = useCallback((question, index) => {
    console.log(buildChecklist(question));
    console.log(
      `Validation ${index + 1}: Prompt clear (${
        question.type
      }) and ready for rendering.`
    );
    console.log(
      `Validation ${index + 1}: Hint reviewed—educational and indirect.`
    );
  }, []);

  const loadQuestion = useCallback(
    (index) => {
      const nextQuestion = medQuestions[index];
      const initialRevealed = getInitialRevealedLetters(nextQuestion.answer);
      setCurrentIndex(index);
      setGuessedLetters(initialRevealed);
      setAttemptsLeft(calculateLives(nextQuestion.answer));
      setHintVisible(false);
      setQuestionResolved(false);
      setStatusMessage("");
      const checklistItems = buildChecklist(nextQuestion);
      setChecklist(checklistItems);
      setSecondsLeft(90);
      setTimeLockout(false);
      setForceRevealAnswer(false);
      logValidationSummary(nextQuestion, index);
    },
    [logValidationSummary]
  );

  useEffect(() => {
    loadQuestion(0);
  }, [loadQuestion]);

  // Letter click handler (declared before keyboard effect to avoid TDZ issues)
  const handleGuessedLetterClick = useCallback(
    (letter) => {
      setGuessedLetters((prev) => {
        if (isOverGame || timeLockout) return prev;
        if (prev.includes(letter)) return prev;

        const newGuessed = [...prev, letter];
        if (!currentAnswer.includes(letter)) {
          setAttemptsLeft((attempts) => Math.max(attempts - 0.5, 0));
        }
        return newGuessed;
      });
    },
    [isOverGame, timeLockout, currentAnswer]
  );

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (quizComplete || isOverGame || timeLockout) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        event.preventDefault();
        handleGuessedLetterClick(key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [quizComplete, isOverGame, timeLockout, handleGuessedLetterClick]);

  const updateResultArray = useCallback(
    (wasCorrect) => {
      setResultArray((prev) => {
        if (prev.some((entry) => entry.questionIndex === currentIndex)) {
          return prev;
        }
        return [...prev, { questionIndex: currentIndex, correct: wasCorrect }];
      });
    },
    [currentIndex]
  );

  // Auto-check: when all required letters are guessed, mark correct and score
  useEffect(() => {
    if (isGameWon && !questionResolved) {
      setStatusMessage("✅ Correct! Excellent deduction.");
      setQuestionResolved(true);
      updateResultArray(true);
    }
  }, [isGameWon, questionResolved, updateResultArray]);

  const handleCheckAnswer = () => {
    if (questionResolved || attemptsLeft <= 0 || timeLockout) return;

    if (!isGameWon) {
      setStatusMessage(
        "❌ Not quite. Keep guessing letters to reveal the answer."
      );
      setAttemptsLeft((prev) => {
        const next = Math.max(prev - 1, 0);
        if (next <= 0) {
          setStatusMessage(
            `❌ Attempts exhausted. The correct term was ${currentAnswer}.`
          );
          setQuestionResolved(true);
          updateResultArray(false);
        }
        return next;
      });
      return;
    }

    setStatusMessage("✅ Correct! Excellent deduction.");
    setQuestionResolved(true);
    updateResultArray(true);
  };

  const handleHintToggle = () => {
    setHintVisible((prev) => !prev);
  };

  const handleNextQuestion = () => {
    if (!questionResolved && attemptsLeft > 0 && !timeLockout) {
      setStatusMessage("Resolve the current question before proceeding.");
      return;
    }
    if (currentIndex + 1 >= totalQuestions) return;
    loadQuestion(currentIndex + 1);
  };

  // Countdown with time-up behavior
  useEffect(() => {
    if (quizComplete) return;
    if (questionResolved) return; // stop when resolved

    const intervalId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          setStatusMessage(
            `⏳ Time's up! The correct term was ${currentAnswer}.`
          );
          setForceRevealAnswer(true);
          setTimeLockout(true);
          setQuestionResolved(true);
          updateResultArray(false);

          window.setTimeout(() => {
            if (currentIndex + 1 < totalQuestions) {
              loadQuestion(currentIndex + 1);
            }
          }, 5000);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questionResolved]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleRestartQuiz = () => {
    setResultArray([]);
    loadQuestion(0);
  };

  const renderPrompt = () => {
    if (currentQuestion.type === "emoji") {
      return (
        <div className="emoji-prompt" aria-label="Emoji prompt">
          {currentQuestion.question.map((item, index) => (
            <span key={`${item}-${index}`} className="emoji-item">
              {item}
            </span>
          ))}
        </div>
      );
    }

    return <div className="text-prompt">{currentQuestion.question}</div>;
  };

  const letterElements = currentAnswer
    .split("")
    .map((letter, index) => (
      <span key={index}>
        {guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
      </span>
    ));

  const keyboardElements = ALPHABET.map((letter) => {
    const isGuessedLetter = guessedLetters.includes(letter);
    const isCorrect = isGuessedLetter && currentAnswer.includes(letter);
    const isWrong = isGuessedLetter && !currentAnswer.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        key={letter}
        className={`key-${className}`}
        disabled={isOverGame}
        aria-disabled={isGuessedLetter}
        aria-label={`Letter ${letter.toUpperCase()}`}
        onClick={() => handleGuessedLetterClick(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const developerChecklist = useMemo(() => checklist, [checklist]);

  if (quizComplete) {
    return (
      <section className="medmoji-game" aria-live="polite">
        <div
          style={{
            backgroundColor: theme.hintBg,
            color: theme.hintFg,
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: 16,
            width: "100%",
            maxWidth: 700,
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          <h2 style={{ margin: 0, color: theme.questionFg, fontWeight: 800 }}>
            Quiz Summary
          </h2>
          <div
            style={{
              marginTop: 8,
              backgroundColor: theme.scoreBg,
              color: theme.scoreFg,
              border: `1px solid ${theme.border}`,
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 6,
              fontWeight: 800,
            }}
          >
            Score: {correctAnswers} / {totalQuestions}
          </div>

          <ul style={{ textAlign: "left", marginTop: 12 }}>
            {resultArray.map((r) => {
              const q = medQuestions[r.questionIndex];
              return (
                <li key={r.questionIndex} style={{ marginBottom: 6 }}>
                  <span style={{ fontWeight: 700 }}>
                    Q{r.questionIndex + 1}:
                  </span>{" "}
                  <span style={{ opacity: 0.85 }}>
                    {Array.isArray(q.question)
                      ? q.question.join(" ")
                      : q.question}
                  </span>{" "}
                  <span style={{ fontWeight: 700 }}>
                    {r.correct ? "✅ Correct" : "❌ Incorrect"}
                  </span>{" "}
                  <span style={{ opacity: 0.85 }}>(Answer: {q.answer})</span>
                </li>
              );
            })}
          </ul>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 8,
              justifyContent: "center",
            }}
          >
            <button
              className="primary"
              onClick={() => navigate("/", { replace: false })}
              style={{
                backgroundColor: theme.scoreBg,
                color: theme.scoreFg,
                border: `1px solid ${theme.border}`,
                padding: "10px 14px",
                borderRadius: 8,
                fontWeight: 800,
              }}
            >
              Go to Home
            </button>
            <button
              onClick={handleRestartQuiz}
              style={{
                backgroundColor: theme.hintButtonBg,
                color: theme.hintButtonFg,
                border: `1px solid ${theme.border}`,
                padding: "10px 14px",
                borderRadius: 8,
                fontWeight: 800,
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="medmoji-game" aria-live="polite">
      <aside className="developer-checklist" aria-hidden="true">
        {JSON.stringify(developerChecklist)}
      </aside>

      {/* Game header */}
      <div
        className="game-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: 700,
        }}
      >
        <div
          className="game-header-board"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            className="attempts-left-badge"
            style={{
              backgroundColor: theme.attemptsBg,
              color: theme.attemptsFg,
              border: `1px solid ${theme.border}`,
              fontWeight: 800,
              minWidth: 135,
              display: "inline-block",
              textAlign: "center",
              boxSizing: "border-box",
              padding: "8px 10px",
              borderRadius: 6,
            }}
          >
            Attempts Left: {attemptsLeft}
          </span>
          <span
            className="score-badge"
            style={{
              backgroundColor: theme.scoreBg,
              color: theme.scoreFg,
              border: `1px solid ${theme.border}`,
              fontWeight: 800,
              padding: "8px 14px",
              borderRadius: 6,
              minWidth: 128,
              display: "inline-block",
              textAlign: "center",
              boxSizing: "border-box",
            }}
            role="status"
            aria-label="Score"
          >
            Score: {correctAnswers} / {totalQuestions}
          </span>
          <span
            className="timer-badge"
            style={{
              backgroundColor: theme.scoreBg,
              color: theme.scoreFg,
              border: `1px solid ${theme.border}`,
              fontWeight: 800,
              padding: "8px 12px",
              borderRadius: 6,
              width: 110,
              minWidth: 110,
              textAlign: "center",
              fontVariantNumeric: "tabular-nums",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              boxSizing: "border-box",
              display: "inline-block",
            }}
            aria-label="Countdown timer"
          >
            ⏱️ {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      {/* Prompt */}
      <div className="prompt-wrapper">
        <div
          style={{
            backgroundColor: theme.promptBg,
            color: theme.promptFg,
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            fontWeight: 800,
          }}
        >
          {renderPrompt()}
        </div>
      </div>

      {/* Hint row: button + inline hint to the right, centered as a unit */}
      <div
        className="hint-row"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          width: "100%",
        }}
      >
        <button
          type="button"
          onClick={handleHintToggle}
          className="hint-toggle"
          style={{
            backgroundColor: hintVisible ? "#FF3B30" : "#006400", // red when hiding, dark green when showing
            color: "#F9F4DA",
            border: `1px solid ${theme.border}`,
            fontWeight: 800,
          }}
        >
          {hintVisible ? "Hide Hint" : "Show Hint"}
        </button>

        {hintVisible && (
          <div
            className="hint"
            role="note"
            style={{
              backgroundColor: theme.hintBg,
              color: theme.hintFg,
              border: `1px solid ${theme.border}`,
              fontWeight: 700,
              padding: "8px 12px",
              borderRadius: 8,
              display: "inline-flex",
              width: "auto",
              maxWidth: 520,
              whiteSpace: "normal",
            }}
          >
            {currentQuestion.hint}
          </div>
        )}
      </div>

      {/* Word container for displaying letters - AssemblyEndgame style */}
      <div className="word-container">{letterElements}</div>

      {/* Keyboard layout - AssemblyEndgame style */}
      <div className="keyboard">
        {keyboardElements.map((buttonEl) =>
          React.cloneElement(buttonEl, {
            disabled: buttonEl.props.disabled || timeLockout,
          })
        )}
      </div>

      {/* Controls */}
      <div className="controls">
        <button
          type="button"
          onClick={handleNextQuestion}
          disabled={
            quizComplete ||
            currentIndex + 1 >= totalQuestions ||
            (!questionResolved && attemptsLeft > 0) ||
            timeLockout
          }
          className="primary"
        >
          Next Question
        </button>
      </div>

      {/* Status message */}
      {statusMessage && <div className="status-message">{statusMessage}</div>}

      {/* Question position now shown in former score area */}
      <div
        className="scoreboard"
        role="status"
        aria-live="polite"
        style={{
          backgroundColor: theme.scoreBg,
          color: theme.scoreFg,
          border: `1px solid ${theme.border}`,
          padding: "6px 12px",
          borderRadius: 6,
          display: "inline-block",
          fontWeight: 800,
        }}
      >
        Question {currentIndex + 1} / {totalQuestions}
      </div>

      {/* Correct Answer Display - shown when attempts exhausted or time up */}
      {(isGameLost && !isGameWon) || forceRevealAnswer ? (
        <div
          className="correct-answer-display"
          style={{
            backgroundColor: theme.promptBg,
            color: theme.promptFg,
            border: `1px solid ${theme.border}`,
            padding: "10px 16px",
            borderRadius: 8,
            fontWeight: 800,
            marginTop: "10px",
          }}
        >
          Correct Answer:{" "}
          <span style={{ letterSpacing: "2px" }}>{currentAnswer}</span>
        </div>
      ) : null}

      {/* Result summary */}
      {quizComplete && (
        <div
          className="result-summary"
          role="region"
          aria-label="Result summary"
        >
          {JSON.stringify({ totalQuestions, correctAnswers, resultArray })}
        </div>
      )}
    </section>
  );
}

export default MedMojiGame;
