import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { RiBookmarkFill } from "react-icons/ri";
import { Link as ScrollLink, scroller } from "react-scroll";
import { useSelector } from "react-redux";
import { NavLink, useNavigate, useLocation ,Link} from "react-router-dom";
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
  const [showGreeting, setShowGreeting] = useState(false);

  const activeSection = useSelector((state) => state.ui.activeSection);
  const user = useSelector(selectUser);

  // Ref for scrolling to sections
  const categoryRef = useRef(null);
  const genreRef = useRef(null);

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

  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsScrolled(scrollTop > 60);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsScrolled(scrollTop > 100);
    };
    handleScroll();
  }, [location.pathname]);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-trigger')) {
        setMenuOpen(false);
      }
    };
    
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

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
    <div className="relative z-50">
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300  border-white/10 ${
        isScrolled 
          ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b shadow-lg" 
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center gap-2">
              <button 
                className="lg:hidden mobile-menu-trigger p-2 text-white hover:text-[#f47521] transition-colors duration-500"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <FaBars size={20} />
              </button>
              
              <Link to="/" className="flex items-center gap-2">
                <div className="text-2xl font-bold text-white hover:text-[#f47521] transition-colors duration-500">
                  AnimeHub
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Main Nav Items */}
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavItemClick(item.toLowerCase())}
                  className={`px-4 py-2 text-lg font-medium capitalize ${
                    !isCategoryPage && !isGenrePage && isHomepage && activeSection === item.toLowerCase()
                      ? "text-[#f47521] border-b-2 border-[#f47521]" : "text-white hover:border-b-2 hover:text-[#f47521] hover:border-[#f47521]"
                  }`}
                >
                  {item}
                </button>
              ))}

              {/* More Dropdown */}
              <div 
                className="relative"
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
                }}
              >
                <button
                  className={`flex items-center gap-2 px-4 py-2 text-lg font-medium ${
                    !isCategoryPage && !isGenrePage && isHomepage && moreItems.map((i) => i.toLowerCase()).includes(activeSection)
                      ? "text-[#f47521] border-b-2 border-[#f47521]" : "text-white hover:border-b-2 hover:text-[#f47521] hover:border-[#f47521]"
                  }`}
                  onClick={() => {
                    setMoreOpen((prev) => !prev);
                    setCategoryOpen(false);
                    setGenreOpen(false);
                  }}
                >
                  More 
                  <FaChevronDown 
                    size={14} 
                    className={`transition-transform duration-500 ${moreOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full -right-4 mt-4 w-48 py-4 gap-4 flex flex-col bg-gray-950 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl"
                    >
                      {moreItems.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleNavItemClick(item.toLowerCase())}
                          className={`w-full text-left px-4 py-1 text-lg font-medium capitalize ${
                            !isCategoryPage && !isGenrePage && isHomepage && activeSection === item.toLowerCase()
                              ? "text-[#f47521] border-b-2 border-[#f47521]" : "text-white hover:border-b-2 hover:text-[#f47521] hover:border-[#f47521]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Category Dropdown */}
              <div 
                className="relative"
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
                }}
              >
                <button
                  className={`flex items-center gap-2 px-4 py-2 text-lg font-medium ${
                    isCategoryPage ? "text-[#f47521] border-b-2 border-[#f47521]" : "text-white hover:border-b-2 hover:text-[#f47521] hover:border-[#f47521]"
                  }`}
                  onClick={() => {
                    setCategoryOpen((prev) => !prev);
                    setMoreOpen(false);
                    setGenreOpen(false);
                  }}
                >
                  Category 
                  <FaChevronDown 
                    size={14} 
                    className={`transition-transform duration-500 ${categoryOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {categoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: .8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full -right-4 mt-4 bg-gray-950 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl  w-max min-w-[300px] p-4"
                    >
                      <div className="grid grid-cols-3 gap-x-14 gap-y-7 transition-all duration-300">
                        {categoryItems.map((item) => (
                          <NavLink
                            key={item}
                            to={`/category/${item.toLowerCase()}`}
                            onClick={() => setCategoryOpen(false)}
                            className={({ isActive }) => `px-3 py-1 text-lg font-medium capitalize ${
                              isActive ? "text-[#f47521] border-b-2 border-[#f47521]" : "text-white hover:border-b-2 hover:text-[#f47521] hover:border-[#f47521]"
                            }`}
                          >
                            {item.replace(/-/g, " ")}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Genres Dropdown */}
              <div 
                className="relative"
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
                }}
              >
                <button
                  className={`flex items-center gap-2 px-4 py-2 text-lg font-medium  ${
                    isGenrePage ? "text-[#f47521] border-b-2 border-[#f47521]" : "text-white hover:border-b-2 hover:text-[#f47521] hover:border-[#f47521]"
                  }`}
                  onClick={() => {
                    setGenreOpen((prev) => !prev);
                    setCategoryOpen(false);
                    setMoreOpen(false);
                  }}
                >
                  Genres 
                  <FaChevronDown 
                    size={14} 
                    className={`transition-transform duration-500 ${genreOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {genreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full -right-12 mt-4 bg-gray-950 pb-4 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl p-4 max-h-[39rem] w-max min-w-[300px] overflow-y-auto scrollbar-hide"
                    >
                      <div className="grid grid-cols-5 gap-x-14 gap-y-7">
                        {genres.map((item) => (
                          <NavLink
                            key={item}
                            to={`/genre/${item.toLowerCase()}`}
                            onClick={() => setGenreOpen(false)}
                            className={({ isActive }) => `px-2 py-1 text-lg font-medium capitalize ${
                              isActive ? "text-[#f47521] border-b-2 border-[#f47521]" : "text-white hover:border-b-2 hover:text-[#f47521] hover:border-[#f47521]"
                            }`}
                          >
                            {item.replace(/-/g, " ")}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Icon */}
              <NavLink 
                to="/search" 
                className={({ isActive }) => `p-2 rounded-full transition-all duration-500 ${
                  isActive ? 'text-[#f47521]  ring-2 ring-[#f47521] bg-[#f47521]/10' : 'text-white hover:text-[#f47521] ring-[#f47521]'
                }`}
              >
                <FaSearch size={18} />
              </NavLink>

              {/* Bookmarks Icon */}
              <NavLink 
                to="/saved" 
                className={({ isActive }) => `p-2 rounded-full transition-all duration-500 ${
                  isActive ? 'text-[#f47521] ring-2 ring-[#f47521] bg-[#f47521]/10' : 'text-white hover:text-[#f47521] hover:ring-[#f47521]'
                }`}
              >
                <RiBookmarkFill size={18} />
              </NavLink>
              
              {/* User Profile / Login */}
              {user ? (
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => `p-[0.10rem] rounded-full transition-all duration-500 ${
                    isActive ? 'ring-2 ring-[#f47521]' : 'hover:ring-2 hover:ring-[#f47521]'
                  }`}
                >
                  <img 
                    src={user.avatar} 
                    className="w-8 h-8 rounded-full object-cover" 
                    alt="Profile" 
                  />
                </NavLink>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-[#f47521] hover:bg-[#e65a0a] text-white rounded-lg text-sm font-medium transition-all duration-500 hover:shadow-lg"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background Overlay */}
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div 
              className="mobile-menu absolute top-0 left-0 w-[80vw] h-full bg-[#0a0a0a]/40 backdrop-blur-xl border-r border-white/10 flex flex-col"
              initial={{ x: "-100%" ,opacity: 0}}
              animate={{ x: 0,opacity: 1}}
              exit={{ x: "-100%",opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30
              }}
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                <div className="text-xl font-bold text-white">
                  AnimeHub
                </div>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-500"
                  aria-label="Close menu"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Mobile Menu Content - Scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="p-6 space-y-6 min-h-full w-full">
                  
                  {/* Main Navigation */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#f47521] uppercase tracking-wider mb-3">
                      Navigation
                    </h3>
                    <div className="space-y-1">
                      {[...navItems, ...moreItems].map((item) => (
                        <button
                          key={item}
                          onClick={() => handleNavItemClick(item.toLowerCase())}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-500 capitalize font-medium ${
                            !isCategoryPage && !isGenrePage && isHomepage && activeSection === item.toLowerCase()
                              ? "text-[#f47521] bg-[#f47521]/10" 
                              : "text-white hover:text-[#f47521] hover:bg-white/5"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div ref={categoryRef}>
                    <button
                      onClick={() => {
                        setCategoryOpen((prev) => !prev);
                        setGenreOpen(false); // Close genre when category opens
                        // Scroll to category section after a short delay
                        setTimeout(() => {
                          if (!categoryOpen && categoryRef.current) {
                            categoryRef.current.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start' 
                            });
                          }
                        }, 300);
                      }}
                      className={`flex items-center justify-between w-full text-lg font-semibold text-[#f47521] uppercase tracking-wider mb-3 transition-all duration-500 `}
                    >
                      <span className={`${isCategoryPage ? "border-b-2 border-[#f47521]" : ""}`}> Categories</span>
                     
                      <FaChevronDown 
                        size={12} 
                        className={`transition-transform duration-500 ${categoryOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {categoryOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-1 pb-2">
                            {categoryItems.map((item) => (
                              <NavLink
                                key={item}
                                to={`/category/${item.toLowerCase()}`}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-500 capitalize text-sm font-medium ${
                                  isActive ? "text-[#f47521] bg-[#f47521]/10" : "text-white hover:text-[#f47521] hover:bg-white/5"
                                }`}
                              >
                                {item.replace(/-/g, " ")}
                              </NavLink>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Genres */}
                  <div ref={genreRef}>
                    <button
                      onClick={() => {
                        setGenreOpen((prev) => !prev);
                        setCategoryOpen(false); // Close category when genre opens
                        // Scroll to genre section after a short delay
                        setTimeout(() => {
                          if (!genreOpen && genreRef.current) {
                            genreRef.current.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start' 
                            });
                          }
                        }, 300);
                      }}
                      className={`flex items-center justify-between w-full text-lg text-[#f47521] font-semibold uppercase tracking-wider mb-3 `}
                    >
                      <span className={`${ isGenrePage ? "border-b-2 border-[#f47521]" : ""}`}> Genres</span>
                     
                      <FaChevronDown 
                        size={12} 
                        className={`transition-transform duration-500 ${genreOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {genreOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-1 pb-2">
                            {genres.map((item) => (
                              <NavLink
                                key={item}
                                to={`/genre/${item.toLowerCase()}`}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => `block px-3 py-2 rounded-lg transition-all duration-500 capitalize text-sm font-medium ${
                                  isActive ? "text-[#f47521] bg-[#f47521]/10" : "text-white hover:text-[#f47521] hover:bg-white/5"
                                }`}
                              >
                                {item.replace(/-/g, " ")}
                              </NavLink>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Footer */}
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowLoginModal(false)}
            />
            
            <motion.div 
              className="relative z-10 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={showGreeting ? {} : { scale: 0.9, opacity: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <Auth 
                onClose={() => setShowLoginModal(false)} 
                showGreeting={showGreeting} 
                setShowGreeting={setShowGreeting} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Dropdown Overlay */}
      {(moreOpen || categoryOpen || genreOpen) && isDesktop && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          onClick={() => {
            setMoreOpen(false);
            setCategoryOpen(false);
            setGenreOpen(false);
          }}
        />
      )}
    </div>
  );
}