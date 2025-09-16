// components/UserAnimeList.jsx
import React from 'react';
import {FaStar, FaBookmark, FaPlay, FaTrashAlt} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import LoadingAnimation from './LoadingAnimation';
import {setEpisodeImage, clearEpisodeImage} from '../redux/apifetch/GetanimeDataSlice';
import {removeFromFavorites, removeFromWatchlist} from '../redux/apifetch/userAnime';
import {selectUser} from '../redux/apifetch/AuthSlicer';
import {useToast} from './Toast';

const UserAnimeCard = ({item, listType}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const {success, error} = useToast();


    const handleRemove = async () => {
        if (! user) {
            error("Error", "You must be logged in to perform this action.");
            return;
        }

        const action = listType === 'favorites' ? removeFromFavorites : removeFromWatchlist;
        const {token} = user;
        const animeId = item.id;

        try {
            await dispatch(action({animeId, token})).unwrap();
            success(`${
                item.name
            } has been removed from your ${listType}`, `${
                item.name
            } has been removed from your ${listType}.`);
        } catch (err) {
            error("Failed", err.message || `Could not remove from ${listType}.`);
        }
    };

    const handleWatchClick = () => {
        dispatch(clearEpisodeImage());
        dispatch(setEpisodeImage(item.poster));
        navigate(`/episodes/${
            item.id
        }/${
            item.name
        }`);
    };

    return (
        <div className="group rounded-xl border-2 border-gray-800 bg-gray-900/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#f47521]/60 hover:scale-105">
            <Link to={
                    `/anime/${
                        item.id
                    }`
                }
                className="block relative w-full">
                <div className="relative w-full aspect-[4/4] overflow-hidden">
                    <img src={
                            item.poster
                        }
                        alt={
                            item.name
                        }
                        className="absolute w-full h-full object-cover transition-all duration-700 group-hover:scale-150"/>
                    <div className="absolute flex items-center justify-center h-full w-full inset-0 bg-gray-950/80 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="hover:scale-110 rounded-full p-3 text-[#f47521] cursor-pointer border border-[#f47521]/50 hover:text-[#f47521] bg-[#f47521]/10 transition-all duration-500"><FaPlay className="text-xs md:text-lg"/>
                        </div>
                    </div>


                </div>
            </Link>
            <div className="p-3 md:p-4 flex flex-col gap-2">
                <Link to={
                        `/anime/${
                            item.id
                        }`
                    }
                    className="font-semibold text-white text-sm md:text-base leading-snug hover:text-[#f47521] transition-colors line-clamp-2">
                    {
                    item.name
                } </Link>
                <div className="text-xs md:text-sm text-gray-400">
                    {
                    item.episodes ?. sub ? `Sub • ${
                        item.episodes.sub
                    } Eps` : 'Sub • N/A'
                } </div>
                <div className="mt-2 flex items-center gap-2">
                    <button onClick={handleWatchClick}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#f47521] text-black text-xs md:text-sm font-bold rounded-lg hover:bg-[#e65a0a] transition-colors duration-300">
                        <FaPlay/>
                        <span>Watch</span>
                    </button>
                    <button onClick={handleRemove}
                        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-red-600/20 transition-colors duration-300"
                        title={
                            `Remove from ${listType}`
                        }
                        aria-label={
                            `Remove ${
                                item.name
                            } from ${listType}`
                    }>
                        <FaTrashAlt/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function UserAnimeList({data, isLoading, listType}) {
    const emptyState = {
        favorites: {
            icon: <FaStar className="text-4xl text-[#f57421]"/>,
            title: "No Favorites Yet",
            message: "Start adding anime to your favorites to see them here!"
        },
        watchlist: {
            icon: <FaBookmark className="text-4xl text-[#f57421]"/>,
            title: "Your Watchlist is Empty",
            message: "Add anime to your watchlist to see them here!"
        }
    };

    const currentInfo = emptyState[listType];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <LoadingAnimation/>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    {
                    currentInfo.icon
                } </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-3">
                    {
                    currentInfo.title
                }</h3>
                <p className="text-gray-500 text-lg">
                    {
                    currentInfo.message
                }</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-6">
            {
            data.map(item => (
                <UserAnimeCard key={
                        item.id
                    }
                    item={item}
                    listType={listType}/>
            ))
        } </div>
    );
}
