import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectUser,
  clearUser,
  deleteUser,
  updateUser,
  setUser,
} from "../redux/apifetch/AuthSlicer";
import {
  selectFavorites,
  selectWatchlist,
  selectUserAnimeLoading,
  getUserAnimeLists,
} from "../redux/apifetch/userAnime";
import {
  FaSignOutAlt,
  FaHeart,
  FaStar,
  FaBookmark,
  FaUserEdit,
  FaTrashAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import AnimeCards from "../components/AnimeCards";
import ToastContainer, { showToast } from "../components/Toast";
import LoadingAnimation from "../components/LoadingAnimation";
import formgirl from "../assets/formgirl.png";
import UserAnimeList from "../components/UserAnimeList";

export default function Profile() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("favorites");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [editForm, setEditForm] = useState({
    username: user?.username || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  const favorites = useSelector(selectFavorites);
  const watchlist = useSelector(selectWatchlist);
  const isListLoading = useSelector(selectUserAnimeLoading);

  

  useEffect(() => {
    if (user?.token) {
      dispatch(getUserAnimeLists(user.token));
    }
  }, [dispatch, user?.token]);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
    setError(""); // Clear any previous error messages
    setEditForm({
      username: user?.username || "",
    });
  };

  const handleEditFormChange = (e) => {
    const newUsername = e.target.value;
    setEditForm({ username: newUsername });

    // Clear error when user starts typing, but check for same username
    if (newUsername === user.username) {
      setError("New username is same as current username");
    } else {
      setError("");
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    const username = editForm.username;

    // Check if the new username is the same as current username
    if (username === user.username) {
      setError("New username is same as current username");
      return;
    }

    setIsUpdatingAccount(true);
    const token = user.token;

    setIsLoading(true);
    const loadingToast = showToast.loading("Updating profile...");

    try {
      const result = await dispatch(updateUser({ token, username, userId: user.userId }));

      if (result.meta.requestStatus === "fulfilled") {
        // Preserve the token
        const updatedUser = {
          ...(result.payload?.data || result.payload),
          token: user.token,
        };

        // Update Redux state
        dispatch(setUser(updatedUser));

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Show success toast
        showToast.success("Profile updated successfully!");
        setIsUpdatingAccount(false);
        setIsEditModalOpen(false);
      } else {
        setIsUpdatingAccount(false);
        // Check if the error is due to username already taken
        const errorMessage =
          result.error?.message ||
          result.payload?.message ||
          "Failed to update profile";

        // Only show error in form for username taken error, toast for other errors
        if (errorMessage.includes("Username is already taken")) {
          setError(errorMessage);
        } else {
          showToast.error(errorMessage);
          setError(errorMessage);
        }
      }
    } catch (error) {
      // Extract error message from the response
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";

      // Only show error in form for username taken error, toast for other errors
      if (errorMessage.includes("Username is already taken")) {
        setError(errorMessage);
      } else {
        showToast.error(errorMessage);
        setError(errorMessage);
      }
      console.error("Failed to update profile:", error);
      setIsUpdatingAccount(false);
    } finally {
      showToast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setError(""); // Clear any error messages when closing the modal
  };

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleConfirmDelete = async () => {
    setIsDeletingAccount(true);
    const loadingToast = showToast.loading("Deleting account...");

    try {
      const result = await dispatch(deleteUser(user.token));
      if (result.meta.requestStatus === "fulfilled") {
        localStorage.removeItem("user");
        setIsDeleteModalOpen(false);
        setDeleteConfirmText("");
        showToast.success("Account deleted successfully");
        navigate("/");
      } else {
        showToast.error("Failed to delete account");
      }
    } catch (error) {
      showToast.error(error.message || "Failed to delete account");
      console.error("Delete failed:", error);
    } finally {
      showToast.dismiss(loadingToast);
      setIsDeletingAccount(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteConfirmText(""); // Clear the text when closing
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center mt-16 min-h-screen bg-black/90">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#f47521] mb-2">
            Not Signed In
          </h2>
          <p className="text-gray-300">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const avatarInitial = user.username
    ? user.username.charAt(0).toUpperCase()
    : "👤";

  return (
    <>
      {/* <ToastContainer /> */}
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
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-white">
                      {avatarInitial}
                    </span>
              )}
            </div>
              </div>
              <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between mt-4 md:ml-6">
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {user.username}
                  </h1>
                  <p className="text-gray-400">{user.email}</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    onClick={handleEditProfile}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg bg-[#f47521] text-black font-bold flex items-center gap-2 hover:bg-[#e65a0a] transition-colors text-sm ${
                      isLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <LoadingAnimation size={16} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaUserEdit /> Edit Profile
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-lg bg-gray-800 text-white font-semibold flex items-center gap-2 hover:bg-gray-700 transition-colors text-sm"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
            <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={isDeletingAccount}
                    className={`px-3 py-2 rounded-lg bg-red-900 text-red-300 font-semibold flex items-center gap-2 hover:bg-red-800 hover:text-red-200 transition-colors text-sm ${
                      isDeletingAccount ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {isDeletingAccount ? (
                      <>
                        <LoadingAnimation size={16} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaTrashAlt /> Delete
                      </>
                    )}
            </button>
          </div>
              </div>
            </div>

            {/* Enhanced Tab Navigation */}
            <div className="w-full border-b border-gray-700 mt-12 mb-8">
              <div className="flex justify-center md:justify-start gap-8">
              <button
                  onClick={() => setActiveTab("favorites")}
                  className={`pb-4 font-bold text-lg border-b-2 transition-all duration-300 relative ${
                    activeTab === "favorites"
                      ? "text-[#f47521] border-[#f47521]"
                      : "text-gray-400 border-transparent hover:text-white hover:border-gray-600"
                  }`}
                >
                  <FaStar className="inline mr-2" />
                  Favorites
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({favorites.length})
                  </span>
              </button>
              <button
                  onClick={() => setActiveTab("watchlist")}
                  className={`pb-4 font-bold text-lg border-b-2 transition-all duration-300 relative ${
                    activeTab === "watchlist"
                      ? "text-[#f47521] border-[#f47521]"
                      : "text-gray-400 border-transparent hover:text-white hover:border-gray-600"
                  }`}
                >
                  <FaBookmark className="inline mr-2" />
                  Watchlist
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({watchlist.length})
                  </span>
              </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {activeTab === "favorites" ? (
                  <UserAnimeList
                    data={favorites}
                    isLoading={isListLoading}
                    listType="favorites"
                  />
                ) : (
                  <UserAnimeList
                    data={watchlist}
                    isLoading={isListLoading}
                    listType="watchlist"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-sm mt-12"
            >
              <div className="absolute left-1/2 -top-[4.8rem] transform -translate-x-1/2 z-20">
                <img
                  src={formgirl}
                  alt="Anime Girl"
                  className="w-28 h-28 object-contain drop-shadow-2xl"
                />
              </div>
          <button
                type="button"
                onClick={handleCloseEditModal}
                className="absolute top-2 right-3 text-[#f47521] bg-transparent hover:text-white text-2xl font-bold focus:outline-none z-10"
                aria-label="Close"
              >
                &times;
          </button>
              <form
                onSubmit={handleEditFormSubmit}
                className="bg-gray-950 rounded-2xl shadow-xl w-full p-6 border border-[#f47521]"
              >
                {/* <AnimatePresence> */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}
                <div className="text-center mb-4">
                  <FaUserEdit className="text-4xl text-[#f47521] mx-auto mb-2" />
                  <h2 className="text-xl font-bold text-white">
                    Edit Username
                  </h2>
                </div>
                <div className="mb-6">
                  <label className="block text-left text-[#f47521] font-semibold mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={handleEditFormChange}
                    className="w-full bg-slate-900 border border-gray-600 focus:border-[#f47521] text-[#F1EFEC] py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f47521]/20 transition-all duration-300"
                    required
                    placeholder="Enter new username"
                  />
                </div>
                <div className="flex gap-4">
          <button
                    disabled={isUpdatingAccount}
                    type="submit"
                    className="w-full py-3 rounded-lg bg-[#f47521] text-white font-semibold transition-colors hover:bg-[#e65a0a]"
                  >
                    {isUpdatingAccount ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoadingAnimation size={16} />
                      </div>
                    ) : (
                      "Save"
                    )}
          </button>
        </div>
              </form>
            </motion.div>
      </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-md mt-12"
            >
              <div className="absolute left-1/2 -top-[4.8rem] transform -translate-x-1/2 z-20">
                <img
                  src={formgirl}
                  alt="Anime Girl"
                  className="w-28 h-28 object-contain drop-shadow-2xl"
                />
              </div>
              <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-red-500/50">
                <div className="text-center">
                  <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white">
                    Delete Account
                  </h2>
                  <p className="text-gray-400 mt-2">
                    This action is irreversible. All your data will be
                    permanently deleted. To confirm, please type "
                    <strong className="text-red-400">DELETE</strong>" in the box
                    below.
                  </p>
                </div>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mt-6 text-center text-white focus:outline-none focus:border-red-500"
                />
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleCloseDeleteModal}
                    disabled={isDeletingAccount}
                    className={`w-full py-3 rounded-lg bg-gray-700 hover:bg-gray-700 font-semibold transition-colors ${
                      isDeletingAccount ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={
                      deleteConfirmText !== "DELETE" || isDeletingAccount
                    }
                    className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
                  >
                    {isDeletingAccount ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoadingAnimation size={16} />
                </div>
              ) : (
                      "Delete My Account"
                    )}
                  </button>
                </div>
              </div>
        </motion.div>
      </div>
        )}
      </AnimatePresence>
    </>
  );
}
