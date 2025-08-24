import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaStar, FaTrophy, FaPlay, FaRedo } from "react-icons/fa";
import "./MiniGame.css";

const MiniGame = ({ onClose }) => {
  const [gameState, setGameState] = useState("menu"); // menu, playing, gameOver
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hearts, setHearts] = useState([]);
  const [level, setLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(30);
    setLevel(1);
    setIsPaused(false);
    generateHearts();
  };

  const generateHearts = () => {
    const newHearts = [];
    const heartCount = Math.min(3 + level, 8); // Tăng số trái tim theo level

    for (let i = 0; i < heartCount; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 200) + 100,
        found: false,
        size: 40 + Math.random() * 20,
        delay: Math.random() * 2,
      });
    }
    setHearts(newHearts);
  };

  const findHeart = (heartId) => {
    setHearts((prev) =>
      prev.map((heart) =>
        heart.id === heartId ? { ...heart, found: true } : heart
      )
    );
    setScore((prev) => prev + 10);

    // Kiểm tra nếu tìm hết trái tim
    const updatedHearts = hearts.map((heart) =>
      heart.id === heartId ? { ...heart, found: true } : heart
    );

    if (updatedHearts.every((heart) => heart.found)) {
      nextLevel();
    }
  };

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
    setTimeLeft((prev) => prev + 10); // Thêm thời gian cho level mới
    generateHearts();
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setTimeLeft(30);
    setLevel(1);
    setHearts([]);
    setIsPaused(false);
  };

  // Timer countdown
  useEffect(() => {
    if (gameState === "playing" && !isPaused && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState("gameOver");
    }
  }, [timeLeft, gameState, isPaused]);

  // Auto-generate hearts for new levels
  useEffect(() => {
    if (gameState === "playing" && hearts.length === 0) {
      generateHearts();
    }
  }, [level, gameState]);

  const renderMenu = () => (
    <motion.div
      className="game-menu"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="game-title">
        <FaHeart className="game-icon" />
        <h2>Tìm Trái Tim Ẩn</h2>
      </div>

      <div className="game-instructions">
        <p>🎯 Tìm và nhấn vào tất cả trái tim ẩn!</p>
        <p>⏰ Bạn có 30 giây để hoàn thành mỗi level</p>
        <p>⭐ Mỗi trái tim = 10 điểm</p>
        <p>🚀 Hoàn thành level để lên cấp cao hơn!</p>
      </div>

      <motion.button
        className="start-game-btn"
        onClick={startGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaPlay /> Bắt Đầu Game
      </motion.button>

      <button className="close-game-btn" onClick={onClose}>
        Quay Lại
      </button>
    </motion.div>
  );

  const renderGame = () => (
    <motion.div
      className="game-playing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="game-header">
        <div className="game-info">
          <span className="score">Điểm: {score}</span>
          <span className="level">Level: {level}</span>
          <span className="time">Thời gian: {timeLeft}s</span>
        </div>

        <div className="game-controls">
          <button
            className="pause-btn"
            onClick={pauseGame}
            title={isPaused ? "Tiếp tục" : "Tạm dừng"}
          >
            {isPaused ? <FaPlay /> : <FaRedo />}
          </button>
        </div>
      </div>

      <div className="game-area">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className={`hidden-heart ${heart.found ? "found" : ""}`}
            style={{
              left: heart.x,
              top: heart.y,
              width: heart.size,
              height: heart.size,
            }}
            initial={{
              opacity: 0,
              scale: 0,
              rotate: -180,
            }}
            animate={{
              opacity: heart.found ? 0.3 : 1,
              scale: heart.found ? 0.5 : 1,
              rotate: heart.found ? 0 : [0, 10, -10, 0],
            }}
            transition={{
              duration: 0.5,
              delay: heart.delay,
              rotate: {
                duration: 2,
                repeat: heart.found ? 0 : Infinity,
                ease: "easeInOut",
              },
            }}
            onClick={() => !heart.found && findHeart(heart.id)}
          >
            <FaHeart />
          </motion.div>
        ))}
      </div>

      {isPaused && (
        <div className="pause-overlay">
          <div className="pause-message">
            <h3>⏸️ Game đã tạm dừng</h3>
            <p>Nhấn nút để tiếp tục</p>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderGameOver = () => (
    <motion.div
      className="game-over"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="game-over-content">
        <FaTrophy className="trophy-icon" />
        <h2>Game Over!</h2>

        <div className="final-stats">
          <p>
            🎯 Điểm cuối: <span className="final-score">{score}</span>
          </p>
          <p>
            🚀 Level đạt được: <span className="final-level">{level}</span>
          </p>
        </div>

        <div className="game-over-buttons">
          <motion.button
            className="play-again-btn"
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRedo /> Chơi Lại
          </motion.button>

          <button className="back-to-menu-btn" onClick={resetGame}>
            Về Menu
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="mini-game-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="mini-game-container"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {gameState === "menu" && renderMenu()}
        {gameState === "playing" && renderGame()}
        {gameState === "gameOver" && renderGameOver()}
      </motion.div>
    </motion.div>
  );
};

export default MiniGame;
