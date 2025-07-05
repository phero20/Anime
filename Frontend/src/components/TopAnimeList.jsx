import React from 'react';
import Title from './Title';
import {MdLiveTv} from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function TopAnimeList({top10Animes}) {
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
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6 text-white font-['Crunchyroll_Atyp',_sans-serif] bg-[#030303]">
           <div className='w-full flex justify-center'> <Title name="Top 10" anime={"Animes"} className="mb-6"/> </div>
            
            {top10AnimesData.map((section, idx) => (
                <div key={idx} className="mb-10" data-aos="zoom-out-up">
                    <h2 className="text-[#f47521] text-lg font-semibold mb-4 border-b border-gray-700 pb-1">
                        {section.name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {section.data.map((anime, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(`/anime/${anime.id}`)}
                                className="flex items-center w-full hover:scale-105 hover:bg-gray-900/90 transition-all duration-500 cursor-pointer bg-black rounded-md overflow-hidden p-2 group"
                            >
                                {/* Image */}
                                <div className="w-28 h-20 rounded-md overflow-hidden shrink-0 relative">
                                    <img
                                        src={anime.poster}
                                        alt={anime.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-150"
                                    />
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                       
                                            <FaPlay className="text-[#f47521]" size={20} />
                                        
                                    </div>
                                </div>
                                {/* Info */}
                                <div className="ml-4 flex-grow">
                                    <h3 className="text-sm font-semibold break-words leading-snug">
                                        {anime.name}
                                    </h3>
                                    <div className="text-xs flex gap-1 text-[#f47521]">
                                        <MdLiveTv/>
                                        {anime.episodes ? `${anime.episodes.sub} Episodes` : ''}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {anime.episodes?.sub && 'Sub'}
                                        {anime.episodes?.sub && anime.episodes?.dub && ' | '}
                                        {anime.episodes?.dub && 'Dub'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
