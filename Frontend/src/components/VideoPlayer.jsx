import React, { useState, useEffect } from 'react';

const VideoPlayer = ({ streamData, onReady }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Simulate video progress
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Set duration on mount
  useEffect(() => {
    setDuration(100);
    if (onReady) {
      // Simulate video ready after 2 seconds
      setTimeout(() => {
        onReady({ currentTime: 0, duration: 100 });
      }, 2000);
    }
  }, [onReady]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(newTime);
  };

  return (
    <div className="relative w-full bg-gray-900">
      {/* Video Placeholder - Main Content */}
      <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-4 sm:mb-6 relative">
            {/* Play Icon with Anime Theme */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[16px] sm:border-l-[20px] md:border-l-[24px] border-l-[#f47521] border-t-[10px] sm:border-t-[12px] md:border-t-[14px] border-t-transparent border-b-[10px] sm:border-b-[12px] md:border-b-[14px] border-b-transparent ml-1"></div>
            </div>
            {/* Animated Ring with Anime Colors */}
            <div className="absolute inset-0 rounded-full border-4 border-[#f47521] animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border-2 border-[#f47521]/50 animate-ping"></div>
          </div>
          <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 font-['Crunchyroll_Atyp',_sans-serif]">Video Loading...</p>
          <p className="text-gray-300 text-sm sm:text-base">
            {streamData?.anilistID ? `AniList ID: ${streamData.anilistID}` : 'Select an episode to start watching'}
          </p>
        </div>
      </div>

      {/* Skip Intro/Outro Buttons - Top Right */}
      {(streamData?.intro || streamData?.outro) && (
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2 sm:gap-3 z-30">
          {streamData.intro && (
            <button className="bg-[#f47521]/90 hover:bg-[#f47521] text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold transition-all duration-300 shadow-xl rounded-lg backdrop-blur-sm border border-[#f47521]/30">
              Skip Intro
            </button>
          )}
          {streamData.outro && (
            <button className="bg-[#f47521]/90 hover:bg-[#f47521] text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold transition-all duration-300 shadow-xl rounded-lg backdrop-blur-sm border border-[#f47521]/30">
              Skip Outro
            </button>
          )}
        </div>
      )}

      {/* Video Info Overlay - Bottom Left */}
      <div className="absolute bottom-16 sm:bottom-20 left-2 sm:left-4 text-white text-xs sm:text-sm bg-black bg-opacity-50 px-2 py-1 rounded z-20">
        {streamData?.anilistID && `AniList: ${streamData.anilistID}`}
        {streamData?.malID && ` | MAL: ${streamData.malID}`}
      </div>

      {/* Video Controls - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 md:p-5 z-30">
        {/* Progress Bar */}
        <div 
          className="w-full h-2 sm:h-2.5 bg-gray-700/50 rounded-full cursor-pointer mb-3 sm:mb-4 hover:bg-gray-700/70 transition-colors"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-[#f47521] rounded-full transition-all duration-300 shadow-lg"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Play/Pause Button */}
            <button 
              onClick={handlePlayPause}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[#f47521] hover:bg-[#e66713] transition-all duration-300 shadow-xl hover:scale-105"
            >
              {isPlaying ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
                  <div className="w-0.5 h-3 sm:w-1 sm:h-4 bg-white rounded"></div>
                  <div className="w-0.5 h-3 sm:w-1 sm:h-4 bg-white rounded ml-0.5 sm:ml-1"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[6px] sm:border-l-[8px] md:border-l-[10px] border-l-white border-t-[5px] sm:border-t-[6px] md:border-t-[8px] border-t-transparent border-b-[5px] sm:border-b-[6px] md:border-b-[8px] border-b-transparent ml-0.5 sm:ml-1"></div>
              )}
            </button>

            {/* Time Display */}
            <span className="text-sm sm:text-base font-bold font-['Crunchyroll_Atyp',_sans-serif] text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Volume and Fullscreen */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-[#f47521] transition-all duration-300 hover:scale-110 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center">
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l4.883-3.794a1 1 0 011.617.794z"/>
                <path d="M12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"/>
              </svg>
            </button>
            <button className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-[#f47521] transition-all duration-300 hover:scale-110 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center">
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 