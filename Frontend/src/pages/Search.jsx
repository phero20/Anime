import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchSuggestions, clearSearchSuggestions, fetchSearchResults, clearSearchResult } from '../redux/apifetch/GetanimeDataSlice';
import { FaPlay, FaSearch } from 'react-icons/fa';
import { FiX, FiFilter } from 'react-icons/fi';
import { MdOutlineSentimentDissatisfied } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import SearchFilter from '../components/SearchFilter';
import AnimeCards from '../components/AnimeCards';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../components/LoadingAnimation';

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
    if (isSearching) {
      return [];
    }
    if (!SearchSuggestionsData?.data?.data) {
      return [];
    }
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

  const performSearch = useCallback((searchQuery) => {
    const formattedQuery = searchQuery.split(' ').join('+');
    dispatch(fetchSearchSuggestions({ q: formattedQuery }));
  }, [dispatch]);

  const debouncedSearch = useCallback((searchQuery) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    setIsSearching(true);
    debounceTimeout.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
  }, [performSearch]);

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

  useEffect(() => {
    if (!loading && isSearching) {
      setIsSearching(false);
    }
  }, [loading, isSearching]);

  const handleClear = useCallback(() => {
    setQuery('');
    setIsSearching(false);
    dispatch(clearSearchSuggestions());
    dispatch(clearSearchResult());
    setShowResults(false);
  }, [dispatch]);

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
    setIsSearching(true);
    dispatch(clearSearchSuggestions());
    dispatch(clearSearchResult());
    setShowResults(false);
  }, [dispatch]);

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

  const handleOpenFilter = useCallback(() => setShowFilter(true), []);
  const handleCloseFilter = useCallback(() => setShowFilter(false), []);
  const handleApplyFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    setShowFilter(false);
  }, []);

  const showDropdown = useMemo(
    () => query.trim().length > 0 && isInputFocused && !showResults,
    [query, isInputFocused, showResults]
  );

  const showLoading = loading || isSearching;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white mt-10">
      {/* Professional Header Section */}
      <div className="relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 "></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16">
          {/* Search Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Discover <span className="text-[#f47521]">Anime</span>
            </h1>
            <p className="text-xl text-gray-400 font-light">
              Search through thousands of anime titles
            </p>
          
            
          </div>


          {
            isInputFocused && (
              <div className="max-w-2xl text-center mx-auto">
                <div className="relative text-lg text-gray-500 font-light group">
                <div>Press Enter For Full Search Results</div>
                </div>
              </div>
            )
          }
          {/* Professional Search Bar */}
          <div className="max-w-2xl mx-auto">
            
            <div className="relative group">
              {/* Search Input Container */}
              <div className="relative">
                <div className="absolute inset-0 bg-gray-900 backdrop-blur-sm rounded-2xl border-2 border-white/10 transition-all duration-300 group-focus-within:border-[#f47521]/50 "></div>
                
                <div className="relative flex items-center">
                  <div className="absolute left-6 z-10">
                    <FaSearch className="text-gray-400 text-lg" />
                  </div>
                  
                  <input
                    type="text"
                    className="w-full bg-transparent text-white placeholder-gray-400 text-lg font-medium px-16 py-6 rounded-2xl border-0 outline-none focus:ring-0"
                    placeholder="Search for anime"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    autoFocus
                  />
                  
                  <div className="absolute right-4 flex items-center gap-2">
                    {query && (
                      <button
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                        onClick={handleClear}
                        aria-label="Clear search"
                      >
                        <FiX className="text-lg" />
                      </button>
                    )}
                    
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-[#f47521] hover:bg-[#ff6600] text-black rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                      onClick={handleOpenFilter}
                    >
                      <FiFilter className="text-sm" />
                      <span className="hidden sm:inline">Filters</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 1 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={handleCloseFilter}
            />

            
            <motion.div 
              className="relative z-10 w-full flex justify-center"
              initial={{ scale: .5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: .5 }}
            >
              <SearchFilter
                open={showFilter}
                onClose={handleCloseFilter}
                onApply={handleApplyFilter}
                filters={filters}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence mode="wait">
        {showDropdown && !showResults && !resultsLoading && (showLoading || suggestions.length > 0) && (
          <motion.div
            key="search-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto px-6 mt-2 relative z-20"
          >
            <div className="bg-gray-900 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md max-h-96 overflow-y-auto scrollbar-hide">
              {showLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="flex items-center gap-3 text-gray-400">
                    <LoadingAnimation size={24} />
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id || suggestion.mal_id || index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9 }}
                      onClick={() => navigate(`/anime/${suggestion.id}`)}
                      className="flex items-center gap-4 px-4 py-4 hover:bg-white/5 cursor-pointer transition-all duration-200 border-b border-white/5 last:border-b-0 group"
                    >
                      {/* Anime Thumbnail */}
                      <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={suggestion.poster}
                          alt={suggestion.title || suggestion.name}
                          className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-150"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <FaPlay className="text-white text-lg" />
                        </div>
                      </div>
                      
                      {/* Anime Information */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-base group-hover:text-[#f47521] transition-colors duration-200">
                          {suggestion.title || suggestion.name}
                        </h4>
                        
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                          {suggestion.moreInfo && suggestion.moreInfo[1] && (
                            <span className="px-2 py-1 bg-white/10 rounded-md text-xs font-medium">
                              {suggestion.moreInfo[1]}
                            </span>
                          )}
                          {suggestion.moreInfo && suggestion.moreInfo[2] && (
                            <span>{suggestion.moreInfo[2]}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Year */}
                      {suggestion.moreInfo && suggestion.moreInfo[0] && (
                        <div className="text-gray-500 text-sm font-medium flex-shrink-0">
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

      {/* Loading State */}
      {resultsLoading && showResults === false && (
        <div className="flex justify-center py-16">
          <div className="flex items-center gap-3 text-gray-400">
           <LoadingAnimation size={24} />
          </div>
        </div>
      )}

      {/* Search Results Section */}
      {showResults && searchResult && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Results Header */}
          <div className="mb-1">
            <div className="flex md:flex-row flex-col md:items-center max-md:gap-3 justify-between mb-1">
              <h2 className="text-2xl flex gap-2 items-center font-bold text-[#f47521]">
              <div className="w-1 h-6 bg-[#f47521] rounded-full"></div>
                Search Results
                <span className="ml-1 text-lg font-normal text-gray-400">
                  ({searchResult.length} found)
                </span>
              </h2>
              
              {Object.keys(appliedFilters).length > 0 && (
                <button
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-500 font-medium"
                  onClick={() => {
                    setFilters({
                      genres: '', type: '', sort: '', season: '', language: '', status: '', rated: '', start_date: '', score: '',
                    });
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
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Applied Filters */}
            {Object.keys(appliedFilters).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Active Filters
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(appliedFilters).map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all duration-200 cursor-default"
                    >
                      <span className="text-gray-300">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                      </span>
                      <span className="text-white font-semibold">{value}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Grid */}
          <div className="border-t border-white/10">
            <AnimeCards data={searchResult} />
          </div>
        </div>
      )}

      {/* No Results State */}
      {showResults && searchResult && searchResult.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MdOutlineSentimentDissatisfied className="text-6xl text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
          <p className="text-gray-400 max-w-md">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}