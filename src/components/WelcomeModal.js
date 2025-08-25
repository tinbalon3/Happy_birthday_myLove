import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaBirthdayCake, FaPlay } from "react-icons/fa";
import "./WelcomeModal.css";

const WelcomeModal = ({ onClose }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = [
    "/assests/images/pic1.jpg",
    "/assests/images/pic2.jpg",
    "/assests/images/pic3.jpg",
    "/assests/images/pic4.jpg",
    "/assests/images/pic5.jpg",
    "/assests/images/pic6.jpg",
    "/assests/images/pic7.jpg",
    "/assests/images/pic8.jpg",
    "/assests/images/pic_final.jpg",
  ];

  const handleImageChange = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="welcome-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="welcome-modal"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="modal-header">
            <motion.div
              className="birthday-icon"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <FaBirthdayCake />
            </motion.div>
            <h1 className="modal-title">🎉 Chúc Mừng Sinh Nhật! 🎂</h1>
            <p className="modal-subtitle">Em yêu của anh</p>
          </div>

          <div className="modal-content">
            <div className="image-slider">
              <motion.img
                key={currentImage}
                src={images[currentImage]}
                alt="Birthday Celebration"
                className="celebration-image"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />

              <div className="image-dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentImage ? "active" : ""}`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>

              <button
                className="next-image-btn"
                onClick={handleImageChange}
                title="Hình tiếp theo"
              >
                →
              </button>
            </div>

            <div className="welcome-message">
              <motion.div
                className="heart-icon"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaHeart />
              </motion.div>

              <p className="message-text">
                Chào mừng em đến với website chúc mừng sinh nhật đặc biệt! Hãy
                nhấn vào nút bên dưới để bắt đầu hành trình đầy yêu thương này
                nhé! 💝
              </p>
            </div>
          </div>

          <motion.button
            className="start-button"
            onClick={onClose}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay />
            <span>Bắt Đầu Hành Trình Yêu Thương</span>
            {isHovered && (
              <motion.div
                className="button-hearts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                ❤️ 💖 💝
              </motion.div>
            )}
          </motion.button>

          <div className="modal-footer">
            <p className="footer-text">
              Với tất cả tình yêu từ trái tim anh ❤️
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeModal;
