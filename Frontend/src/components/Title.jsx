import React from 'react';

export default function Title({name, anime}) {
    return (
        <div className="mb-4">
            <h2 className={`font-bold flex items-center tracking-tight gap-2 ${
                anime 
                    ? 'text-xl md:text-xl lg:text-2xl xl:text-3xl' 
                    : 'justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl'
            }`}>
                <span className={anime ? 'text-white' : 'text-[#f47521]'}>
                    {name}
                </span>
                {anime && (
                    <span className="text-[#f47521]">
                        {anime}
                    </span>
                )}
            </h2>
        </div>
    );
}
