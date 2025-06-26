import React, {useState} from "react";
import {FaPlay} from "react-icons/fa";
import {RiBookmarkLine, RiAddFill} from "react-icons/ri";

export default function Season({data}) {

    const [showFullDescription, setShowFullDescription] = useState(false);
    if (!data) 
        return null;
    

    const {poster, name, stats, description} = data.anime.info;
    const {studios, genres, producers} = data.anime.moreInfo


    return (
        <section className="relative w-full bg-black text-white overflow-hidden">
            {/* ───── Background poster + soft vignette ───── */}
            <div className="absolute inset-0">
                <img src={poster}
                    alt={name}
                    className="w-full h-full object-cover opacity-50"/>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0.5)_10%,transparent_100%),linear-gradient(to_top,rgba(0,0,0,0.9),transparent)]"/>
            </div>

            {/* ───── Foreground content ───── */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col lg:flex-row gap-10 items-center lg:items-start">
                {/* Info column */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-[#f47521]">
                        {name} </h1>

                    <div className="text-sm text-gray-300">
                        <div>
                        {
                        stats ?. episodes ?. sub && <span>Sub | 
                        </span>
                    }
                        {
                        stats ?. episodes ?. dub && <span> Dub</span>
                    }
                        </div>
                        <p className="text-xs">{stats.quality}</p>
                         </div>


                    {/* Synopsis */}
                    <div className="space-y-2">
                        <p className={
                                `text-gray-200 leading-relaxed transition-all duration-700 overflow-hidden ${
                                    showFullDescription ? "max-h-[1000px]" : "max-h-[100px]"
                                }`
                            }
                            style={
                                {wordBreak: "break-word"}
                        }>
                            {
                            showFullDescription ? description : `${
                                description.slice(0, 300)+'...'
                            }`
                        } </p>
                        {
                        description.length > 300 && (
                            <button onClick={
                                    () => setShowFullDescription(!showFullDescription)
                                }
                                className="text-sm font-semibold text-[#f47521] hover:text-gray-200 self-start transition-colors duration-500">
                                {
                                showFullDescription ? "Read Less" : "Read More"
                            } </button>
                        )
                    } </div>
                    {/* Stats */}
                    <div className="text-sm font-semibold text-[#f47521] space-y-1">
                        <p>
                            Rated :&nbsp;
                            <span className="text-gray-300">
                                {
                                stats ?. rating || "N/A"
                            } </span>
                        </p>

                        <p>
                            Sub :&nbsp;
                            <span className="text-gray-300">
                                {
                                stats ?. episodes ?. sub || "N/A"
                            } </span>
                        </p>
                        <p>
                            Dub :&nbsp;
                            <span className="text-gray-300">
                                {
                                stats ?. episodes ?. dub || "N/A"
                            } </span>
                        </p>
                        <p>
                            Studio :&nbsp;
                            <span className="text-gray-300">
                                {
                                studios || "N/A"
                            } </span>
                        </p>
                    </div>
                    {/* CTA buttons */}
                    <div className="flex flex-wrap items-center gap-4">
                        <button className="flex items-center gap-2 bg-[#f47521] hover:bg-[#e66713] text-black font-bold px-6 py-3 rounded transition">
                            <FaPlay/>
                            START WATCHING
                        </button>
                        <button className="flex items-center gap-2 border-2 border-[#f47521] text-[#f47521] hover:bg-[#f47521]/10 px-3 py-3 rounded transition">
                            <RiBookmarkLine size={21}/>
                        </button>
                        <button className="flex items-center gap-2 text-[#f47521] hover:text-white p-2 rounded transition">
                            <RiAddFill size={30}/>
                        </button>
                    </div>
                    <div className="text-sm font-semibold my-5 text-[#f47521] space-y-1">
                        {/* Genres & Producers */}
                        {
                        (genres ?. length || producers ?. length) && (
                            <div className="text-sm text-gray-300 flex flex-col gap-3">
                                {
                                genres ?. length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        <span className="font-semibold text-[#f47521]">Genres :</span>
                                        {
                                        genres.map((g) => (
                                            <span key={g}
                                                className="bg-gray-900/80 px-2 py-0.5 rounded text-xs tracking-wide">
                                                {g} </span>
                                        ))
                                    } </div>
                                )
                            }

                                {
                                producers ?. length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        <span className="font-semibold text-[#f47521]">Producers :</span>
                                        {
                                        producers.map((p) => (
                                            <span key={p}
                                                className="bg-gray-900/80 px-2 py-0.5 rounded text-xs tracking-wide">
                                                {p} </span>
                                        ))
                                    } </div>
                                )
                            } </div>
                        )
                    } </div>
                </div>

                {/* Empty right-hand area keeps background poster visible on desktop */}
                <div className="hidden lg:block lg:w-1/2"/>
            </div>


        </section>
    );
}
