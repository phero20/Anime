import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEpisodesData, fetchEpisodesServerData } from '../redux/apifetch/GetanimeDataSlice';
import { FaPlay, FaEye, FaServer, FaClosedCaptioning, FaMicrophone, FaVolumeUp } from 'react-icons/fa';

export default function Episodes() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedServer, setSelectedServer] = useState({ server: null, type: null });
  const [serverLoading, setServerLoading] = useState(false);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [selectedEpisodeRange, setSelectedEpisodeRange] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      setServerLoading(true);
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
      setServerLoading(false);
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
    setServerLoading(true);
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
        <div className="mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden">
            {/* Video Player Placeholder */}
            <div className="relative w-full h-96 bg-gray-800 flex items-center justify-center">
              {selectedServer.server ? (
                <div className="text-center">
                  <FaPlay className="text-[#f47521] mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-white mb-2">
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
            <div className="p-4 bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="bg-[#f47521] hover:bg-[#e66713] text-black px-4 py-2 rounded-lg font-semibold transition-colors duration-300">
                    <FaPlay size={16} className="inline mr-2" />
                    Play
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300">
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
            <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg">
              {/* Left: Info/Help */}
              <div className="bg-[#f47521] flex flex-col justify-center items-center px-6 py-2 md:w-1/3 w-full text-center">
                <div className="text-black text-lg font-semibold mb-2">You are watching</div>
                <div className="text-black text-2xl font-extrabold mb-2">Episode {selectedEpisode.number}</div>
                <div className="text-black text-base font-medium">If current server doesn't work<br/>please try other servers beside.</div>
              </div>
              {/* Right: Server Selection */}
              <div className="bg-[#18151f] flex-1 px-6 py-2 flex flex-col gap-3 justify-center md:rounded-l-none rounded-b-2xl md:rounded-r-2xl">
                {serverLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f47521] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading servers...</p>
                  </div>
                ) : (
                  <>
                    {/* SUB Servers */}
                    {servers.sub && servers.sub.length > 0 && (
                      <div className="flex items-center gap-4 flex-wrap mb-2">
                        <span className="flex items-center gap-2 mr-2">
                          <FaClosedCaptioning className="text-[#f47521]" size={18} />
                          <span className="font-semibold text-white">SUB:</span>
                        </span>
                        {servers.sub.map((server) => (
                          <button
                            key={server.serverId}
                            onClick={() => handleServerClick(server, 'sub')}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-base
                              ${selectedServer.server?.serverId === server.serverId && selectedServer.type === 'sub'
                                ? 'bg-[#f47521] text-black'
                                : 'bg-[#232031] text-[#f47521] hover:bg-[#f47521]/20 hover:text-white'}
                            `}
                          >
                            {server.serverName.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* DUB Servers */}
                    {servers.dub && servers.dub.length > 0 && (
                      <div className="flex items-center gap-4 flex-wrap mt-2">
                        <span className="flex items-center gap-2 mr-2">
                          <FaMicrophone className="text-[#f47521]" size={18} />
                          <span className="font-semibold text-white">DUB:</span>
                        </span>
                        {servers.dub.map((server) => (
                          <button
                            key={server.serverId}
                            onClick={() => handleServerClick(server, 'dub')}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-base
                              ${selectedServer.server?.serverId === server.serverId && selectedServer.type === 'dub'
                                ? 'bg-[#f47521] text-black'
                                : 'bg-[#232031] text-[#f47521] hover:bg-[#f47521]/20 hover:text-white'}
                            `}
                          >
                            {server.serverName.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* No servers available */}
                    {(!servers.sub || servers.sub.length === 0) && 
                     (!servers.dub || servers.dub.length === 0) && (
                      <div className="text-center text-gray-400 py-8">
                        <FaServer size={32} className="mx-auto mb-3" />
                        <p className="text-lg">No servers available for this episode</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Episodes List Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">All Episodes</h2>
            
            {/* Episode Range Dropdown */}
            {totalEpisodes > 100 && (
              <div className="relative dropdown-container">
                <div 
                  className="bg-black border-2 border-gray-700 text-white px-6 py-3 rounded-2xl hover:border-gray-600 cursor-pointer transition-all duration-300 flex items-center justify-between min-w-[200px]"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-white">
                    {selectedEpisodeRange ? `Episodes ${selectedEpisodeRange.label}` : 'All Episodes'}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-[#f47521] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black border-2 border-gray-700 rounded-2xl overflow-hidden z-50 shadow-2xl">
                    <div 
                      className="px-6 py-3 hover:bg-gray-900 cursor-pointer transition-colors duration-200 border-b border-gray-700"
                      onClick={() => {
                        setSelectedEpisodeRange(null);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="text-white">All Episodes</span>
                    </div>
                    {episodeRanges.map((range) => (
                      <div 
                        key={range.label}
                        className="px-6 py-3 hover:bg-gray-900 cursor-pointer transition-colors duration-200 border-b border-gray-700 last:border-b-0"
                        onClick={() => {
                          setSelectedEpisodeRange(range);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="text-white">Episodes {range.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {currentEpisodes.map((episode, index) => (
              <div
                key={episode.episodeId || index}
                onClick={() => handleEpisodeClick(episode)}
                className={`group cursor-pointer bg-gray-900/50 backdrop-blur-sm border rounded-lg p-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                  selectedEpisode?.episodeId === episode.episodeId
                    ? 'border-[#f47521] bg-[#f47521]/10'
                    : 'border-gray-700/50 hover:border-[#f47521]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#f47521] text-black text-sm font-bold px-2 py-1 rounded-full min-w-[40px] text-center">
                    {episode.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-[#f47521] transition-colors duration-300">
                      {episode.title}
                    </h3>
                    {episode.isFiller && (
                      <span className="text-xs text-yellow-400 bg-yellow-400/10 px-1 py-0.5 rounded">
                        Filler
                      </span>
                    )}
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
