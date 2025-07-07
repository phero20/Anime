import React, { useEffect, useState, useRef } from "react";
import { FaPlay, FaPlus } from "react-icons/fa";
import {RiBookmarkLine} from "react-icons/ri"
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setEpisodeImage, clearEpisodeImage } from '../redux/apifetch/GetanimeDataSlice';



export default function Homeview({AnimeData, loading}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const slides =
    !loading &&
    AnimeData &&
    AnimeData.data &&
    AnimeData.data.data &&
    Array.isArray(AnimeData.data.data.spotlightAnimes)
      ? AnimeData.data.data.spotlightAnimes
      : [];

  // Carousel navigation
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetTimeout();
  };

  const resetTimeout = () => {
    clearTimeout(timeoutRef.current);
    
    // Use CSS animation for smooth progress
    const duration = 5000; // 9 seconds
    
    timeoutRef.current = setTimeout(nextSlide, duration);
  };

  useEffect(() => {
    if (slides.length > 0) {
      resetTimeout();
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, slides.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f47521] mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg text-gray-400"></p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative min-h-screen bg-black text-white font-['Crunchyroll_Atyp',_sans-serif] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={currentSlide.poster}
          alt={`${currentSlide.name} Poster`}
          className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-screen flex items-end md:items-center pb-24 md:pb-0">
        <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col items-center md:items-start justify-center h-full max-w-2xl lg:max-w-3xl mx-auto md:mx-0">
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-4 sm:mb-6 text-[#f47521] drop-shadow-lg text-center md:text-left">
              {currentSlide.name}
            </h1>
            
            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed mb-6 sm:mb-8 max-w-xl lg:max-w-2xl text-center md:text-left">
              {currentSlide.description.length > 400
                ? `${currentSlide.description.slice(0, 400)}...`
                : currentSlide.description}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10">
            <button 
             onClick={()=>{navigate(`/episodes/${currentSlide.id}`)
             dispatch(clearEpisodeImage());
             dispatch(setEpisodeImage(currentSlide.poster));
       }}
            className="flex items-center gap-2 bg-[#f47521] hover:bg-[#e66713] text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl">
            <FaPlay size={12} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
                                    Watch Now
                                </button>
              <button className="flex items-center gap-2 border-2 border-[#f47521] text-[#f47521] hover:bg-[#f47521] hover:text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 transform hover:scale-105">
              <RiBookmarkLine size={20}/>
                Add to Crunchylist
              </button>
            </div>

            {/* Carousel Indicators */}
            <div className="flex gap-2 sm:gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full relative overflow-hidden ${
                    index === currentIndex
                      ? "bg-gray-600 scale-110"
                      : "bg-gray-600 hover:bg-[#f47521]/70"
                  }`}
                  style={{
                    width: index === currentIndex ? '3rem' : '2rem',
                    height: '0.5rem'
                  }}
                >
                  {index === currentIndex && (
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#f47521] animate-progress rounded-full"
                      style={{ 
                        animationDuration: '5s',
                        animationFillMode: 'forwards'
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-specific overlay for better text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent md:hidden" />
    </div>
  );
}
