import React from 'react';
import { toast } from 'react-toastify';
import { FaSync } from 'react-icons/fa';
import { useCachedApi } from '../hooks/useCachedApi';
import { getPromotionRequests } from '../api/promotions';
import { CACHE_KEYS } from '../utils/cache';
import { formatDate } from '../utils/helpers';
import './PromotionRequests.css';

const PromotionRequests = () => {
  const { data: requestsData, loading, error, refetch } = useCachedApi(
    getPromotionRequests,
    CACHE_KEYS.PROMOTIONS_REQUESTS_LIST
  );
  const [refreshing, setRefreshing] = React.useState(false);

  // Show error toast if API call fails
  React.useEffect(() => {
    if (error) {
      toast.error(error || 'Failed to load promotion requests');
    }
  }, [error]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch(true); // Force refresh
      toast.success('Promotion requests list refreshed successfully');
    } catch {
      toast.error('Failed to refresh promotion requests list');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="promotion-requests-page">
        <div className="page-header">
          <h2>Promotion Requests</h2>
          <p>View and manage promotion requests</p>
        </div>
        <div className="promotions-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="promotion-card skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="promotion-requests-page">
        <div className="page-header">
          <h2>Promotion Requests</h2>
          <p>View and manage promotion requests</p>
        </div>
        <div className="error-message">
          <p>Error loading promotion requests: {error}</p>
        </div>
      </div>
    );
  }

  const requests = requestsData || [];

  return (
    <div className="promotion-requests-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>Promotion Requests</h2>
            <p>View and manage promotion requests</p>
          </div>
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            title="Refresh promotion requests list"
          >
            <FaSync className={refreshing ? 'spinning' : ''} size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="no-results">
          <p>No promotion requests found.</p>
        </div>
      ) : (
        <div className="promotions-grid">
          {requests.map((request) => (
            <div key={request.promotionId} className="promotion-card">
              <div className="promotion-image-container">
                <img
                  src={request.imageUrl || '/placeholder-image.png'}
                  alt={request.description || 'Promotion Request'}
                  className="promotion-image"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png';
                  }}
                />
                <div className="promotion-status-badge">
                  <span className="status-badge status-pending">
                    Pending
                  </span>
                </div>
              </div>
              <div className="promotion-content">
                <div className="promotion-field">
                  <span className="field-label">Promotion ID:</span>
                  <span className="field-value">{request.promotionId}</span>
                </div>
                <div className="promotion-field">
                  <span className="field-label">Vendor ID:</span>
                  <span className="field-value">{request.vendorId}</span>
                </div>
                <div className="promotion-field">
                  <span className="field-label">Category:</span>
                  <span className="field-value category-badge">{request.category || 'N/A'}</span>
                </div>
                <div className="promotion-field description-field">
                  <span className="field-label">Description:</span>
                  <span className="field-value">{request.description || 'N/A'}</span>
                </div>
                <div className="promotion-field">
                  <span className="field-label">Start Date:</span>
                  <span className="field-value">{formatDate(request.startDate) || 'N/A'}</span>
                </div>
                <div className="promotion-field">
                  <span className="field-label">End Date:</span>
                  <span className="field-value">{formatDate(request.endDate) || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionRequests;

