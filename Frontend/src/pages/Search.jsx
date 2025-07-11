import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchSuggestions, clearSearchSuggestions } from '../redux/apifetch/GetanimeDataSlice';
import { FaPlay, FaSearch } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { MdOutlineSentimentDissatisfied } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import SearchFilter from '../components/SearchFilter';

export default function Search() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    genres: '',
    type: '',
    sort: '',
    season: '',
    language: '',
    status: '',
    rated: '',
    start_date: '',
    score: '',
  });
  const debounceTimeout = useRef(null);
  const noResultsTimeout = useRef(null);

  const { SearchSuggestionsData, loading } = useSelector((state) => state.AnimeData);

  // Memoize suggestions to prevent unnecessary re-renders
  const suggestions = useMemo(() => {
    // If we're searching, don't show old results
    if (isSearching) {
      return [];
    }
    if (!SearchSuggestionsData?.data?.data) {
      return [];
    }
    // Handle different possible data structures
    const data = SearchSuggestionsData.data.data;
    if (Array.isArray(data)) {
      return data;
    } else if (data.suggestions && Array.isArray(data.suggestions)) {
      return data.suggestions;
    } else if (data.animes && Array.isArray(data.animes)) {
      return data.animes;
    }
    return [];
  }, [SearchSuggestionsData, isSearching]);

  // Memoize the search function to prevent recreation
  const performSearch = useCallback((searchQuery) => {
    const formattedQuery = searchQuery.split(' ').join('+');
    dispatch(fetchSearchSuggestions({ q: formattedQuery }));
  }, [dispatch]);

  // Debounce search with useCallback to prevent recreation
  const debouncedSearch = useCallback((searchQuery) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    // Set searching state immediately
    setIsSearching(true);
    debounceTimeout.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
  }, [performSearch]);

  // Debounce search - only run when query changes
  useEffect(() => {
    if (!query.trim()) {
      setIsSearching(false);
      setShowNoResults(false);
      return;
    }
    setShowNoResults(false);
    debouncedSearch(query);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (noResultsTimeout.current) {
        clearTimeout(noResultsTimeout.current);
      }
    };
  }, [query, debouncedSearch]);

  // Reset searching state when loading completes
  useEffect(() => {
    if (!loading && isSearching) {
      setIsSearching(false);
    }
  }, [loading, isSearching]);

  // Delay showing 'No suggestions found' by 1 second
  useEffect(() => {
    if (!isSearching && !loading && query.trim() && suggestions.length === 0) {
      noResultsTimeout.current = setTimeout(() => {
        setShowNoResults(true);
      }, 500);
    } else {
      setShowNoResults(false);
      if (noResultsTimeout.current) {
        clearTimeout(noResultsTimeout.current);
      }
    }
    return () => {
      if (noResultsTimeout.current) {
        clearTimeout(noResultsTimeout.current);
      }
    };
  }, [isSearching, loading, query, suggestions]);

  // Handle clear/close
  const handleClear = useCallback(() => {
    setQuery('');
    setIsSearching(false);
    setShowNoResults(false);
    dispatch(clearSearchSuggestions());
  }, [dispatch]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
    setIsSearching(true);
    setShowNoResults(false);
    dispatch(clearSearchSuggestions());
  }, [dispatch]);

  // Handle filter open/close
  const handleOpenFilter = useCallback(() => setShowFilter(true), []);
  const handleCloseFilter = useCallback(() => setShowFilter(false), []);
  const handleApplyFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    setShowFilter(false);
    // Optionally trigger a new search here with filters
  }, []);

  // Memoize the dropdown visibility
  const showDropdown = useMemo(() => query.trim().length > 0, [query]);

  // Determine if we should show loading
  const showLoading = loading || isSearching;

  return (
    <div className="min-h-64 mt-10 text-[#F1EFEC]">
      {/* Search Bar + Filter Button */}
      <div className="w-full flex flex-col items-center pt-8 pb-4 px-4">
        <div className="w-full max-w-xl flex flex-col sm:flex-row items-end gap-2">
          {/* Filter Button */}
         
          {/* Search Bar */}
          <div className="relative flex-1 flex items-center w-full">
            <input
              type="text"
              className="flex-1 bg-transparent  text-lg sm:text-xl md:text-2xl font-light px-0 py-2 border-0 border-b-2 focus:ring-0 border-[#f47521] placeholder-[#888] outline-none transition-shadow duration-200 shadow-md focus:shadow-[#232323]/40"
              placeholder="Search anime..."
              value={query}
              onChange={handleInputChange}
              autoFocus
            />
            {query && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 sm:p-2 text-[#F1EFEC] hover:text-[#f47521] cursor-pointer transition-colors duration-150"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <FiX className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#f47521]" />
              </button>
            )}
            {!query && (
              <FaSearch className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#f47521]" />
            )}
          </div>
          <button
            className="px-3 py-2 text-sm font-medium border-2 flex items-center rounded-md border-[#f47521] text-[#f47521] hover:bg-[#f47521] hover:text-white hover:scale-105 transition-all duration-500 w-full sm:w-auto"
            onClick={handleOpenFilter}
          >
            Filters
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      <SearchFilter
        open={showFilter}
        onClose={handleCloseFilter}
        onApply={handleApplyFilter}
        filters={filters}
      />

      {/* Search Suggestions Dropdown */}
      <AnimatePresence mode="wait">
        {showDropdown && (
          <motion.div
            key="search-dropdown"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-xl mx-auto px-4"
          >
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700/50 max-h-80 overflow-y-auto scrollbar-none">
              {showLoading ? (
                <div className="p-4 text-center">
                  <div className="text-[#f47521] text-sm sm:text-base">Loading suggestions...</div>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id || suggestion.mal_id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 cursor-pointer transition-colors duration-150 border-b border-gray-700/30 last:border-b-0 group"
                    >
                      {/* Anime Image */}
                      <div className="relative w-10 h-14 sm:w-12 sm:h-16 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={suggestion.poster}
                          alt={suggestion.title || suggestion.name}
                          className="object-cover h-full w-full transition-transform duration-700 rounded-md group-hover:scale-150"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                        <div className='absolute flex items-center justify-center h-full w-full top-0 left-0 bg-black/70 group-hover:opacity-100 opacity-0 transition-all duration-500'>
                        <FaPlay className='text-[#f47521]' />
                        </div>
                      </div>
                      
                      {/* Anime Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[#F1EFEC] font-medium text-xs sm:text-sm md:text-base">
                          {suggestion.title || suggestion.name}
                        </div>
                        <div className="text-[#888] text-xs sm:text-sm mt-1">
                          {suggestion.moreInfo && (
                            <span className="inline-block bg-[#f47521]/20 text-[#f47521] px-1.5 py-0.5 rounded text-xs mr-2">
                              {suggestion.moreInfo[1]}
                            </span>
                          )}
                          {suggestion.moreInfo && (
                            <span className="text-[#888]">
                              {suggestion.moreInfo[2]}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Year */}
                      {suggestion.moreInfo && (
                        <div className="text-[#888] text-xs flex-shrink-0">
                          {suggestion.moreInfo[0]}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                showNoResults && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 text-center"
                  >
                    <MdOutlineSentimentDissatisfied className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#888] mx-auto mb-2 sm:mb-3" />
                    <div className="text-[#888] text-sm sm:text-base md:text-lg">No suggestions found</div>
                    <div className="text-[#666] text-xs sm:text-sm mt-1">Try a different search term</div>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
