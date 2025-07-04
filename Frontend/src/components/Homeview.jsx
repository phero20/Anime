import React, { useEffect, useState, useRef } from "react";

export default function Homeview({AnimeData,loading}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const slides =
    !loading &&
    AnimeData &&
    AnimeData.data &&
    AnimeData.data.data &&
    Array.isArray(AnimeData.data.data.spotlightAnimes)
      ? AnimeData.data.data.spotlightAnimes
      : [];

  // Carousel navigation
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetTimeout();
  };

  const resetTimeout = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextSlide, 2000);
  };

  useEffect(() => {
    if (slides.length > 0) {
      resetTimeout();
    }
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, slides.length]);

  if (loading)
    return (
      <div className="text-white text-center bg-black h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (slides.length === 0)
    return (
      <div>
       
      </div>
    );

  const currentSlide = slides[currentIndex];

  return (
    <div className="min-h-screen bg-black text-white font-['Crunchyroll_Atyp',_sans-serif]">
      <div className="relative w-full h-screen overflow-hidden">
        <img
          src={currentSlide.poster}
          alt={`${currentSlide.name} Poster`}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ease-in-out"
          loading="lazy"
        />

      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.85)_20%,rgba(0,0,0,0.5)_60%,transparent_100%),linear-gradient(to_top,rgba(0,0,0,0.9),transparent)]" />


        <div className="relative z-10 h-full flex items-center justify-start">
          <div className="hidden md:flex flex-col justify-center w-full max-w-[40rem] px-6 lg:px-12 h-full">
            <h1 className="text-[#f47521] text-3xl lg:text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
              {currentSlide.name}
            </h1>
            <p className="text-gray-200 text-sm lg:text-base leading-relaxed font-medium max-w-[36rem]">
              {currentSlide.description.length > 500
                ? `${currentSlide.description.slice(0, 500)}...`
                : currentSlide.description}
            </p>
            <div className="mt-8 flex gap-4">
              <button className="bg-[#f47521] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#e55f0a] transition duration-300">
                ▶ Watch Now
              </button>
              <button className="border border-[#f47521] text-[#f47521] px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#f47521] hover:text-white transition duration-300">
                + Add to Crunchylist
              </button>
            </div>

            <div className="flex mt-6 gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-10 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#f47521] scale-110"
                      : "bg-gray-600 hover:bg-[#f47521]/70"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="md:hidden flex flex-col justify-end w-full px-4 pb-12 h-full bg-gradient-to-t from-black/90 to-transparent">
            <h1 className="text-[#f47521] text-2xl font-bold text-center leading-tight mb-4 drop-shadow-lg">
              {currentSlide.name}
            </h1>
            <p className="text-gray-200 text-sm lg:text-base leading-relaxed font-medium mb-4 text-center max-w-[36rem]">
              {currentSlide.description.length > 200
                ? `${currentSlide.description.slice(0, 200)}...`
                : currentSlide.description}
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-[#f47521] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#e55f0a] transition duration-300">
                ▶ Watch Now
              </button>
              <button className="border border-[#f47521] text-[#f47521] px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#f47521] hover:text-white transition duration-300">
                + Add to Crunchylist
              </button>
            </div>

            <div className="flex justify-center mt-4 gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-8 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#f47521] scale-110"
                      : "bg-gray-600 hover:bg-[#f47521]/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
