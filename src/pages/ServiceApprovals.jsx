import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FaSync, FaTimes } from 'react-icons/fa';
import { Eye, Filter, X } from 'lucide-react';
import Table from '../components/Table';
import Loading from '../components/common/Loading';
import { SkeletonTable } from '../components/common/Skeleton';
import { useCachedApi } from '../hooks/useCachedApi';
import { getServiceApprovals } from '../api/vendors';
import { CACHE_KEYS } from '../utils/cache';
import { formatDate } from '../utils/helpers';
import './ServiceApprovals.css';

const ServiceApprovals = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [businessIdFilter, setBusinessIdFilter] = useState('');
  const [vendorIdFilter, setVendorIdFilter] = useState('');

  // Build filters object
  const filters = useMemo(() => {
    const filterObj = {};
    if (statusFilter) filterObj.status = statusFilter;
    if (businessIdFilter) filterObj.businessId = businessIdFilter;
    if (vendorIdFilter) filterObj.vendorId = vendorIdFilter;
    return filterObj;
  }, [statusFilter, businessIdFilter, vendorIdFilter]);

  // Create dynamic cache key based on filters
  const cacheKey = useMemo(() => {
    const filterStr = JSON.stringify(filters);
    return `${CACHE_KEYS.SERVICE_APPROVALS_LIST}_${filterStr}`;
  }, [filters]);

  // Create API function wrapper with filters
  const fetchServiceApprovals = React.useCallback(async () => {
    const response = await getServiceApprovals(filters);
    return response;
  }, [filters]);

  const { data: servicesData, loading, error, refetch } = useCachedApi(
    fetchServiceApprovals,
    cacheKey,
    [filters],
    true,
    true
  );

  // Show error toast if API call fails
  React.useEffect(() => {
    if (error) {
      toast.error(error || 'Failed to load service approvals');
    }
  }, [error]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch(true);
      toast.success('Service approvals list refreshed successfully');
    } catch {
      toast.error('Failed to refresh service approvals list');
    } finally {
      setRefreshing(false);
    }
  };

  const handleView = (row) => {
    setSelectedService(row);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedService(null);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setBusinessIdFilter('');
    setVendorIdFilter('');
  };

  const hasActiveFilters = statusFilter || businessIdFilter || vendorIdFilter;

  const columns = [
    {
      key: 'serialNo',
      header: 'Serial No',
      className: 'text-center',
    },
    {
      key: 'serviceName',
      header: 'Service Name',
    },
    {
      key: 'vendorId',
      header: 'Vendor ID',
    },
    {
      key: 'businessId',
      header: 'Business ID',
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`status-badge status-${value?.toLowerCase() || 'pending'}`}>
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending'}
        </span>
      ),
      className: 'text-center',
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (value) => value ? formatDate(value) : 'N/A',
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
            title="View Service Details"
          >
            <Eye size={14} />
            <span>View</span>
          </button>
        </div>
      ),
    },
  ];

  // Transform data to include serial numbers
  const tableData = useMemo(() => {
    if (!servicesData || !Array.isArray(servicesData)) return [];
    return servicesData.map((service, index) => ({
      ...service,
      serialNo: index + 1,
    }));
  }, [servicesData]);

  if (loading && !servicesData) {
    return (
      <div className="service-approvals-page">
        <div className="page-header">
          <h2>Services Approvals</h2>
          <p>Review and approve service requests from vendors</p>
        </div>
        <div className="table-wrapper">
          <SkeletonTable rows={5} columns={7} />
        </div>
      </div>
    );
  }

  return (
    <div className="service-approvals-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>Services Approvals</h2>
            <p>Review and approve service requests from vendors</p>
          </div>
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            title="Refresh service approvals list"
          >
            <FaSync className={refreshing ? 'spinning' : ''} size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filters-header">
          <Filter size={18} className="filter-icon" />
          <span className="filters-title">Filters</span>
        </div>
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="business-id-filter">Business ID</label>
            <input
              id="business-id-filter"
              type="text"
              className="filter-input"
              placeholder="Enter Business ID"
              value={businessIdFilter}
              onChange={(e) => setBusinessIdFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="vendor-id-filter">Vendor ID</label>
            <input
              id="vendor-id-filter"
              type="text"
              className="filter-input"
              placeholder="Enter Vendor ID"
              value={vendorIdFilter}
              onChange={(e) => setVendorIdFilter(e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              <X size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <Table columns={columns} data={tableData} keyField="_id" />
      </div>
      {tableData.length === 0 && !loading && (
        <div className="no-results">
          <p>No service approvals found.</p>
        </div>
      )}

      {/* Service Detail Modal */}
      {showDetailModal && selectedService && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Service Details</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <FaTimes size={18} />
              </button>
            </div>
            <div className="modal-body">
              {selectedService.serviceImage && (
                <div className="service-detail-image-container">
                  <img
                    src={selectedService.serviceImage}
                    alt={selectedService.serviceName || 'Service image'}
                    className="service-detail-image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="service-detail-grid">
                <div className="service-detail-item">
                  <label>Service ID</label>
                  <p>{selectedService._id || 'N/A'}</p>
                </div>
                <div className="service-detail-item">
                  <label>Service Name</label>
                  <p>{selectedService.serviceName || 'N/A'}</p>
                </div>
                <div className="service-detail-item">
                  <label>Vendor ID</label>
                  <p>{selectedService.vendorId || 'N/A'}</p>
                </div>
                <div className="service-detail-item">
                  <label>Business ID</label>
                  <p>{selectedService.businessId || 'N/A'}</p>
                </div>
                <div className="service-detail-item">
                  <label>Description</label>
                  <p>{selectedService.description || 'N/A'}</p>
                </div>
                <div className="service-detail-item">
                  <label>Duration</label>
                  <p>{selectedService.durationInMinutes ? `${selectedService.durationInMinutes} minutes` : 'N/A'}</p>
                </div>
                <div className="service-detail-item">
                  <label>Buffer Time</label>
                  <p>
                    {selectedService.bufferTimeInMinutes !== null && selectedService.bufferTimeInMinutes !== undefined
                      ? `${selectedService.bufferTimeInMinutes} minutes`
                      : 'N/A'}
                  </p>
                </div>
                <div className="service-detail-item">
                  <label>Price</label>
                  <p>{selectedService.price ? `₹${selectedService.price}` : 'N/A'}</p>
                </div>
                <div className="service-detail-item">
                  <label>Category</label>
                  <p>{selectedService.category || 'N/A'}</p>
                </div>
                <div className="service-detail-item">
                  <label>Gender</label>
                  <p>
                    <span className={`gender-badge gender-${selectedService.gender?.toLowerCase() || 'unisex'}`}>
                      {selectedService.gender || 'N/A'}
                    </span>
                  </p>
                </div>
                <div className="service-detail-item">
                  <label>Max Bookings Per Slot</label>
                  <p>
                    {selectedService.maxBookingsPerSlot !== null && selectedService.maxBookingsPerSlot !== undefined
                      ? selectedService.maxBookingsPerSlot
                      : 'N/A'}
                  </p>
                </div>
                <div className="service-detail-item service-detail-item-full">
                  <label>Assigned Staff</label>
                  <div className="assigned-staff-list">
                    {selectedService.assignedStaff && Array.isArray(selectedService.assignedStaff) && selectedService.assignedStaff.length > 0 ? (
                      selectedService.assignedStaff.map((staff, index) => (
                        <span key={index} className="staff-badge">
                          {staff}
                        </span>
                      ))
                    ) : (
                      <span className="no-staff">No staff assigned</span>
                    )}
                  </div>
                </div>
                <div className="service-detail-item">
                  <label>Status</label>
                  <p>
                    <span className={`status-badge status-${selectedService.status?.toLowerCase() || 'pending'}`}>
                      {selectedService.status ? selectedService.status.charAt(0).toUpperCase() + selectedService.status.slice(1) : 'Pending'}
                    </span>
                  </p>
                </div>
                <div className="service-detail-item">
                  <label>Created At</label>
                  <p>{selectedService.createdAt ? formatDate(selectedService.createdAt) : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceApprovals;