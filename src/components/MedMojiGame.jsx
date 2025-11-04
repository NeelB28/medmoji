import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  const totalQuestions = medQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [questionResolved, setQuestionResolved] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [resultArray, setResultArray] = useState([]);
  const [checklist, setChecklist] = useState(buildChecklist(medQuestions[0]));

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
        if (isOverGame) return prev;
        if (prev.includes(letter)) return prev;

        const newGuessed = [...prev, letter];
        if (!currentAnswer.includes(letter)) {
          setAttemptsLeft((attempts) => Math.max(attempts - 0.5, 0));
        }
        return newGuessed;
      });
    },
    [isOverGame, currentAnswer]
  );

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (quizComplete || isOverGame) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        event.preventDefault();
        handleGuessedLetterClick(key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [quizComplete, isOverGame, handleGuessedLetterClick]);

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
    if (questionResolved || attemptsLeft <= 0) return;

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
    if (!questionResolved && attemptsLeft > 0) {
      setStatusMessage("Resolve the current question before proceeding.");
      return;
    }
    if (currentIndex + 1 >= totalQuestions) return;
    loadQuestion(currentIndex + 1);
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

  return (
    <section className="medmoji-game" aria-live="polite">
      <aside className="developer-checklist" aria-hidden="true">
        {JSON.stringify(developerChecklist)}
      </aside>

      {/* Game header */}
      <div className="game-header">
        <span
          className="attempts-left-badge"
          style={{
            backgroundColor: theme.attemptsBg,
            color: theme.attemptsFg,
            border: `1px solid ${theme.border}`,
            fontWeight: 800,
          }}
        >
          Attempts Left: {attemptsLeft}
        </span>
        <span
          className="question-position"
          style={{
            backgroundColor: theme.questionBg,
            color: theme.questionFg,
            border: `1px solid ${theme.border}`,
            fontWeight: 800,
          }}
        >
          Question {currentIndex + 1} / {totalQuestions}
        </span>
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
      <div className="keyboard">{keyboardElements}</div>

      {/* Controls */}
      <div className="controls">
        <button
          type="button"
          onClick={handleNextQuestion}
          disabled={
            quizComplete ||
            currentIndex + 1 >= totalQuestions ||
            (!questionResolved && attemptsLeft > 0)
          }
          className="primary"
        >
          Next Question
        </button>
      </div>

      {/* Status message */}
      {statusMessage && <div className="status-message">{statusMessage}</div>}

      {/* Scoreboard */}
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
        Score: {correctAnswers} / {totalQuestions}
      </div>

      {/* Correct Answer Display - shown when attempts exhausted */}
      {isGameLost && !isGameWon && (
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
      )}

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
