import React, { useState } from "react";
import {
  FaHamburger,
  FaSearch,
  FaSave,
  FaUser,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import { useSelector } from "react-redux";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const activeSection = useSelector((state) => state.ui.activeSection);
  const navItems = ["Home", "Trending", "Latests", "Upcomings"];
  const moreItems = ["Top10", "Airing", "Popular", "Favorite", "Completed"];
  const allMobileItems = [...navItems, ...moreItems];

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setMoreOpen(false);
  };

  return (
    <div className="relative z-50 text-lg ">
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#030303] text-[#F1EFEC] pt-20 px-6 z-40 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {allMobileItems.map((item) => (
              <ScrollLink
                key={item}
                to={item.toLowerCase()}
                smooth={true}
                duration={900}
                offset={-80}
                activeClass="text-[#f47521] border-b-2 border-[#f47521]"
                onClick={() => setMenuOpen(false)}
                className={`hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 cursor-pointer capitalize
        ${activeSection === item.toLowerCase() ? "text-[#f47521] border-b-2 border-[#f47521]" : ""}
      `}
              >
                {item}
              </ScrollLink>
            ))}
          </div>
        </div>
      )}

      <nav className={`fixed top-0 ${activeSection != 'home' ? 'bg-[#030303]' : ''} left-0  right-0 text-[#F1EFEC] flex items-center justify-between px-4 lg:px-12 py-3 z-50`}>
        <div className="flex items-center gap-6">
          <div className="lg:hidden cursor-pointer" onClick={toggleMenu}>
            <FaHamburger size={22} />
          </div>
          <div className="text-xl font-bold">logo</div>
        </div>

        <div className="hidden lg:flex gap-4 items-center">
          {navItems.map((item) => (
            <ScrollLink
              key={item}
              to={item.toLowerCase()}
              smooth={true}
              duration={900}
              offset={-80}
              activeClass="text-[#f47521] border-b-2 border-[#f47521]"
              className={`hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 cursor-pointer capitalize
        ${activeSection === item.toLowerCase() ? "text-[#f47521] border-b-4 border-[#f47521]" : ""}
      `}
            >
              {item}
            </ScrollLink>
          ))}

          <div className="relative">
            <div
              className={`flex items-center gap-2 cursor-pointer hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-2 duration-200 transition-all
                ${moreItems.map(i => i.toLowerCase()).includes(activeSection)
                  ? "text-[#f47521] border-b-2 border-[#f47521]"
                  : ""
                }
              `}
              onClick={() => setMoreOpen((prev) => !prev)}
            >
              More {moreOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </div>
            {moreOpen && (
              <div className="absolute top-full flex flex-col right-0 bg-[#030303] mt-2 rounded shadow-md overflow-hidden z-30">
                {moreItems.map((item) => (
                  <ScrollLink
                    key={item}
                    to={item.toLowerCase()}
                    smooth={true}
                    duration={900}
                    offset={-80}
                    activeClass="text-[#f47521] border-b-2 border-[#f47521]"
                    className={`hover:border-b-2 border-[#f47521] hover:text-[#f47521] px-4 py-1 transition-all duration-200 cursor-pointer capitalize
        ${activeSection === item.toLowerCase() ? "text-[#f47521] border-b-2 border-[#f47521]" : ""}
      `}
                  >
                    {item}
                  </ScrollLink>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {[FaSearch, FaSave, FaUser].map((Icon, i) => (
            <div
              key={i}
              className="p-2 hover:bg-[#f47521] hover:text-[#030303] rounded-full cursor-pointer transition"
            >
              <Icon size={16} />
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}