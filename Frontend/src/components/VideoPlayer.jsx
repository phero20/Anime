import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import LoadingAnimation from './LoadingAnimation';
import { FaPlay, FaExclamationTriangle, FaRedo } from 'react-icons/fa';

const plyrDefaultOptions = {
  controls: [
    'play-large',
    'play',
    'progress',
    'current-time',
    'duration',
    'mute',
    'volume',
    'settings',
    'fullscreen'
  ],
  settings: ['quality', 'speed'],
  quality: {
    default: 'auto',
    options: ['auto', '1080p', '720p', '480p', '360p']
  },
  speed: {
    selected: 1,
    options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
  },
  keyboard: { focused: true, global: false },
  tooltips: { controls: true, seek: true },
  captions: { active: false, update: false, language: 'auto' },
  fullscreen: { enabled: true, fallback: true, iosNative: false },
  storage: { enabled: true, key: 'plyr' },
  hideControls: true,
  clickToPlay: true,
  disableContextMenu: true
};

export default function VideoPlayer({ streamData }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const initializePlayer = useCallback(async () => {
    if (!streamData || !containerRef.current) {
      setIsLoading(true);
      setError(null);
      setIsReady(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsReady(false);

      // Clear the container and create the video element
      containerRef.current.innerHTML = '';
      const videoElement = document.createElement('video');
      videoElement.className = 'w-full h-full object-contain bg-black';
      videoElement.crossOrigin = 'anonymous';
      videoElement.preload = 'metadata';
      videoElement.style.maxWidth = '100%';
      videoElement.style.maxHeight = '100%';
      videoElement.style.objectFit = 'contain';
      containerRef.current.appendChild(videoElement);

      // Initialize HLS
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferHole: 0.5,
          highBufferWatchdogPeriod: 2,
          nudgeOffset: 0.1,
          nudgeMaxRetry: 3,
          maxFragLookUpTolerance: 0.25,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: Infinity,
          liveDurationInfinity: false,
          enableSoftwareAES: true,
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 1,
          manifestLoadingRetryDelay: 1000,
          levelLoadingTimeOut: 10000,
          levelLoadingMaxRetry: 4,
          levelLoadingRetryDelay: 1000,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 6,
          fragLoadingRetryDelay: 1000,
          startFragPrefetch: false,
          fpsDroppedMonitoringPeriod: 5000,
          fpsDroppedMonitoringThreshold: 0.2,
          appendErrorMaxRetry: 3,
          loader: Hls.DefaultConfig.loader,
          fLoader: undefined,
          pLoader: undefined,
          xhrSetup: undefined,
          fetchSetup: undefined,
          abrController: Hls.DefaultConfig.abrController,
          bufferController: Hls.DefaultConfig.bufferController,
          capLevelController: Hls.DefaultConfig.capLevelController,
          fpsController: Hls.DefaultConfig.fpsController,
          stretchShortVideoTrack: false,
          maxAudioFramesDrift: 1,
          forceKeyFrameOnDiscontinuity: true,
          abrEwmaFastLive: 3.0,
          abrEwmaSlowLive: 9.0,
          abrEwmaFastVoD: 3.0,
          abrEwmaSlowVoD: 9.0,
          abrEwmaDefaultEstimate: 5e5,
          abrBandWidthFactor: 0.95,
          abrBandWidthUpFactor: 0.7,
          abrMaxWithRealBitrate: false,
          maxStarvationDelay: 4,
          maxLoadingDelay: 4,
          minAutoBitrate: 0,
          emeEnabled: false,
          widevineLicenseUrl: undefined,
          drmSystemOptions: {},
          requestMediaKeySystemAccessFunc: Hls.DefaultConfig.requestMediaKeySystemAccessFunc
        });
        
        hlsRef.current = hls;

        // HLS Error handling
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError('Network error occurred. Please check your connection.');
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError('Media error occurred. The video format may not be supported.');
                break;
              default:
                setError('An unexpected error occurred while loading the video.');
                break;
            }
            setIsLoading(false);
          }
        });

        // Load source - handle both old and new data structures
        const sourceUrl = streamData.sources?.[0]?.url || streamData.sources?.[0]?.file;
        if (!sourceUrl) {
          setError('No valid stream source found.');
          setIsLoading(false);
          return;
        }
        
        hls.loadSource(sourceUrl);
        hls.attachMedia(videoElement);

        // Wait for manifest to be parsed
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed successfully');
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        const sourceUrl = streamData.sources?.[0]?.url || streamData.sources?.[0]?.file;
        videoElement.src = sourceUrl;
      } else {
        setError('HLS is not supported in this browser.');
        setIsLoading(false);
        return;
      }

      // Initialize Plyr with container constraints
      const player = new Plyr(videoElement, {
        ...plyrDefaultOptions,
        ratio: null, // Let container control aspect ratio
        fullscreen: {
          enabled: true,
          fallback: true,
          iosNative: false,
          container: null // Use default container behavior
        }
      });
      playerRef.current = player;
      
      // Ensure player container fits within bounds
      const plyrContainer = containerRef.current.querySelector('.plyr');
      if (plyrContainer) {
        plyrContainer.style.width = '100%';
        plyrContainer.style.height = '100%';
        plyrContainer.style.maxWidth = '100%';
        plyrContainer.style.maxHeight = '100%';
        plyrContainer.style.overflow = 'hidden';
      }

      // Mobile fullscreen orientation handling
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      player.on('enterfullscreen', () => {
        if (isMobile && screen.orientation?.lock) {
          screen.orientation.lock('landscape').catch(err => 
            console.error("Could not lock screen orientation:", err)
          );
        }
      });

      player.on('exitfullscreen', () => {
        if (isMobile && screen.orientation?.unlock) {
          screen.orientation.unlock();
        }
      });

      // Player event listeners
      player.on('loadstart', () => {
        setIsLoading(true);
        setIsBuffering(false);
      });

      player.on('waiting', () => {
        setIsBuffering(true);
      });

      player.on('playing', () => {
        setIsLoading(false);
        setIsBuffering(false);
        setIsReady(true);
      });

      player.on('canplay', () => {
        setIsLoading(false);
        setIsReady(true);
      });

      player.on('loadeddata', () => {
        setIsLoading(false);
        setIsReady(true);
      });

      player.on('error', (event) => {
        console.error('Player error:', event);
        setError('Failed to load video. Please try again.');
        setIsLoading(false);
      });

      player.on('stalled', () => {
        setIsBuffering(true);
      });

      player.on('progress', () => {
        setIsBuffering(false);
      });

    } catch (err) {
      console.error('Error initializing player:', err);
      setError('Failed to initialize video player.');
      setIsLoading(false);
    }
  }, [streamData]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setError(null);
    initializePlayer();
  }, [initializePlayer]);

  useEffect(() => {
    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [initializePlayer]);

  return (
    <div className="relative w-full aspect-video bg-gray-900 overflow-hidden shadow-2xl border border-gray-700">
      {/* Video Container */}
      <div ref={containerRef} className="w-full h-full overflow-hidden" />
      
      {/* Loading Overlay - Only show when we have streamData but video isn't ready */}
      {streamData && (isLoading || isBuffering) && !error && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
          <div className="flex flex-col items-center space-y-4">
            <LoadingAnimation />
            <div className="text-center">
              <p className="text-white font-medium text-lg mb-1">
                {isLoading ? 'Loading Video...' : 'Buffering...'}
              </p>
              <p className="text-gray-300 text-sm">
                {isLoading ? 'Please wait while we prepare your video' : 'Loading content...'}
              </p>
            </div>
            {/* Loading Progress Bar */}
            <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#f47521] to-[#ff6600] rounded-full animate-pulse" 
                   style={{ width: isBuffering ? '60%' : '90%' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* No Stream Data Overlay */}
      {!streamData && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
          <div className="flex flex-col items-center space-y-4">
            <LoadingAnimation />
            <div className="text-center">
              <p className="text-white font-medium text-lg mb-1">
                Loading Stream...
              </p>
              <p className="text-gray-300 text-sm">
                Preparing video stream from server
              </p>
            </div>
            {/* Loading Progress Bar */}
            <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#f47521] to-[#ff6600] rounded-full animate-pulse" 
                   style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
          <div className="text-center max-w-md px-6">
            <FaExclamationTriangle className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-3">Playback Error</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-[#f47521] hover:bg-[#ff6600] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto shadow-lg"
            >
              <FaRedo className="text-sm" />
              Try Again {retryCount > 0 && `(${retryCount})`}
            </button>
            <p className="text-gray-400 text-xs mt-4">
              If the problem persists, try selecting a different server
            </p>
          </div>
        </div>
      )}
      
      {/* Video Ready Indicator */}
      {/* {!isLoading && !error && isReady && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Ready
            </div>
          </div>
        </div>
      )} */}
      
      {/* Buffering Indicator */}
      {streamData && isBuffering && !isLoading && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-[#f47521]/20 border border-[#f47521]/50 text-[#f47521] px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#f47521] rounded-full animate-bounce"></div>
              Buffering
            </div>
          </div>
        </div>
      )}
    </div>
  );
}