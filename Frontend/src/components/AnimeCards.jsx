import React, { useRef, useEffect } from "react";
import Title from "./Title";
import { FaHeart, FaBookmark, FaPlay } from "react-icons/fa";
import { MdVideoLibrary, MdVerified, MdSecurity } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../redux/apifetch/AuthSlicer';
import { addToFavorites, addToWatchlist } from '../redux/apifetch/userAnime';
import { setShowAuthModel } from '../redux/apifetch/uiSlice';
import { useToast } from './Toast';
import 'swiper/css';
import 'swiper/css/navigation';
import LoadingAnimation from "./LoadingAnimation";
import { motion } from 'framer-motion';

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
      dispatch(setShowAuthModel(true));
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
      dispatch(setShowAuthModel(true));
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

  // Handle mouse interactions for better UX
  useEffect(() => {
    if (!scroll || !swiperRef.current) return;

    const swiperEl = swiperRef.current.el;
    if (!swiperEl) return;

    const handleMouseEnter = () => {
      if (swiperRef.current?.autoplay) {
        swiperRef.current.autoplay.stop();
      }
    };

    const handleMouseLeave = () => {
      if (swiperRef.current?.autoplay) {
        // Restart autoplay after a delay to avoid conflicts
        setTimeout(() => {
          if (swiperRef.current?.autoplay) {
            swiperRef.current.autoplay.start();
          }
        }, 1000);
      }
    };

    const handleTouchStart = () => {
      if (swiperRef.current?.autoplay) {
        swiperRef.current.autoplay.stop();
      }
    };

    const handleTouchEnd = () => {
      if (swiperRef.current?.autoplay) {
        setTimeout(() => {
          if (swiperRef.current?.autoplay) {
            swiperRef.current.autoplay.start();
          }
        }, 2000);
      }
    };

    swiperEl.addEventListener('mouseenter', handleMouseEnter);
    swiperEl.addEventListener('mouseleave', handleMouseLeave);
    swiperEl.addEventListener('touchstart', handleTouchStart);
    swiperEl.addEventListener('touchend', handleTouchEnd);

    return () => {
      swiperEl.removeEventListener('mouseenter', handleMouseEnter);
      swiperEl.removeEventListener('mouseleave', handleMouseLeave);
      swiperEl.removeEventListener('touchstart', handleTouchStart);
      swiperEl.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scroll, swiperRef.current]);

  const renderCard = (item, index) => (
    <Link to={`/anime/${item.id}`} key={index}>
      <motion.div
        {...(!scroll ? {
          initial: { opacity: 0, y: 60 },
          whileInView: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -40 },
          viewport: { once: false },
          transition: { duration: .6 }
        } : {})}
        className={`group cursor-pointer relative overflow-hidden snap-start flex-shrink-0 transition-all duration-300 ${scroll ? "min-w-[140px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[230px] xl:min-w-[270px]" : "w-full"}`}
      >
        {/* Crunchyroll-style Card Container */}
        <div className="relative overflow-hidden group-hover:border-[#f47521]/50 transition-all duration-500">

          {/* Image Container - Crunchyroll aspect ratio */}
          <div className="relative w-full aspect-[2/3] rounded-md overflow-hidden">
            <img
              src={item.poster}
              alt={item.name}
              className="w-full h-full object-cover rounded-md transition-transform duration-500 group-hover:scale-150"
            />
            {item.rating && (
              <div className=" flex items-center gap-1 absolute top-3 right-3 p-1 text-sm rounded-md bg-gray-950/50 backdrop-blur-sm">
                <MdSecurity className="text-[#f47521]" size={14} />
                <span>{item.rating}</span>
              </div>
            )}
            {/* Hover Overlay */}
            <div className="absolute inset-0 rounded-md flex justify-center items-center bg-gray-950/80 opacity-0 group-hover:opacity-100 transition-all duration-500">
              {/* Top Action Buttons */}
              <div className="absolute bottom-3 left-3 flex gap-3" onClick={(e) => e.preventDefault()}>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToFavorites(item); }}
                  className="w-6 h-6 md:h-10 md:w-10  flex items-center justify-center rounded-full bg-gray-900/80 backdrop-blur-sm border text-gray-400 border-[#f47521] hover:text-[#f47521] hover:bg-[#f47521]/10 transition-all duration-300"
                  title="Add to Favorites"
                >
                  <FaHeart className="text-xs md:text-base" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToWatchlist(item); }}
                  className="w-6 h-6 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-gray-900/80 backdrop-blur-sm border text-gray-400 border-[#f47521] hover:text-[#f47521] hover:bg-[#f47521]/10 transition-all duration-300"
                  title="Add to Watchlist"
                >
                  <FaBookmark className="text-xs md:text-base" />
                </button>
              </div>

              {/* Bottom Info on Hover */}
              <div className="absolute top-3 left-1 right-0 p-3">
                <div className="space-y-1">
                  {item.type && (
                    <span className="md:inline-block bg-[#f47521]/20 text-[#f47521] px-2 py-1 rounded text-xs font-medium border border-[#f47521]/30">
                      {item.type}
                    </span>
                  )}
                  {item.episodes?.sub && (
                    <div className="hidden md:flex items-center gap-1 text-sm text-gray-300">
                      <MdVideoLibrary className="text-[#f47521]" size={12} />
                      <span>Sub | {item.episodes.sub} Episodes</span>
                    </div>
                  )}
                  {item.episodes?.dub && (
                    <div className="hidden md:flex items-center gap-1 text-sm text-gray-300">
                      <MdVideoLibrary className="text-[#f47521]" size={12} />
                      <span>Dub | {item.episodes.dub} Episodes</span>
                    </div>
                  )}


                </div>
              </div>

              <div className="hover:scale-110 rounded-full p-3 text-[#f47521] cursor-pointer border border-[#f47521]/50 hover:text-[#f47521] bg-[#f47521]/10 transition-all duration-500"><FaPlay className="text-xs md:text-lg" /> </div>
            </div>
          </div>

          {/* Content Section - Always Visible */}
          <div className="p-3 space-y-2">
            {/* Title */}
            <h3 className="text-sm font-bold text-white group-hover:text-[#f47521] transition-colors duration-300 line-clamp-2 leading-tight">
              {item.name}
            </h3>

            {/* Episode Info - Always Visible */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                {item.episodes?.sub && <span>Sub</span>}
                {item.episodes?.sub && item.episodes?.dub && <span>|</span>}
                {item.episodes?.dub && <span>Dub</span>}
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );

  return (
    <div className="w-full max-w-[98%] mx-auto px-2 sm:px-4 md:px-6 py-4 text-white font-['Crunchyroll_Atyp',_sans-serif] relative">
      <div className={`${scroll ? 'my-0' : 'my-6'}`}>
        <Title name={name} anime={scroll ? 'Animes' : ''} />
      </div>
      {scroll ? (
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-10 z-20 bg-gradient-to-r from-black via-black/10 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 z-20 bg-gradient-to-l from-black via-black/10 to-transparent" />
          <Swiper
            modules={[Navigation, Autoplay]}
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
              reverseDirection: false
            }}
            speed={900}
            navigation={{ nextEl: `.swiper-next-${navId}`, prevEl: `.swiper-prev-${navId}` }}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            slidesPerView="auto"
            spaceBetween={30}
            allowTouchMove={true}
            grabCursor={true}
            watchOverflow={true}
            touchRatio={1.5}
            touchAngle={45}
            longSwipes={true}
            longSwipesRatio={0.3}
            longSwipesMs={300}
            followFinger={true}
            shortSwipes={true}
            threshold={10}
            touchMoveStopPropagation={false}
            simulateTouch={true}
            touchStartPreventDefault={false}
            touchStartForcePreventDefault={false}
            resistance={true}
            resistanceRatio={0.85}
            className="pb-4 scroll-smooth rounded-2xl bg-transparent relative z-10"
          >
            {swiperData.map((item, index) => (
              <SwiperSlide key={index} className="!w-[140px] sm:!w-[180px] md:!w-[200px] lg:!w-[230px] xl:!w-[270px] flex-shrink-0 snap-start">
                {renderCard(item, index % safeData.length)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="w-full">
          <InfiniteScroll
            dataLength={safeData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <div className="col-span-full flex justify-center items-center py-8">
                <LoadingAnimation />
              </div>
            }
           
            className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
            style={{ overflow: 'visible' }}
          >
            {safeData.map(renderCard)}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}