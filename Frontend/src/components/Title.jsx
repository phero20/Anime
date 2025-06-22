import React from 'react';

export default function Title({ name }) {
    return (
        <div className="w-full my-6">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="text-white">{name} </span>
                <span className="text-orange-500">Anime</span>
            </h2>
        </div>
    );
}
