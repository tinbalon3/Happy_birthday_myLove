import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './FloatingBubbles.css';

const FloatingBubbles = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const createBubble = () => {
      const newBubble = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 3,
        size: 20 + Math.random() * 40
      };
      
      setBubbles(prev => [...prev, newBubble]);
      
      // Xóa bong bóng sau khi animation hoàn thành
      setTimeout(() => {
        setBubbles(prev => prev.filter(bubble => bubble.id !== newBubble.id));
      }, 7000);
    };

    const interval = setInterval(createBubble, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-bubbles">
      {bubbles.map(bubble => (
        <motion.div
          key={bubble.id}
          className="bubble"
          style={{
            left: bubble.x,
            width: bubble.size,
            height: bubble.size
          }}
          initial={{ 
            y: window.innerHeight + 50, 
            opacity: 0,
            scale: 0 
          }}
          animate={{ 
            y: -100, 
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0.8],
            x: [0, (Math.random() - 0.5) * 100]
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export default FloatingBubbles;
