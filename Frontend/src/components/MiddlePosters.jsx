import React from "react";
import { FaPlay, FaHeart } from "react-icons/fa";
import { RiBookmarkLine } from "react-icons/ri";
import { MdVideoLibrary, MdSecurity } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from 'react-redux';
import { setEpisodeImage, clearEpisodeImage } from '../redux/apifetch/GetanimeDataSlice';
import { selectUser } from '../redux/apifetch/AuthSlicer';
import { addToFavorites, addToWatchlist } from '../redux/apifetch/userAnime';
import { useToast } from './Toast';

export default function MiddlePosters({ data }) {
  const posterData = data || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { success, error, loading, dismiss } = useToast();

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

  return (
    <div className="w-full max-w-7xl mx-auto mb-12 text-white font-['Crunchyroll_Atyp',_sans-serif]">
      <div className="bg-gray-900/10 backdrop-blur-[.1px] rounded-xl p-6 hover:border-[#f47521]/50 transition-all duration-500">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          {/* Poster Image */}
          <div className="relative w-full lg:w-1/2 max-w-[600px] cursor-pointer overflow-hidden rounded-xl group">
            <img
              src={posterData.poster}
              alt={posterData.name || "Anime poster"}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-150 rounded-xl"
              onClick={() => navigate(`/anime/${posterData.id}`)}
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gray-950/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center rounded-xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#f47521]/10 border border-[#f47521]/50 rounded-full hover:scale-110 transition-all duration-500 cursor-pointer flex items-center justify-center mx-auto shadow-xl">
                  <FaPlay className="text-[#f47521] ml-1" size={20} />
                </div>
                <p className="text-[#f47521] font-semibold text-lg">Watch Now</p>
              </div>
            </div>
            
            {/* Rating Badge */}
            {posterData.rating && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#f47521]/20 backdrop-blur-sm border border-[#f47521]/30 rounded-lg px-3 py-2">
                <MdSecurity className="text-[#f47521]" size={16} />
                <span className="text-white font-semibold">{posterData.rating}</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-3 w-full lg:w-1/2 lg:text-left lg:items-start">
            {/* Title */}
            <div className="flex items-center space-y-1 gap-3">
            <div className="h-8 w-1 bg-[#f47521] rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#f47521] transition-colors duration-300">
                {posterData.name || "Untitled"}
              </h2>
             
            </div>

            {/* Episodes & Language Info */}
            <div className="flex flex-wrap gap-3">
              {posterData.episodes?.sub && (
                <div className="flex items-center gap-2 bg-gray-800/60 px-2 py-2 rounded-lg">
                  <MdVideoLibrary className="text-[#f47521]" size={14} />
                  <span className="text-xs text-gray-300">SUB {posterData.episodes.sub} Episodes</span>
                </div>
              )}
              {posterData.episodes?.dub && (
                <div className="flex items-center gap-2 bg-gray-800/60 px-2 py-2 rounded-lg">
                  <MdVideoLibrary className="text-[#f47521]" size={14} />
                  <span className="text-xs text-gray-300">DUB {posterData.episodes.dub} Episodes</span>
                </div>
              )}
              {posterData.type && (
                <span className="bg-[#f47521]/20 text-[#f47521] px-3 py-2 rounded-lg text-xs font-medium border border-[#f47521]/30">
                  {posterData.type}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              {/* <h3 className="text-lg font-semibold text-white flex items-center gap-3">
                <div className="w-1 h-5 bg-[#f47521] rounded-full"></div>
                Synopsis
              </h3> */}
              <p className="text-base text-gray-100 leading-relaxed">
                {posterData.description?.length > 280
                  ? posterData.description.slice(0, 280) + "..."
                  : posterData.description || "No description available."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  navigate(`/episodes/${posterData.id}`);
                  dispatch(clearEpisodeImage());
                  dispatch(setEpisodeImage(posterData.poster));
                }}
                className="group relative overflow-hidden bg-[#f47521] hover:bg-[#ff6600] text-black font-bold px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <FaPlay size={14} />
                <span className="text-sm font-semibold">START WATCHING</span>
              </button>
              
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToWatchlist(posterData); }}
                className="group relative flex items-center justify-center gap-2 bg-gray-900/80 backdrop-blur-sm border-2 border-[#f47521]/50 text-[#f47521] hover:border-[#f47521] hover:bg-[#f47521]/10 rounded-xl px-4 py-2 transition-all duration-300"
              >
                <RiBookmarkLine size={18} className="transition-transform duration-300" />
                <span className="text-sm font-semibold">ADD TO WATCHLIST</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}