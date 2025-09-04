import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaChevronLeft, FaChevronRight, FaUsers, FaVideo, FaTv } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";
import { motion } from "framer-motion";

export default function MoreInfo({ data }) {
  // Move all hooks before any early returns
  const seasonRef = useRef(null);
  const promoRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [showLeftS, setShowLeftS] = useState(false);
  const [showRightS, setShowRightS] = useState(false);

  const promotionalVideos = data?.anime?.info?.promotionalVideos || [];
  const charactersVoiceActors = data?.anime?.info?.charactersVoiceActors || [];
  const seasons = data?.seasons || [];

  useEffect(() => {
    const updateScroll = () => {
      if (!promoRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = promoRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
    };
    updateScroll();
    promoRef.current?.addEventListener("scroll", updateScroll);
    return () => promoRef.current?.removeEventListener("scroll", updateScroll);
  }, [promotionalVideos.length]);

  useEffect(() => {
    const update = () => {
      if (!seasonRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = seasonRef.current;
      setShowLeftS(scrollLeft > 0);
      setShowRightS(scrollLeft + clientWidth < scrollWidth - 1);
    };
    update();
    seasonRef.current?.addEventListener("scroll", update);
    return () => seasonRef.current?.removeEventListener("scroll", update);
  }, [seasons.length]);

  // Show loading animation while data is loading
  if (!data) {
    return (
      <section className="w-full bg-black text-white font-['Crunchyroll_Atyp',sans-serif]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
          <LoadingAnimation />
        </div>
      </section>
    );
  }

  if (!data?.anime?.info) return null;

  return (
    <section className="w-full bg-black text-white font-['Crunchyroll_Atyp',sans-serif]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-8 space-y-8">

        {/* Seasons Section */}
        {seasons.length > 0 && (
          <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: .6}}   
          className="bg-gray-900/10 backdrop-blur-[.1px] border border-gray-700/50 rounded-xl p-6 md:px-8 px-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[#f47521] rounded-full"></div>
              <FaTv className="text-[#f47521]" size={24} />
              Seasons
            </h2>

            {/* Navigation arrows */}
            {showLeftS && (
              <button 
                onClick={() => seasonRef.current.scrollBy({ left: -600, behavior: "smooth" })}
                className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/4 text-gray-400 hover:text-[#f47521] p-3 rounded-full z-20 transition-all duration-300"
              >
                <FaChevronLeft size={22} />
              </button>
            )}

            {showRightS && (
              <button 
                onClick={() => seasonRef.current.scrollBy({ left: 600, behavior: "smooth" })}
                className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/4 text-gray-400 hover:text-[#f47521] p-3 rounded-full z-20 transition-all duration-300"
              >
                <FaChevronRight size={22} />
              </button>
            )}

            {/* Seasons scroll container */}
            <div 
              ref={seasonRef}
              className="flex overflow-x-auto overflow-y-hidden gap-4 sm:gap-6 md:gap-8 snap-x snap-mandatory scrollbar-hide scroll-smooth pb-4"
            >
              {seasons.map((s, idx) => (
                <div 
                  key={idx}
                  className="relative group snap-start cursor-pointer flex-shrink-0 flex flex-col"
                >
                  <Link 
                    to={`/anime/${s.id}`}
                    className="block w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px]"
                  >
                    <div className={`relative overflow-hidden rounded-xl transition-all duration-500 aspect-[3/4] ${
                      s.isCurrent 
                        ? "bg-[#f47521]/20 border-2 border-[#f47521] p-1" 
                        : "bg-gray-900/40 border border-gray-700/50 hover:border-[#f47521]/50 p-1 group-hover:bg-gray-800/60"
                    }`}>
                      <img 
                        src={s.poster}
                        alt={s.name}
                        className="w-full h-full object-cover rounded-lg transition-all duration-500 group-hover:scale-150"
                      />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300 flex items-center justify-center">
                        <div className="text-center p-2">
                          <FaPlay className="text-[#f47521] text-lg mx-auto mb-2" />
                          <p className="text-xs text-white font-medium leading-tight">
                            {s.title || s.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className={`mt-2 text-xs sm:text-sm font-medium px-1 w-full text-center transition-colors duration-300 ${
                      s.isCurrent ? "text-[#f47521]" : "text-gray-300 group-hover:text-white"
                    }`}>
                      {s.name}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Promotional Videos Section */}
        {promotionalVideos.length > 0 && (
          <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: .6}}
          className="bg-gray-900/10 backdrop-blur-[.1px] border border-gray-700/50 rounded-xl py-6 md:px-8 px-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[#f47521] rounded-full"></div>
              <FaVideo className="text-[#f47521]" size={24} />
              Promotional Videos
            </h2>

            {/* Navigation arrows */}
            {showLeft && (
              <button 
                onClick={() => promoRef.current.scrollBy({ left: -800, behavior: "smooth" })}
                className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f47521] p-3 rounded-full z-20 transition-all duration-300"
              >
                <FaChevronLeft size={22} />
              </button>
            )}

            {showRight && (
              <button 
                onClick={() => promoRef.current.scrollBy({ left: 800, behavior: "smooth" })}
                className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f47521] p-3 rounded-full z-20 transition-all duration-300"
              >
                <FaChevronRight size={22} />
              </button>
            )}

            {/* Videos scroll container */}
            <div 
              ref={promoRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 md:gap-8 snap-x snap-mandatory scrollbar-hide scroll-smooth pb-2"
            >
              {promotionalVideos.map((vid, idx) => (
                <a 
                  key={idx}
                  href={vid.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative min-w-[160px] sm:min-w-[200px] md:min-w-[240px] lg:min-w-[280px] snap-start flex-shrink-0 group"
                >
                  {/* Image container with hover effect */}
                  <div className="relative overflow-hidden bg-gray-900/40 border border-gray-700/50 hover:border-[#f47521]/50 rounded-xl p-2 group-hover:bg-gray-800/60 transition-all duration-500">
                    <div className="w-full h-32 sm:h-36 md:h-40 lg:h-44 rounded-lg overflow-hidden">
                      <img 
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-150" 
                      />
                       
                    </div>
                    
                    <div className="absolute inset-2 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 rounded-lg">
                      <div className="bg-[#f47521]/20 border border-[#f47521] rounded-full p-3">
                        <FaPlay className="text-[#f47521] text-xl" />
                       
                      </div>
                      <p className="text-xs text-[#f47521] font-bold leading-tight">
                            YOUTUBE
                          </p>
                    </div>
                  </div>

                  {/* Title below image */}
                  <p className="mt-3 text-xs sm:text-sm text-gray-300 group-hover:text-white truncate px-1 transition-colors duration-300">
                    {vid.title}
                  </p>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Characters & Voice Actors Section */}
        {charactersVoiceActors.length > 0 && (
              <motion.div 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: .6}}
            
          className="bg-gray-900/10 backdrop-blur-[.1px] border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[#f47521] rounded-full"></div>
              <FaUsers className="text-[#f47521]" size={24} />
              Characters & Voice Actors
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {charactersVoiceActors.map((pair, idx) => (
                <div 
                  key={idx}
                  className="group flex items-center gap-3 sm:gap-4 bg-gray-800/40 hover:bg-gray-700/60 border border-gray-700/30 hover:border-[#f47521]/30 p-4 rounded-xl transition-all duration-300"
                >
                  {/* Character */}
                  <div className="flex items-center gap-3 w-1/2">
                    <div className="relative overflow-hidden rounded-lg border border-gray-600/50 group-hover:border-[#f47521]/50 transition-all duration-300">
                      <img 
                        src={pair.character?.poster}
                        alt={pair.character?.name}
                        className="w-12 h-16 sm:w-14 sm:h-20 md:w-16 md:h-24 object-cover transition-all duration-300 group-hover:scale-105" 
                      />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#f47521] truncate transition-colors duration-300">
                        {pair.character?.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-[#f47521] rounded-full"></div>
                        <p className="text-xs text-gray-400">Character</p>
                      </div>
                    </div>
                  </div>

                  {/* Voice Actor */}
                  <div className="flex items-center gap-3 w-1/2">
                    <div className="relative overflow-hidden rounded-lg border border-gray-600/50 group-hover:border-[#f47521]/50 transition-all duration-300">
                      <img 
                        src={pair.voiceActor?.poster}
                        alt={pair.voiceActor?.name}
                        className="w-12 h-16 sm:w-14 sm:h-20 md:w-16 md:h-24 object-cover transition-all duration-300 group-hover:scale-105" 
                      />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#f47521] truncate transition-colors duration-300">
                        {pair.voiceActor?.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                        <p className="text-xs text-gray-400 truncate">
                          {pair.voiceActor?.cast}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
