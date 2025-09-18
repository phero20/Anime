import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import LoadingAnimation from './LoadingAnimation';
import { FaPlay, FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import { addToHistory } from '../redux/apifetch/userAnime';
import { selectUser } from '../redux/apifetch/AuthSlicer';

const plyrDefaultOptions = {
  controls: [
    'play-large',
    'play',
    'progress',
    'current-time',
    'duration',
    'mute',
    'volume',
    'captions',
    'settings',
    'fullscreen'
  ],
  settings: ['captions', 'quality', 'speed'],
  quality: {
    default: 720,
    options: [1080, 720, 480, 360, 'auto']
  },
  speed: {
    selected: 1,
    options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
  },
  keyboard: { focused: true, global: false },
  tooltips: { controls: true, seek: true },
  captions: { active: true, update: true, language: 'auto' },
  fullscreen: { enabled: true, fallback: true, iosNative: false },
  storage: { enabled: true, key: 'plyr' },
  hideControls: true,
  clickToPlay: true,
  disableContextMenu: true
};

export default function VideoPlayer({ 
  streamData, 
  selectedEpisode, 
  selectedServer, 
  animeName, 
  animeId, 
  episodeImage 
}) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState('720p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [availableSubtitles, setAvailableSubtitles] = useState([]);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const [historyAdded, setHistoryAdded] = useState(false);
  const historyAddedRef = useRef(false);

  // Reset history flag when episode changes
  useEffect(() => {
    setHistoryAdded(false);
    historyAddedRef.current = false;
  }, [selectedEpisode?.episodeId]);

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

        // Wait for manifest to be parsed and set up quality control
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('successfully');
          
          // Set default quality to 720p if available
          const levels = hls.levels;
          if (levels && levels.length > 0) {
            // Find 720p level or closest match
            const targetHeight = 720;
            let bestLevel = 0;
            let closestDiff = Math.abs(levels[0].height - targetHeight);
            
            for (let i = 1; i < levels.length; i++) {
              const diff = Math.abs(levels[i].height - targetHeight);
              if (diff < closestDiff) {
                closestDiff = diff;
                bestLevel = i;
              }
            }
            
            // Set the quality level (disable auto-switching)
            hls.currentLevel = bestLevel;
            console.log(``);
          }
        });
        
        // Handle subtitle/caption tracks
        hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, () => {
          const tracks = hls.subtitleTracks;
          console.log('Available subtitle tracks:', tracks);
        });
        
        hls.on(Hls.Events.SUBTITLE_TRACK_LOADED, (event, data) => {
          console.log('');
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        const sourceUrl = streamData.sources?.[0]?.url || streamData.sources?.[0]?.file;
        videoElement.src = sourceUrl;
        
        // Handle text tracks for Safari
        videoElement.addEventListener('loadedmetadata', () => {
          const textTracks = videoElement.textTracks;
          if (textTracks && textTracks.length > 0) {
            console.log('Text tracks available:', textTracks.length);
            // Don't auto-show, let user control via captions button
            for (let i = 0; i < textTracks.length; i++) {
              textTracks[i].mode = 'disabled';
            }
          }
        });
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
      
      // Set up HLS.js integration for quality control
      if (hlsRef.current) {
        const hls = hlsRef.current;
        
        // Handle quality changes from Plyr settings
        player.on('qualitychange', (event) => {
          const quality = event.detail.quality;
          console.log('');
          
          if (quality === 'auto') {
            hls.currentLevel = -1; // Auto quality
            console.log('');
          } else {
            // Find the level index for the requested quality
            const levels = hls.levels;
            const levelIndex = levels.findIndex(level => level.height === parseInt(quality));
            if (levelIndex !== -1) {
              hls.currentLevel = levelIndex;
              console.log(``);
            }
          }
        });
        
        // Wait for levels to be available and update quality options
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const levels = hls.levels;
          if (levels && levels.length > 0) {
            console.log('');
            
            // Set available qualities for custom UI
            const qualities = ['Auto', ...levels.map(level => `${level.height}p`)];
            setAvailableQualities(qualities);
            
            // Don't set default subtitles here - wait for actual subtitle detection
            
            // Set default to 720p if available
            const has720p = levels.some(level => level.height === 720);
            if (has720p) {
              const level720Index = levels.findIndex(level => level.height === 720);
              hls.currentLevel = level720Index;
              setCurrentQuality('720p');
              console.log('');
            } else {
              setCurrentQuality('Auto');
            }
          }
        });
        
        // Handle subtitle/caption tracks
        hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, () => {
          const subtitleTracks = hls.subtitleTracks;
          console.log('');
          
          if (subtitleTracks && subtitleTracks.length > 0) {
            console.log('');
            setAvailableSubtitles(subtitleTracks);
            
            // Add subtitle tracks to video element
            subtitleTracks.forEach((track, index) => {
              const textTrack = videoElement.addTextTrack(
                'subtitles', 
                track.name || `Subtitle ${index + 1}`, 
                track.lang || 'en'
              );
              textTrack.mode = 'disabled'; // Start disabled, user can enable via captions
            });
          } else {
            // No subtitles available
            setAvailableSubtitles([]);
          }
        });
        
        // Handle subtitle track changes
        hls.on(Hls.Events.SUBTITLE_TRACK_SWITCH, (event, data) => {
          console.log('');
        });
      }
      
      // Remove Plyr caption handlers since we're using custom controls
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
            console.error("")
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

      // Add to history only once when video successfully starts playing
      const addToHistoryOnce = () => {
        if (user?.token && selectedEpisode && !historyAddedRef.current) {
          historyAddedRef.current = true;
          setHistoryAdded(true);
          dispatch(addToHistory({ 
            episodeId: selectedEpisode.episodeId, 
            episodeNumber: selectedEpisode.number,
            animeName: animeName,
            server: selectedServer?.server?.serverName || 'Unknown', 
            category: selectedServer?.type || 'Unknown', 
            EpisodeImage: episodeImage, 
            animeId: animeId, 
            token: user.token 
          }));
        }
      };

      player.on('playing', () => {
        setIsLoading(false);
        setIsBuffering(false);
        setIsReady(true);
        addToHistoryOnce();
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
        // console.error('Player error:', event);
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
      // console.error('Error initializing player:', err);
      setError('Failed to initialize video player.');
      setIsLoading(false);
    }
  }, [streamData]);

  // Handle quality change
  const handleQualityChange = useCallback((quality) => {
    if (!hlsRef.current) return;
    
    const hls = hlsRef.current;
    const levels = hls.levels;
    
    if (quality === 'Auto') {
      hls.currentLevel = -1; // Auto quality
      setCurrentQuality('Auto');
      // console.log('Quality set to: Auto');
    } else {
      const targetHeight = parseInt(quality.replace('p', ''));
      const levelIndex = levels.findIndex(level => level.height === targetHeight);
      if (levelIndex !== -1) {
        hls.currentLevel = levelIndex;
        setCurrentQuality(quality);
      }
    }
    setShowQualityMenu(false);
  }, []);

  // Handle captions toggle
  const handleCaptionsToggle = useCallback(() => {
    if (!hlsRef.current || availableSubtitles.length === 0) return;
    
    const hls = hlsRef.current;
    const videoElement = containerRef.current?.querySelector('video');
    const newCaptionsState = !captionsEnabled;
    
    if (newCaptionsState) {
      // Enable captions
      hls.subtitleTrack = 0; // Enable first subtitle track
      
      // Also enable text tracks on video element
      if (videoElement && videoElement.textTracks.length > 0) {
        for (let i = 0; i < videoElement.textTracks.length; i++) {
          videoElement.textTracks[i].mode = i === 0 ? 'showing' : 'disabled';
        }
      }
      
      setCaptionsEnabled(true);
    } else {
      // Disable captions
      hls.subtitleTrack = -1; // Disable subtitles
      
      // Also disable text tracks on video element
      if (videoElement && videoElement.textTracks.length > 0) {
        for (let i = 0; i < videoElement.textTracks.length; i++) {
          videoElement.textTracks[i].mode = 'disabled';
        }
      }
      
      setCaptionsEnabled(false);
      // console.log('Captions disabled');
    }
  }, [captionsEnabled, availableSubtitles]);

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

  // Auto-hide controls after 3 seconds
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    
    return setTimeout(() => {
      setShowControls(false);
      setShowQualityMenu(false); // Also close quality menu
    }, 3000);
  }, []);

  // Show controls on mouse movement
  useEffect(() => {
    let timeout;
    
    const handleMouseMove = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = resetControlsTimeout();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseMove);
      
      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseMove);
      };
    }
  }, [resetControlsTimeout]);

  // Close quality menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showQualityMenu && !event.target.closest('.relative')) {
        setShowQualityMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showQualityMenu]);

  // Initialize controls timeout when video is ready
  useEffect(() => {
    let timeout;
    if (isReady && streamData && !error) {
      timeout = resetControlsTimeout();
    }
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isReady, streamData, error, resetControlsTimeout]);

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
            <FaExclamationTriangle className="text-red-500 mx-auto mb-1" size={48} />
            <h3 className="text-lg font-semibold text-white mb-1">Playback Error</h3>
            <p className="text-gray-300 mb-2 leading-relaxed">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-[#f47521] hover:bg-[#ff6600] text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto shadow-lg"
            >
              <FaRedo className="text-sm" />
              Try Again {retryCount > 0 && `(${retryCount})`}
            </button>
            <p className="text-gray-400 text-xs mt-4 mb-1">
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
      
      {/* Custom Quality & Captions Controls - Auto-hide */}
      {streamData && !error && isReady && showControls && (
        <div 
          className="absolute top-4 right-4 z-20 flex gap-2 transition-opacity duration-300"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => {
            const timeout = resetControlsTimeout();
            setControlsTimeout(timeout);
          }}
        >
          {/* Quality Selector */}
          {availableQualities.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="bg-black/80 hover:bg-black/90 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm border border-gray-600 hover:border-[#f47521] transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <span className="text-xs">🎬</span>
                {currentQuality}
              </button>
              
              {/* Quality Menu */}
              {showQualityMenu && (
                <div className="absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-sm border border-gray-600 rounded-lg overflow-hidden min-w-[120px] shadow-xl">
                  {availableQualities.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => handleQualityChange(quality)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[#f47521]/20 transition-colors ${
                        currentQuality === quality 
                          ? 'bg-[#f47521]/30 text-[#f47521]' 
                          : 'text-white'
                      }`}
                    >
                      {quality}
                      {currentQuality === quality && (
                        <span className="float-right text-[#f47521]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Captions Toggle - Only show if subtitles available */}
          {availableSubtitles.length > 0 && (
            <button
              onClick={handleCaptionsToggle}
              className={`px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm border transition-all duration-200 flex items-center gap-2 shadow-lg ${
                captionsEnabled
                  ? 'bg-[#f47521]/20 border-[#f47521] text-[#f47521]'
                  : 'bg-black/80 hover:bg-black/90 border-gray-600 hover:border-[#f47521] text-white'
              }`}
            >
              <span className="text-xs">CC</span>
              {captionsEnabled ? 'On' : 'Off'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}