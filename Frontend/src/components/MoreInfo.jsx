import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

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

  if (!data?.anime?.info) return null;

  return (
    <section className="w-full bg-black text-white font-['Crunchyroll_Atyp',sans-serif]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 space-y-12 sm:space-y-16">

        {/* Seasons Section */}
        {seasons.length > 0 && (
          <div data-aos="zoom-out-up" className="relative">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 text-[#f47521]">
              Seasons
            </h2>

            {/* Navigation arrows */}
            {showLeftS && (
              <button 
                onClick={() => seasonRef.current.scrollBy({ left: -600, behavior: "smooth" })}
                className="hidden md:flex absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/4 p-2 rounded-full z-20 transition-colors"
              >
                <FaChevronLeft size={18} />
              </button>
            )}

            {showRightS && (
              <button 
                onClick={() => seasonRef.current.scrollBy({ left: 600, behavior: "smooth" })}
                className="hidden md:flex absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/4 p-2 rounded-full z-20 transition-colors"
              >
                <FaChevronRight size={18} />
              </button>
            )}

            {/* Seasons scroll container */}
            <div 
              ref={seasonRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 md:gap-8 h-[170px] sm:h-[190px] md:h-[220px] lg:h-[230px] snap-x snap-mandatory scrollbar-hide scroll-smooth"
            >
              {seasons.map((s, idx) => (
                <Link 
                  to={`/anime/${s.id}`}
                  key={idx}
                  className={`relative group snap-start cursor-pointer flex-shrink-0
                    w-[100px] h-[140px] sm:w-[120px] sm:h-[160px] md:w-[140px] md:h-[180px] lg:w-[160px] lg:h-[200px]
                    ${s.isCurrent ? "border-4 rounded-lg border-[#f47521] bg-[#f47521]" : ""}`}
                >
                  <div className="w-full h-full object-cover rounded-lg overflow-hidden">
                  <img 
                    src={s.poster}
                    alt={s.name}
                    className="w-full h-full transition-all duration-700  group-hover:scale-150"
                  />
                  </div>
                
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 w-full h-full bg-gray-950/80 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300 flex items-center justify-center p-2 text-center">
                    <p className="text-xs sm:text-sm text-[#f47521] leading-snug font-medium">
                      {s.title || s.name}
                    </p>
                  </div>

                  <p className={`mt-2 text-xs sm:text-sm font-medium px-1 truncate w-full text-center ${
                    s.isCurrent ? "text-[#f47521]" : "text-gray-300"
                  }`}>
                    {s.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Promotional Videos Section */}
        {promotionalVideos.length > 0 && (
          <div className="relative" data-aos="zoom-out-up">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 text-[#f47521]">
              Promotional <span className="text-white">Videos</span>
            </h2>

            {/* Navigation arrows */}
            {showLeft && (
              <button 
                onClick={() => promoRef.current.scrollBy({ left: -800, behavior: "smooth" })}
                className="hidden md:flex absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black p-2 rounded-full z-20 transition-colors"
              >
                <FaChevronLeft size={18} />
              </button>
            )}

            {showRight && (
              <button 
                onClick={() => promoRef.current.scrollBy({ left: 800, behavior: "smooth" })}
                className="hidden md:flex absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black p-2 rounded-full z-20 transition-colors"
              >
                <FaChevronRight size={18} />
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
                  className="relative min-w-[160px] sm:min-w-[200px] md:min-w-[240px] lg:min-w-[280px] snap-start flex-shrink-0"
                >
                  {/* Image container with hover effect */}
                  <div className="group relative rounded-lg overflow-hidden">
                    <div className="w-full h-32 sm:h-36 md:h-40 lg:h-44 object-cover" >
                    <img 
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full transition-all duration-700 group-hover:scale-150 object-cover" 
                    />
                    </div>
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <FaPlay className="text-[#f47521] text-xl sm:text-2xl" />
                    </div>
                  </div>

                  {/* Title below image */}
                  <p className="mt-2 text-xs sm:text-sm text-gray-300 truncate px-1">
                    {vid.title}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Characters & Voice Actors Section */}
        {charactersVoiceActors.length > 0 && (
          <div data-aos="zoom-out-up">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 text-[#f47521]">
              Characters & <span className="text-white">Voice Actors</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {charactersVoiceActors.map((pair, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 sm:gap-4 bg-gray-800/60 hover:bg-gray-700/60 p-3 sm:p-4 rounded-lg transition-colors duration-300"
                >
                  {/* Character */}
                  <div className="flex items-center gap-2 sm:gap-3 w-1/2">
                    <img 
                      src={pair.character?.poster}
                      alt={pair.character?.name}
                      className="w-12 h-16 sm:w-14 sm:h-20 md:w-16 md:h-24 object-cover rounded-lg flex-shrink-0" 
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {pair.character?.name}
                      </p>
                      <p className="text-xs text-gray-400">Character</p>
                    </div>
                  </div>

                  {/* Voice Actor */}
                  <div className="flex items-center gap-2 sm:gap-3 w-1/2">
                    <img 
                      src={pair.voiceActor?.poster}
                      alt={pair.voiceActor?.name}
                      className="w-12 h-16 sm:w-14 sm:h-20 md:w-16 md:h-24 object-cover rounded-lg flex-shrink-0" 
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {pair.voiceActor?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {pair.voiceActor?.cast}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
