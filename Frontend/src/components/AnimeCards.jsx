import React, { useRef, useState, useEffect } from "react";
import Title from "./Title";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AnimeCards({ data, name }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = node;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    handleScroll(); 
    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">No {name} found.</div>
    );
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

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8 text-white font-['Crunchyroll_Atyp',_sans-serif] relative">
      <Title name={name} />

      {showLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black p-2 rounded-full z-20 hidden md:flex"
        >
          <FaChevronLeft size={18} />
        </button>
      )}

      {showRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black p-2 rounded-full z-20 hidden md:flex"
        >
          <FaChevronRight size={18} />
        </button>
      )}

      {/* Anime Scroll Row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-8 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="group cursor-pointer relative rounded-lg overflow-hidden min-w-[160px] sm:min-w-[200px] lg:min-w-[240px] snap-start flex-shrink-0 shadow-md hover:shadow-xl transition-shadow w-[260px]"
          >
            {/* Card Wrapper: Image + Title */}
            <div className="relative rounded-md overflow-hidden">
              {/* Image */}
              <img
                src={item.poster}
                alt={item.name}
                className="w-full h-[390px] object-cover"
              />

              {/* Bottom Title Info */}
              <div className="bg-[#0e0e10] px-3 py-2">
                <h3 className="text-sm font-semibold text-[#f47521] w-full truncate">
                  {item.name}
                </h3>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {item.episodes?.sub && item.episodes?.dub
                    ? "Sub / Dub"
                    : item.episodes?.sub
                    ? "Sub"
                    : item.episodes?.dub
                    ? "Dub"
                    : ""}
                </div>
              </div>

              {/* Hover Overlay — spans image + title */}
              <div className="absolute inset-0 bg-gray-950/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col p-3 space-y-2">
                <p className="text-[16px] text-[#f47521] font-semibold line-clamp-3 leading-snug">
                  {item.type || item.name}
                </p>
                <div className="flex gap-2 text-sm text-gray-200">
                  {item.season && <span>Season {item.season}</span>}
                  {item.episodes && (
                    <span>
                      {item.episodes.sub && item.episodes.dub
                        ? `${item.episodes.sub} Eps (Sub/Dub)`
                        : item.episodes.sub
                        ? `${item.episodes.sub} Eps (Sub)`
                        : item.episodes.dub
                        ? `${item.episodes.dub} Eps (Dub)`
                        : item.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
