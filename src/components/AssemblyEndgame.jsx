import React, { useState } from "react";
import { languages } from "../languages";
import clsx from "clsx"; // clsx is a utility for constructing className strings conditionally
import { getFarewellText, getRandomWord } from "../utils";

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

function AssemblyEndgame() {
  // Using getRandomWord() for dynamic word, and initial revealed letters from it.
  const initialWord = getRandomWord();
  const [currentWord, setCurrentWord] = useState(initialWord);
  const [guessedLetters, setGuessedLetters] = useState(
    getInitialRevealedLetters(initialWord)
  );
  const [attemptsLeft, setAttemptsLeft] = useState(initialWord.length);

  const wrongGuessedArray = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  );

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = attemptsLeft <= 0;
  const isOverGame = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]; // start with 0 index so if 1 guessed then will fetch [0] and if 2 guessed then will fetch [1] and so on
  // so we need to check if the letter is in the guessed letters array or not
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);
  // to make sure undefined doesnt come so we need to check if the letter is not undefined

  const languageElements = languages.map((language, index) => {
    const isLanguageLost = index < wrongGuessedArray.length; // changed condition

    const clsxClassName = clsx("language-span", isLanguageLost && "lost"); // so we are using the clsx library to create a class name based on the conditions, so if the language is lost then we will add the lost class to the class name
    // so we are using the index to check if the language is lost or not, so if the index is less than the length of the wrong guessed letters array then the language is lost
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };

    return (
      <span
        key={language.name}
        className={clsxClassName} // so we are using the clsx library to create a class name based on the conditions
        // so className is used in react, now we want to add jsx to the html, but indiscriminately adding jsx to the html will not work, so we need to use the curly braces to add the jsx to the html so we are adding the language name to the class name, but we need to convert the language name to lowercase, so we use the toLowerCase method which is again a js method, so we use the $curly braces to add the js to the html inside the template literal string inside the jsx className={`language-btn ${language.name.toLowerCase()`}
        role="listitem"
        tabIndex="0"
        style={styles}
      >
        {language.name}
      </span>
    );
  });

  // letterElements tp display the letters of the current word
  const letterElements = currentWord.split("").map((letter, index) => {
    // letterOutofLetterElementsAfterSplit: letter A S S E M B L Y
    // Index: 0 1 2 3 4 5 6 7
    // letter: A S S E M B L Y
    // return <span key={index}>{letter.toUpperCase()}</span>;

    // now i want to only show the letters that are guessed correctly, so i will check if the letter is in the guessed letters array or not; we will do changes between span tag as from there only word is being displayed
    return (
      <span key={index}>
        {/* as we are inside map of currentWord array and gussedLetter is trigerred when we press the keyboard then it comes here check the mapping of letterElements */}
        {guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
      </span>
    );
  });

  // keyboardElements to display the keyboard layout
  const keyBoardAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const keyboardElements = keyBoardAlphabet.split("").map((letter) => {
    const isGuessedLetter = guessedLetters.includes(letter);
    // so guessedletters is an state var which will re-render the component when the state is updated, so everytime the map is run the current gussed letter will be present in this map too as it is the same press that triggers the state update
    // so we need to check if the letter is matching the current word letters
    const isCorrect = isGuessedLetter && currentWord.includes(letter);
    const isWrong = isGuessedLetter && !currentWord.includes(letter);
    // clsx is a utility for constructing className strings conditionally (with conditions)
    const className = clsx({
      correct: isCorrect, // so clsx help us create a class name if isCorrect is true then the class name will be correct
      wrong: isWrong, // so clsx help us create a class name if isWrong is true then the class name will be wrong
    });

    return (
      <button
        key={letter}
        className={`key-${className}`} // so we are using the clsx library to create a class name based on the conditions
        // the reason i put method with parentheses is because i want to call the function when the button is clicked and if i dont put it in the bracket then the function will be called immediately; also parameters are passed to the function so we need to use the arrow function to pass the letter to this function
        // so when we used eventHandlers/onClick in react, we need to pass the function to the onClick event, so we xs the parameter to the function, so we need to use the arrow function to pass the letter to this function
        disabled={isOverGame} // so we need to disable the button if the letter is already guessed
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter.toUpperCase()}`}
        onClick={() => handleGuessedLetterClick(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  // function to add the letter to the guessed letters array
  // this function will be called when the user clicks on a letter in the keyboard
  // so we need to pass the letter to this function the letter will be passed as an argument to this function so we need to use the arrow function to pass the letter to this function
  // function to handle the letter click
  const handleGuessedLetterClick = (letter) => {
    setGuessedLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter]
    );
    if (!currentWord.includes(letter)) {
      setAttemptsLeft((prev) => prev - 1);
    }
  };

  // function to handle the new game button click
  const handleNewGameClick = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    setGuessedLetters(getInitialRevealedLetters(newWord));
    setAttemptsLeft(newWord.length);
  };

  // so we need to check if the length of the wrong guessed letters is greater than 8 then we need to show the lose message
  const isGameOverMessage = () => {
    const messageStatus = () => {
      if (
        wrongGuessedArray.length < 8 &&
        currentWord.split("").every((letter) => guessedLetters.includes(letter))
      ) {
        return (
          <div className={classNameGameStatus}>
            <h2>You Win 🎉</h2>
            <p>
              Congratulations, you have guessed the word{" "}
              <span className="current-word">{currentWord}</span>!
            </p>
          </div>
        );
      } else if (wrongGuessedArray.length >= 8) {
        return (
          <div className={classNameGameStatus}>
            <h2>You Lose 😢</h2>
            <p>
              Sorry, you have lost the game! The word was{" "}
              <span className="current-word">{currentWord}</span>.
            </p>
          </div>
        );
      } else if (
        wrongGuessedArray.length < 8 &&
        !isGameWon &&
        !isGameLost &&
        isLastGuessIncorrect
      ) {
        return (
          <div className={classNameGameStatus}>
            <h2>
              {" "}
              {getFarewellText(languages[wrongGuessedArray.length - 1].name)}
            </h2>
          </div>
        );
      }
      return null; // Return null if no message is needed
    };
    const classNameGameStatus = clsx({
      lose: wrongGuessedArray.length >= 8 || isGameLost,
      win:
        wrongGuessedArray.length < 8 &&
        currentWord
          .split("")
          .every((letter) => guessedLetters.includes(letter)),
      farewell:
        wrongGuessedArray.length < 8 &&
        !isGameWon &&
        !isGameLost &&
        isLastGuessIncorrect,
    });
    return <div className={classNameGameStatus}>{messageStatus()}</div>;
  };

  return (
    <>
      {/* Win/Lose/Farewell message container */}
      <section className="win-message" role="status" aria-live="assertive">
        {isGameOverMessage()}
      </section>

      {/* Display dynamic Attempts Left */}
      <div className="attempts-left">Attempts Left: {attemptsLeft}</div>

      {/* Language badges container with list role */}
      <div className="language-span-container" role="list">
        {languageElements}
      </div>

      {/* Word container for typing character */}
      <div className="word-container">{letterElements}</div>

      {/* Keyboard layout */}
      <div className="keyboard">{keyboardElements}</div>

      {/* New Game Button */}
      <div className="new-game-container">
        {isOverGame && (
          <button className="new-game-button" onClick={handleNewGameClick}>
            New Game
          </button>
        )}
      </div>
    </>
  );
}

export default AssemblyEndgame;
