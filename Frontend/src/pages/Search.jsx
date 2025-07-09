import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchSuggestions } from '../redux/apifetch/GetanimeDataSlice';
import { FaXRay, FaSearch } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { MdOutlineSentimentDissatisfied } from 'react-icons/md';
import AnimeCards from '../components/AnimeCards';

export default function Search() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const debounceTimeout = useRef(null);

  const { SearchSuggestionsData, loading } = useSelector((state) => state.AnimeData);

  // Debounce search
  useEffect(() => {
    if (!query) {
      return;
    }
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      const formattedQuery = query.split(' ').join('+');
      dispatch(fetchSearchSuggestions({ q: formattedQuery }));
    }, 400);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query, dispatch]);

  // Extract suggestions safely
  const suggestions = SearchSuggestionsData?.data?.data?.suggestions || [];

  // Handle clear/close
  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="min-h-64 mt-16 text-[#F1EFEC]">
      {/* Search Bar */}
      <div className="w-full flex flex-col items-center pt-12 pb-6 bg-gray-900/40">
        <div className="relative w-full max-w-3xl mx-5 shadow-lg rounded-lg">
          <input
            type="text"
            className="w-full bg-transparent text-4xl font-light px-0 py-2 border-0 border-b-2 focus:ring-0 focus:border-[#f47521] placeholder-[#888] outline-none transition-shadow duration-200 shadow-md focus:shadow-[#232323]/40"
            placeholder="Search anime..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#F1EFEC] hover:text-[#f47521] cursor-pointer transition-colors duration-150"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <FiX className="h-7 w-7 text-[#f47521]" />
            </button>
          )}
          {!query && (
            <FaSearch className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 text-[#f47521]" />
          )}
        </div>
      </div>

      {/* Results Section */}
      {query && (
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 mt-2 tracking-tight">Top Results</h2>
          {loading ? (
            <div className="text-[#f47521] text-lg py-12 flex justify-center items-center">Loading...</div>
          ) : suggestions.length > 0 ? (
            <div className="pb-16">
              <AnimeCards data={suggestions} name="Results" scroll={false} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <MdOutlineSentimentDissatisfied className="h-16 w-16 text-[#888] mb-4" />
              <div className="text-[#888] text-xl font-medium">No results found.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
