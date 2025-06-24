import React from 'react';

const footerLinks = [
  {
    title: 'Explore',
    links: ['Catalog', 'Genres', 'Top Picks', 'New & Trending', 'Store'],
  },
  {
    title: 'About',
    links: ['About Us', 'Press', 'Careers', 'Investor Relations'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Contact Us', 'Submit a Ticket', 'Privacy Settings'],
  },
  {
    title: 'Legal',
    links: ['Terms of Use', 'Privacy Policy', 'Cookie Consent', 'Do Not Sell My Info'],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#030303] text-gray-300 font-['Crunchyroll_Atyp',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <h4 className="text-white font-semibold mb-4">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="text-white font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            {/* Placeholder icons */}
            <a href="#" aria-label="Facebook" className="hover:text-white">
              🔵
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white">
              🐦
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              📸
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Crunchyroll, LLC</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="text-xs hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs hover:text-white transition-colors">Cookie Settings</a>
            <a href="#" className="text-xs hover:text-white transition-colors">Do Not Sell My Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
