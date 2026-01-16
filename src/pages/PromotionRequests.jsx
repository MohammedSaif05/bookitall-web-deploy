import React from 'react';
import { toast } from 'react-toastify';
import { FaSync, FaTimes, FaUpload, FaTrash } from 'react-icons/fa';
import { useCachedApi } from '../hooks/useCachedApi';
import { getPromotionRequests, uploadPromotionImages, getPromotionAssets, approvePromotionRequest } from '../api/promotions';
import { CACHE_KEYS } from '../utils/cache';
import { formatDate } from '../utils/helpers';
import Table from '../components/Table';
import { SkeletonTable } from '../components/common/Skeleton';
import './PromotionRequests.css';

const PromotionRequests = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState('pending');
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [uploadedAssets, setUploadedAssets] = React.useState([]);
  const [loadingAssets, setLoadingAssets] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const { data: requestsData, loading, error, refetch } = useCachedApi(
    () => getPromotionRequests({ status: statusFilter }),
    CACHE_KEYS.PROMOTIONS_REQUESTS_LIST,
    [statusFilter]
  );

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

  const handleView = async (row) => {
    setSelectedRequest(row);
    setShowDetailModal(true);
    setSelectedImages([]); // Reset images when opening modal
    setUploadedAssets([]); // Reset uploaded assets
    
    // If status is images_uploaded, fetch the assets
    if (row._fullData?.status === 'images_uploaded' && row._fullData?.requestId && row._fullData?.vendorId) {
      try {
        setLoadingAssets(true);
        const response = await getPromotionAssets(row._fullData.requestId, row._fullData.vendorId);
        setUploadedAssets(response.data || []);
      } catch (err) {
        toast.error('Failed to load uploaded images');
        console.error('Error loading assets:', err);
      } finally {
        setLoadingAssets(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
    setSelectedImages([]);
    setUploadedAssets([]);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 4 images
    if (selectedImages.length + files.length > 4) {
      toast.error('You can only select up to 4 images');
      return;
    }
    
    // Validate file types
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      return true;
    });
    
    setSelectedImages([...selectedImages, ...validFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmitImages = async () => {
    if (!selectedRequest || !selectedRequest._fullData || !selectedRequest._fullData.requestId) {
      toast.error('Request ID not found');
      return;
    }

    if (selectedImages.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (selectedImages.length > 4) {
      toast.error('You can only upload up to 4 images');
      return;
    }

    try {
      setUploading(true);
      await uploadPromotionImages(selectedRequest._fullData.requestId, selectedImages);
      toast.success('Images uploaded successfully');
      
      // Refresh data
      await refetch(true);
      
      // Close modal and reset
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload images';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest || !selectedRequest._fullData || !selectedRequest._fullData.requestId) {
      toast.error('Request ID not found');
      return;
    }

    try {
      setApproving(true);
      const response = await approvePromotionRequest(selectedRequest._fullData.requestId);
      toast.success(response.data?.message || 'Promotion approved successfully');
      
      // Refresh data
      await refetch(true);
      
      // Close modal and reset
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to approve promotion';
      toast.error(errorMessage);
    } finally {
      setApproving(false);
    }
  };

  // Check if any asset has isSelectedByVendor: true
  const hasSelectedAsset = React.useMemo(() => {
    return uploadedAssets.some(asset => asset.isSelectedByVendor === true);
  }, [uploadedAssets]);

  // Transform API response to match table structure
  const tableData = React.useMemo(() => {
    if (!requestsData || !Array.isArray(requestsData)) return [];
    
    return requestsData.map((request, index) => ({
      id: request.requestId || index,
      requestId: request.requestId || 'N/A',
      serialNo: index + 1,
      businessName: request.businessName || 'N/A',
      businessCategory: request.businessCategory || 'N/A',
      city: request.city || 'N/A',
      status: request.status || 'pending',
      // Store full request data for modal
      _fullData: request,
    }));
  }, [requestsData]);

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
      key: 'businessCategory',
      header: 'Business Category',
    },
    {
      key: 'city',
      header: 'City',
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        let statusClass = 'status-pending';
        let displayText = value || 'pending';
        
        if (value === 'images_uploaded') {
          statusClass = 'status-images-uploaded';
          displayText = 'Images Uploaded';
        } else if (value === 'approved') {
          statusClass = 'status-approved';
          displayText = 'Approved';
        }
        
        return (
          <span className={`status-badge ${statusClass}`}>
            {displayText}
          </span>
        );
      },
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
      <div className="promotion-requests-page">
        <div className="page-header">
          <h2>Promotion Requests</h2>
          <p>View and manage promotion requests</p>
        </div>
        <div className="table-wrapper">
          <SkeletonTable rows={5} columns={6} />
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

      {/* Status Filter */}
      <div className="filter-section">
        <label htmlFor="status-filter" className="filter-label">Filter by Status:</label>
        <select
          id="status-filter"
          className="status-filter-select"
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          <option value="pending">Pending</option>
          <option value="images_uploaded">Images Uploaded</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="table-wrapper">
        <Table columns={columns} data={tableData} keyField="requestId" />
      </div>

      {tableData.length === 0 && requestsData && requestsData.length === 0 && (
        <div className="no-results">
          <p>No promotion requests found.</p>
        </div>
      )}

      {/* Promotion Request Detail Modal */}
      {showDetailModal && selectedRequest && selectedRequest._fullData && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Promotion Request Details</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <FaTimes size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="promotion-detail-grid">
                <div className="promotion-detail-item">
                  <label>Request ID</label>
                  <p>{selectedRequest._fullData.requestId || 'N/A'}</p>
                </div>
                <div className="promotion-detail-item">
                  <label>Vendor ID</label>
                  <p>{selectedRequest._fullData.vendorId || 'N/A'}</p>
                </div>
                <div className="promotion-detail-item">
                  <label>Business Name</label>
                  <p>{selectedRequest._fullData.businessName || 'N/A'}</p>
                </div>
                <div className="promotion-detail-item">
                  <label>Business Category</label>
                  <p>{selectedRequest._fullData.businessCategory || 'N/A'}</p>
                </div>
                <div className="promotion-detail-item">
                  <label>City</label>
                  <p>{selectedRequest._fullData.city || 'N/A'}</p>
                </div>
                <div className="promotion-detail-item">
                  <label>Category</label>
                  <p>
                    <span className="category-badge">
                      {selectedRequest._fullData.category || 'N/A'}
                    </span>
                  </p>
                </div>
                <div className="promotion-detail-item promotion-detail-item-full">
                  <label>Description</label>
                  <p>{selectedRequest._fullData.description || 'N/A'}</p>
                </div>
                <div className="promotion-detail-item">
                  <label>Duration Type</label>
                  <p>
                    <span className="duration-badge">
                      {selectedRequest._fullData.durationType || 'N/A'}
                    </span>
                  </p>
                </div>
                <div className="promotion-detail-item">
                  <label>Status</label>
                  <p>
                    <span className={`status-badge ${
                      selectedRequest._fullData.status === 'images_uploaded' 
                        ? 'status-images-uploaded' 
                        : selectedRequest._fullData.status === 'approved'
                        ? 'status-approved'
                        : 'status-pending'
                    }`}>
                      {selectedRequest._fullData.status === 'images_uploaded' 
                        ? 'Images Uploaded' 
                        : selectedRequest._fullData.status === 'approved'
                        ? 'Approved'
                        : selectedRequest._fullData.status || 'pending'}
                    </span>
                  </p>
                </div>
                <div className="promotion-detail-item">
                  <label>Created At</label>
                  <p>{formatDate(selectedRequest._fullData.createdAt) || 'N/A'}</p>
                </div>
                <div className="promotion-detail-item">
                  <label>Updated At</label>
                  <p>{formatDate(selectedRequest._fullData.updatedAt) || 'N/A'}</p>
                </div>
              </div>

              {/* Image Upload Section - Only show for pending status */}
              {selectedRequest._fullData.status === 'pending' && (
                <div className="image-upload-section">
                  <div className="image-upload-header">
                    <h4>Upload Promotion Images</h4>
                    <p className="image-upload-hint">Select up to 4 images</p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="image-input-hidden"
                    id="image-upload-input"
                    disabled={selectedImages.length >= 4 || uploading}
                  />
                  
                  <label
                    htmlFor="image-upload-input"
                    className={`upload-images-button ${selectedImages.length >= 4 || uploading ? 'disabled' : ''}`}
                  >
                    <FaUpload size={16} />
                    <span>Upload Images ({selectedImages.length}/4)</span>
                  </label>

                  {/* Image Preview Grid */}
                  {selectedImages.length > 0 && (
                    <div className="image-preview-grid">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="image-preview-item">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="image-preview"
                          />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => handleRemoveImage(index)}
                            disabled={uploading}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Submit Button */}
                  {selectedImages.length > 0 && (
                    <div className="image-upload-actions">
                      <button
                        type="button"
                        className="submit-images-button"
                        onClick={handleSubmitImages}
                        disabled={uploading || selectedImages.length === 0}
                      >
                        {uploading ? 'Uploading...' : 'Submit Images'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Uploaded Images Section - Only show for images_uploaded status */}
              {selectedRequest._fullData.status === 'images_uploaded' && (
                <div className="uploaded-images-section">
                  <div className="image-upload-header">
                    <h4>Uploaded Promotion Images</h4>
                    <p className="image-upload-hint">
                      {uploadedAssets.length > 0 
                        ? `${uploadedAssets.length} image${uploadedAssets.length !== 1 ? 's' : ''} uploaded`
                        : 'No images uploaded yet'}
                    </p>
                  </div>

                  {loadingAssets ? (
                    <div className="assets-loading">
                      <p>Loading images...</p>
                    </div>
                  ) : uploadedAssets.length > 0 ? (
                    <>
                      <div className="uploaded-images-grid">
                        {uploadedAssets.map((asset) => (
                          <div key={asset.assetId} className="uploaded-image-item">
                            <div className="uploaded-image-wrapper">
                              <img
                                src={asset.imageUrl}
                                alt={`Promotion image ${asset.assetId}`}
                                className="uploaded-image"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="image-error-placeholder" style={{ display: 'none' }}>
                                <span>Failed to load image</span>
                              </div>
                              {asset.isSelectedByVendor && (
                                <div className="selected-badge">
                                  Selected
                                </div>
                              )}
                            </div>
                            <div className="uploaded-image-info">
                              <div className="image-info-item">
                                <span className="info-label">Asset ID:</span>
                                <span className="info-value">{asset.assetId || 'N/A'}</span>
                              </div>
                              <div className="image-info-item">
                                <span className="info-label">Selected by Vendor:</span>
                                <span className={`info-value ${asset.isSelectedByVendor ? 'info-value-true' : 'info-value-false'}`}>
                                  {asset.isSelectedByVendor ? 'True' : 'False'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Approve Button - Only show if at least one asset is selected by vendor */}
                      {hasSelectedAsset && (
                        <div className="approve-section">
                          <button
                            type="button"
                            className="approve-button"
                            onClick={handleApprove}
                            disabled={approving}
                          >
                            {approving ? 'Approving...' : 'Approve Promotion'}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="no-images-message">
                      <p>No images found for this promotion request.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionRequests;
