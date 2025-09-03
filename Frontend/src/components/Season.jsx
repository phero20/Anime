import React, { useState } from "react";
import {
    FaPlay,
    FaStar,
    FaCalendar,
    FaClock,
    FaHeart
} from "react-icons/fa";
import { RiBookmarkLine, RiAddFill, RiStarFill } from "react-icons/ri";
import { MdHd, MdSubtitles } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { setEpisodeImage, clearEpisodeImage } from '../redux/apifetch/GetanimeDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../redux/apifetch/AuthSlicer';
import { addToFavorites, addToWatchlist } from '../redux/apifetch/userAnime';
import { useToast } from './Toast';


export default function Season({ data }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const { success, error, dismiss } = useToast();


    const handleAddToFavorites = async (item) => {
        if (!user) {
            error('Please login to add to favorites');
            return;
        }


        try {
            const result = await dispatch(addToFavorites({
                token: user.token,
                anime: {
                    id: item.id,
                    name: item.name,
                    poster: item.poster,
                    episodes: item.episodes
                }
            })).unwrap();


            if (result.success) {
                success(result.message || `${item.name
                    } added to favorites!`);
            } else {
                const errorMessage = result.message || (result.error?.message) || 'Failed to add to favorites';
                error(errorMessage);
            }
        } catch (err) {

            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to add to favorites';
            error(errorMessage);
        }
    };

    const handleAddToWatchlist = async (item) => {
        if (!user) {
            error('Please login to add to watchlist');
            return;
        }
        try {
            const result = await dispatch(addToWatchlist({
                token: user.token,
                anime: {
                    id: item.id,
                    name: item.name,
                    poster: item.poster,
                    episodes: item.episodes
                }
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


    const [showFullDescription, setShowFullDescription] = useState(false);

    if (!data)
        return null;



    const {
        poster,
        name,
        stats,
        description,
        id,
        anilistId,
        malId
    } = data.anime.info;
    const { studios, genres, producers } = data.anime.moreInfo;
    const item = {
        id: id || malId || anilistId,
        name,
        poster
    };

    return (
        <section className="relative w-full min-h-screen bg-black text-white overflow-hidden">
            {/* Enhanced background */}
            <div className="absolute inset-0">
                <img src={poster}
                    alt={name}
                    className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
            </div>

            {/* Main content container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="min-h-screen flex items-center py-16 lg:pt-20 pb-0">
                    <div className="w-full">

                        {/* Mobile Poster Section - Top Center */}
                        <div className="lg:hidden flex flex-col items-center mb-8 space-y-4">
                            <div className="relative group max-w-[12rem] w-full">
                                <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-2 group-hover:border-[#f47521] transition-all duration-500">
                                    <img src={poster}
                                        alt={name}
                                        className="w-full h-auto rounded-lg shadow-2xl transform group-hover:scale-150 transition-all duration-500" />
                                 <div className="absolute inset-0 w-full text-[#f47521]  bg-gray-950/70 opacity-0 hover:opacity-100 transition-all duration-500 h-full flex justify-center items-center">
                                    <div 
                                    onClick={
                                        () => {
                                            navigate(`/episodes/${id || malId || anilistId
                                                }`)
                                            dispatch(clearEpisodeImage());
                                            dispatch(setEpisodeImage(poster));
                                        }
                                    }
                                    className="hover:scale-110 cursor-pointer transition-all duration-500"><FaPlay size={35} /></div>  
                                      </div>
                                </div>
                            </div>
                            {/* Anime name below poster */}
                            <h1 className="text-xl font-black leading-tight text-[#f47521] drop-shadow-lg text-center">
                                {name}
                            </h1>
                        </div>

                        {/* Mobile Content Section */}
                        <div className="lg:hidden">
                            {/* Quick Info Bar */}
                           

                            {/* Synopsis Card */}
                            <div className="bg-gray-900/10 backdrop-blur-[.1px] border border-gray-700/50 rounded-xl p-6 space-y-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <div className="w-1 h-6 bg-[#f47521] rounded-full"></div>
                                    Synopsis
                                </h3>
                                <div className="space-y-3">
                                    <div className="relative overflow-hidden">
                                        <p className={
                                            `text-base text-gray-100 leading-relaxed transition-all duration-700 ease-in-out ${showFullDescription ? "max-h-[2000px] opacity-100" : "max-h-[130px] opacity-90"
                                            }`
                                        }>
                                            {description} </p>
                                        {
                                            // !showFullDescription && description.length > 300 && (
                                            //     // <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none" />
                                            // )
                                        } </div>
                                    {
                                        description.length > 305 && (
                                            <button onClick={
                                                () => {
                                                    setShowFullDescription(!showFullDescription)
                                                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                                                }
                                            }
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#f47521] hover:text-white transition-all duration-300 group">
                                                <span>{
                                                    showFullDescription ? "Show Less" : "Read More"
                                                }</span>
                                                <svg className={
                                                    `w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5 ${showFullDescription ? 'rotate-180' : ''
                                                    }`
                                                }
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        )
                                    } </div>
                            </div>

                            {/* Enhanced Stats Grid */}
                            <div className="rounded-xl p-6">
                                {/* <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                                    <div className="w-1 h-6 bg-[#f47521] rounded-full"></div>
                                    Details
                                </h3> */}
                                <div className="grid grid-cols-3 lg:grid-cols-5 gap-6">
                                    <div className="text-center space-y-1">
                                        <div className="w-12 h-12 bg-[#f47521]/20 rounded-full flex items-center justify-center mx-auto">
                                            <FaStar className="text-[#f47521]"
                                                size={20} />
                                        </div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Rating</p>
                                        <p className="text-lg font-bold text-white">
                                            {
                                                stats?.rating || "N/A"
                                            }</p>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <div className="w-12 h-12 bg-[#f47521]/20 rounded-full flex items-center justify-center mx-auto">
                                            <MdSubtitles className="text-[#f47521]"
                                                size={20} />
                                        </div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Sub Episodes</p>
                                        <p className="text-lg font-bold text-white">
                                            {
                                                stats?.episodes?.sub || "N/A"
                                            }</p>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <div className="w-12 h-12 bg-[#f47521]/20 rounded-full flex items-center justify-center mx-auto">
                                            <MdHd className="text-[#f47521]"
                                                size={20} />
                                        </div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Dub Episodes</p>
                                        <p className="text-lg font-bold text-white">
                                            {
                                                stats?.episodes?.dub || "N/A"
                                            }</p>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <div className="w-12 h-12 bg-[#f47521]/20 rounded-full flex items-center justify-center mx-auto">
                                            <FaClock className="text-[#f47521]"
                                                size={20} />
                                        </div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Studio</p>
                                        <p className="text-lg font-bold text-white truncate"
                                            title={studios}>
                                            {
                                                studios || "N/A"
                                            }</p>
                                    </div>
                                    <div className="text-center space-y-1">
                                            <div className="w-12 h-12 bg-[#f47521]/20 rounded-full flex items-center justify-center mx-auto">
                                                <MdHd className="text-[#f47521]"
                                                    size={20} />
                                            </div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Quality</p>
                                            <p className="text-lg font-bold text-white truncate"
                                                title={studios}>
                                                {
                                                    stats.quality || "N/A"
                                                }</p>
                                        </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3">
                                <button onClick={
                                    () => {
                                        navigate(`/episodes/${id || malId || anilistId
                                            }`)
                                        dispatch(clearEpisodeImage());
                                        dispatch(setEpisodeImage(poster));
                                    }
                                }
                                    className="group relative overflow-hidden bg-[#f47521] hover:bg-[#ff6600] text-black font-bold px-3 py-4 rounded-xl transition-all duration-300">
                                    <div className="relative flex items-center gap-1">
                                        <FaPlay size={15} />
                                        <span className="text-sm font-bold">START WATCHING</span>
                                    </div>
                                </button>

                                <button onClick={
                                    (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleAddToWatchlist(item);
                                    }
                                }
                                title=" Add to Watchlist"
                                    className="group relative flex items-center justify-center w-14 h-14 bg-gray-900/80 backdrop-blur-sm border-2 border-[#f47521]/50 text-[#f47521] hover:border-[#f47521] hover:bg-[#f47521]/10 rounded-xl transition-all duration-300 ">
                                    <RiBookmarkLine size={22}
                                        className="group-hover:scale-110 transition-transform duration-300" />
                                  
                                </button>

                                <button onClick={
                                    (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleAddToFavorites(item);
                                    }
                                }
                                 title="Add to Favorites"
                                    className="group relative flex items-center justify-center w-14 h-14 bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600/50 text-gray-400 hover:border-[#f47521]/50 hover:text-[#f47521] hover:bg-[#f47521]/10 rounded-xl transition-all duration-300">
                                    <FaHeart size={20}
                                        className="group-hover:scale-110 transition-transform duration-300" />
                                   
                                </button>
                            </div>

                            {/* Tags Card */}
                            {
                                (genres?.length || producers?.length) && (
                                    <div className="bg-gray-900/10 mt-4 backdrop-blur-[.1px] border border-gray-700/50 rounded-xl p-6 space-y-6">
                                      

                                        {
                                            genres?.length > 0 && (
                                                <div className="space-y-3">
                                                    <h4 className="text-base font-semibold text-[#f47521] flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-[#f47521] rounded-full"></div>
                                                        Genres
                                                    </h4>
                                                    <div className="flex flex-wrap gap-3">
                                                        {
                                                            genres.map((genre) => (
                                                                <span onClick={
                                                                    () => navigate(`/genre/${genre.replace(/\s+/g, '-')
                                                                        }`)
                                                                }
                                                                    key={genre}
                                                                    className="group cursor-pointer bg-gray-800/60  border border-gray-700/50 hover:border-[#f47521]/50 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-[#f47521] transition-all duration-300">
                                                                    {genre} </span>
                                                            ))
                                                        } </div>
                                                </div>
                                            )
                                        }

                                        {
                                            producers?.length > 0 && (
                                                <div className="space-y-3">
                                                    <h4 className="text-base font-semibold text-[#f47521] flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-[#f47521] rounded-full"></div>
                                                        Producers
                                                    </h4>
                                                    <div className="flex flex-wrap gap-3">
                                                        {
                                                            producers.map((producer) => (
                                                                <span onClick={
                                                                    () => navigate(`/producer/${producer.replace(/\s+/g, '-')
                                                                        }`)
                                                                }
                                                                    key={producer}
                                                                    className="group cursor-pointer bg-gray-800/60  border border-gray-700/50 hover:border-[#f47521]/50 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-[#f47521] transition-all duration-300">
                                                                    {producer} </span>
                                                            ))
                                                        } </div>
                                                </div>
                                            )
                                        } </div>
                                )
                            } </div>

                        {/* Desktop Layout */}
                        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
                            {/* Main content - spans 7 columns */}
                            <div className="lg:col-span-7">
                                {/* Hero Title - Desktop only */}
                                <div className="space-y-6">
                                   
                                    {/* Quick Info Bar */}
                                   
                                </div>

                                {/* Synopsis Card */}
                                <div className="bg-gray-900/10 backdrop-blur-[.1px] border border-gray-700/50 rounded-xl p-6 space-y-4 mb-5">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <div className="w-1 h-6 bg-[#f47521] rounded-full"></div>
                                        Synopsis
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="relative overflow-hidden">
                                            <p className={
                                                `text-base text-gray-100 leading-relaxed transition-all duration-700 ease-in-out ${showFullDescription ? "max-h-[2000px] opacity-100" : "max-h-[130px] opacity-90"
                                                }`
                                            }>
                                                {description} </p>
                                            {
                                                !showFullDescription && description.length > 300 && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none" />
                                                )
                                            } </div>
                                        {
                                            description.length > 305 && (
                                                <button onClick={
                                                    () => {
                                                        setShowFullDescription(!showFullDescription)
                                                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                                                    }
                                                }
                                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#f47521] hover:text-white transition-all duration-300 group">
                                                    <span>{
                                                        showFullDescription ? "Show Less" : "Read More"
                                                    }</span>
                                                    <svg className={
                                                        `w-4 h-4 transition-transform duration-300 ${showFullDescription ? 'rotate-180' : ''
                                                        }`
                                                    }
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            )
                                        } </div>
                                </div>

                                {/* Enhanced Stats Grid */}
                                <div className=" rounded-xl mb-5">
                                   
                                    <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                                        <div className="text-center space-y-2">
                                            <div className="w-12 h-12 bg-[#f47521]/20 rounded-full flex items-center justify-center mx-auto">
                                                <FaStar className="text-[#f47521]"
                                                    size={20} />
                                            </div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Rating</p>
                                            <p className="text-lg font-bold text-white">
                                                {
                                                    stats?.rating || "N/A"
                                                }</p>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <div className="w-12 h-12 bg-[#f47521]/20 rounded-full flex items-center justify-center mx-auto">
                                                <MdSubtitles className="text-[#f47521]"
                                                    size={20} />
                                            </div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Sub Episodes</p>
                                            <p className="text-lg font-bold text-white">
                                                {
                                                    stats?.episodes?.sub || "N/A"
                                                }</p>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <div className="w-12 h-12 bg-[#f47521]/20 rounded-full flex items-center justify-center mx-auto">
                                            <MdSubtitles className="text-[#f47521]"
                                                    size={20} />
                                            </div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Dub Episodes</p>
                                            <p className="text-lg font-bold text-white">
                                                {
                                                    stats?.episodes?.dub || "N/A"
                                                }</p>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <div className="w-12 h-12 bg-[#f47521]/20 rounded-full flex items-center justify-center mx-auto">
                                                <FaClock className="text-[#f47521]"
                                                    size={20} />
                                            </div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Studio</p>
                                            <p className="text-lg font-bold text-white truncate"
                                                title={studios}>
                                                {
                                                    studios || "N/A"
                                                }</p>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <div className="w-12 h-12 bg-[#f47521]/20 rounded-full flex items-center justify-center mx-auto">
                                                <MdHd className="text-[#f47521]"
                                                    size={20} />
                                            </div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Quality</p>
                                            <p className="text-lg font-bold text-white truncate"
                                                title={studios}>
                                                {
                                                    stats.quality || "N/A"
                                                }</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-4 mb-5">
                                    <button onClick={
                                        () => {
                                            navigate(`/episodes/${id || malId || anilistId
                                                }`)
                                            dispatch(clearEpisodeImage());
                                            dispatch(setEpisodeImage(poster));
                                        }
                                    }
                                        className="group relative overflow-hidden bg-[#f47521] hover:bg-[#ff6600] text-black font-bold px-8 py-4 rounded-xl transition-all duration-300   transform">
                                        <div className="relative flex items-center gap-3">
                                            <FaPlay size={18} />
                                            <span className="text-base font-bold">START WATCHING</span>
                                        </div>
                                    </button>

                                    <button onClick={
                                        (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleAddToWatchlist(item);
                                        }
                                    }
                                    title=" Add to Watchlist"
                                        className="group relative flex items-center justify-center w-14 h-14 bg-gray-900/80 backdrop-blur-sm border-2 border-[#f47521]/50 text-[#f47521] hover:border-[#f47521] hover:bg-[#f47521]/10 rounded-xl transition-all duration-300 ">
                                        <RiBookmarkLine size={22}
                                            className="group-hover:scale-110 transition-transform duration-300" />
                                       
                                    </button>

                                    <button onClick={
                                        (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleAddToFavorites(item);
                                        }
                                    }
                                    title="Add to Favorites"
                                        className="group relative flex items-center justify-center w-14 h-14 bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600/50 text-gray-400 hover:border-[#f47521]/50 hover:text-[#f47521] hover:bg-[#f47521]/10 rounded-xl transition-all duration-300 ">
                                        <FaHeart size={20}
                                            className="group-hover:scale-110 transition-transform duration-300" />
                                       
                                    </button>
                                </div>

                                {/* Tags Card */}
                                {
                                    (genres?.length || producers?.length) && (
                                        <div className="bg-gray-900/10 backdrop-blur-[.1px] border border-gray-700/50 rounded-xl p-6 space-y-6">
                                            {/* <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                                <div className="w-1 h-6 bg-[#f47521] rounded-full"></div>
                                                Categories
                                            </h3> */}

                                            {
                                                genres?.length > 0 && (
                                                    <div className="space-y-3">
                                                        <h4 className="text-base font-semibold text-[#f47521] flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-[#f47521] rounded-full"></div>
                                                            Genres
                                                        </h4>
                                                        <div className="flex flex-wrap gap-3">
                                                            {
                                                                genres.map((genre) => (
                                                                    <span onClick={
                                                                        () => navigate(`/genre/${genre.replace(/\s+/g, '-')
                                                                            }`)
                                                                    }
                                                                        key={genre}
                                                                        className="group cursor-pointer bg-gray-800/60 border border-gray-700/50 hover:border-[#f47521]/50 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-[#f47521] transition-all duration-300">
                                                                        {genre} </span>
                                                                ))
                                                            } </div>
                                                    </div>
                                                )
                                            }

                                            {
                                                producers?.length > 0 && (
                                                    <div className="space-y-3">
                                                        <h4 className="text-base font-semibold text-[#f47521] flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-[#f47521] rounded-full"></div>
                                                            Producers
                                                        </h4>
                                                        <div className="flex flex-wrap gap-3">
                                                            {
                                                                producers.map((producer) => (
                                                                    <span onClick={
                                                                      
                                                                        () => navigate(`/producer/${producer.replace(/\s+/g, '-')
                                                                            }`)
                                                                    }
                                                                        key={producer}
                                                                        className="group cursor-pointer bg-gray-800/60 border border-gray-700/50 hover:border-[#f47521]/50 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-[#f47521] transition-all duration-300">
                                                                        {producer} </span>
                                                                ))
                                                            } </div>
                                                    </div>
                                                )
                                            } </div>
                                    )
                                } </div>

                            {/* Desktop Sidebar - Poster */}
                            <div className="lg:col-span-5 lg:mt-10 flex justify-center lg:justify-end">
                                <div className="relative group max-w-sm w-full">
                                    <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-2 group-hover:border-[#f47521] transition-all duration-500">
                                        <img src={poster}
                                            alt={name}
                                        className="w-full h-auto rounded-lg shadow-2xl transform group-hover:scale-150 transition-all duration-500" />
                                      <div className="absolute inset-0 w-full text-[#f47521]  bg-gray-950/80 opacity-0 hover:opacity-100 transition-all duration-500 h-full flex justify-center items-center">
                                    <div 
                                    onClick={
                                        () => {
                                            navigate(`/episodes/${id || malId || anilistId
                                                }`)
                                            dispatch(clearEpisodeImage());
                                            dispatch(setEpisodeImage(poster));
                                        }
                                    }
                                    className="hover:scale-110 cursor-pointer rounded-full p-3 text-[#f47521] cursor-pointer border border-[#f47521]/50 hover:text-[#f47521] bg-[#f47521]/10 transition-all duration-500"><FaPlay size={25} /></div>  
                                      </div>
                                    </div>
                                    <h1 className="text-4xl mt-2 text-center font-black leading-tight text-[#f47521] drop-shadow-lg">
                                        {name} </h1>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
