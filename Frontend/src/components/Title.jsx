import React from 'react';

export default function Title({name, anime}) {
    return (
        <div className="w-full my-6">
            <h2 className={
                `font-bold flex tracking-tight ${
                    anime ? 'text-xl md:text-3xl lg:text-4xl' : 'justify-center pb-6 text-2xl md:text-4xl lg:text-5xl'
                }`
            }>
                <span className={
                    ` ${
                        anime ? 'text-white' : 'text-[#f47521]'
                    } `
                }>
                    {name} </span>
                <span className="text-[#f47521]">
                    {anime}</span>
            </h2>
        </div>
    );
}
