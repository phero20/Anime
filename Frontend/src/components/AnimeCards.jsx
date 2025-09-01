import React, { useRef, useEffect } from "react";
import Title from "./Title";
import { FaHeart, FaBookmark } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../redux/apifetch/AuthSlicer';
import { addToFavorites, addToWatchlist } from '../redux/apifetch/userAnime';
import { useToast } from './Toast';
import 'swiper/css';
import 'swiper/css/navigation';
import LoadingAnimation from "./LoadingAnimation";

export default function AnimeCards({
  data,
  name,
  scroll,
  fetchMoreData,
  hasMore
}) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { success, error, loading, dismiss } = useToast();
  const scrollRef = useRef(null);
  const safeData = Array.isArray(data) ? data : [];

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

  const navId = name ? name.replace(/\s+/g, '-') : 'animecards';
  let swiperData = safeData;
  if (scroll && safeData.length > 0 && safeData.length <= 6) {
    swiperData = Array(3).fill(safeData).flat();
  }
  const swiperRef = useRef(null);

  useEffect(() => {
    if (!scroll) return;
    const interval = setInterval(() => {
      if (swiperRef.current && swiperRef.current.slideNext && swiperRef.current.autoplay && !swiperRef.current.autoplay.running) {
        swiperRef.current.slideNext();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [scroll]);

  const renderCard = (item, index) => (
    <Link to={`/anime/${item.id}`} key={index}>
      <div {...(!scroll ? { 'data-aos': 'zoom-out-up' ,'data-aos-offset':'120' } : {})}
        className={`group cursor-pointer relative overflow-hidden snap-start flex-shrink-0 transition-all duration-300 hover:shadow-lg ${scroll ? "min-w-[160px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] xl:min-w-[240px]" : "w-full"} h-[320px]`}
      >
        <div className="relative overflow-hidden bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] h-full flex flex-col">
          
          {/* Image container with fixed height */}
          <div className="relative w-full h-[220px] overflow-hidden rounded-t-lg flex-shrink-0">
            <img 
              src={item.poster} 
              alt={item.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            
            {/* Subtle dark overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Episode indicator - top left */}
            {item.episodes?.sub && (
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/70 rounded text-xs text-white">
                <MdLiveTv size={12} />
                <span>{item.episodes.sub}</span>
              </div>
            )}
            
            {/* Quality indicator - top right */}
            {item.episodes?.sub && item.episodes?.dub && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-[#f47521] rounded text-xs text-white font-medium">
                SUB | DUB
              </div>
            )}
          </div>
          
          {/* Content section with fixed height */}
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1">
                {item.name}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                {item.type && <span>{item.type}</span>}
                {item.season && item.type && <span>•</span>}
                {item.season && <span>Season {item.season}</span>}
              </div>
            </div>
            
            {/* Rating at bottom */}
            {item.rating && (
              <div className="text-xs text-gray-500">
                Rated: {item.rating}
              </div>
            )}
          </div>
          
          {/* Professional hover overlay - Crunchyroll style */}
          <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 space-y-4 rounded-lg">
            
            {/* Title and info */}
            <div className="text-center space-y-2">
              <h4 className="text-base font-bold text-white line-clamp-2 leading-tight">
                {item.name}
              </h4>
              
              {item.episodes?.sub && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                  <MdLiveTv className="text-[#f47521]" size={16} />
                  <span>{item.episodes.sub} Episodes</span>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                {item.type && <span>{item.type}</span>}
                {item.season && item.type && <span>•</span>}
                {item.season && <span>Season {item.season}</span>}
              </div>
              
              {item.rating && (
                <div className="text-xs text-gray-400">
                  Rated: {item.rating}
                </div>
              )}
            </div>
            
            {/* Clean action buttons */}
            <div className="flex gap-3" onClick={(e) => e.preventDefault()}>
              <button 
                type="button" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  handleAddToFavorites(item); 
                }} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f47521] hover:bg-[#e65a0a] text-white transition-colors duration-200 shadow-md"
                title="Add to Favorites"
              >
                <FaHeart size={16} />
              </button>
              
              <button 
                type="button" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  handleAddToWatchlist(item); 
                }} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200 shadow-md"
                title="Add to Watchlist"
              >
                <FaBookmark size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="w-full max-w-[98%] mx-auto px-2 sm:px-4 md:px-6 py-4 text-white font-['Crunchyroll_Atyp',_sans-serif] relative">
      <Title name={name} anime={scroll ? 'Animes' : ''} />
      
      {scroll ? (
        <div className="relative mt-4">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-8 z-20 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 z-20 bg-gradient-to-l from-black to-transparent" />
          
          <Swiper
            modules={[Navigation, Autoplay]}
            loop={true}
            autoplay={{ delay: 100, disableOnInteraction: false, pauseOnMouseEnter: false }}
            speed={4000}
            navigation={{ nextEl: `.swiper-next-${navId}`, prevEl: `.swiper-prev-${navId}`}}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            slidesPerView="auto"
            spaceBetween={16}
            allowTouchMove={true}
            className="pb-4 scroll-smooth rounded-2xl bg-transparent relative z-10"
          >
            {swiperData.map((item, index) => (
              <SwiperSlide key={index} className="!w-[160px] sm:!w-[180px] md:!w-[200px] lg:!w-[220px] xl:!w-[240px] flex-shrink-0 snap-start">
                {renderCard(item, index % safeData.length)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="mt-4">
          <InfiniteScroll
            dataLength={safeData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className="p-4 w-full"><LoadingAnimation /></div>}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 scrollbar-hide"
          >
            {safeData.map(renderCard)}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}