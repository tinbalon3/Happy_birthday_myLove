import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaStar, FaTrophy, FaPlay, FaPause, FaRedo } from "react-icons/fa";
import "./MiniGame.css";

const MiniGame = ({ onClose }) => {
  const [gameState, setGameState] = useState("menu"); // menu, playing, gameOver
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hearts, setHearts] = useState([]);
  const [level, setLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [showLoveModal, setShowLoveModal] = useState(false);

  const closeLoveModal = () => setShowLoveModal(false);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(30);
    setLevel(1);
    setIsPaused(false);
    generateHearts(1);
  };

  const generateHearts = (levelValue = level) => {
    const newHearts = [];
    const heartCount = Math.min(3 + levelValue, 8); // Tăng số trái tim theo level
    
    console.log(`Generating ${heartCount} hearts for level ${levelValue}`);

    for (let i = 0; i < heartCount; i++) {
      const x = Math.random() * (window.innerWidth - 200) + 100; // Tránh viền
      const y = Math.random() * (window.innerHeight - 300) + 150; // Tránh header và footer
      
      newHearts.push({
        id: Date.now() + i, // Tạo id unique cho mỗi lần gọi
        x: x,
        y: y,
        found: false,
        size: 40 + Math.random() * 20,
        delay: Math.random() * 2,
      });
    }
    
    console.log('New hearts:', newHearts);
    setHearts(newHearts);
  };

  const findHeart = (heartId) => {
    console.log(`Finding heart with id: ${heartId}`);
    setHearts((previousHearts) => {
      const updatedHearts = previousHearts.map((heart) =>
        heart.id === heartId ? { ...heart, found: true } : heart
      );
      
      const foundCount = updatedHearts.filter(h => h.found).length;
      const totalCount = updatedHearts.length;
      console.log(`Found ${foundCount}/${totalCount} hearts`);
      
      if (updatedHearts.every((heart) => heart.found)) {
        console.log('All hearts found! Moving to next level');
        nextLevel();
      }
      return updatedHearts;
    });
    setScore((prev) => prev + 10);
  };

  const nextLevel = () => {
    setLevel((prev) => {
      const newLevel = prev + 1;
      setTimeLeft((time) => time + 10); // Thêm thời gian cho level mới
      generateHearts(newLevel);
      return newLevel;
    });
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

  const SPAWN_INTERVAL_MS = 1200; // Tạo thêm 1 trái tim mỗi ~1.2s
  const MAX_HEARTS_ON_SCREEN = 25; // Giới hạn để tránh lag

  const spawnHeart = () => {
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * (window.innerHeight - 300) + 150;
    const newHeart = {
      id: Date.now() + Math.random(),
      x,
      y,
      found: false,
      size: 40 + Math.random() * 20,
      delay: Math.random() * 2,
    };
    setHearts((prev) => {
      const next = [...prev, newHeart];
      // Nếu quá nhiều thì bỏ các tim đã tìm trước (hoặc tim đầu danh sách)
      if (next.length > MAX_HEARTS_ON_SCREEN) {
        // Ưu tiên loại bỏ các tim đã tìm rồi
        const remainingFound = next.filter((h) => h.found);
        if (remainingFound.length > 0) {
          const firstFoundId = remainingFound[0].id;
          return next.filter((h) => h.id !== firstFoundId);
        }
        // Nếu chưa có tim nào tìm được, loại bỏ tim đầu tiên để giữ số lượng ổn định
        return next.slice(1);
      }
      return next;
    });
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
      setShowLoveModal(true);
    }
  }, [timeLeft, gameState, isPaused]);

  // Auto-generate hearts for new levels
  useEffect(() => {
    if (gameState === "playing" && hearts.length === 0) {
      generateHearts(level);
    }
  }, [level, gameState, hearts.length]);

  // Spawn trái tim liên tục khi đang chơi và không tạm dừng
  useEffect(() => {
    if (gameState === "playing" && !isPaused) {
      const interval = setInterval(() => {
        spawnHeart();
      }, SPAWN_INTERVAL_MS);
      return () => clearInterval(interval);
    }
  }, [gameState, isPaused]);

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
            {isPaused ? <FaPlay /> : <FaPause />}
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

      {showLoveModal && (
        <div className="love-modal-overlay" onClick={closeLoveModal}>
          <div className="love-modal" onClick={(e) => e.stopPropagation()}>
            <div className="love-modal-heart">❤️</div>
            <h2>Anh yêu em nhiều lắm</h2>
            <button className="love-modal-button" onClick={closeLoveModal}>Đóng</button>
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
