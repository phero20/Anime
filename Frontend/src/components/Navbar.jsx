import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHamburger,
  FaSearch,
  FaUser,
  FaChevronDown,
  FaTimes,
  // FaChevronUp
} from "react-icons/fa";
import { RiBookmarkFill } from "react-icons/ri";
import { Link as ScrollLink, scroller } from "react-scroll";
import { useSelector } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { selectUser } from "../redux/apifetch/AuthSlicer";
import Auth from "./Auth";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const activeSection = useSelector((state) => state.ui.activeSection);
  const user = useSelector(selectUser);

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
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Full-Screen Themed Mobile Menu */}
            <motion.div 
              className="fixed inset-0 w-full h-full bg-black text-[#F1EFEC] pt-8 px-2 z-50 overflow-y-auto flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 35,
                duration: 0.2
              }}
            >
              {/* Close Button */}
              <button aria-label="Close menu" className="absolute top-4 right-4 text-4xl px-3 py-1 rounded-full hover:text-white transition font-bold text-[#F47521]" onClick={() => setMenuOpen(false)}>
                &times;
              </button>
            <div className="flex flex-col gap-2 my-8">
              {/* Navigation Section */}
              <div className="bg-gray-900/80 rounded-xl shadow p-4 flex flex-col gap-2">
                <div className="uppercase text-xs tracking-widest text-gray-400 mb-2 font-semibold">Navigation</div>
                <div className="flex flex-col gap-1">
                  {[...navItems, ...moreItems].map((item) => (
                    <div key={item}
                      onClick={() => handleNavItemClick(item.toLowerCase())}
                      className={`rounded-lg px-4 py-2 transition-all duration-200 cursor-pointer capitalize text-base font-medium text-left tracking-wide ${
                        !isCategoryPage && !isGenrePage && isHomepage && activeSection === item.toLowerCase()
                          ? "bg-[#f47521] text-[#181818] shadow" : "hover:bg-gray-800 hover:text-[#f47521] text-gray-300"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              {/* Category Section */}
              <div className="bg-gray-900/80 rounded-xl shadow p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between cursor-pointer px-2 py-2 rounded-lg" onClick={() => { setCategoryOpen((prev) => !prev); setGenreOpen(false); }}>
                  <span className="uppercase text-xs tracking-widest text-gray-400 font-semibold">Category</span>
                  <FaChevronDown size={18} className={`transition-transform text-[#f47521] duration-300 ${categoryOpen ? 'rotate-180' : ''}`} />
                </div>
                {categoryOpen && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-2 py-2 bg-gray-900 rounded-lg border border-[#232323] shadow">
                    {categoryItems.map((item) => (
                      <NavLink key={item}
                        to={`/category/${item.toLowerCase()}`}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) => `text-base cursor-pointer capitalize transition-all duration-200 rounded px-3 py-2 font-medium text-left ${
                          isActive ? "bg-[#f47521] text-[#181818] shadow" : "text-gray-300 hover:bg-gray-800 hover:text-[#f47521]"
                        }`}>
                        {item.replace(/-/g, " ")}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
              {/* Genres Section */}
              <div className="bg-gray-900/80 rounded-xl shadow p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between cursor-pointer px-2 py-2 rounded-lg" onClick={() => { setGenreOpen((prev) => !prev); setCategoryOpen(false); }}>
                  <span className="uppercase text-xs tracking-widest text-gray-400 font-semibold">Genres</span>
                  <FaChevronDown size={18} className={`transition-transform text-[#f47521] duration-300 ${genreOpen ? 'rotate-180' : ''}`} />
                </div>
                {genreOpen && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-2 py-2 bg-gray-900 rounded-lg border border-[#232323] shadow">
                    {genres.map((item) => (
                      <NavLink key={item}
                        to={`/genre/${item.toLowerCase()}`}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) => `text-base cursor-pointer capitalize transition-all duration-200 rounded px-3 py-2 font-medium text-left ${
                          isActive ? "bg-[#f47521] text-[#181818] shadow" : "text-gray-300 hover:bg-gray-800 hover:text-[#f47521]"
                        }`}>
                        {item.replace(/-/g, " ")}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Animation styles */}
            
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Transparent background */}
            <motion.div 
              className="absolute inset-0 bg-gray-950/70"
              // initial={{ backdropFilter: "blur(0px)" }}
              // animate={{ backdropFilter: "blur(8px)" }}
              // exit={{ backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3}}
              onClick={() => setShowLoginModal(false)}
            />
            
            {/* Auth Component */}
            <motion.div 
              className="relative z-10 w-full h-full flex items-center justify-center p-4"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1
              }}
            >
              <Auth onClose={() => setShowLoginModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hide navbar when menuOpen is true on mobile */}
      <nav className={`fixed top-0 left-0 right-0 z-50 text-[#F1EFEC] flex items-center justify-between px-4 lg:px-12 py-3 transition-all duration-500 ${
        isScrolled ? "bg-[#030303]" : " bg-transparent"
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
              More <FaChevronDown size={14} className={`transition-transform duration-300 ${moreOpen ? 'rotate-180' : ''}`} />
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
              Category <FaChevronDown size={14} className={`transition-transform duration-300 ${categoryOpen ? 'rotate-180' : ''}`} />
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
              Genres <FaChevronDown size={14} className={`transition-transform duration-300 ${genreOpen ? 'rotate-180' : ''}`} />
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
          {[{icon:FaSearch,path:'search'}, {icon:RiBookmarkFill,path:'saved'}].map((Icon, i) => (
            <NavLink to={`/${Icon.path}`} key={i}
            className={({ isActive }) =>`p-2 hover:bg-[#f47521] hover:text-[#030303] rounded-full cursor-pointer transition-all duration-500 } ${ isActive ? 'bg-[#f47521] text-black' : ''}` }>
              <Icon.icon size={18} />
            </NavLink>
          ))}
          
          {/* Conditional Auth Button */}
          {user ? (
            <NavLink to="/profile" 
              className={({ isActive }) =>`p-0.5 hover:bg-[#f47521] hover:text-[#030303] rounded-full cursor-pointer transition-all duration-500 ${ isActive ? 'bg-[#f47521] text-black' : ''}`}>
              <img src={user.avatar} className="w-7 rounded-full" alt="" />
            </NavLink>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 bg-[#f47521] text-black rounded-full hover:bg-[#ff6d12] hover:scale-105 transition-all duration-500 text-sm font-semibold">
              Login
            </button>
          )}
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