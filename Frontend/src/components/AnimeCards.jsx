import React, { useRef, useState, useEffect } from "react";
import Title from "./Title";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";

export default function AnimeCards({ data, name, scroll, fetchMoreData, hasMore }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  useEffect(() => {
    if (!scroll || !scrollRef.current) return;
    const node = scrollRef.current;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = node;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    handleScroll();
    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, [scroll]);

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-center text-gray-400 py-8">No {name} found.</div>;
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -900, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 900, behavior: "smooth" });
    }
  };

  const renderCard = (item, index) => (
    <div
      key={index}
      {...(!scroll ? { 'data-aos': 'zoom-out-up' } : {})}
      className={`group cursor-pointer relative rounded-lg overflow-hidden snap-start flex-shrink-0 hover:shadow-xl transition-shadow ${
        scroll ? "min-w-[160px] sm:min-w-[200px] lg:min-w-[240px] w-[260px]" : "w-full sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[240px]"
      }`}
    >
      <div className="relative rounded-md overflow-hidden">
        <img
          src={item.poster}
          alt={item.name}
          className="w-full h-[220px] sm:h-[300px] md:h-[340px] xl:h-[390px] rounded-md object-cover"
        />
        <div className="px-3 py-2">
          <h3 className="text-sm font-semibold text-[#f47521] w-full">
            {item.name}
          </h3>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {item.episodes?.sub && item.episodes?.dub
              ? "Sub | Dub"
              : item.episodes?.sub
              ? "Sub"
              : item.episodes?.dub
              ? "Dub"
              : ""}


              
          </div>
        </div>

        <div className="absolute inset-0 bg-gray-950/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col p-3 space-y-2">
          <p className="text-[16px] text-[#f47521] font-semibold line-clamp-3 leading-snug">
            {item.type || item.name}
          </p>

          <div className="flex flex-col gap-2 text-sm text-gray-200">
            {item.season && <span>Season {item.season}</span>}

            {item.episodes && (
              <div className="flex flex-col gap-1">
                {item.episodes.sub && (
                  <span className="flex items-center gap-1">
                    <MdLiveTv className="text-[#f47521]" /> {item.episodes.sub} Eps
                  </span>
                )}
                <span className="text-gray-300">
                  {item.episodes.sub && "Sub"}
                  {item.episodes.sub && item.episodes.dub && " | "}
                  {item.episodes.dub && "Dub"}
                </span>
              </div>
            )}
          </div>

          {item.rating && (
            <span className="text-sm text-gray-200">Rating: {item.rating}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8 text-white font-['Crunchyroll_Atyp',_sans-serif] relative">
      <Title name={name} />

      {scroll && showLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black p-2 rounded-full z-20 hidden md:flex"
        >
          <FaChevronLeft size={18} />
        </button>
      )}

      {scroll && showRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black p-2 rounded-full z-20 hidden md:flex"
        >
          <FaChevronRight size={18} />
        </button>
      )}

      {scroll ? (
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-10 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {data.map(renderCard)}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={data.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<p className="text-center py-4">Loading more...</p>}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 scrollbar-hide"
        >
          {data.map(renderCard)}
        </InfiniteScroll>
      )}
    </div>
  );
}
