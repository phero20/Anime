import React from 'react';

export default function Title({ name, anime }) {
    return (
        <div className="mb-1 md:mb-4">
            <div className={`flex items-center gap-3 ${anime ? 'justify-start' : 'justify-center'
                }`}>
                {
                    (name || anime) && <div className="w-1 h-8 bg-[#f47521] rounded-full"></div>
                }


                <h2 className={`font-black tracking-tight leading-tight ${anime
                        ? 'text-xl md:text-2xl lg:text-3xl xl:text-4xl'
                        : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'
                    }`}>
                    <span className={`${anime ? 'text-white' : 'text-[#f47521]'} `}>
                        {name}
                    </span>
                    {anime && (
                        <>
                            <span className="text-gray-400 mx-2">•</span>
                            <span className="text-[#f47521]">
                                {anime}
                            </span>
                        </>
                    )}
                </h2>
            </div>


        </div>
    );
}
