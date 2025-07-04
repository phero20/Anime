import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function MoreInfo({ data }) {
  if (!data?.anime?.info)
    return null;


  const promotionalVideos = data.anime.info.promotionalVideos || [];
  const charactersVoiceActors = data.anime.info.charactersVoiceActors || [];
  const seasons = data.seasons || [];
  const seasonRef = useRef(null);
  const promoRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      if (!promoRef.current)
        return;

      const { scrollLeft, scrollWidth, clientWidth } = promoRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
    };
    updateScroll();
    promoRef.current?.addEventListener("scroll", updateScroll);
    return () => promoRef.current?.removeEventListener("scroll", updateScroll);
  }, [promotionalVideos.length]);


  const [showLeftS, setShowLeftS] = useState(false);
  const [showRightS, setShowRightS] = useState(false);

  useEffect(() => {
    const update = () => {
      if (!seasonRef.current)
        return;

      const { scrollLeft, scrollWidth, clientWidth } = seasonRef.current;
      setShowLeftS(scrollLeft > 0);
      setShowRightS(scrollLeft + clientWidth < scrollWidth - 1);
    };
    update(); // initial
    seasonRef.current?.addEventListener("scroll", update);
    return () => seasonRef.current?.removeEventListener("scroll", update);
  }, [seasons.length]);

  return (
    <section className="w-full bg-black text-white font-['Crunchyroll_Atyp',sans-serif]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-14">


        {/* ───── Seasons ───── */}
        {
          seasons.length > 0 && (
            <div data-aos="zoom-out-up" className="relative">
              <h2 className="text-xl md:text-2xl font-semibold mb-5 text-[#f47521]">
                Seasons
              </h2>

              {/* ← arrow */}
              {
                showLeftS && (
                  <button onClick={
                    () => seasonRef.current.scrollBy({ left: -600, behavior: "smooth" })
                  }
                    className="hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 hover:bg-black p-2 rounded-full z-20">
                    <FaChevronLeft />
                  </button>
                )
              }

              {/* → arrow */}
              {
                showRightS && (
                  <button onClick={
                    () => seasonRef.current.scrollBy({ left: 600, behavior: "smooth" })
                  }
                    className="hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 hover:bg-black p-2 rounded-full z-20">
                    <FaChevronRight />
                  </button>
                )
              }

              {/* scroll container */}
              <div ref={seasonRef}
                className="flex overflow-x-auto gap-8 h-[180px] sm:h-[210px] md:h-[250px] lg:h-[270px] snap-x snap-mandatory scrollbar-hide scroll-smooth pb-2">
                {
                  seasons.map((s, idx) => (
                    <Link to={
                      `/anime/${s.id
                      }`
                    }
                      key={idx}
                      className={
                        `relative group snap-start cursor-pointer
                         w-[100px] h-[150px]
                         sm:w-[120px] sm:h-[180px]
                         md:w-[140px] md:h-[210px]
                         lg:w-[160px] lg:h-[240px]
                         ${s.isCurrent ? "border-4 rounded border-[#f47521] bg-[#f47521]" : ""}`
                      }>
                      <img src={
                        s.poster
                      }
                        alt={
                          s.name
                        }
                        className="w-full h-full object-cover rounded"
                      /> {/* hover overlay */}
                      <div className="absolute inset-0 w-full h-full bg-gray-950/80 opacity-0 group-hover:opacity-100 rounded transition flex items-center justify-center p-2 text-center">
                        <p className="text-xs text-[#f47521] leading-snug">
                          {
                            s.title || s.name
                          }</p>
                      </div>

                      <p className={`mt-2 text-xs font-medium px-0.5 truncate w-full text-center  ${s.isCurrent ? "text-[#f47521]" : ""} `}>
                        {
                          s.name
                        }</p>
                    </Link>
                  ))
                } </div>
            </div>
          )
        }


        {/* ───── Promotional Videos ───── */}
        {
          promotionalVideos.length > 0 && (
            <div className="relative" data-aos="zoom-out-up">
              <h2 className="text-xl md:text-2xl font-semibold mb-5 text-[#f47521]">Promotional 
               <span className="text-white">  Videos</span>
              </h2>

              {
                showLeft && (
                  <button onClick={
                    () => promoRef.current.scrollBy({ left: -800, behavior: "smooth" })
                  }
                    className="hidden md:flex absolute -left-10 top-1/2 -translate-y-1/2 hover:bg-black p-2 rounded-full z-20">
                    <FaChevronLeft />
                  </button>
                )
              }

              {
                showRight && (
                  <button onClick={
                    () => promoRef.current.scrollBy({ left: 800, behavior: "smooth" })
                  }
                    className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 hover:bg-black p-2 rounded-full z-20">
                    <FaChevronRight />
                  </button>
                )
              }

              <div ref={promoRef}
                className="flex overflow-x-auto space-x-6 snap-x snap-mandatory scrollbar-hide scroll-smooth pb-2">
                {
                  promotionalVideos.map((vid, idx) => (
                    <a key={idx}
                      href={
                        vid.source
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative min-w-[180px] sm:min-w-[220px] lg:min-w-[260px] snap-start">
                      {/* Image container with hover effect */}
                      <div className="group relative rounded overflow-hidden">
                        <img src={
                          vid.thumbnail
                        }
                          alt={
                            vid.title
                          }
                          className="w-full h-40 sm:h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center">
                          <FaPlay className="text-[#f47521] text-2xl" />
                        </div>
                      </div>

                      {/* Title below image */}
                      <p className="mt-2 text-sm truncate">
                        {
                          vid.title
                        }</p>
                    </a>
                  ))
                } </div>
            </div>
          )
        }


        {/* ───── Characters & Voice Actors ───── */}
        {
          charactersVoiceActors.length > 0 && (
            <div data-aos="zoom-out-up">
              <h2 className="text-xl md:text-2xl font-semibold mb-5 text-[#f47521]">
              Characters & <span className="text-white">   Voice Actors</span>
              </h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {
                  charactersVoiceActors.map((pair, idx) => (
                    <div key={idx}
                      className="flex items-center gap-4 bg-gray-800/60 p-4 rounded">
                      {/* Character */}
                      <div className="flex items-center gap-3 w-1/2">
                        <img src={
                          pair.character?.poster
                        }
                          alt={
                            pair.character?.name
                          }
                          className="w-16 h-24 object-cover rounded" />
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold">
                            {
                              pair.character?.name
                            }</p>
                          <p className="text-xs text-gray-400">Character</p>
                        </div>
                      </div>

                      {/* Voice Actor */}
                      <div className="flex items-center gap-3 w-1/2">
                        <img src={
                          pair.voiceActor?.poster
                        }
                          alt={
                            pair.voiceActor?.name
                          }
                          className="w-16 h-24 object-cover rounded" />
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold">
                            {
                              pair.voiceActor?.name
                            }</p>
                          <p className="text-xs text-gray-400">
                            {
                              pair.voiceActor?.cast
                            }</p>
                        </div>
                      </div>
                    </div>
                  ))
                } </div>
            </div>
          )
        } </div>
    </section>
  );
}
