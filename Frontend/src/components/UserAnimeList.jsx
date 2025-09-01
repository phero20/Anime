// components/UserAnimeList.jsx
import React from 'react';
import { FaStar, FaBookmark, FaPlay, FaTrashAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingAnimation from './LoadingAnimation';
import { setEpisodeImage, clearEpisodeImage } from '../redux/apifetch/GetanimeDataSlice';
import { removeFromFavorites, removeFromWatchlist } from '../redux/apifetch/userAnime';
import { selectUser } from '../redux/apifetch/AuthSlicer'; // Import user selector
import { useToast } from './Toast'; // Import custom toast hook

const UserAnimeCard = ({ item, listType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser); // Get the logged-in user
  const { success, error } = useToast();

  // --- ADDED: Handler to remove item from list ---
  const handleRemove = async () => {
    if (!user) {
      error("Error", "You must be logged in to perform this action.");
      return;
    }

    const action = listType === 'favorites' ? removeFromFavorites : removeFromWatchlist;
    const { token } = user;
    const animeId = item.id;

    try {
      await dispatch(action({ animeId, token })).unwrap();
      success(`${item.name} has been removed from your ${listType}`, `${item.name} has been removed from your ${listType}.`);
    } catch (err) {
      error("Failed", err.message || `Could not remove from ${listType}.`);
    }
  };

  const handleWatchClick = () => {
    dispatch(clearEpisodeImage());
    dispatch(setEpisodeImage(item.poster));
    navigate(`/episodes/${item.id}`);
  };

  return (
    <div className="bg-gray-900/70 overflow-hidden flex group rounded-lg border-gray-800 hover:bg-gray-900/8 hover:shadow-xl border hover:ring-2 hover:ring-[#f47521] hover:text-[#f47521] hover:scale-[101%] transition-all duration-300">
      <Link to={`/anime/${item.id}`} className="w-24 h-36 overflow-hidden flex-shrink-0">
        <img src={item.poster} alt={item.name} className="w-full h-full object-cover block group-hover:scale-150 transition-all duration-700" />
      </Link>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <Link to={`/anime/${item.id}`} className="font-bold text-white text-lg hover:text-[#f47521] transition-colors line-clamp-2">
            {item.name}
          </Link>
          <div className="text-sm text-gray-400 mt-1">
            {item.episodes?.sub && `Sub | ${item.episodes.sub} Eps`}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleWatchClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#f47521] text-black text-xs font-bold rounded-full hover:bg-[#e65a0a] transition-colors duration-500"
          >
            <FaPlay />
            <span>Watch</span>
          </button>
          {/* --- FIXED: Added onClick to the button --- */}
          <button
            onClick={handleRemove}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-500"
            title={`Remove from ${listType}`}
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserAnimeList({ data, isLoading, listType }) {
  const emptyState = {
    favorites: {
      icon: <FaStar className="text-4xl text-gray-600" />,
      title: "No Favorites Yet",
      message: "Start adding anime to your favorites to see them here!",
    },
    watchlist: {
      icon: <FaBookmark className="text-4xl text-gray-600" />,
      title: "Your Watchlist is Empty",
      message: "Add anime to your watchlist to see them here!",
    },
  };

  const currentInfo = emptyState[listType];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingAnimation />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          {currentInfo.icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-300 mb-3">{currentInfo.title}</h3>
        <p className="text-gray-500 text-lg">{currentInfo.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map(item => (
        <UserAnimeCard key={item.id} item={item} listType={listType} />
      ))}
    </div>
  );
}