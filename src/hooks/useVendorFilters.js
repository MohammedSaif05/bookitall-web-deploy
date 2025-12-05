import { useState, useMemo } from 'react';

/**
 * Custom hook for vendor filtering
 * @param {Array} data - Vendor data array
 * @returns {Object} Filtered data and filter controls
 */
export const useVendorFilters = (data = []) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Get unique categories and locations from data
  const { categories, locations } = useMemo(() => {
    const uniqueCategories = [...new Set(data.map((v) => v.businessCategory).filter(Boolean))].sort();
    const uniqueLocations = [...new Set(data.map((v) => v.location).filter(Boolean))].sort();
    return {
      categories: uniqueCategories,
      locations: uniqueLocations,
    };
  }, [data]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((vendor) => {
        const searchableFields = [
          vendor.businessName,
          vendor.businessType,
          vendor.businessCategory,
          vendor.mobileNumber,
          vendor.location,
        ];
        return searchableFields.some((field) => {
          if (!field) return false;
          return field.toString().toLowerCase().includes(query);
        });
      });
    }

    // Apply category filter
    if (categoryFilter) {
      result = result.filter((vendor) => vendor.businessCategory === categoryFilter);
    }

    // Apply location filter
    if (locationFilter) {
      result = result.filter((vendor) => vendor.location === locationFilter);
    }

    // Update serial numbers
    return result.map((vendor, index) => ({
      ...vendor,
      serialNo: index + 1,
    }));
  }, [data, searchQuery, categoryFilter, locationFilter]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  const handleLocationChange = (value) => {
    setLocationFilter(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setLocationFilter('');
  };

  const hasActiveFilters = searchQuery || categoryFilter || locationFilter;

  return {
    filteredData,
    searchQuery,
    categoryFilter,
    locationFilter,
    categories,
    locations,
    handleSearchChange,
    handleCategoryChange,
    handleLocationChange,
    clearFilters,
    hasActiveFilters,
  };
};

