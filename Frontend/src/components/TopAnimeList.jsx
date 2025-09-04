import React from 'react';
import Title from './Title';
import { MdLiveTv } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdVideoLibrary } from "react-icons/md";
import { motion } from 'framer-motion';

export default function TopAnimeList({ top10Animes }) {
    const navigate = useNavigate();

    const top10AnimesData = [
        {
            name: 'Today',
            data: top10Animes?.today || []
        }, {
            name: 'Week',
            data: top10Animes?.week || []
        }, {
            name: 'Month',
            data: top10Animes?.month || []
        },
    ];


    return (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 text-white font-['Crunchyroll_Atyp',_sans-serif]">
            <div className='w-full flex justify-center mb-8'> <Title name="Top 10" anime={"Animes"} /> </div>

            {top10AnimesData.map((section, idx) => (
                <motion.div key={idx}
                id={idx}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                viewport={{ once: false, margin: "-80px" }}
                transition={{ duration: .6 }}
                className="mb-12">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-2">
                        <div className="h-8 w-1 bg-[#f47521] rounded-full"></div>
                        <h2 className="text-[#f47521] text-xl sm:text-2xl font-bold">
                            {section.name}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {section.data.map((anime, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(`/anime/${anime.id}`)}
                                className="group cursor-pointer hover:bg-gray-900/55 hover:border border-[#f47521]/50 rounded-xl p-2 transition-all duration-500"
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                  
                                    <div className="w-28 h-20 rounded-lg overflow-hidden shrink-0 relative">
                                        <img
                                            src={anime.poster}
                                            alt={anime.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-150"
                                        />
                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 bg-gray-950/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#f47521]/10 border border-[#f47521]/50 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                                                <FaPlay className="text-[#f47521] ml-0.5" size={12} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-grow min-w-0">
                                        <h3 className="text-sm font-bold text-white group-hover:text-[#f47521] transition-colors duration-300 line-clamp-2 leading-tight mb-1">
                                            {anime.name}
                                        </h3>
                                        
                                        {/* Episode Badges */}
                                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                                            {anime.episodes?.sub && (
                                                <div className="flex items-center gap-1 bg-gray-800/60 px-2 py-1 rounded-md">
                                                    <MdVideoLibrary className="text-[#f47521]" size={10} />
                                                    <span className="text-xs text-gray-300">SUB {anime.episodes.sub}</span>
                                                </div>
                                            )}
                                            {anime.episodes?.dub && (
                                                <div className="flex items-center gap-1 bg-gray-800/60 px-2 py-1 rounded-md">
                                                    <MdVideoLibrary className="text-[#f47521]" size={10} />
                                                    <span className="text-xs text-gray-300">DUB {anime.episodes.dub}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                      
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
