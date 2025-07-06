import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaFilm } from 'react-icons/fa';
import { fetchEpisodesData, fetchEpisodesServerData } from '../redux/apifetch/GetanimeDataSlice';
import { FaPlay, FaEye, FaServer, FaClosedCaptioning, FaMicrophone, FaVolumeUp, FaSearch } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';


export default function Episodes() {
  const dispatch = useDispatch();
  const { EpisodeImage } = useSelector((state) => state.AnimeData);
  console.log(EpisodeImage)
  const { id } = useParams();
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedServer, setSelectedServer] = useState({ server: null, type: null });
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [selectedEpisodeRange, setSelectedEpisodeRange] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showServerSelection, setShowServerSelection] = useState(false);

  const { EpisodesData, EpisodesServerData } = useSelector((state) => state.AnimeData);
  const episodes = EpisodesData?.data?.data?.episodes || [];
  const totalEpisodes = EpisodesData?.data?.data?.totalEpisodes || 0;
  const servers = EpisodesServerData?.data?.data || {};

  // Create episode ranges for dropdown (100 episodes each)
  const episodeRanges = [];
  if (totalEpisodes > 100) {
    for (let i = 0; i < totalEpisodes; i += 100) {
      const start = i + 1;
      const end = Math.min(i + 100, totalEpisodes);
      episodeRanges.push({
        label: `${start}-${end}`,
        start: start,
        end: end,
        episodes: episodes.slice(i, i + 100)
      });
    }
  }

  // Get current episodes to display
  const currentEpisodes = selectedEpisodeRange 
    ? selectedEpisodeRange.episodes 
    : episodes;

  useEffect(() => {
    if (id) {
      setEpisodesLoading(true);
      dispatch(fetchEpisodesData(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentEpisodes.length > 0 && currentEpisodes[0]?.episodeId) {
      setSelectedEpisode(currentEpisodes[0]);
      dispatch(fetchEpisodesServerData(currentEpisodes[0].episodeId));
    }
  }, [currentEpisodes, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Reset server loading when server data is received
  useEffect(() => {
    if (EpisodesServerData) {
      // setServerLoading(false); // Removed unused variable
    }
  }, [EpisodesServerData]);

  // Reset episodes loading when episodes data is received
  useEffect(() => {
    if (EpisodesData) {
      setEpisodesLoading(false);
    }
  }, [EpisodesData]);

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
    setSelectedServer({ server: null, type: null });
    dispatch(fetchEpisodesServerData(episode.episodeId));
  };

  const handleServerClick = (server, type) => {
    setSelectedServer({ server, type });
  };

  if (episodesLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f47521] mx-auto mb-4"></div>
          <p className="text-lg">Loading episodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Crunchyroll_Atyp',_sans-serif] pt-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f47521] mb-2">
            Episodes
          </h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1">
              <FaEye className="text-[#f47521]" size={16} />
              {totalEpisodes} Episodes
            </span>
            {selectedEpisode && (
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">
                Episode {selectedEpisode.number}
              </span>
            )}
          </div>
        </div>

        {/* Video Player Section */}
        <div className="mb-6">
          <div className="bg-gray-900/90 border border-gray-700 rounded-lg overflow-hidden">
            {/* Video Player Placeholder */}
            <div className="relative w-full h-96 bg-gray-800 flex items-center justify-center">
              {selectedServer.server ? (
                <div className="text-center">
                  <FaPlay className="text-[#f47521] mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-200 mb-2">
                    Episode {selectedEpisode?.number}: {selectedEpisode?.title}
                  </h3>
                  <p className="text-gray-400 mb-4">Playing on {selectedServer.server.serverName}</p>
                  <div className="bg-[#f47521] text-black px-4 py-2 rounded-lg font-semibold">
                    Video Player Would Load Here
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FaPlay className="text-gray-400 mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Select a server to start watching
                  </h3>
                  <p className="text-gray-500">Choose from the available servers below</p>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="p-4 bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="bg-[#f47521] hover:bg-[#e66713] text-black px-4 py-2 rounded-lg font-semibold transition-colors duration-300">
                    <FaPlay size={16} className="inline mr-2" />
                    Play
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg font-semibold transition-colors duration-300">
                    <FaVolumeUp size={16} className="inline mr-2" />
                    Mute
                  </button>
                </div>
                <div className="text-sm text-gray-400">
                  {selectedEpisode && `Episode ${selectedEpisode.number}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Server Selection Section */}
        {selectedEpisode && (
          <div className="mb-8">
            {/* Current Server Info */}
            <div className="bg-gray-900/70 rounded-xl px-4 py-3 flex items-center justify-between mb-2 shadow border border-gray-800">
              <div className="flex flex-col">
                <div className='flex w-full items-center gap-3'>
                <FaServer className="text-[#f47521] text-lg" />
                <span className="font-bold text-white text-base uppercase">{selectedServer.server ? selectedServer.server.serverName : 'Select Server'}</span>
                {selectedServer.type && (
                  <span className="ml-2 bg-gray-800 text-xs text-white px-2 py-0.5 rounded font-semibold uppercase tracking-wide">
                    {selectedServer.type === 'sub' ? 'SUB' : 'DUB'}
                  </span>
                  
                )}
                </div>
               
                <div className="text-gray-300 text-xs mt-2">
                    If current server doesn't work please try other servers beside, click to change.
                  </div>
              </div>
              <button
                className={`text-gray-400 hover:text-[#f47521] transition-all duration-200 transform ${showServerSelection ? 'rotate-180' : ''}`}
                onClick={() => setShowServerSelection(v => !v)}
                title="Show/hide server selection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {/* Info Text and Server Selection Box with Framer Motion Animation */}
            <AnimatePresence initial={false}>
              {showServerSelection && (
                <motion.div
                  key="server-selection"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.40, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  
                  <div className="bg-gray-900/70 rounded-xl px-4 py-4 shadow border border-gray-800">
                    {/* Subtitles Section */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FaClosedCaptioning className="text-[#f47521] text-base" />
                        <span className="font-semibold text-white text-base">Subtitles</span>
                        <span className="text-xs text-gray-400">({servers.sub ? servers.sub.length : 0} servers)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {servers.sub && servers.sub.length > 0 ? (
                          servers.sub.map((server) => (
                            <button
                              key={server.serverId}
                              onClick={() => {
                                handleServerClick(server, 'sub')
                                setShowServerSelection(v => !v)
                                setTimeout(() => {
                                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                                }, 100)
                              }}
                              className={`w-full px-0 py-2 rounded-md font-semibold uppercase text-sm transition-all duration-200
                                ${selectedServer.server?.serverId === server.serverId && selectedServer.type === 'sub'
                                  ? 'bg-[#f47521] text-white'
                                  : 'bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all duration-500 hover:text-[#f47521]'}
                              `}
                            >
                              {server.serverName}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 col-span-full">No subtitle servers available.</span>
                        )}
                      </div>
                    </div>
                    {/* Dubbed Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-2 mt-4">
                        <FaMicrophone className="text-[#f47521] text-base" />
                        <span className="font-semibold text-white text-base">Dubbed</span>
                        <span className="text-xs text-gray-400">({servers.dub ? servers.dub.length : 0} servers)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {servers.dub && servers.dub.length > 0 ? (
                          servers.dub.map((server) => (
                            <button
                              key={server.serverId}
                              onClick={() => {
                                handleServerClick(server, 'dub')
                                setShowServerSelection(v => !v)
                                setTimeout(() => {
                                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                                }, 100)
                              }}
                              className={`w-full px-0 py-2 rounded-md font-semibold uppercase text-sm transition-all duration-200
                                ${selectedServer.server?.serverId === server.serverId && selectedServer.type === 'dub'
                                  ? 'bg-[#f47521] text-white'
                                  : 'bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all duration-500 hover:text-[#f47521]'}
                              `}
                            >
                              {server.serverName}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 col-span-full">No dubbed servers available.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Episodes List Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <h2 className="text-xl text-[#f47521] font-semibold">Episodes </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search Bar with Icon */}
              <div className="relative w-40 h-9">
                
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search episode..."
                  className="bg-gray-900/80 border-2 border-gray-700 text-sm text-white rounded-xl pr-9 pl-3 py-1.5 focus:outline-none focus:border-[#f47521] transition-all duration-300 w-40 h-9"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f47521] text-base pointer-events-none" />
              </div>
              {/* Episode Range Dropdown */}
              {totalEpisodes > 100 && (
                <div className="relative dropdown-container w-40 h-9">
                  <div 
                    className="bg-gray-900 border-2 border-gray-700 text-gray-200 px-3 py-1.5 rounded-xl hover:border-[#f47521] cursor-pointer transition-all duration-300 flex items-center justify-between w-40 h-9"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="text-gray-200 text-sm truncate">
                      {selectedEpisodeRange ? `Episodes ${selectedEpisodeRange.label}` : 'All Episodes'}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-[#f47521] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {/* Dropdown Menu */}
                  <AnimatePresence initial={false}>
                    {isDropdownOpen && (
                      <motion.div
                        key="episode-dropdown"
                        initial={{ height: 0, opacity: 0, y: -10 }}
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -10 }}
                        transition={{ duration: 0.40, ease: [0.4, 0, 0.2, 1] }}
                        style={{ overflow: 'hidden' }}
                        className="absolute top-full left-0 right-0 px-1.5 py-1.5 mt-2 bg-gray-900/90 border-2 border-gray-700 rounded-xl z-50 shadow-2xl w-40"
                      >
                        <div 
                          className={`px-2 py-2.5 hover:bg-gray-800 text-gray-200 hover:text-[#f47521] cursor-pointer transition-all duration-500 rounded-md text-sm ${
                            !selectedEpisodeRange ? 'bg-[#f47521] text-white' : ''
                          }`}
                          onClick={() => {
                            setSelectedEpisodeRange(null);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span className="">All Episodes</span>
                        </div>
                        {episodeRanges.map((range) => (
                          <div 
                            key={range.label}
                            className={`px-2 py-2.5 hover:bg-gray-800 text-gray-200 hover:text-[#f47521] rounded-md cursor-pointer transition-all duration-500 text-sm ${
                              selectedEpisodeRange?.label === range.label ? 'bg-[#f47521]/60 text-white' : ''
                            }`}
                            onClick={() => {
                              setSelectedEpisodeRange(range);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="">Episodes {range.label}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
          
          {/* Responsive Episode Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentEpisodes
              .filter(ep => {
                if (!searchTerm) return true;
                const term = searchTerm.toLowerCase();
                return (
                  (ep.title && ep.title.toLowerCase().includes(term)) ||
                  (ep.number && ep.number.toString().includes(term))
                );
              })
              .map((episode, index) => (
                <div
                  key={episode.episodeId || index}
                  onClick={() => {handleEpisodeClick(episode)
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                  }}
                //  data-aos="zoom-out-up"
                  className={`group flex items-center bg-gray-900/70 rounded-lg border-gray-800 hover:bg-gray-900/85 border hover:scale-y-110 hover:ring-2 hover:ring-[#f47521]  hover:text-[#f47521] transition-all duration-500 cursor-pointer h-20 min-h-[80px]` + (selectedEpisode?.episodeId === episode.episodeId ? ' ring-2 ring-[#f47521] text-[#f47521] scale-y-110' : 'text-white scale-y-100')}
                >
                  {/* Image */}
                  <div className="relative w-24 md:w-28 min-w-[96px] h-full overflow-hidden rounded-lg bg-gray-800" >
                    <img
                      src={EpisodeImage || 'https://placehold.co/192x128?text=No+Image'}
                      alt={episode.title}
                      className="w-full h-full object-cover block group-hover:scale-150 transition-all duration-500"
                      draggable={false}
                    />
                    <div className="absolute bottom-1 left-1 bg-[#181818] text-[#f47521] text-[10px] font-semibold px-2 py-0.5 rounded shadow">
                      EP {episode.number}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-center px-2 py-1 min-w-0">
                    <div className="flex items-center gap-1 w-full min-w-0">
                      <span className="text-sm w-6 flex-shrink-0">{episode.number}.</span>
                      <span className="text-sm truncate">{episode.title}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
