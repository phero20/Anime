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
    <div className="relative w-full bg-gray-900" style={{ aspectRatio: '16/9' }}>
      {/* Video Placeholder - Main Content */}
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="text-center z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 relative">
            {/* Play Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[12px] sm:border-l-[16px] md:border-l-[20px] border-l-white border-t-[8px] sm:border-t-[10px] md:border-t-[12px] border-t-transparent border-b-[8px] sm:border-b-[10px] md:border-b-[12px] border-b-transparent ml-1"></div>
            </div>
            {/* Animated Ring */}
            <div className="absolute inset-0 rounded-full border-2 sm:border-3 md:border-4 border-[#f47521] animate-pulse"></div>
          </div>
          <p className="text-white text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2">Video Loading...</p>
          <p className="text-gray-400 text-xs sm:text-sm">
            {streamData?.anilistID ? `AniList ID: ${streamData.anilistID}` : 'Demo Video'}
          </p>
        </div>
      </div>

      {/* Skip Intro/Outro Buttons - Top Right */}
      {(streamData?.intro || streamData?.outro) && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 z-30">
          {streamData.intro && (
            <button className="bg-[#f47521] hover:bg-[#e66713] text-white px-2 py-1 sm:px-3 text-xs sm:text-sm font-semibold transition-colors shadow-lg rounded">
              Skip Intro
            </button>
          )}
          {streamData.outro && (
            <button className="bg-[#f47521] hover:bg-[#e66713] text-white px-2 py-1 sm:px-3 text-xs sm:text-sm font-semibold transition-colors shadow-lg rounded">
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
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 sm:p-3 md:p-4 z-30">
        {/* Progress Bar */}
        <div 
          className="w-full h-1.5 sm:h-2 bg-gray-700 rounded-full cursor-pointer mb-2 sm:mb-3"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-[#f47521] rounded-full transition-all duration-300"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Play/Pause Button */}
            <button 
              onClick={handlePlayPause}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#f47521] hover:bg-[#e66713] transition-colors shadow-lg"
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
            <span className="text-xs sm:text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Volume and Fullscreen */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button className="w-6 h-6 sm:w-8 sm:h-8 text-white hover:text-gray-300 transition-colors">
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l4.883-3.794a1 1 0 011.617.794z"/>
                <path d="M12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"/>
              </svg>
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 text-white hover:text-gray-300 transition-colors">
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