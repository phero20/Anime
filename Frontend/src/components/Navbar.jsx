import React, { useState, useEffect } from "react";
import {
  FaHamburger,
  FaSearch,
  FaUser,
  FaChevronDown,
  FaChevronUp,
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

  const activeSection = useSelector((state) => state.ui.activeSection);

  const navItems = ["Home", "Trending", "Latests", "Upcomings"];
  const moreItems = ["Top10", "Airing", "Popular", "Favorite", "Completed"];
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

  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const section = location.state.scrollTo;
      setTimeout(() => {
        scroller.scrollTo(section, {
          smooth: true,
          duration: 900,
          offset: -80,
        });
      }, 100);
    }
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setMoreOpen(false);
    setCategoryOpen(false);
  };

  const handleNavItemClick = (section) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: section } });
    } else {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 900,
        offset: -80,
      });
    }
    setMenuOpen(false);
    setMoreOpen(false);
    setCategoryOpen(false);
  };

  const isCategoryPage = location.pathname.startsWith("/category/");

  return (
    <div className="relative z-50 text-lg">
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#030303] text-[#F1EFEC] pt-20 px-6 z-40 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {[...navItems, ...moreItems].map((item) => (
              <div
                key={item}
                onClick={() => handleNavItemClick(item.toLowerCase())}
                className={`hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 cursor-pointer capitalize ${
                  !isCategoryPage && activeSection === item.toLowerCase()
                    ? "text-[#f47521] border-b-2 border-[#f47521]"
                    : ""
                }`}
              >
                {item}
              </div>
            ))}

            <div>
              <div
                onClick={() => setCategoryOpen((prev) => !prev)}
                className="flex justify-between items-center px-4 py-2 text-[#f47521] border-b border-gray-700 cursor-pointer"
              >
                <span>Category</span>
                {categoryOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </div>
              {categoryOpen && (
                <div className="grid grid-cols-3 gap-x-4 gap-y-7 px-4 py-2">
                  {categoryItems.map((item) => (
                    <NavLink
                      key={item}
                      to={`/category/${item.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-sm cursor-pointer capitalize transition-all duration-200 hover:text-[#f47521] text-gray-300 ${
                          isActive ? "text-[#f47521] border-b-2 border-[#f47521]" : ""
                        }`
                      }
                    >
                      {item.replace(/-/g, " ")}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <nav
        className={`fixed top-0 left-0 right-0 z-50 text-[#F1EFEC] flex items-center justify-between px-4 lg:px-12 py-3 transition duration-300 ${
          activeSection !== "home" || location.pathname !== "/"
            ? "bg-[#030303]"
            : ""
        }`}
      >
        <div className="flex items-center gap-6">
          <div className="lg:hidden cursor-pointer" onClick={toggleMenu}>
            <FaHamburger size={22} />
          </div>
          <div className="text-xl font-bold">logo</div>
        </div>

        <div className="hidden lg:flex gap-4 items-center">
          {navItems.map((item) => (
            <div
              key={item}
              onClick={() => handleNavItemClick(item.toLowerCase())}
              className={`hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 cursor-pointer capitalize ${
                !isCategoryPage && activeSection === item.toLowerCase()
                  ? "text-[#f47521] border-b-2 border-[#f47521]"
                  : ""
              }`}
            >
              {item}
            </div>
          ))}

          <div className="relative">
            <div
              className={`flex items-center gap-2 cursor-pointer hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 ${
                !isCategoryPage && moreItems.map((i) => i.toLowerCase()).includes(activeSection)
                  ? "text-[#f47521] border-b-2 border-[#f47521]"
                  : ""
              }`}
              onClick={() => {
                setMoreOpen((prev) => !prev);
                setCategoryOpen(false);
              }}
            >
              More {moreOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </div>
            <div
              className={`absolute top-full right-0 mt-2 bg-[#030303] rounded shadow-md z-30 py-4 overflow-hidden flex flex-col gap-4 transition-all duration-300 ${
                moreOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {moreItems.map((item) => (
                <div
                  key={item}
                  onClick={() => handleNavItemClick(item.toLowerCase())}
                  className={`hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 cursor-pointer capitalize ${
                    !isCategoryPage && activeSection === item.toLowerCase()
                      ? "text-[#f47521] border-b-2 border-[#f47521]"
                      : ""
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className={`flex items-center gap-2 cursor-pointer hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 ${
                categoryItems.map((i) => `/category/${i.toLowerCase()}`).includes(location.pathname)
                  ? "text-[#f47521] border-b-2 border-[#f47521]"
                  : ""
              }`}
              onClick={() => {
                setCategoryOpen((prev) => !prev);
                setMoreOpen(false);
              }}
            >
              Category {categoryOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </div>
            <div
              className={`absolute top-full right-0 mt-2 bg-[#030303] rounded shadow-md z-30 p-4 grid grid-cols-3 gap-x-14 gap-y-7 w-max min-w-[300px] transition-all duration-300 ${
                categoryOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {categoryItems.map((item) => (
                <NavLink
                  key={item}
                  to={`/category/${item.toLowerCase()}`}
                  onClick={() => setCategoryOpen(false)}
                  className={({ isActive }) =>
                    `hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-2 py-1 transition-all duration-200 cursor-pointer capitalize ${
                      isActive ? "text-[#f47521] border-b-2 border-[#f47521]" : ""
                    }`
                  }
                >
                  {item.replace(/-/g, " ")}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {[FaSearch, RiBookmarkFill, FaUser].map((Icon, i) => (
            <div
              key={i}
              className="p-2 hover:bg-[#f47521] hover:text-[#030303] rounded-full cursor-pointer transition"
            >
              <Icon size={16} />
            </div>
          ))}
        </div>
      </nav>

      {(menuOpen || moreOpen || categoryOpen) && (
        <div
          className="hidden lg:block fixed top-0 left-0 w-full h-screen bg-gray-900/65 z-30"
          onClick={() => {
            setMenuOpen(false);
            setMoreOpen(false);
            setCategoryOpen(false);
          }}
        />
      )}
    </div>
  );
}
