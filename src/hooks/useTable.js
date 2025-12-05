import { useState, useMemo } from 'react';
import { generateSerialNo } from '../utils/helpers';

/**
 * Custom hook for table functionality
 * @param {Array} data - Table data
 * @param {Object} options - Table options
 * @returns {Object} Table state and functions
 */
export const useTable = (data = [], options = {}) => {
  const {
    defaultPageSize = 10,
    defaultSortBy = null,
    defaultSortOrder = 'asc',
  } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate pagination
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [filteredData, sortBy, sortOrder]);

  // Paginate data
  const paginatedData = useMemo(() => {
    return sortedData.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      serialNo: generateSerialNo(index, currentPage, pageSize),
    }));
  }, [sortedData, startIndex, endIndex, currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setSearchQuery('');
    setSortBy(defaultSortBy);
    setSortOrder(defaultSortOrder);
  };

  return {
    // Data
    data: paginatedData,
    filteredData: sortedData,
    allData: data,
    
    // Pagination
    currentPage,
    pageSize,
    totalPages,
    totalItems: filteredData.length,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, filteredData.length),
    
    // Sorting
    sortBy,
    sortOrder,
    
    // Search
    searchQuery,
    
    // Handlers
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleSearch,
    resetFilters,
  };
};

