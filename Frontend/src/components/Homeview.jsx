import React, { useEffect, useState, useRef } from "react";
import { FaPlay, FaPlus } from "react-icons/fa";
import {RiBookmarkLine,RiAddFill} from "react-icons/ri"
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from 'react-redux';
import { setEpisodeImage, clearEpisodeImage } from '../redux/apifetch/GetanimeDataSlice';
import LoadingAnimation from "./LoadingAnimation";
import { selectUser } from '../redux/apifetch/AuthSlicer';
import { addToFavorites, addToWatchlist } from '../redux/apifetch/userAnime';
import { useToast } from './Toast';


export default function Homeview({AnimeData, loading}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { success, error, dismiss } = useToast();



 const handleAddToFavorites = async (item) => {
    if (!user) {
      error('Please login to add to favorites');
      return;
    }
    

    try {
      const result = await dispatch(addToFavorites({ 
        token: user.token,
        anime: { id: item.id, name: item.name, poster: item.poster, episodes: item.episodes }
      })).unwrap();

   

      if (result.success) {
        success(result.message || `${item.name} added to favorites!`);
      } else {
        const errorMessage = result.message || (result.error?.message) || 'Failed to add to favorites';
        error(errorMessage);
      }
    } catch (err) {
     
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to add to favorites';
      error(errorMessage);
    }
  };

  const handleAddToWatchlist = async (item) => {
    if (!user) {
      error('Please login to add to watchlist');
      return;
    }
    try {
      const result = await dispatch(addToWatchlist({ 
        token: user.token,
        anime: { id: item.id, name: item.name, poster: item.poster, episodes: item.episodes }
      })).unwrap();

      if (result.success) {
        success(result.message || 'Added to watchlist successfully');
      } else {
        error(result.message || (result.error?.message) || 'Failed to add to watchlist');
      }
    } catch (err) {
      error(err?.response?.data?.message || err?.message || 'Failed to add to watchlist');
    }
  };

















  const slides =
    !loading &&
    AnimeData &&
    AnimeData.data &&
    AnimeData.data.data &&
    Array.isArray(AnimeData.data.data.spotlightAnimes)
      ? AnimeData.data.data.spotlightAnimes
      : [];

  // Carousel navigation
  // Add custom animations
  useEffect(() => {
    // Add these keyframes to the document if they don't exist
    if (!document.querySelector('#custom-animations')) {
      const style = document.createElement('style');
      style.id = 'custom-animations';
      style.textContent = `
        @keyframes kenBurns {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        @keyframes titleFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes descriptionFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          50% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes buttonsFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          70% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
             @keyframes indicatorsFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          70% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-title-fade-in {
          animation: titleFadeIn 0.8s ease-out forwards;
        }
        .animate-description-fade-in {
          animation: descriptionFadeIn 1s ease-out forwards;
        }
        .animate-buttons-fade-in {
          animation: buttonsFadeIn 1.1s ease-out forwards;
        }
        .animate-indicators-fade-in {
          animation: indicatorsFadeIn 1.2s ease-out forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

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
      <div className='w-full overflow-hidden'>
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
          <LoadingAnimation />
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
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={currentSlide.poster}
          alt={`${currentSlide.name} Poster`}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out transform scale-105 animate-ken-burns"
          style={{
            animation: 'kenBurns 15s ease-in-out infinite alternate'
          }}
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/40 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-black/20 to-transparent opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.9)_100%)]" />
      </div>

      {/* Content Container with Improved Layout */}
      <div className="relative z-10 h-screen flex items-end md:items-center pb-0">
        <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col items-center md:items-start justify-center h-full max-w-2xl lg:max-w-3xl mx-auto md:mx-0">
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4 sm:mb-6 text-center md:text-left animate-title-fade-in">
              <span className="text-[#f47521]">
                {currentSlide.name}
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed mb-8 sm:mb-10 max-w-xl lg:max-w-2xl text-center md:text-left animate-description-fade-in">
              {currentSlide.description.length > 400
                ? `${currentSlide.description.slice(0, 400)}...`
                : currentSlide.description}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-row items-center gap-2 mb-8 sm:mb-10 animate-buttons-fade-in">
              <button 
                onClick={() => {
                  navigate(`/episodes/${currentSlide.id}`);
                  dispatch(clearEpisodeImage());
                  dispatch(setEpisodeImage(currentSlide.poster));
                }}
                className="group flex items-center gap-2 bg-[#f47521] text-white font-bold px-3 py-2 rounded-lg transition-all duration-300 text-sm hover:bg-[#e65a0a]"
              >
                <FaPlay size={12} />
                <span>Watch Now</span>
              </button>

              <button 
                title="Add to Watchlist" 
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToWatchlist(currentSlide); }}
                className="group flex items-center gap-2 bg-transparent border border-[#f47521] text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:bg-[#f47521]"
              >
                <RiBookmarkLine size={14} className="text-[#f47521] group-hover:text-white" />
                <span>Add to List</span>
              </button>

              <button 
               title="Add to Favorites"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToFavorites(currentSlide); }}
                className="group flex items-center justify-center h-9 w-9 bg-transparent border border-[#f47521] text-[#f47521] rounded-lg transition-all duration-300 hover:bg-[#f47521] hover:text-white"
              >
                <RiAddFill size={16} className="transform group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Enhanced Carousel Indicators */}
            <div className="flex gap-2 sm:gap-3 animate-indicators-fade-in">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="group relative"
                >
                  <div
                    className={`transition-all duration-300 rounded-full relative overflow-hidden ${
                      index === currentIndex
                        ? "bg-gray-600 scale-110"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    style={{
                      width: index === currentIndex ? '2.5rem' : '2rem',
                      height: '0.4rem'
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
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
