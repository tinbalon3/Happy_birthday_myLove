import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import "./BackgroundMusic.css";

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audio] = useState(new Audio());

  useEffect(() => {
    // Sử dụng file nhạc từ assets
    audio.src = "/assests/musics/hpbd_songs.mp3";
    audio.loop = true;
    audio.volume = 0.4;

    // Tự động phát nhạc khi component được mount
    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Auto-play failed, user needs to interact first:", error);
        setIsPlaying(false);
      }
    };

    // Thử phát nhạc sau một chút delay
    const timer = setTimeout(playAudio, 1000);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.src = "";
    };
  }, [audio]);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((e) => console.log("Audio play failed:", e));
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      // Bật âm thanh trở lại
      audio.volume = 0.4;
      setIsMuted(false);
    } else {
      // Tắt âm thanh hoàn toàn
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  // Hàm để tắt âm thanh nền (có thể gọi từ component khác)
  const stopBackgroundMusic = () => {
    audio.pause();
    setIsPlaying(false);
  };

  // Hàm để bật âm thanh nền trở lại
  const resumeBackgroundMusic = () => {
    if (!isMuted) {
      audio.play().catch((e) => console.log("Audio play failed:", e));
      setIsPlaying(true);
    }
  };

  // Expose functions globally để component khác có thể sử dụng
  useEffect(() => {
    window.stopBackgroundMusic = stopBackgroundMusic;
    window.resumeBackgroundMusic = resumeBackgroundMusic;

    return () => {
      delete window.stopBackgroundMusic;
      delete window.resumeBackgroundMusic;
    };
  }, []);

  return (
    <div className="background-music">
      <button
        className="music-control play-pause"
        onClick={togglePlay}
        title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <button
        className="music-control mute"
        onClick={toggleMute}
        title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
      >
        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>

      <div className="music-label">🎵 Nhạc nền</div>
    </div>
  );
};

export default BackgroundMusic;
