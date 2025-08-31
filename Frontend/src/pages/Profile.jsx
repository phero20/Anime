import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, clearUser, deleteUser } from '../redux/apifetch/AuthSlicer';
import { FaSignOutAlt, FaHeart,FaStar, FaBookmark, FaUserEdit, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import AnimeCards from '../components/AnimeCards';


export default function Profile() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('favorites');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Placeholder data for demo
  const favorites = [];
  const wishlist = [];

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('user');
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteUser(user.userId));
      localStorage.removeItem('user');
      // Close modal and clear text on success
      setIsDeleteModalOpen(false);
      setDeleteConfirmText('');
      // User will be automatically logged out on success
    } catch (error) {
      console.error('Delete failed:', error);
      // Keep modal open on failure so user can try again
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteConfirmText(''); // Clear the text when closing
  };
  
  if (!user) {
    return (
      <div className="flex items-center justify-center mt-16 min-h-screen bg-black/90">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#f47521] mb-2">Not Signed In</h2>
          <p className="text-gray-300">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const avatarInitial = user.username ? user.username.charAt(0).toUpperCase() : '👤';

  return (
    <>
      <div className="w-full min-h-screen bg-black text-white font-['Crunchyroll_Atyp',_sans-serif]">
        {/* Profile Background Banner with User's Avatar */}
        <div className="relative w-full h-48 md:h-64 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/40">
            {user.avatar && (
              <img 
                src={user.avatar} 
                alt="Profile Background" 
                className="w-full h-full object-cover opacity-60"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="relative px-4 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative flex flex-col items-center md:flex-row md:items-end -mt-16 md:-mt-20">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-800 border-4 border-black overflow-hidden flex items-center justify-center">
                  {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-5xl font-bold text-white">{avatarInitial}</span>}
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between mt-4 md:ml-6">
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{user.username}</h1>
                  <p className="text-gray-400">{user.email}</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button className="px-4 py-2 rounded-lg bg-[#f47521] text-black font-bold flex items-center gap-2 hover:bg-[#e65a0a] transition-colors text-sm">
                    <FaUserEdit /> Edit Profile
                  </button>
                  <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-gray-800 text-white font-semibold flex items-center gap-2 hover:bg-gray-700 transition-colors text-sm">
                    <FaSignOutAlt /> Logout
                  </button>
                  <button onClick={() => setIsDeleteModalOpen(true)} className="px-3 py-2 rounded-lg bg-red-900 text-red-300 font-semibold flex items-center gap-2 hover:bg-red-800 hover:text-red-200 transition-colors text-sm">
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            </div>
            


            {/* Enhanced Tab Navigation */}
            <div className="w-full border-b border-gray-700 mt-12 mb-8">
              <div className="flex justify-center md:justify-start gap-8">
                <button 
                  onClick={() => setActiveTab('favorites')} 
                  className={`pb-4 font-bold text-lg border-b-2 transition-all duration-300 relative ${
                    activeTab === 'favorites' 
                      ? 'text-[#f47521] border-[#f47521]' 
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                  }`}
                >
                  <FaStar className="inline mr-2" />
                  Favorites
                  <span className="ml-2 text-sm font-normal text-gray-500">({favorites.length})</span>
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')} 
                  className={`pb-4 font-bold text-lg border-b-2 transition-all duration-300 relative ${
                    activeTab === 'wishlist' 
                      ? 'text-[#f47521] border-[#f47521]' 
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                  }`}
                >
                  <FaBookmark className="inline mr-2" />
                  Watchlist
                  <span className="ml-2 text-sm font-normal text-gray-500">({wishlist.length})</span>
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {activeTab === 'favorites' ? (
                favorites.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaStar className="text-4xl text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-300 mb-3">No Favorites Yet</h3>
                    <p className="text-gray-500 text-lg">Start adding anime to your favorites to see them here!</p>
                  </div>
                ) : (
                  <AnimeCards data={favorites} scroll={false} />
                )
              ) : (
                wishlist.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaBookmark className="text-4xl text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-300 mb-3">Your Watchlist is Empty</h3>
                    <p className="text-gray-500 text-lg">Add anime to your watchlist to see them here!</p>
                  </div>
                ) : (
                  <AnimeCards data={wishlist} scroll={false} />
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-red-500/50">
              <div className="text-center">
                <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Delete Account</h2>
                <p className="text-gray-400 mt-2">This action is irreversible. All your data will be permanently deleted. To confirm, please type "<strong className="text-red-400">DELETE</strong>" in the box below.</p>
              </div>
              <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="Type DELETE to confirm" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mt-6 text-center text-white focus:outline-none focus:border-red-500" />
              <div className="flex gap-4 mt-6">
                <button onClick={handleCloseDeleteModal} className="w-full py-3 rounded-lg bg-gray-700 hover:bg-gray-700 font-semibold transition-colors">Cancel</button>
                <button onClick={handleConfirmDelete} disabled={deleteConfirmText !== 'DELETE'} className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700">Delete My Account</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}