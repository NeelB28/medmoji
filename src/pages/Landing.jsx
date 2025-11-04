import { Link } from "react-router-dom";
import { medmojiTheme } from "../config/medmojiTheme";

function Landing() {
  return (
    <main style={{ width: "100%", padding: 20 }}>
      <section
        style={{
          width: "100%",
          maxWidth: 960,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
        }}
      >
        <header
          style={{
            width: "100%",
            maxWidth: 960,
            background: medmojiTheme.hintBg,
            border: `1px solid ${medmojiTheme.border}`,
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: medmojiTheme.questionFg,
              letterSpacing: 0.5,
            }}
          >
            Med‍मो‍ji — Word Puzzle
          </h1>
          <p style={{ marginTop: 8, color: medmojiTheme.hintButtonFg }}>
            Decode emoji and text clues to guess the medical term. Use the
            on-screen keyboard or your physical keyboard. Hints are always
            available—use them wisely. Good luck!
          </p>
          <div
            style={{
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
              marginTop: 10,
              backgroundColor: medmojiTheme.scoreBg,
              color: medmojiTheme.questionFg,
              padding: "6px 10px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            <span role="img" aria-label="sparkles">
              ✨
            </span>
            Learn medical terms the fun way
          </div>
        </header>

        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
            maxWidth: 960,
            marginTop: 6,
          }}
        >
          <div
            style={{
              background: medmojiTheme.hintBg,
              border: `1px dashed ${medmojiTheme.border}`,
              borderRadius: 12,
              padding: 16,
              color: medmojiTheme.hintFg,
            }}
          >
            <h2
              style={{
                margin: 0,
                color: medmojiTheme.questionFg,
                fontWeight: 800,
                fontSize: "1.25rem",
                letterSpacing: 0.3,
              }}
            >
              How to play
            </h2>
            <p style={{ marginTop: 6 }}>
              Med‍मो‍ji plays a lot like Hangman, with a clinical twist. Use the
              clues (emoji or text) to figure out the medical term before your
              attempts run out.
            </p>
            <ul
              style={{
                textAlign: "left",
                marginTop: 8,
                marginBottom: 0,
                lineHeight: 1.8,
              }}
            >
              <li>Study the prompt first (emoji or a short text clue).</li>
              <li>
                Guess letters using the on-screen keyboard or your keyboard.
              </li>
              <li>
                Correct letters appear in the boxes and do not cost attempts.
              </li>
              <li>Only wrong guesses reduce your attempts—choose carefully.</li>
              <li>Toggle the Hint for guidance if you get stuck.</li>
              <li>To score, solve the full term before attempts reach zero.</li>
              <li>
                Letters only—punctuation and spaces are ignored when present.
              </li>
              <li>
                Your score updates automatically when you complete a term.
              </li>
            </ul>
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 4 }}
          >
            <Link to="/medmoji" style={{ textDecoration: "none" }}>
              <button
                className="primary"
                style={{
                  backgroundColor: medmojiTheme.scoreBg,
                  color: medmojiTheme.scoreFg,
                  padding: "12px 20px",
                  borderRadius: 12,
                  fontWeight: 800,
                  fontSize: "1rem",
                  border: `1px solid ${medmojiTheme.border}`,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.filter = "brightness(1.05)")
                }
                onMouseOut={(e) => (e.currentTarget.style.filter = "none")}
              >
                Play MedMoji
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Landing;
