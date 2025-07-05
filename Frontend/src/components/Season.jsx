import React, {useState} from "react";
import {FaPlay} from "react-icons/fa";
import {RiBookmarkLine, RiAddFill} from "react-icons/ri";

export default function Season({data}) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    
    if (!data) return null;

    const {poster, name, stats, description} = data.anime.info;
    const {studios, genres, producers} = data.anime.moreInfo;

    return (
        <section className="relative w-full min-h-screen bg-black text-white overflow-hidden">
            {/* Background poster with overlay */}
            <div className="absolute inset-0">
                <img 
                    src={poster}
                    alt={name}
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"/>
            </div>

            {/* Main content container */}
            <div className="relative mt-12 z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="min-h-screen flex flex-col justify-center py-8 sm:py-12 lg:py-16">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                        
                        {/* Left content section */}
                        <div className="w-full lg:w-2/3 flex flex-col gap-6 sm:gap-8">
                            
                            {/* Title section */}
                            <div className="space-y-4">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#f47521]">
                                    {name}
                                </h1>
                                
                                {/* Episode info */}
                                <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-gray-300">
                                    {stats?.episodes?.sub && (
                                        <span className="bg-[#f47521]/20 text-[#f47521] px-3 py-1 rounded-full font-medium">
                                            Sub
                                        </span>
                                    )}
                                    {stats?.episodes?.dub && (
                                        <span className="bg-[#f47521]/20 text-[#f47521] px-3 py-1 rounded-full font-medium">
                                            Dub
                                        </span>
                                    )}
                                    {stats?.quality && (
                                        <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full">
                                            {stats.quality}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Synopsis section */}
                            <div className="space-y-3">
                                <h3 className="text-lg sm:text-xl font-semibold text-white">Synopsis</h3>
                                <div className="space-y-2">
                                    <div className="relative overflow-hidden">
                                        <p className={`text-sm sm:text-base text-gray-200 leading-relaxed transition-all duration-700 ease-in-out ${
                                            showFullDescription ? "max-h-[2000px] opacity-100" : "max-h-[115px] opacity-90"
                                        }`}>
                                            {description}
                                        </p>
                                        {!showFullDescription && description.length > 300 && (
                                            <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"/>
                                        )}
                                    </div>
                                    {description.length > 305 && (
                                        <button 
                                            onClick={() => setShowFullDescription(!showFullDescription)}
                                            className="text-sm font-semibold text-[#f47521] hover:text-white transition-all duration-300 flex items-center gap-1 group"
                                        >
                                            <span>{showFullDescription ? "Show Less" : "Read More"}</span>
                                            <svg 
                                                className={`w-4 h-4 transition-transform duration-300 ${showFullDescription ? 'rotate-180' : ''}`}
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stats section */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                                <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Rating</p>
                                    <p className="text-sm sm:text-base font-semibold text-white">{stats?.rating || "N/A"}</p>
                                </div>
                                <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Sub Episodes</p>
                                    <p className="text-sm sm:text-base font-semibold text-white">{stats?.episodes?.sub || "N/A"}</p>
                                </div>
                                <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Dub Episodes</p>
                                    <p className="text-sm sm:text-base font-semibold text-white">{stats?.episodes?.dub || "N/A"}</p>
                                </div>
                                <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Studio</p>
                                    <p className="text-sm sm:text-base font-semibold text-white">{studios || "N/A"}</p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                <button className="flex items-center gap-2 bg-[#f47521] hover:bg-[#e66713] text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl">
                                    <FaPlay size={16}/>
                                    START WATCHING
                                </button>
                                <button className="flex items-center justify-center w-12 h-12 border-2 border-[#f47521] text-[#f47521] hover:bg-[#f47521] hover:text-black rounded-lg transition-all duration-300">
                                    <RiBookmarkLine size={20}/>
                                </button>
                                <button className="flex items-center justify-center w-12 h-12 text-[#f47521] hover:text-white hover:bg-[#f47521]/20 rounded-lg transition-all duration-300">
                                    <RiAddFill size={24}/>
                                </button>
                            </div>

                            {/* Tags section */}
                            {(genres?.length || producers?.length) && (
                                <div className="space-y-4">
                                    {genres?.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm sm:text-base font-semibold text-[#f47521]">Genres</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {genres.map((genre) => (
                                                    <span 
                                                        key={genre}
                                                        className="bg-gray-800/80 hover:bg-gray-700/80 px-3 py-1.5 rounded-full text-xs sm:text-sm text-gray-300 transition-colors duration-300"
                                                    >
                                                        {genre}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {producers?.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm sm:text-base font-semibold text-[#f47521]">Producers</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {producers.map((producer) => (
                                                    <span 
                                                        key={producer}
                                                        className="bg-gray-800/80 hover:bg-gray-700/80 px-3 py-1.5 rounded-full text-xs sm:text-sm text-gray-300 transition-colors duration-300"
                                                    >
                                                        {producer}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right spacer for desktop */}
                        <div className="hidden lg:block lg:w-1/3"/>
                    </div>
                </div>
            </div>
        </section>
    );
}
