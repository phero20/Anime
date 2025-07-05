import React from "react";
import { FaPlay } from "react-icons/fa";
import { RiBookmarkLine } from "react-icons/ri";
import { MdLiveTv } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function MiddlePosters({ data }) {
  const posterData = data || {};
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-7xl mx-auto px-6 bg-black mb-12 text-white font-['Crunchyroll_Atyp',_sans-serif]">
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
        {/* Poster Image */}
        <div className="relative w-full lg:w-1/2 max-w-[600px] cursor-pointer overflow-hidden rounded group">
          <img
            src={posterData.poster || ""}
            alt={posterData.name || "Anime poster"}
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-150"
            onClick={() => navigate(`/anime/${posterData.id}`)}
          />
          <div onClick={() => navigate(`/anime/${posterData.id}`)} className="bg-gray-950/90 top-0 absolute w-full h-full flex items-center justify-center group-hover:opacity-100 opacity-0 transition-all duration-500">
            To Series
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col gap-4 w-[95%] lg:w-1/2 lg:text-left lg:items-start">
          <h2 className="text-xl sm:text-2xl font-semibold">
            {posterData.name || "Untitled"}
          </h2>

          {/* Episodes & Language */}
          <div className="text-sm flex flex-col text-[#f47521] gap-1">
            {posterData.episodes?.sub !== undefined && (
              <div className="flex items-center gap-1">
                <MdLiveTv className="text-base" />
                {`${posterData.episodes.sub || 0} Episodes`}
              </div>
            )}
            <p className="text-xs text-gray-400">
              {posterData.episodes?.sub && "Sub"}
              {posterData.episodes?.sub && posterData.episodes?.dub && " | "}
              {posterData.episodes?.dub && "Dub"}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed">
            {posterData.description?.length > 250
              ? posterData.description.slice(0, 250) + "..."
              : posterData.description || "No description available."}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button className="flex items-center justify-center gap-2 bg-[#f47521] hover:bg-orange-600 text-black font-semibold px-4 py-2 text-sm rounded transition">
              <FaPlay />
              <span className="whitespace-nowrap">START WATCHING S1 E1</span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-[#f47521] text-[#f47521] hover:bg-[#f47521]/10 font-semibold px-4 py-2 text-sm rounded transition">
              <RiBookmarkLine />
              <span className="whitespace-nowrap">ADD TO WATCHLIST</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}