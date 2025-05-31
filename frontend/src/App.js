import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import About from "./pages/About";
import Science from "./pages/Science";
import Methodology from "./pages/Methodology";
import SDGs from "./pages/SDGs";
import PlantQuiz from "./pages/plant-quiz";
import ChatPage from "./pages/ChatPage";
import Feedback from "./pages/Feedback"; // <-- Import your Feedback page

export default function App() {
  // Only show intro if it hasn't been shown before in this browser
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem("introShown"));

  // When user clicks Next, hide intro and remember in localStorage
  const handleIntroNext = () => {
    localStorage.setItem("introShown", "true");
    setShowIntro(false);
  };

  return (
    <Router>
      {showIntro ? (
        <Intro onNext={handleIntroNext} />
      ) : (
        <>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/science" element={<Science />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/sdgs" element={<SDGs />} />
            <Route path="/plant-quiz" element={<PlantQuiz />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/feedback" element={<Feedback />} /> {/* <-- Feedback route */}
          </Routes>
        </>
      )}
    </Router>
  );
}
