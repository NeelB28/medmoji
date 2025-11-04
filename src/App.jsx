import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import MedMojiPage from "./pages/MedMojiPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/medmoji" element={<MedMojiPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
