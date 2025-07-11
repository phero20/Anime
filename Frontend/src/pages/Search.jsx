import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchSuggestions, clearSearchSuggestions, fetchSearchResults, clearSearchResult } from '../redux/apifetch/GetanimeDataSlice';
import { FaPlay, FaSearch } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { MdOutlineSentimentDissatisfied } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import SearchFilter from '../components/SearchFilter';
import AnimeCards from '../components/AnimeCards';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
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

  const { SearchSuggestionsData, loading, SearchResultData } = useSelector((state) => state.AnimeData);

  const searchResult = SearchResultData?.data?.data?.animes;
  const [showResults, setShowResults] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const appliedFilters = SearchResultData?.data?.data?.searchFilters || [];

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
      return;
    }
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

  // Handle clear/close
  const handleClear = useCallback(() => {
    setQuery('');
    setIsSearching(false);
    dispatch(clearSearchSuggestions());
    dispatch(clearSearchResult());
    setShowResults(false);
  }, [dispatch]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
    setIsSearching(true);
    dispatch(clearSearchSuggestions());
    dispatch(clearSearchResult());
    setShowResults(false); // Hide results and allow dropdown to show again
  }, [dispatch]);

  // Handle Enter key for search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      const params = Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      const fullQuery = params ? `${query.trim()}&${params}` : query.trim();
      dispatch(clearSearchResult());
      setShowResults(false);
      setResultsLoading(true);
      dispatch(fetchSearchResults({ q: fullQuery })).then(() => {
        setResultsLoading(false);
        setShowResults(true);
      });
    }
  };

  // Handle filter open/close
  const handleOpenFilter = useCallback(() => setShowFilter(true), []);
  const handleCloseFilter = useCallback(() => setShowFilter(false), []);
  const handleApplyFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    setShowFilter(false);
    // Optionally trigger a new search here with filters
  }, []);

  // Memoize the dropdown visibility
  const showDropdown = useMemo(
    () => query.trim().length > 0 && isInputFocused && !showResults,
    [query, isInputFocused, showResults]
  );

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
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
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
        {showDropdown && !showResults && !resultsLoading && (showLoading || suggestions.length > 0) && (
          <motion.div
            key="search-dropdown"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-2xl mx-auto px-4"
          >
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700/50 max-h-80 overflow-y-auto scrollbar-none">
              {showLoading ? (
                <div className="p-4 text-center">
                  <div className="text-[#f47521] text-sm sm:text-base">Loading suggestions...</div>
                </div>
              ) : (
                <div className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id || suggestion.mal_id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={()=>navigate(`/anime/${suggestion.id}`)}
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading and Results */}
      {resultsLoading && showResults === false && (
        <div className="flex justify-center items-center py-10">
          <div className="text-[#f47521] text-lg font-semibold animate-pulse">Loading results...</div>
        </div>
      )}
      {showResults && searchResult && (
  <div className='flex flex-col items-center'>
          <div className='text-sm sm:text-base font-semibold text-[#f47521] my-4'>
          Total results :  
         <span className='bg-gray-800/80 ml-1 cursor-pointer hover:text-[#fe7521] hover:bg-gray-700/80 px-2 py-1 rounded-lg text-xs sm:text-sm text-gray-300 transition-colors duration-300'>
         {searchResult.length}
          </span> 
        </div>
    {
      Object.keys(appliedFilters).length > 0 && (
        <div className="flex items-center gap-6 mb-2">
          <h4 className="text-sm sm:text-base font-semibold text-[#f47521]">Filters Applied</h4>
          <button
            className="text-xs sm:text-sm px-3 py-1 rounded-lg border border-[#f47521] text-[#f47521] hover:bg-[#f47521] hover:text-white transition-colors duration-200"
            onClick={() => {
              setFilters({
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
              // Optionally trigger a new search with cleared filters
              if (query.trim()) {
                const fullQuery = query.trim();
                dispatch(clearSearchResult());
                setShowResults(false);
                setResultsLoading(true);
                dispatch(fetchSearchResults({ q: fullQuery })).then(() => {
                  setResultsLoading(false);
                  setShowResults(true);
                });
              }
            }}
          >
            Clear Filters
          </button>
        </div>
      )
    }
   
    <div className="px-4 pt-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(appliedFilters).length === 0 ? (
          <span className="text-xs text-gray-400"></span>
        ) : (
          Object.entries(appliedFilters).map(([key, value]) => (
            <span
              key={key}
              className="bg-gray-800/80 cursor-pointer hover:text-[#fe7521] hover:bg-gray-700/80 px-3 py-1.5 rounded-full text-xs sm:text-sm text-gray-300 transition-colors duration-300"
            >
              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: <span className="font-medium">{value}</span>
            </span>
            
          ))
        )}
     
      </div>

    </div>
    <div className="py-0">

      <AnimeCards data={searchResult} />
    </div>
  </div>
)}
    </div>
  );
}
