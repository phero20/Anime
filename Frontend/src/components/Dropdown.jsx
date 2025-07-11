import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown, FaSearch } from 'react-icons/fa';

export default function Dropdown({ options, value, onChange, placeholder = 'Select', searchable = true, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  // Filtered options based on search
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) setSearch('');
  }, [isOpen]);

  const selected = options.find(opt => opt.value === value);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div
        className="flex items-center justify-between bg-slate-900 border border-gray-700 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 cursor-pointer hover:border-[#f47521] transition-all text-xs sm:text-sm text-[#F1EFEC] min-h-[36px]"
        onClick={() => setIsOpen(v => !v)}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(v => !v); }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`truncate ${!selected ? 'text-gray-400' : ''}`}>{selected ? selected.label : placeholder}</span>
        <FaChevronDown className={`ml-2 w-3 h-3 text-[#f47521] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-gray-950 border border-gray-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto scrollbar-none"
          >
            {searchable && (
              <div className="flex items-center px-2 py-1 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
                <FaSearch className="w-3 h-3 text-[#f47521] mr-2" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent outline-none text-xs sm:text-sm flex-1 text-[#F1EFEC] placeholder-gray-500"
                  autoFocus
                />
              </div>
            )}
            <div className="py-1 mx-2 my-2">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-xs text-gray-500 text-center">No options</div>
              ) : (
                filteredOptions.map(opt => (
                  <div
                    key={opt.value}
                    className={`w-full px-4 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-800 hover:text-[#f47521] rounded transition-all ${value === opt.value ? 'bg-[#f47521]/80 text-white font-semibold' : 'text-[#F1EFEC]'}`}
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    role="option"
                    aria-selected={value === opt.value}
                  >
                    {opt.label}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 