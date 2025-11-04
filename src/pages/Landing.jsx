import { Link } from "react-router-dom";

function Landing() {
  return (
    <main>
      <header>
        <h1>MedMoji — Brain Puzzle</h1>
        <p>
          Decode emoji and text clues to guess the medical term. Use the on-screen
          keyboard or your physical keyboard. Hints are indirect—use them wisely.
        </p>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <div style={{ maxWidth: 640, color: "#cfd8ff" }}>
          <p style={{ margin: 0 }}>How to play:</p>
          <ul style={{ textAlign: "left" }}>
            <li>Look at the prompt (emoji or text).</li>
            <li>Click typeable letters; correct letters reveal in the boxes.</li>
            <li>Attempts decrease only on wrong letters.</li>
            <li>Reveal/Hide Hint for indirect guidance.</li>
            <li>Score updates automatically when you solve a term.</li>
          </ul>
        </div>
        <Link to="/medmoji" style={{ textDecoration: "none" }}>
          <button className="primary" style={{ fontWeight: 800 }}>Play MedMoji</button>
        </Link>
      </div>
    </main>
  );
}

export default Landing;


