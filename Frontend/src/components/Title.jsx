import React from 'react';

export default function Title({name, anime}) {
    return (
        <div className="mb-1 md:mb-4">
            <div className={`flex items-center gap-3 ${
                anime ? 'justify-start' : 'justify-center'
            }`}>
                {/* Orange accent bar */}
                <div className="w-1 h-8 bg-[#f47521] rounded-full"></div>
                
                <h2 className={`font-black tracking-tight leading-tight ${
                    anime 
                        ? 'text-xl md:text-2xl lg:text-3xl xl:text-4xl' 
                        : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'
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
            
            {/* Subtle underline effect
            <div className={`mt-3 ${anime ? 'ml-4' : 'flex justify-center'}`}>
                <div className="h-0.5 w-16 bg-gradient-to-r from-[#f47521] to-transparent rounded-full"></div>
            </div> */}
        </div>
    );
}
