import React, { useState, useEffect } from "react";
import "./App.css";
import WelcomeModal from "./components/WelcomeModal";
import BirthdayCard from "./components/BirthdayCard";
import FloatingHearts from "./components/FloatingHearts";
import FloatingBubbles from "./components/FloatingBubbles";
import BackgroundMusic from "./components/BackgroundMusic";
import MiniGame from "./components/MiniGame";

function App() {
  const [showModal, setShowModal] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [showGame, setShowGame] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
    setAudioStarted(true);
    // Hiệu ứng xuất hiện dần dần sau khi đóng modal
    setTimeout(() => {
      setShowContent(true);
    }, 500);
  };

  const handleOpenGame = () => {
    setShowGame(true);
  };

  const handleCloseGame = () => {
    setShowGame(false);
  };

  return (
    <div className="App">
      {showModal && <WelcomeModal onClose={handleModalClose} />}

      {audioStarted && <BackgroundMusic />}
      <FloatingHearts />
      <FloatingBubbles />

      <div className={`content ${showContent ? "show" : ""}`}>
        <BirthdayCard onOpenGame={handleOpenGame} />
      </div>

      {showGame && <MiniGame onClose={handleCloseGame} />}
    </div>
  );
}

export default App;
