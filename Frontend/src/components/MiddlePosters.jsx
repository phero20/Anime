import React from "react";
import { FaPlay } from "react-icons/fa";
import { RiBookmarkLine } from "react-icons/ri";
import { MdLiveTv } from "react-icons/md";

export default function MiddlePosters({ data }) {
  const posterData = data || {};

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 bg-black text-white max-w-7xl mx-auto px-4 py-8 font-['Crunchyroll_Atyp',_sans-serif]">
      {/* Poster Image */}
      <div className="relative w-full lg:w-1/2 max-w-[700px] cursor-pointer">
        <img
          src={posterData.poster || ""}
          alt={posterData.name || "Anime poster"}
          className="w-full h-auto rounded object-cover"
        />
        <div className="bg-gray-950/90 top-0 absolute w-full h-full flex items-center justify-center hover:opacity-100 opacity-0 transition-all duration-500">
          To Series
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-4 w-[90%] lg:w-1/2 lg:text-left lg:items-start">
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
        <div className="flex flex-wrap gap-3 mt-2">
          <button className="flex items-center gap-2 bg-[#f47521] hover:bg-orange-600 text-black font-semibold px-4 py-2 text-sm rounded transition">
            <FaPlay />
            <span className="whitespace-nowrap">START WATCHING S1 E1</span>
          </button>
          <button className="flex items-center gap-2 border border-[#f47521] text-[#f47521] hover:bg-[#f47521]/10 font-semibold px-4 py-2 text-sm rounded transition">
            <RiBookmarkLine />
            <span className="whitespace-nowrap">ADD TO WATCHLIST</span>
          </button>
        </div>
      </div>
    </div>
  );
}