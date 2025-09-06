import React from 'react';
import { FaDiscord, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const footerLinks = [
  {
    title: 'Discover',
    links: [
      { name: 'Most-Favorite', path: '/category/most-favorite' },
      { name: 'Movies', path: '/category/Movie' },
      { name: 'TV Series', path: '/category/TV' },
      { name: 'Most Popular', path: '/category/most-popular' }
    ],
  },
  {
    title: 'Genres',
    links: [
      { name: 'Action', path: '/genre/Action' },
      { name: 'Romance', path: '/genre/Romance' },
      { name: 'Comedy', path: '/genre/Comedy' },
      { name: 'Adventure', path: '/genre/Adventure' }
    ],
  },
];

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className=" text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        {/* Logo and Description */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          <div className="mb-8 md:mb-0 max-w-sm">
            <img src={logo} alt="" className="w-28 rotate-[7deg]" />
            <p className="text-sm leading-relaxed">
              Your gateway to the endless universe of anime. Stream, discover, and join our community of passionate anime fans.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 xl:gap-12">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-3">
                <h4 className="text-[#f47521] font-semibold text-sm uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-sm hover:text-[#f47521] transition-colors duration-200"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="https://discord.com/channels/@phero0127" target='/' className="text-gray-400 hover:text-[#f47521] transition-colors">
                <FaDiscord size={20} />
              </a>
              <a href="https://x.com/phero_19" target='/' className="text-gray-400 hover:text-[#f47521] transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.instagram.com/ig_phero.19" target='/' className="text-gray-400 hover:text-[#f47521] transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://github.com/phero20" target='/' className="text-gray-400 hover:text-[#f47521] transition-colors">
                <FaGithub size={20} />
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Aniverse. All rights reserved.
              </p>
              <div className="flex items-center justify-center md:justify-end space-x-4 mt-2 text-xs">
                <a href="#" className="hover:text-[#f47521] transition-colors">Terms</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="hover:text-[#f47521] transition-colors">Privacy</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="hover:text-[#f47521] transition-colors">Guidelines</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
