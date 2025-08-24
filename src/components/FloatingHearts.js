import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import './FloatingHearts.css';

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const createHeart = () => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        size: 0.5 + Math.random() * 1
      };
      
      setHearts(prev => [...prev, newHeart]);
      
      // Xóa trái tim sau khi animation hoàn thành
      setTimeout(() => {
        setHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
      }, 5000);
    };

    const interval = setInterval(createHeart, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-hearts">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="floating-heart"
          style={{
            left: heart.x,
            fontSize: `${heart.size}rem`
          }}
          initial={{ 
            y: -50, 
            opacity: 0,
            scale: 0 
          }}
          animate={{ 
            y: window.innerHeight + 100, 
            opacity: [0, 1, 0],
            scale: [0, 1, 0.8],
            rotate: [0, 360]
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            ease: "easeInOut"
          }}
        >
          <FaHeart />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
