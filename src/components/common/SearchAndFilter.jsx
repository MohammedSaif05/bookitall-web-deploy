import React from 'react';
import { Search, X, Filter, Clock } from 'lucide-react';
import './SearchAndFilter.css';

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  locationFilter,
  onLocationChange,
  sortByTime,
  onSortByTimeChange,
  categories = [],
  locations = [],
  onClearFilters,
}) => {
  const hasActiveFilters = searchQuery || categoryFilter || locationFilter || sortByTime;

  return (
    <div className="search-filter-container">
      <div className="search-filter-row">
        {/* Search Bar */}
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="filters-row">
          <div className="filter-group">
            <Filter className="filter-icon filter-icon-left" size={16} />
            <select
              id="category-filter"
              className="filter-select filter-select-with-icon"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              id="location-filter"
              className="filter-select"
              value={locationFilter}
              onChange={(e) => onLocationChange(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <Clock className="filter-icon filter-icon-left" size={16} />
            <select
              id="sort-time-filter"
              className="filter-select filter-select-with-icon"
              value={sortByTime || ''}
              onChange={(e) => onSortByTimeChange(e.target.value)}
            >
              <option value="">Sort by Time</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={onClearFilters}>
              <X size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;

