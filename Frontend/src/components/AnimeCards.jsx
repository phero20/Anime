import React, { useRef, useEffect } from "react";
import Title from "./Title";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function AnimeCards({
  data,
  name,
  scroll,
  fetchMoreData,
  hasMore
}) {
  const scrollRef = useRef(null);
  // Always use a safe array for data
  const safeData = Array.isArray(data) ? data : [];
  // Remove unused showLeft and showRight
  // const [showLeft, setShowLeft] = useState(true);
  // const [showRight, setShowRight] = useState(true);

  useEffect(() => {
    if (!scroll || !scrollRef.current)
      return;
    // No need for handleScroll logic
  }, [scroll]);

  // Generate a unique navigation class/id from the name prop
  const navId = name ? name.replace(/\s+/g, '-') : 'animecards';

  // Duplicate cards if not enough to fill Swiper for autoplay/loop
  const maxVisibleSlides = 6; // adjust as needed for your breakpoints
  let swiperData = safeData;
  if (scroll && safeData.length > 0 && safeData.length <= maxVisibleSlides) {
    swiperData = Array(3).fill(safeData).flat(); // 3x duplication for safety
  }

  if (safeData.length === 0) {
    return <div className="text-center text-gray-400 py-8">No {name} found.</div>;
  }

  const renderCard = (item, index) => (
    <Link to={`/anime/${item.id}`} key={index}>
      <div {...(!scroll ? { 'data-aos': 'zoom-out-up' ,'data-aos-offset':'120' } : {})}
        className={
          `group cursor-pointer relative overflow-hidden snap-start flex-shrink-0 hover:shadow-xl transition-shadow ${scroll ? "min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] xl:min-w-[220px]" : "w-full"
          }`
        }>
        <div className="relative overflow-hidden">
          <div className="w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px] rounded-lg overflow-hidden">
            <img src={
              item.poster
            }
              alt={
                item.name
              }
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-150" />
          </div>

          <div className="px-2 sm:px-3 py-2">
            <h3 className="text-xs sm:text-sm font-semibold text-[#f47521] w-full line-clamp-2">
              {
                item.name
              } </h3>
            <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">
              {
                item.episodes?.sub && item.episodes?.dub ? "Sub | Dub" : item.episodes?.sub ? "Sub" : item.episodes?.dub ? "Dub" : ""
              } </div>
          </div>

          <div className="absolute inset-0 bg-gray-900/90 h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-2 sm:p-3 space-y-2 text-center">
            <p className="text-sm sm:text-base text-[#f47521] font-semibold line-clamp-3 leading-snug">
              {
                item.type || item.name
              } </p>

            <div className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm text-gray-200">
              {
                item.season && <span>Season {
                  item.season
                }</span>
              }

              {
                item.episodes && (
                  <div className="flex flex-col justify-center gap-1">
                    {
                      item.episodes.sub && (
                        <span className="flex gap-1 items-center">
                          <MdLiveTv className="text-[#f47521]"
                            size={14} />
                          <span>{
                            item.episodes.sub
                          }
                            Eps</span>
                        </span>
                      )
                    }
                    <span className="text-gray-300">
                      {
                        item.episodes.sub && "Sub"
                      }
                      {
                        item.episodes.sub && item.episodes.dub && " | "
                      }
                      {
                        item.episodes.dub && "Dub"
                      } </span>
                  </div>
                )
              } </div>

            {
              item.rating && (
                <span className="text-xs sm:text-sm text-gray-200">Rated: {
                  item.rating
                }</span>
              )
            } </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="w-full max-w-[98%] mx-auto px-2 sm:px-4 md:px-6 py-6 text-white font-['Crunchyroll_Atyp',_sans-serif] relative">
      <Title name={name}
        anime={scroll ? 'Animes' : ''} /> 
          {/* <>
            <button className={`swiper-prev-${navId} ${scroll ? 'opacity-100' : 'opacity-0'} absolute -left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full z-20 hidden md:flex`}>
              <FaChevronLeft size={18} />
            </button>
            <button className={`swiper-next-${navId} absolute ${scroll ? 'opacity-100' : 'opacity-0'} -right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full z-20 hidden md:flex`}>
              <FaChevronRight size={18} />
            </button>
          </> */}
        

      {
        scroll ? (
          <div className="relative">
            {/* Left gradient shadow */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-10 z-20 bg-gradient-to-r from-black via-black/10 to-transparent" /> {/* Right gradient shadow */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 z-20 bg-gradient-to-l from-black via-black/10 to-transparent" />
            <Swiper
              modules={[Navigation, Autoplay]}
              loop={true}
              freeMode={true}
              autoplay={{
                delay:0, // no delay between transitions
                disableOnInteraction: false, // keep auto-scrolling after user interaction
                pauseOnMouseEnter: false, // optional: pause on hover
              }}
              speed={4000} // higher = slower, lower = faster (try 4000ms for smoothness)
              navigation={{
                nextEl: `.swiper-next-${navId}`,
                prevEl: `.swiper-prev-${navId}`,
              }}
              // slidesPerGroup={data.length-1}
              slidesPerView="auto"
              spaceBetween={25}
              allowTouchMove={true}
              className="pb-4 scroll-smooth rounded-2xl bg-transparent relative z-10"
            >
              {swiperData.map((item, index) => (
                <SwiperSlide
                  key={index}
                  className="!w-[140px] sm:!w-[160px] md:!w-[180px] lg:!w-[200px] xl:!w-[220px] flex-shrink-0 snap-start"
                >
                  {renderCard(item, index % safeData.length)}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <InfiniteScroll dataLength={
            safeData.length
          }
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <p
                className="text-center py-4">Loading more...</p>
            }

            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 scrollbar-hide">
            {
              safeData.map(renderCard)
            } </InfiniteScroll>
        )
      } </div>
  );
}
