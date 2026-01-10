import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSync } from 'react-icons/fa';
import { Eye } from 'lucide-react';
import Table from '../components/Table';
import Loading from '../components/common/Loading';
import { SkeletonTable } from '../components/common/Skeleton';
import { useCachedApi } from '../hooks/useCachedApi';
import { getServiceApprovals } from '../api/vendors';
import { ROUTES } from '../utils/constants';
import { CACHE_KEYS } from '../utils/cache';
import { formatDate } from '../utils/helpers';
import './ServiceApprovals.css';

const ServiceApprovals = () => {
  const navigate = useNavigate();
  const { data: servicesData, loading, error, refetch } = useCachedApi(
    getServiceApprovals,
    CACHE_KEYS.SERVICE_APPROVALS_LIST
  );
  const [refreshing, setRefreshing] = React.useState(false);

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
    // Navigate to vendor details using vendorId
    const vendorId = row.vendorId;
    if (vendorId) {
      navigate(ROUTES.VERIFIED_VENDOR_DETAILS(vendorId));
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
      key: 'serviceName',
      header: 'Service Name',
    },
    {
      key: 'vendorId',
      header: 'Vendor ID',
    },
    {
      key: 'description',
      header: 'Description',
      render: (value) => value || 'N/A',
    },
    {
      key: 'durationInMinutes',
      header: 'Duration',
      render: (value) => value ? `${value} min` : 'N/A',
      className: 'text-center',
    },
    {
      key: 'bufferTimeInMinutes',
      header: 'Buffer Time',
      render: (value) => value !== null && value !== undefined ? `${value} min` : 'N/A',
      className: 'text-center',
    },
    {
      key: 'price',
      header: 'Price',
      render: (value) => value ? `₹${value}` : 'N/A',
      className: 'text-center',
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'maxBookingsPerSlot',
      header: 'Max Bookings',
      render: (value) => value !== null && value !== undefined ? value : 'N/A',
      className: 'text-center',
    },
    {
      key: 'gender',
      header: 'Gender',
      render: (value) => (
        <span className={`gender-badge gender-${value?.toLowerCase() || 'unisex'}`}>
          {value || 'N/A'}
        </span>
      ),
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
            title="View Vendor Details"
          >
            <Eye size={14} />
            <span>View</span>
          </button>
        </div>
      ),
    },
  ];

  // Transform data to include serial numbers
  const tableData = React.useMemo(() => {
    if (!servicesData || !Array.isArray(servicesData)) return [];
    return servicesData.map((service, index) => ({
      ...service,
      serialNo: index + 1,
    }));
  }, [servicesData]);

  if (loading) {
    return (
      <div className="service-approvals-page">
        <div className="page-header">
          <h2>Services Approvals</h2>
          <p>Review and approve service requests from vendors</p>
        </div>
        <div className="table-wrapper">
          <SkeletonTable rows={5} columns={13} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-approvals-page">
        <div className="page-header">
          <h2>Services Approvals</h2>
          <p>Review and approve service requests from vendors</p>
        </div>
        <div className="error-message">
          <p>Error loading service approvals: {error}</p>
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
      <div className="table-wrapper">
        <Table columns={columns} data={tableData} keyField="_id" />
      </div>
      {tableData.length === 0 && (
        <div className="no-results">
          <p>No service approvals found.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceApprovals;

