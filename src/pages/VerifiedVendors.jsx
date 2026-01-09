import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSync } from 'react-icons/fa';
import Table from '../components/Table';
import Loading from '../components/common/Loading';
import { SkeletonTable } from '../components/common/Skeleton';
import SearchAndFilter from '../components/common/SearchAndFilter';
import { useCachedApi } from '../hooks/useCachedApi';
import { useVendorFilters } from '../hooks/useVendorFilters';
import { getVerifiedVendors } from '../api/vendors';
import { ROUTES } from '../utils/constants';
import { CACHE_KEYS } from '../utils/cache';
import { formatPhoneNumber } from '../utils/helpers';
import './VerifiedVendors.css';

const VerifiedVendors = () => {
  const navigate = useNavigate();
  const { data: vendorsData, loading, error, refetch } = useCachedApi(
    getVerifiedVendors,
    CACHE_KEYS.VERIFIED_VENDORS_LIST
  );
  const [refreshing, setRefreshing] = React.useState(false);

  // Filtering
  const {
    filteredData,
    searchQuery,
    categoryFilter,
    locationFilter,
    sortByTime,
    categories,
    locations,
    handleSearchChange,
    handleCategoryChange,
    handleLocationChange,
    handleSortByTimeChange,
    clearFilters,
  } = useVendorFilters(vendorsData || []);

  // Show error toast if API call fails
  React.useEffect(() => {
    if (error) {
      toast.error(error || 'Failed to load verified vendors');
    }
  }, [error]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch(true); // Force refresh
      toast.success('Vendors list refreshed successfully');
    } catch {
      toast.error('Failed to refresh vendors list');
    } finally {
      setRefreshing(false);
    }
  };

  const handleView = (row) => {
    // Navigate to verified vendor details page using userId
    const userId = row.userId || row.id;
    if (userId) {
      navigate(`/dashboard/vendor/verified/${userId}`);
    } else {
      toast.error('Vendor ID not found');
    }
  };

  const columns = [
    {
      key: 'serialNo',
      header: 'Serial No',
      className: 'text-center',
    },
    {
      key: 'businessName',
      header: 'Business Name',
    },
    {
      key: 'businessType',
      header: 'Business Type',
    },
    {
      key: 'businessCategory',
      header: 'Business Category',
    },
    {
      key: 'location',
      header: 'Location',
    },
    {
      key: 'mobileNumber',
      header: 'Mobile Number',
      render: (value) => formatPhoneNumber(value) || 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className="status-badge status-verified">{value}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-center',
      render: (value, row) => (
        <div className="action-buttons">
          <button
            className="action-btn action-btn-primary"
            onClick={() => handleView(row)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="verified-vendors-page">
        <div className="page-header">
          <h2>Verified Vendors</h2>
          <p>Manage and view all verified vendors</p>
        </div>
        <div className="table-wrapper">
          <SkeletonTable rows={5} columns={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verified-vendors-page">
        <div className="page-header">
          <h2>Verified Vendors</h2>
          <p>Manage and view all verified vendors</p>
        </div>
        <div className="error-message">
          <p>Error loading vendors: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verified-vendors-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>Verified Vendors</h2>
            <p>Manage and view all verified vendors</p>
          </div>
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            title="Refresh vendors list"
          >
            <FaSync className={refreshing ? 'spinning' : ''} size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        locationFilter={locationFilter}
        onLocationChange={handleLocationChange}
        sortByTime={sortByTime}
        onSortByTimeChange={handleSortByTimeChange}
        categories={categories}
        locations={locations}
        onClearFilters={clearFilters}
      />
      <div className="table-wrapper">
        <Table columns={columns} data={filteredData} keyField="id" />
      </div>
      {filteredData.length === 0 && vendorsData && vendorsData.length > 0 && (
        <div className="no-results">
          <p>No vendors found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default VerifiedVendors;

