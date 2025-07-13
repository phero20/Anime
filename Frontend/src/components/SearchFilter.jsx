import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

import Dropdown from './Dropdown';


const TYPES = [ "Most-Favorite",
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
  "Completed",];
const SORTS = ['recently-added','score', 'popularity', 'date', 'title'];
const SEASONS = ['spring', 'summer', 'fall', 'winter'];
const LANGUAGES = ['sub', 'dub'];
const STATUSES = ['finished-airing', 'currently-airing', 'not-yet-aired'];
const RATED = ['g', 'pg', 'pg-13', 'r', 'r+', 'rx'];
const SCORES = ['good', 'very-good', 'bad'];

function toOptions(arr, capitalize = false, transform = null) {
  return arr.map(v => ({
    value: v,
    label: transform ? transform(v) : (capitalize ? v.charAt(0).toUpperCase() + v.slice(1) : v.toUpperCase ? v.toUpperCase() : v)
  }));
}



export default function SearchFilter({ open, onClose, onApply, filters }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const { AnimeData } = useSelector((state) => state.AnimeData);
  const GENRES = AnimeData?.data?.data?.genres || [];

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  if (!open) return null;

  const handleChange = (name, value) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply({
      ...localFilters,
      start_date: localFilters.start_date || '',
      end_date: localFilters.end_date || '',
    });
  };

  return (
    <div className="bg-gray-950 rounded-2xl shadow-2xl w-full max-w-2xl px-3 py-6 mx-2 sm:p-8 relative border border-[#f47521]/80">
        <button
          className="absolute top-4 right-4 text-[#f47521] text-2xl sm:text-3xl hover:text-[#f47521]/80 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-[#f47521] tracking-tight">Filter Search</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Genres */}
          <div>
            <label className="block text-xs sm:text-sm mb-1 font-semibold text-[#f47521]">Genres</label>
            <Dropdown
              options={[{ value: '', label: 'Any' }, ...toOptions(GENRES, true)]}
              value={localFilters.genres}
              onChange={v => handleChange('genres', v)}
              placeholder="Any Genre"
            />
          </div>
          {/* Type */}
          <div>
            <label className="block text-xs sm:text-sm mb-1 font-semibold text-[#f47521]">Type</label>
            <Dropdown
              options={[{ value: '', label: 'Any' }, ...toOptions(TYPES, false, v => v.toUpperCase())]}
              value={localFilters.type}
              onChange={v => handleChange('type', v)}
              placeholder="Any Type"
            />
          </div>
          {/* Sort */}
          <div>
            <label className="block text-xs sm:text-sm mb-1 font-semibold text-[#f47521]">Sort By</label>
            <Dropdown
              options={[{ value: '', label: 'Default' }, ...toOptions(SORTS, true)]}
              value={localFilters.sort}
              onChange={v => handleChange('sort', v)}
              placeholder="Default"
            />
          </div>
          {/* Season */}
          <div>
            <label className="block text-xs sm:text-sm mb-1 font-semibold text-[#f47521]">Season</label>
            <Dropdown
              options={[{ value: '', label: 'Any' }, ...toOptions(SEASONS, true)]}
              value={localFilters.season}
              onChange={v => handleChange('season', v)}
              placeholder="Any Season"
            />
          </div>
          {/* Language */}
          <div>
            <label className="block text-xs sm:text-sm mb-1 font-semibold text-[#f47521]">Language</label>
            <Dropdown
              options={[{ value: '', label: 'Any' }, ...toOptions(LANGUAGES, false, v => v.toUpperCase())]}
              value={localFilters.language}
              onChange={v => handleChange('language', v)}
              placeholder="Any Language"
            />
          </div>
          {/* Status */}
          <div>
            <label className="block text-xs sm:text-sm mb-1 font-semibold text-[#f47521]">Status</label>
            <Dropdown
              options={[{ value: '', label: 'Any' }, ...toOptions(STATUSES, false, v => v.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))]}
              value={localFilters.status}
              onChange={v => handleChange('status', v)}
              placeholder="Any Status"
            />
          </div>
          {/* Rated */}
          <div>
            <label className="block text-xs sm:text-sm mb-1 font-semibold text-[#f47521]">Rated</label>
            <Dropdown
              options={[{ value: '', label: 'Any' }, ...toOptions(RATED, false, v => v.toUpperCase())]}
              value={localFilters.rated}
              onChange={v => handleChange('rated', v)}
              placeholder="Any Rating"
            />
          </div>
          {/* Start Date */}
          <div>
            <label className="block text-xs sm:text-sm mb-1 font-semibold text-[#f47521]">Start Date</label>
            <input
              type="text"
              name="start_date"
              value={localFilters.start_date || ''}
              onChange={e => handleChange('start_date', e.target.value)}
              className="w-full bg-slate-900 border border-gray-700 rounded-lg text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2 text-[#F1EFEC] focus:border-[#f47521] focus:outline-none"
              placeholder="YYYY-MM-DD (e.g., 2024-0-0)"
            />
          </div>
          {/* End Date */}
          <div>
            <label className="block text-xs sm:text-sm mb-1 font-semibold text-[#f47521]">End Date</label>
            <input
              type="text"
              name="end_date"
              value={localFilters.end_date || ''}
              onChange={e => handleChange('end_date', e.target.value)}
              className="w-full bg-slate-900 border border-gray-700 rounded-lg text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2 text-[#F1EFEC] focus:border-[#f47521] focus:outline-none"
              placeholder="YYYY-MM-DD (e.g., 2024-0-0)"
            />
          </div>
          {/* Score */}
          <div>
          <label className="block text-xs sm:text-sm mb-1 font-semibold text-[#f47521]">Score</label>

            <Dropdown
              options={[{ value: '', label: 'Any' }, ...toOptions(SCORES, true)]}
              value={localFilters.score}
              onChange={v => handleChange('score', v)}
              placeholder="Any Score"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 sm:mt-8 gap-2 sm:gap-3">
          {/* <button
            className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-xs sm:text-base text-[#F1EFEC] hover:bg-gray-600 transition-colors font-semibold shadow"
            onClick={onClose}
          >
            Cancel
          </button> */}
          <button
            className="px-3 py-2 rounded-lg bg-[#f47521] text-base text-black hover:bg-[#d65d13] transition-colors font-semibold shadow-lg"
            onClick={handleApply}
          >
            Apply Filters
          </button>
        </div>
      </div>
  );
} 