// eslint-disable-next-line
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../redux/apifetch/AuthSlicer';
import { logoutUser } from '../redux/apifetch/AuthSlicer';
import { FaSignOutAlt, FaHeart, FaBookmark, FaUserEdit, FaTrashAlt } from 'react-icons/fa';
import AnimeCards from '../components/AnimeCards';
import Title from '../components/Title';

export default function Profile() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('favorites');

  // Placeholder data for demo
  const favorites = [];
  const wishlist = [];

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleDelete = () => {
    // Placeholder for delete user logic
    alert('Delete user (Coming Soon)');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center mt-16 min-h-screen bg-black/90">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-[#f47521] mb-2">Not signed in</h2>
          <p className="text-gray-300 mb-4">Please log in to view your profile.</p>
        </motion.div>
      </div>
    );
  }

  // Avatar fallback: show image if available, else initial
  const avatarImg = user.avatar;
  const avatarInitial = user.username ? user.username.charAt(0).toUpperCase() : '👤';

  return (
    <div className="min-h-screen w-full mt-16 bg-black font-['Crunchyroll_Atyp',_sans-serif] flex flex-col items-start px-2 sm:px-4 md:px-16 lg:px-32 py-6 sm:py-8">
      {/* User Info - left-aligned, big avatar */}
      <div className="flex flex-col items-start gap-4 sm:gap-6 w-full max-w-2xl mb-6 sm:mb-8">
        <div className="flex items-center gap-4 sm:gap-8 relative w-full">
          {/* Avatar with edit button outside overflow */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-gradient-to-br from-[#f47521]/80 to-[#e65a0a]/80 flex items-center justify-center text-3xl sm:text-5xl font-bold text-white">
              {avatarImg ? (
                <img src={avatarImg} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{avatarInitial}</span>
              )}
            </div>
            {/* Edit button absolutely positioned, not clipped */}
            <button
              className="absolute -bottom-1 -right-1 sm:-bottom-0 sm:-right-0 bg-[#232323] border border-[#f47521]/60 text-[#f47521] p-2 sm:p-3 rounded-full shadow hover:bg-[#f47521] hover:text-white transition-colors"
              title="Edit Avatar (Coming Soon)"
              disabled
              style={{ zIndex: 2 }}
            >
              <FaUserEdit className="text-base sm:text-lg" />
            </button>
          </div>
          <div className="flex flex-col gap-0.5 sm:gap-1 items-start">
            <span className="text-lg sm:text-2xl md:text-3xl font-bold text-white leading-tight">{user.username}</span>
            <span className="text-gray-400 text-xs sm:text-base md:text-lg break-all">{user.email}</span>
            <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3">
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#f47521] text-black font-bold flex items-center gap-1.5 sm:gap-2 hover:bg-[#e65a0a] transition-colors text-xs sm:text-sm md:text-base"
              >
                <FaSignOutAlt className="text-xs sm:text-base" /> Logout
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-transparent border border-red-500 text-red-400 font-bold flex items-center gap-1.5 sm:gap-2 hover:bg-red-500 hover:text-white transition-colors text-xs sm:text-sm md:text-base"
              >
                <FaTrashAlt className="text-xs sm:text-base" /> Delete User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - centered, pill style, compact on mobile */}
      <div className="w-full flex justify-center mb-3 sm:mb-4">
        <div className="flex gap-1 sm:gap-2 bg-gray-900/80 rounded-full p-0.5 sm:p-1 shadow-lg">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 focus:outline-none ${activeTab === 'favorites' ? 'bg-[#f47521] text-black shadow' : 'bg-transparent text-gray-300 hover:text-[#f47521]'}`}
          >
            <FaHeart className="text-sm sm:text-base" /> Favorites
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 focus:outline-none ${activeTab === 'wishlist' ? 'bg-[#f47521] text-black shadow' : 'bg-transparent text-gray-300 hover:text-[#f47521]'}`}
          >
            <FaBookmark className="text-sm sm:text-base" /> Wishlist
          </button>
        </div>
      </div>

      {/* Tab Content - centered */}
      <div className="w-full flex justify-center">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-5xl"
        >
          {activeTab === 'favorites' ? (
            <>
              <Title name="Your Favorites" />
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400">
                  <FaHeart className="text-2xl sm:text-4xl mb-2 animate-pulse text-[#f47521]/60" />
                  <p className="text-sm sm:text-base font-semibold mb-1">No favorites yet</p>
                  <p className="text-xs sm:text-sm">Add anime to your favorites to see them here.</p>
                </div>
              ) : (
                <AnimeCards data={favorites} name="Favorites" scroll={false} />
              )}
            </>
          ) : (
            <>
              <Title name="Your Wishlist" />
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400">
                  <FaBookmark className="text-2xl sm:text-4xl mb-2 animate-pulse text-[#f47521]/60" />
                  <p className="text-sm sm:text-base font-semibold mb-1">No anime in your wishlist</p>
                  <p className="text-xs sm:text-sm">Add anime to your wishlist to see them here.</p>
                </div>
              ) : (
                <AnimeCards data={wishlist} name="Wishlist" scroll={false} />
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
