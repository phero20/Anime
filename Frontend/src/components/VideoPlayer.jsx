import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import LoadingAnimation from './LoadingAnimation';
// import './Loader.css';

const plyrDefaultOptions = { /* ... your options ... */ };

export default function VideoPlayer({ streamData }) {
  // 1. This ref will now point to the container div
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  if (!streamData || !containerRef.current) return;

  // Clear the container and create the video element
  containerRef.current.innerHTML = '';
  const videoElement = document.createElement('video');
  videoElement.className = 'w-full aspect-video';
  containerRef.current.appendChild(videoElement);
  
  let hls = new Hls();
  let player = new Plyr(videoElement, plyrDefaultOptions);

  // --- CORRECT FULLSCREEN ROTATION LOGIC ---
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // 1. Lock screen ONLY when entering fullscreen
  player.on('enterfullscreen', () => {
    if (isMobile && screen.orientation?.lock) {
      screen.orientation.lock('landscape').catch(err => 
        console.error("Could not lock screen orientation:", err)
      );
    }
  });

  // 2. Unlock screen ONLY when exiting fullscreen
  player.on('exitfullscreen', () => {
    if (isMobile && screen.orientation?.unlock) {
      screen.orientation.unlock();
    }
  });
  // --- END OF LOGIC ---

  // Setup HLS and other listeners
  hls.loadSource(streamData.sources[0].url);
  hls.attachMedia(videoElement);
  player.on('waiting', () => setIsLoading(true));
  player.on('playing', () => setIsLoading(false));
  player.on('canplay', () => setIsLoading(false));

  // Cleanup
  return () => {
    player.destroy();
    hls.destroy();
  };
}, [streamData]); // Re-run only when streamData changes

  return (
    <div className="relative w-full ">
      {isLoading && (
        <div className="loader-overlay">
          {/* <div className="loader-spinner"></div> */}
           <LoadingAnimation />
          </div>
      )}
      {/* 3. The ref is on the container, and the video tag is gone from JSX */}
      <div ref={containerRef} className='aspect-video' />
    </div>
  );
}