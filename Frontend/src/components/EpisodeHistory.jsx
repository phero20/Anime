import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaClock, FaServer, FaChevronLeft, FaChevronRight, FaHistory } from 'react-icons/fa';
import { MdVideoLibrary, MdDateRange } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Title from './Title';
import { useDispatch } from 'react-redux';
import { setEpisodeImage, clearEpisodeImage } from '../redux/apifetch/GetanimeDataSlice';

export default function EpisodeHistory({ historyData = [], name = "Your Watch History", scroll = false }) {
  const safeData = Array.isArray(historyData) ? historyData : [];
  const scrollContainerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Monitor scroll position to show/hide buttons
  useEffect(() => {
    const updateScrollButtons = () => {
      if (!scrollContainerRef.current || !scroll) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    updateScrollButtons();
    scrollContainerRef.current?.addEventListener("scroll", updateScrollButtons);
    
    return () => scrollContainerRef.current?.removeEventListener("scroll", updateScrollButtons);
  }, [safeData.length, scroll]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -600,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 600,
        behavior: 'smooth'
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffTime = startOfToday.getTime() - startOfDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return 'Today';
    }
    if (diffDays === 1) {
      return 'Yesterday';
    }
    if (diffDays > 1 && diffDays < 7) {
      return `${diffDays} days ago`;
    }
    return date.toLocaleDateString(); 
  };



  const renderHistoryCard = (item, index) => (
    <div 
    onClick={() => {
      dispatch(setEpisodeImage(item.EpisodeImage));
      navigate(`/episodes/${item.animeId}/${item.animeName}/${item.server}/${encodeURIComponent(item.episodeId)}`)}}
     key={index}>
      <motion.div
        {...(!scroll ? {
          initial: { opacity: 0, },
          whileInView: { opacity: 1 },
          exit: { opacity: 0, },
          viewport: { once: false },
          transition: { duration: 0.6 }
        } : {})}
        className={`group cursor-pointer relative overflow-hidden transition-all duration-300 ${scroll ? `${safeData.length === 1 ? "w-[280px] max-w-[280px]" : "min-w-[200px] sm:min-w-[240px] md:min-w-[280px] lg:min-w-[320px] xl:min-w-[360px]"} flex-shrink-0` : "w-full"}`}
      >
        {/* Crunchyroll-style Card Container */}
        <div className="relative overflow-hidden group-hover:border-[#f47521] transition-all duration-500 bg-gray-900/50 rounded-lg border border-gray-800/50">
          
          {/* Image Container - Episode thumbnail */}
          <div className={`relative w-full ${scroll ? 'aspect-[16/8]' : 'aspect-[16/8]'} rounded-t-lg overflow-hidden`}>
            <img
              src={item.EpisodeImage}
              alt={`Episode ${item.episodeNumber}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-150"
            />
            
            {/* Server Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-gray-950/70 backdrop-blur-sm border border-[#f47521]/30">
              <FaServer className="text-[#f47521]" size={10} />
              <span className="text-white font-medium">{item.server.toUpperCase()}</span>
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3 px-2 py-1 text-xs rounded-md bg-gray-950/70 backdrop-blur-sm text-[#f47521] border border-[#f47521]/30 font-medium">
              {item.category.toUpperCase()}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 rounded-t-lg flex justify-center items-center bg-gray-950/80 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="hover:scale-110 rounded-full p-4 text-[#f47521] cursor-pointer border border-[#f47521]/50 bg-[#f47521]/10 transition-all duration-500">
                <FaPlay className="text-lg" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-3">
            {/* Episode Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MdVideoLibrary className="text-[#f47521]" size={16} />
                <span className="text-white font-semibold">Episode {item.episodeNumber}</span>
              </div>
              
              {/* Anime ID as title */}
              <h3 className="text-sm font-bold text-white group-hover:text-[#f47521] transition-colors duration-300 line-clamp-2 leading-tight capitalize">
                {item.animeName}
              </h3>
            </div>

            {/* Date and Server Info */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700/50">
              <div className="flex items-center gap-2">
                <MdDateRange className="text-[#f47521]" size={14} />
                <span>{formatDate(item.watchedAt)}</span>
              </div>
              
              {/* <div className="flex items-center gap-2">
                <FaClock className="text-[#f47521]" size={12} />
                <span>Continue Watching</span>
              </div> */}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (safeData.length === 0) {
    return (
      <div className="w-full max-w-[98%] mx-auto px-2 sm:px-4 md:px-6 py-4 text-white font-['Crunchyroll_Atyp',_sans-serif]">
        {/* <div className={`${scroll ? 'my-0' : 'my-6'}`}>
          <Title name={name} anime={scroll ? 'Episodes' : ''} />
        </div> */}
        
        <div className="text-center py-12 flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <FaHistory size={25} className="text-4xl text-[#f57421]" />
        </div>
        <h3 className="text-2xl font-bold text-gray-300 mb-3">No watch history found</h3>
        <p className="text-gray-500 text-lg">Start watching some episodes to see your history here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[95%] mx-auto px-2 sm:px-4 md:px-6 py-4 text-white font-['Crunchyroll_Atyp',_sans-serif] relative">
    {
      scroll && (
        <div className={`${scroll ? 'my-0' : 'my-6'}`}>
        <Title name={name} anime={scroll ? 'History' : ''} />
      </div>
      )
    }
     
      
      {scroll ? (
        <div className="relative">
          {/* Left Scroll Button - Only show when can scroll left */}
          {showLeft && (
            <button
              onClick={scrollLeft}
              className="hidden md:flex absolute -left-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 text-gray-400 hover:text-[#f47521] rounded-full items-center justify-center transition-all duration-300 backdrop-blur-sm"
              title="Scroll Left"
            >
              <FaChevronLeft size={20} />
            </button>
          )}

          {/* Right Scroll Button - Only show when can scroll right */}
          {showRight && (
            <button
              onClick={scrollRight}
              className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10  text-gray-400 hover:text-[#f47521] rounded-full items-center justify-center transition-all duration-300 backdrop-blur-sm"
              title="Scroll Right"
            >
              <FaChevronRight size={20} />
            </button>
          )}

          <div className="pointer-events-none absolute left-0 top-0 h-full w-10 z-20 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 z-20 bg-gradient-to-l from-black/70 via-black/30 to-transparent" />
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          >
            {safeData.map(renderHistoryCard)}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
         gap-4 sm:gap-5 md:gap-6">
          {safeData.map(renderHistoryCard)}
        </div>
      )}
    </div>
  );
}
