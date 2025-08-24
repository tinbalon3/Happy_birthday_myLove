import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaBirthdayCake,
  FaStar,
  FaGift,
  FaPlay,
  FaPause,
  FaGamepad,
} from "react-icons/fa";
import "./BirthdayCard.css";

const BirthdayCard = ({ onOpenGame }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const messages = [
    "Chúc mừng sinh nhật em yêu! 🎉",
    "Em là món quà tuyệt vời nhất mà anh từng có 💝",
    "Mỗi ngày bên em là một ngày hạnh phúc ✨",
    "Chúc em luôn xinh đẹp, vui vẻ và thành công 🌟",
    "Anh yêu em rất nhiều! Happy Birthday! 🥰",
  ];

  const handleClick = () => {
    if (!showMessage) {
      setShowMessage(true);
    } else {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }
  };

  const handleVideoToggle = () => {
    if (!showVideo) {
      // Khi mở video, tắt âm thanh nền
      if (window.stopBackgroundMusic) {
        window.stopBackgroundMusic();
      }
      setShowVideo(true);
      setIsVideoPlaying(true);
    } else {
      // Khi đóng video, bật âm thanh nền trở lại
      if (window.resumeBackgroundMusic) {
        window.resumeBackgroundMusic();
      }
      setShowVideo(false);
      setIsVideoPlaying(false);
    }
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    // Khi video kết thúc, bật âm thanh nền trở lại
    if (window.resumeBackgroundMusic) {
      window.resumeBackgroundMusic();
    }
  };

  return (
    <motion.div
      className="birthday-card"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 1, type: "spring" }}
    >
      <div className="card-header">
        <motion.div
          className="birthday-icon"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <FaBirthdayCake />
        </motion.div>
        <h1 className="title">Happy Birthday!</h1>
        <p className="date">26/8</p>
      </div>

      <div className="card-body">
        <motion.div
          className="heart-container"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaHeart className="main-heart" />
        </motion.div>

        <div className="media-section">
          <div className="image-gallery">
            <motion.img
              src="/assests/images/pic1.jpg"
              alt="Birthday Celebration 1"
              className="gallery-image"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.img
              src="/assests/images/pic2.jpg"
              alt="Birthday Celebration 2"
              className="gallery-image"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.img
              src="/assests/images/pic3.jpg"
              alt="Birthday Celebration 3"
              className="gallery-image"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.img
              src="/assests/images/pic4.jpg"
              alt="Birthday Celebration 4"
              className="gallery-image"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.img
              src="/assests/images/pic5.jpg"
              alt="Birthday Celebration 5"
              className="gallery-image"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="action-buttons">
            <motion.button
              className="video-button"
              onClick={handleVideoToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showVideo ? <FaPause /> : <FaPlay />}
              <span>{showVideo ? "Ẩn Video" : "Xem Video Đặc Biệt"}</span>
            </motion.button>

            <motion.button
              className="game-button"
              onClick={onOpenGame}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGamepad />
              <span>Chơi Game Đặc Biệt</span>
            </motion.button>
          </div>

          {showVideo && (
            <motion.div
              className="video-container"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <video
                src="/assests/videos/video.mp4"
                controls
                autoPlay={isVideoPlaying}
                onEnded={handleVideoEnded}
                className="birthday-video"
                poster="/assests/images/pic_final.jpg"
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </motion.div>
          )}
        </div>

        <div className="message-section">
          {!showMessage ? (
            <motion.button
              className="open-button"
              onClick={handleClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGift /> Nhấn để mở quà
            </motion.button>
          ) : (
            <motion.div
              className="birthday-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentMessage}
            >
              <p>{messages[currentMessage]}</p>
              <motion.button
                className="next-button"
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaStar /> Tiếp theo
              </motion.button>
            </motion.div>
          )}
        </div>

        <div className="decorations">
          <motion.div
            className="star star1"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <FaStar />
          </motion.div>
          <motion.div
            className="star star2"
            animate={{ rotate: -360, scale: [1, 0.8, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <FaStar />
          </motion.div>
          <motion.div
            className="star star3"
            animate={{ rotate: 360, scale: [1, 1.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <FaStar />
          </motion.div>
        </div>
      </div>

      <div className="card-footer">
        <p className="signature">Với tất cả tình yêu ❤️</p>
        <p className="from">Từ người yêu của em</p>
      </div>
    </motion.div>
  );
};

export default BirthdayCard;
