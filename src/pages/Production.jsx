import React from 'react';
import { toast } from 'react-toastify';
import { FaSync, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { useCachedApi } from '../hooks/useCachedApi';
import { getActivePromotions, createGlobalPromotion, deleteGlobalPromotion } from '../api/promotions';
import { CACHE_KEYS } from '../utils/cache';
import { formatDate } from '../utils/helpers';
import './Production.css';

const Production = () => {
  const { data: promotionsData, loading, error, refetch } = useCachedApi(
    () => getActivePromotions({ isActive: true }),
    CACHE_KEYS.PROMOTIONS_PRODUCTION_LIST
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [category, setCategory] = React.useState('offer');
  const [description, setDescription] = React.useState('');
  const [promotionImage, setPromotionImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleting, setDeleting] = React.useState(null);
  const fileInputRef = React.useRef(null);

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

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setCategory('offer');
    setDescription('');
    setPromotionImage(null);
    setImagePreview(null);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setCategory('offer');
    setDescription('');
    setPromotionImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setPromotionImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPromotionImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    if (!promotionImage) {
      toast.error('Please select an image');
      return;
    }

    try {
      setSubmitting(true);
      await createGlobalPromotion({
        category,
        description: description.trim(),
        promotionImage,
      });
      toast.success('Global promotion created successfully');
      
      // Refresh data
      await refetch(true);
      
      // Close modal and reset
      handleCloseAddModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create promotion';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (promotionId) => {
    if (!promotionId) {
      toast.error('Promotion ID not found');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this global promotion?')) {
      return;
    }

    try {
      setDeleting(promotionId);
      await deleteGlobalPromotion(promotionId);
      toast.success('Global promotion deleted successfully');
      
      // Refresh data
      await refetch(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete promotion';
      toast.error(errorMessage);
    } finally {
      setDeleting(null);
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
          <div className="header-actions">
            <button
              className="add-promotion-button"
              onClick={handleOpenAddModal}
              title="Add new global promotion"
            >
              <FaPlus size={16} />
              <span>Add Promotion</span>
            </button>
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
                {promotion.isGlobal && (
                  <div className="global-badge">
                    <span>Global</span>
                  </div>
                )}
              </div>
              <div className="promotion-content">
                <div className="promotion-field">
                  <span className="field-label">Promotion ID:</span>
                  <span className="field-value">{promotion.promotionId}</span>
                </div>
                {promotion.vendorId && (
                  <div className="promotion-field">
                    <span className="field-label">Vendor ID:</span>
                    <span className="field-value">{promotion.vendorId}</span>
                  </div>
                )}
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
                {promotion.isGlobal && (
                  <div className="promotion-actions">
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(promotion.promotionId)}
                      disabled={deleting === promotion.promotionId}
                      title="Delete global promotion"
                    >
                      <FaTrash size={14} />
                      <span>{deleting === promotion.promotionId ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Promotion Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseAddModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Global Promotion</h3>
              <button className="modal-close-btn" onClick={handleCloseAddModal}>
                <FaTimes size={18} />
              </button>
            </div>
            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="offer">Offer</option>
                  <option value="featured">Featured</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter promotion description"
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="promotionImage">Promotion Image *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="promotionImage"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="form-file-input"
                  required
                />
                {imagePreview && (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview-img" />
                    <button
                      type="button"
                      className="remove-preview-btn"
                      onClick={handleRemoveImage}
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={handleCloseAddModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit-btn"
                  disabled={submitting || !category || !description.trim() || !promotionImage}
                >
                  {submitting ? 'Creating...' : 'Create Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Production;
