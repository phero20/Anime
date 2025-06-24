import React from 'react';
import Title from './Title';
import {MdLiveTv} from "react-icons/md";


export default function TopAnimeList({top10Animes}) {
    const top10AnimesData = [
        {
            name: 'Today',
            data: top10Animes ?. today || []
        }, {
            name: 'Week',
            data: top10Animes ?. week || []
        }, {
            name: 'Month',
            data: top10Animes ?. month || []
        },
    ];

    return (
        <div className="max-w-[90rem] mx-auto px-4 py-6 text-white font-['Crunchyroll_Atyp',_sans-serif] bg-[#030303]">
            <Title name="Top 10" className="mb-6"/> {
            top10AnimesData.map((section, idx) => (
                <div key={idx}
                    className="mb-10"
                    data-aos="zoom-out-up">
                    <h2 className="text-[#f47521] text-xl font-semibold mb-4 border-b border-gray-700 pb-1">
                        {
                        section.name
                    } </h2>

                    <div className="flex flex-wrap gap-4">
                        {
                        section.data.map((anime, i) => (
                            <div key={i}
                                className="flex items-center w-full hover:scale-105 hover:bg-gray-900/90 transition-all duration-500 cursor-pointer  sm:w-[48%] lg:w-[32%] xl:w-[30%] bg-black rounded-md overflow-hidden p-2">
                                {/* Image */}
                                <img src={
                                        anime.poster
                                    }
                                    alt={
                                        anime.name
                                    }
                                    className="w-36 h-20 object-cover rounded-md shrink-0"/> {/* Info */}
                                {/* Info */}
                                <div className="ml-4 flex-grow">
                                    <h3 className="text-sm font-semibold break-words leading-snug">
                                        {
                                        anime.name
                                    }</h3>
                                    <div className="text-xs flex gap-1 text-[#f47521]">
                                        <MdLiveTv/> {
                                        anime.episodes ? `${
                                            anime.episodes.sub
                                        } Episodes` : ''
                                    } </div>
                                    <div className="text-xs text-gray-400">
                                        {
                                        anime.episodes.sub && 'Sub'
                                    }
                                        {
                                        anime.episodes.dub && ' | Dub'
                                    } </div>
                                </div>
                            </div>
                        ))
                    } </div>
                </div>
            ))
        } </div>
    );
}
