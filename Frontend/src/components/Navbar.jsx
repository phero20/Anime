import React, { useState, useEffect, useRef } from "react";
import {
  FaHamburger,
  FaSearch,
  FaUser,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { RiBookmarkFill } from "react-icons/ri";
import { Link as ScrollLink, scroller } from "react-scroll";
import { useSelector } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const activeSection = useSelector((state) => state.ui.activeSection);

  const navItems = ["Home", "Trending", "Latests", "Upcomings"];
  const moreItems = [
    "Top10",
    "Airing",
    "Popular",
    "Favorite",
    "Completed"
  ];
  const categoryItems = [
    "Most-Favorite",
    "Most-Popular",
    "Subbed-Anime",
    "Dubbed-Anime",
    "Recently-Updated",
    "Recently-Added",
    "Top-Upcoming",
    "Top-Airing",
    "Movie",
    "Special",
    "OVA",
    "ONA",
    "TV",
    "Completed",
  ];
  const { AnimeData } = useSelector((state) => state.AnimeData);
  const genres = AnimeData?.data?.data?.genres || [];

  // Responsive desktop detection
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll detection for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsScrolled(scrollTop > 60);
    };

    // Set initial state
    handleScroll();

    // Add event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Additional effect to handle scroll state when location changes
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsScrolled(scrollTop > 100);
    };

    // Check scroll position when location changes
    handleScroll();
  }, [location.pathname]);

  // Dropdown close delay timers
  const moreTimeout = useRef();
  const categoryTimeout = useRef();
  const genreTimeout = useRef();

  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const section = location.state.scrollTo;
      setTimeout(() => {
        scroller.scrollTo(section, {
          smooth: true,
          duration: 900,
          offset: -80
        });
      }, 100);
    }
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setMoreOpen(false);
    setCategoryOpen(false);
    setGenreOpen(false);
  };

  const handleNavItemClick = (section) => {
    if (location.pathname !== "/") {
      navigate("/", {
        state: {
          scrollTo: section
        }
      });
    } else {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 900,
        offset: -80
      });
    }
    setMenuOpen(false);
    setMoreOpen(false);
    setCategoryOpen(false);
    setGenreOpen(false);
  };

  const isCategoryPage = location.pathname.startsWith("/category/");
  const isGenrePage = location.pathname.startsWith("/genre/");
  const isHomepage = location.pathname === "/";

  return (
    <div className="relative z-50 text-lg">
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#030303] text-[#F1EFEC] pt-20 px-6 z-50 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {/* Close Button */}
            <button aria-label="Close menu" className="absolute top-4 right-4 text-3xl px-3 py-0.5 rounded-full hover:bg-[#232323] transition font-bold text-[#f47521] focus:outline-none focus:ring-2 focus:ring-[#f47521]"
              onClick={() => setMenuOpen(false)}>
              &times;
            </button>
            {/* Navigation Section (navItems + moreItems combined) */}
            <div>
              <div className="text-[#f47521] font-semibold text-base mb-2 pl-2 tracking-wide">Navigation</div>
              <div className="flex flex-col gap-1">
                {[...navItems, ...moreItems].map((item) => (
                  <div key={item}
                    onClick={() => handleNavItemClick(item.toLowerCase())}
                    className={`rounded px-4 py-2 transition-all duration-200 cursor-pointer capitalize text-base font-medium ${
                      !isCategoryPage && !isGenrePage && isHomepage && activeSection === item.toLowerCase() 
                        ? "bg-[#f47521] text-[#030303]" 
                        : "hover:bg-[#232323] hover:text-[#f47521]"
                    }`}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {/* Category Section */}
            <div>
              <div onClick={() => {
                setCategoryOpen((prev) => !prev);
                setGenreOpen(false);
              }}
                className={`flex items-center justify-between cursor-pointer px-2 py-2 rounded-lg bg-[#181818] mb-2 ${
                  isCategoryPage ? "text-[#f47521]" : "text-[#F1EFEC]"
                }`}>
                <span className="font-semibold text-base">Category</span>
                {categoryOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
              </div>
              {categoryOpen && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-2 py-3 bg-[#181818] rounded-lg">
                  {categoryItems.map((item) => (
                    <NavLink key={item}
                      to={`/category/${item.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) => `text-sm cursor-pointer capitalize transition-all duration-200 rounded px-2 py-1 font-medium ${
                        isActive ? "bg-[#f47521] text-[#030303]" : "text-gray-300 hover:bg-[#232323] hover:text-[#f47521]"
                      }`}>
                      {item.replace(/-/g, " ")}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
            {/* Genres Section */}
            <div>
              <div onClick={() => {
                setGenreOpen((prev) => !prev);
                setCategoryOpen(false);
              }}
                className={`flex items-center justify-between cursor-pointer px-2 py-2 rounded-lg bg-[#181818] mb-2 ${
                  isGenrePage ? "text-[#f47521]" : "text-[#F1EFEC]"
                }`}>
                <span className="font-semibold text-base">Genres</span>
                {genreOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
              </div>
              {genreOpen && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-2 py-3 bg-[#181818] rounded-lg">
                  {genres.map((item) => (
                    <NavLink key={item}
                      to={`/genre/${item.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) => `text-sm cursor-pointer capitalize transition-all duration-200 rounded px-2 py-1 font-medium ${
                        isActive ? "bg-[#f47521] text-[#030303]" : "text-gray-300 hover:bg-[#232323] hover:text-[#f47521]"
                      }`}>
                      {item.replace(/-/g, " ")}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Hide navbar when menuOpen is true on mobile */}
      <nav className={`fixed top-0 left-0 right-0 z-50 text-[#F1EFEC] flex items-center justify-between px-4 lg:px-12 py-3 transition-all duration-500 ${
        isScrolled ? "bg-[#030303]" : "bg-transparent"
      } ${menuOpen ? "hidden" : ""}`}>
        <div className="flex items-center gap-6">
          <div className="lg:hidden cursor-pointer" onClick={toggleMenu}>
            <FaHamburger size={22} />
          </div>
          <div className="text-xl font-bold">logo</div>
        </div>

        <div className="hidden lg:flex gap-4 items-center">
          {navItems.map((item) => (
            <div key={item}
              onClick={() => handleNavItemClick(item.toLowerCase())}
              className={`hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 cursor-pointer capitalize ${
                !isCategoryPage && !isGenrePage && isHomepage && activeSection === item.toLowerCase() 
                  ? "text-[#f47521] border-b-2 border-[#f47521]" 
                  : ""
              }`}>
              {item}
            </div>
          ))}

          {/* For More dropdown: */}
          <div className="relative"
            onMouseEnter={() => {
              if (isDesktop) {
                clearTimeout(moreTimeout.current);
                setMoreOpen(true);
                setCategoryOpen(false);
                setGenreOpen(false);
              }
            }}
            onMouseLeave={() => {
              if (isDesktop) {
                moreTimeout.current = setTimeout(() => setMoreOpen(false), 150);
              }
            }}>
            <div className={`flex items-center gap-2 cursor-pointer hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 ${
              !isCategoryPage && !isGenrePage && isHomepage && moreItems.map((i) => i.toLowerCase()).includes(activeSection) 
                ? "text-[#f47521] border-b-2 border-[#f47521]" 
                : ""
            }`}
              onClick={() => {
                setMoreOpen((prev) => !prev);
                setCategoryOpen(false);
                setGenreOpen(false);
              }}>
              More {moreOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </div>
            <div className={`absolute top-full right-0 mt-2 bg-[#030303] rounded shadow-md z-30 py-4 overflow-hidden flex flex-col gap-4 transition-all duration-300 ${
              moreOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}>
              {moreItems.map((item) => (
                <div key={item}
                  onClick={() => handleNavItemClick(item.toLowerCase())}
                  className={`hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 cursor-pointer capitalize ${
                    !isCategoryPage && !isGenrePage && isHomepage && activeSection === item.toLowerCase() 
                      ? "text-[#f47521] border-b-2 border-[#f47521]" 
                      : ""
                  }`}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* For Category dropdown: */}
          <div className="relative"
            onMouseEnter={() => {
              if (isDesktop) {
                clearTimeout(categoryTimeout.current);
                setCategoryOpen(true);
                setMoreOpen(false);
                setGenreOpen(false);
              }
            }}
            onMouseLeave={() => {
              if (isDesktop) {
                categoryTimeout.current = setTimeout(() => setCategoryOpen(false), 150);
              }
            }}>
            <div className={`flex items-center gap-2 cursor-pointer hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 ${
              isCategoryPage ? "text-[#f47521] border-b-2 border-[#f47521]" : ""
            }`}
              onClick={() => {
                setCategoryOpen((prev) => !prev);
                setMoreOpen(false);
                setGenreOpen(false);
              }}>
              Category {categoryOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </div>
            <div className={`absolute top-full right-0 mt-2 bg-[#030303] rounded shadow-md z-30 p-4 grid grid-cols-3 gap-x-14 gap-y-7 w-max min-w-[300px] transition-all duration-300 ${
              categoryOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}>
              {categoryItems.map((item) => (
                <NavLink key={item}
                  to={`/category/${item.toLowerCase()}`}
                  onClick={() => setCategoryOpen(false)}
                  className={({ isActive }) => `hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-2 py-1 transition-all duration-200 cursor-pointer capitalize ${
                    isActive ? "text-[#f47521] border-b-2 border-[#f47521]" : ""
                  }`}>
                  {item.replace(/-/g, " ")}
                </NavLink>
              ))}
            </div>
          </div>

          {/* For Genres dropdown: */}
          <div className="relative"
            onMouseEnter={() => {
              if (isDesktop) {
                clearTimeout(genreTimeout.current);
                setGenreOpen(true);
                setCategoryOpen(false);
                setMoreOpen(false);
              }
            }}
            onMouseLeave={() => {
              if (isDesktop) {
                genreTimeout.current = setTimeout(() => setGenreOpen(false), 150);
              }
            }}>
            <div className={`flex items-center gap-2 cursor-pointer hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 ${
              isGenrePage ? "text-[#f47521] border-b-2 border-[#f47521]" : ""
            }`}
              onClick={() => {
                setGenreOpen((prev) => !prev);
                setCategoryOpen(false);
                setMoreOpen(false);
              }}>
              Genres {genreOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </div>
            <div className={`absolute top-full -right-1/2 mt-2 bg-[#030303] rounded shadow-md z-30 p-4 grid grid-cols-5 gap-x-14 gap-y-7 w-max min-w-[300px] transition-all duration-300 ${
              genreOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}>
              {genres.map((item) => (
                <NavLink key={item}
                  to={`/genre/${item.toLowerCase()}`}
                  onClick={() => setGenreOpen(false)}
                  className={({ isActive }) => `hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-2 py-1 transition-all duration-200 cursor-pointer capitalize ${
                    isActive ? "text-[#f47521] border-b-2 border-[#f47521]" : ""
                  }`}>
                  {item.replace(/-/g, " ")}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {[FaSearch, RiBookmarkFill, FaUser].map((Icon, i) => (
            <div key={i}
              className="p-2 hover:bg-[#f47521] hover:text-[#030303] rounded-full cursor-pointer transition">
              <Icon size={16} />
            </div>
          ))}
        </div>
      </nav>
      
      {(menuOpen || moreOpen || categoryOpen || genreOpen) && (
        <div className="hidden lg:block fixed top-0 left-0 w-full h-screen bg-gray-900/65 z-30"
          onClick={() => {
            setMenuOpen(false);
            setMoreOpen(false);
            setCategoryOpen(false);
          }} />
      )}
    </div>
  );
}
