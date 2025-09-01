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
        error(result.message || 'Failed to add to watchlist');
      }
    } catch (err) {
      error(err?.response?.data?.message || 'Failed to add to watchlist');
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
        className={`group cursor-pointer relative overflow-hidden snap-start flex-shrink-0 hover:shadow-xl transition-shadow ${scroll ? "min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] xl:min-w-[220px]" : "w-full"}`}
      >
        <div className="relative overflow-hidden">
          <div className="w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px] rounded-lg overflow-hidden">
            <img src={item.poster} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-150" />
          </div>
          <div className="px-2 sm:px-3 py-2">
            <h3 className="text-xs sm:text-sm font-semibold text-[#f47521] w-full line-clamp-2">{item.name}</h3>
            <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">
              {item.episodes?.sub && item.episodes?.dub ? "Sub | Dub" : item.episodes?.sub ? "Sub" : item.episodes?.dub ? "Dub" : ""}
            </div>
          </div>
          <div className="absolute inset-0 bg-gray-900/90 h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-2 sm:p-3 space-y-2 text-center">
            <p className="text-sm sm:text-base text-[#f47521] font-semibold line-clamp-3 leading-snug">{item.type || item.name}</p>
            <div className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm text-gray-200">
              {item.season && <span>Season {item.season}</span>}
              {item.episodes?.sub && (
                <span className="flex gap-1 items-center justify-center">
                  <MdLiveTv className="text-[#f47521]" size={14} />
                  <span>{item.episodes.sub} Eps</span>
                </span>
              )}
            </div>
            {item.rating && <span className="text-xs sm:text-sm text-gray-200">Rated: {item.rating}</span>}
            <div className="absolute left-3 bottom-3 flex gap-2" onClick={(e) => e.preventDefault()}>
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToFavorites(item); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f47521] text-white shadow-lg hover:bg-[#e65a0a] transition-colors" title="Add to Favorites">
                <FaHeart size={14} />
              </button>
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToWatchlist(item); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors" title="Add to Watchlist">
                <FaBookmark size={14} />
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
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-10 z-20 bg-gradient-to-r from-black via-black/10 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 z-20 bg-gradient-to-l from-black via-black/10 to-transparent" />
          <Swiper
            modules={[Navigation, Autoplay]}
            loop={true}
            autoplay={{ delay: 100, disableOnInteraction: false, pauseOnMouseEnter: false }}
            speed={4000}
            navigation={{ nextEl: `.swiper-next-${navId}`, prevEl: `.swiper-prev-${navId}`}}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            slidesPerView="auto"
            spaceBetween={35}
            allowTouchMove={true}
            className="pb-4 scroll-smooth rounded-2xl bg-transparent relative z-10"
          >
            {swiperData.map((item, index) => (
              <SwiperSlide key={index} className="!w-[140px] sm:!w-[160px] md:!w-[180px] lg:!w-[200px] xl:!w-[220px] flex-shrink-0 snap-start">
                {renderCard(item, index % safeData.length)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={safeData.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<div className="p-4 w-full"><LoadingAnimation /></div>}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 scrollbar-hide"
        >
          {safeData.map(renderCard)}
        </InfiniteScroll>
      )}
    </div>
  );
}