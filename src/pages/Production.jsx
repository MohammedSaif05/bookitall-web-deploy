import React from 'react';
import { toast } from 'react-toastify';
import { FaSync } from 'react-icons/fa';
import { useCachedApi } from '../hooks/useCachedApi';
import { getActivePromotions } from '../api/promotions';
import { CACHE_KEYS } from '../utils/cache';
import { formatDate } from '../utils/helpers';
import './Production.css';

const Production = () => {
  const { data: promotionsData, loading, error, refetch } = useCachedApi(
    () => getActivePromotions({ isActive: true }),
    CACHE_KEYS.PROMOTIONS_PRODUCTION_LIST
  );
  const [refreshing, setRefreshing] = React.useState(false);

  // Show error toast if API call fails
  React.useEffect(() => {
    if (error) {
      toast.error(error || 'Failed to load promotions');
    }
  }, [error]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch(true); // Force refresh
      toast.success('Promotions list refreshed successfully');
    } catch {
      toast.error('Failed to refresh promotions list');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="production-page">
        <div className="page-header">
          <h2>Production Promotions</h2>
          <p>View all active promotions</p>
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
      <div className="production-page">
        <div className="page-header">
          <h2>Production Promotions</h2>
          <p>View all active promotions</p>
        </div>
        <div className="error-message">
          <p>Error loading promotions: {error}</p>
        </div>
      </div>
    );
  }

  const promotions = promotionsData || [];

  return (
    <div className="production-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>Production Promotions</h2>
            <p>View all active promotions</p>
          </div>
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            title="Refresh promotions list"
          >
            <FaSync className={refreshing ? 'spinning' : ''} size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {promotions.length === 0 ? (
        <div className="no-results">
          <p>No active promotions found.</p>
        </div>
      ) : (
        <div className="promotions-grid">
          {promotions.map((promotion) => (
            <div key={promotion.promotionId} className="promotion-card">
              <div className="promotion-image-container">
                <img
                  src={promotion.imageUrl || '/placeholder-image.png'}
                  alt={promotion.description || 'Promotion'}
                  className="promotion-image"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png';
                  }}
                />
                <div className="promotion-status-badge">
                  <span className={`status-badge ${promotion.isActive ? 'status-active' : 'status-inactive'}`}>
                    {promotion.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="promotion-content">
                <div className="promotion-field">
                  <span className="field-label">Promotion ID:</span>
                  <span className="field-value">{promotion.promotionId}</span>
                </div>
                <div className="promotion-field">
                  <span className="field-label">Vendor ID:</span>
                  <span className="field-value">{promotion.vendorId}</span>
                </div>
                <div className="promotion-field">
                  <span className="field-label">Category:</span>
                  <span className="field-value category-badge">{promotion.category || 'N/A'}</span>
                </div>
                <div className="promotion-field description-field">
                  <span className="field-label">Description:</span>
                  <span className="field-value">{promotion.description || 'N/A'}</span>
                </div>
                <div className="promotion-field">
                  <span className="field-label">Start Date:</span>
                  <span className="field-value">{formatDate(promotion.startDate) || 'N/A'}</span>
                </div>
                <div className="promotion-field">
                  <span className="field-label">End Date:</span>
                  <span className="field-value">{formatDate(promotion.endDate) || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Production;

