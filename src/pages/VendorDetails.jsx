import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Phone, Mail, User, Clock, Calendar, Image as ImageIcon, FileText, Scissors } from 'lucide-react';
import { FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Loading from '../components/common/Loading';
import { getVendorDetailsByUserId, approveVendorProduction, rejectVendorImages, rejectVendorDocument } from '../api/vendors';
import { ROUTES } from '../utils/constants';
import { useCachedApi } from '../hooks/useCachedApi';
import { CACHE_KEYS } from '../utils/cache';
import { formatPhoneNumber, formatDate } from '../utils/helpers';
import './VendorDetails.css';

const sampleShopImages = [
  // Turf-themed sample
  'https://images.unsplash.com/photo-1554254227-712e1b02c279?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1639070462748-42d7716ee0cd?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const VendorDetails = () => {
  const { id } = useParams(); // This is the userId
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejectingImages, setRejectingImages] = useState(false);
  const [rejectingDocument, setRejectingDocument] = useState(false);

  // Create API function wrapper
  const fetchVendorDetails = React.useCallback(async () => {
    const response = await getVendorDetailsByUserId(id);
    return response;
  }, [id]);

  const { data: vendor, loading, error, refetch } = useCachedApi(
    fetchVendorDetails,
    CACHE_KEYS.VENDOR_DETAILS(id),
    [id],
    true,
    true
  );

  const shopImages = useMemo(() => {
    // Prioritize businessImages from new API response
    if (Array.isArray(vendor?.businessImages) && vendor.businessImages.length > 0) {
      return vendor.businessImages.slice(0, 2);
    }

    // Fallback to other possible fields
    const arrayCandidate =
      vendor?.shopImages ||
      vendor?.storeImages ||
      vendor?.images;

    if (Array.isArray(arrayCandidate) && arrayCandidate.length > 0) {
      return arrayCandidate.slice(0, 2);
    }

    const fallbackImages = [vendor?.shopImage1, vendor?.shopImage2].filter(Boolean);
    if (fallbackImages.length > 0) {
      return fallbackImages.slice(0, 2);
    }

    return sampleShopImages;
  }, [vendor]);

  // Get business document (single PDF)
  const businessDocument = useMemo(() => {
    return vendor?.businessDocument || null;
  }, [vendor]);

  // Show error toast if API call fails
  React.useEffect(() => {
    if (error) {
      toast.error(error || 'Failed to load vendor details');
    }
  }, [error]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch(true); // Force refresh
      toast.success('Vendor details refreshed successfully');
    } catch {
      toast.error('Failed to refresh vendor details');
    } finally {
      setRefreshing(false);
    }
  };

  const handleApprove = async () => {
    if (!id || vendor?.isBusinessVerified) return;

    const result = await Swal.fire({
      title: 'Approve vendor?',
      text: 'This will mark the vendor as verified and move them to verified vendors.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10b981',
    });

    if (!result.isConfirmed) return;

    try {
      setApproving(true);
      await approveVendorProduction(id);
      Swal.fire({
        icon: 'success',
        title: 'Vendor approved',
        text: 'The vendor has been successfully approved and moved to verified vendors.',
        timer: 2200,
        showConfirmButton: false,
      });
      // Navigate to pending vendors list after successful approval
      navigate(ROUTES.VENDOR_PENDING);
    } catch (err) {
      toast.error(err?.message || 'Failed to approve vendor');
    } finally {
      setApproving(false);
    }
  };

  const handleRejectImages = async () => {
    if (!id || vendor?.isBusinessVerified) return;

    const { value: reason } = await Swal.fire({
      title: 'Reject Images',
      input: 'text',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'Enter reason for rejecting images',
      inputValidator: (value) => (!value ? 'Reason is required' : undefined),
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#ef4444',
    });

    if (!reason) return;

    try {
      setRejectingImages(true);
      await rejectVendorImages(id, reason);
      await refetch(true);
      Swal.fire({
        icon: 'success',
        title: 'Images rejected',
        text: 'The images have been rejected successfully.',
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      toast.error(err?.message || 'Failed to reject images');
    } finally {
      setRejectingImages(false);
    }
  };

  const handleRejectDocument = async () => {
    if (!id || vendor?.isBusinessVerified) return;

    const { value: reason } = await Swal.fire({
      title: 'Reject Document',
      input: 'text',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'Enter reason for rejecting document',
      inputValidator: (value) => (!value ? 'Reason is required' : undefined),
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#ef4444',
    });

    if (!reason) return;

    try {
      setRejectingDocument(true);
      await rejectVendorDocument(id, reason);
      await refetch(true);
      Swal.fire({
        icon: 'success',
        title: 'Document rejected',
        text: 'The document has been rejected successfully.',
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      toast.error(err?.message || 'Failed to reject document');
    } finally {
      setRejectingDocument(false);
    }
  };

  if (loading) {
    return (
      <div className="vendor-details-page">
        <Loading fullScreen />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="vendor-details-page">
        <div className="vendor-details-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="error-state">
            <p>{error || 'Vendor not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-details-page">
      <div className="vendor-details-container">
        {/* Header */}
        <div className="details-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="header-content">
            <h1>{vendor.businessName || 'N/A'}</h1>
            <div className="header-actions">
              {!vendor.isBusinessVerified && (
                <button
                  className="approve-button"
                  onClick={handleApprove}
                  disabled={approving}
                  title="Approve vendor"
                >
                  {approving ? 'Approving…' : 'Approve'}
                </button>
              )}
              <span
                className={`status-badge ${
                  vendor.isBusinessVerified ? 'status-verified' : 'status-pending'
                }`}
              >
                {vendor.isBusinessVerified ? 'Verified' : 'Pending'}
              </span>
              <button
                className="refresh-button"
                onClick={handleRefresh}
                disabled={refreshing || loading}
                title="Refresh vendor details"
              >
                <FaSync className={refreshing ? 'spinning' : ''} size={14} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="details-content">
          {/* Business Information */}
          <section className="details-section">
            <h2 className="section-title">
              <Building2 size={20} />
              Business Information
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Business Name</label>
                <p>{vendor.businessName || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Business Type</label>
                <p>{vendor.businessType || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Business Category</label>
                <p>{vendor.businessCategory || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Business Email</label>
                <p>{vendor.businessEmail || 'N/A'}</p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="details-section">
            <h2 className="section-title">
              <Phone size={20} />
              Contact Information
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Owner Name</label>
                <p>{vendor.ownerName || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Mobile Number</label>
                <p>{formatPhoneNumber(vendor.mobileNo) || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Alternate Phone</label>
                <p>{formatPhoneNumber(vendor.alternatePhoneNumber) || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Business Email</label>
                <p>{vendor.businessEmail || 'N/A'}</p>
              </div>
            </div>
          </section>

          {/* Location Information */}
          <section className="details-section">
            <h2 className="section-title">
              <MapPin size={20} />
              Location Information
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Address</label>
                <p>{vendor.address || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>City</label>
                <p>{vendor.city || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Pincode</label>
                <p>{vendor.pincode || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Landmark</label>
                <p>{vendor.landmark || 'N/A'}</p>
              </div>
              {vendor.googleMapLink && (
                <div className="info-item full-width">
                  <label>Google Map Link</label>
                  <a 
                    href={vendor.googleMapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="map-link"
                  >
                    {vendor.googleMapLink}
                  </a>
                </div>
              )}
              {(vendor.latitude && vendor.longitude) && (
                <div className="info-item">
                  <label>Coordinates</label>
                  <p>{vendor.latitude}, {vendor.longitude}</p>
                </div>
              )}
            </div>
          </section>

          {/* Working Hours */}
          <section className="details-section">
            <h2 className="section-title">
              <Clock size={20} />
              Working Hours
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Different Timings Each Day</label>
                <p>{vendor.differentTimingsEachDay ? 'Yes' : 'No'}</p>
              </div>
              {!vendor.differentTimingsEachDay && (
                <>
                  <div className="info-item">
                    <label>Start Time</label>
                    <p>{vendor.startTime || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>End Time</label>
                    <p>{vendor.endTime || 'N/A'}</p>
                  </div>
                </>
              )}
              <div className="info-item">
                <label>Has Break Hours</label>
                <p>{vendor.hasBreakHours ? 'Yes' : 'No'}</p>
              </div>
              {vendor.workingDays && vendor.workingDays.length > 0 && (
                <div className="info-item full-width">
                  <label>Working Days</label>
                  <div className="working-days">
                    {vendor.workingDays.map((day, index) => (
                      <span key={index} className="day-badge">{day}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Daily Timings */}
            {vendor.differentTimingsEachDay && vendor.days && vendor.days.length > 0 && (
              <div className="daily-timings">
                <h3>Daily Timings</h3>
                <div className="timings-list">
                  {vendor.days.map((day, index) => (
                    <div key={index} className="timing-item">
                      <div className="timing-header">
                        <strong>{day.day}</strong>
                        <span className="timing-range">
                          {day.start_time} - {day.end_time}
                        </span>
                      </div>
                      {day.breaks && day.breaks.length > 0 && (
                        <div className="breaks-list">
                          <span className="breaks-label">Breaks:</span>
                          {day.breaks.map((breakItem, breakIndex) => (
                            <span key={breakIndex} className="break-badge">
                              {breakItem.break_start} - {breakItem.break_end}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Breaks */}
            {vendor.breaks && vendor.breaks.length > 0 && !vendor.differentTimingsEachDay && (
              <div className="general-breaks">
                <h3>Break Hours</h3>
                <div className="breaks-list">
                  {vendor.breaks.map((breakItem, index) => (
                    <span key={index} className="break-badge">
                      {breakItem.break_start} - {breakItem.break_end}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Services */}
          {vendor.services && vendor.services.length > 0 && (
            <section className="details-section">
              <h2 className="section-title">
                <Scissors size={20} />
                Services
              </h2>
              <div className="services-grid">
                {vendor.services.map((service, index) => (
                  <div key={index} className="service-card">
                    <div className="service-header">
                      <h3 className="service-name">{service.serviceName || 'N/A'}</h3>
                      <span className="service-cost">₹{service.serviceCost || '0'}</span>
                    </div>
                    <div className="service-details">
                      <div className="service-detail-item">
                        <label>Duration</label>
                        <span>{service.serviceDuration || 'N/A'} minutes</span>
                      </div>
                      <div className="service-detail-item">
                        <label>Gender</label>
                        <span className={`gender-badge gender-${service.gender?.toLowerCase() || 'unisex'}`}>
                          {service.gender || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Shop Images */}
          <section className="details-section">
            <h2 className="section-title">
              <ImageIcon size={20} />
              Shop Images
            </h2>
            {vendor.isBusinessImageApproved === false && vendor.imageRejectMessage && (
              <div className="rejection-message">
                <span className="rejection-label">Rejection Reason:</span>
                <span className="rejection-text">{vendor.imageRejectMessage}</span>
              </div>
            )}
            <div className="shop-images-grid">
              {shopImages.length > 0 ? (
                shopImages.map((src, index) => (
                  <div key={index} className="shop-image-card">
                    <img
                      src={src}
                      alt={`Shop image ${index + 1}`}
                      className="shop-image"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://via.placeholder.com/600x400?text=Image+unavailable';
                      }}
                    />
                  </div>
                ))
              ) : (
                <p className="empty-state">No shop images uploaded.</p>
              )}
            </div>
            {!vendor.isBusinessVerified && (
              <div className="section-actions">
                <button
                  className="reject-button"
                  onClick={handleRejectImages}
                  disabled={rejectingImages}
                >
                  {rejectingImages ? 'Rejecting…' : 'Reject Images'}
                </button>
              </div>
            )}
          </section>

          {/* Business Document */}
          <section className="details-section">
            <h2 className="section-title">
              <FileText size={20} />
              Business Document
            </h2>
            {vendor.isBusinessDocumentApproved === false && vendor.documentRejectMessage && (
              <div className="rejection-message">
                <span className="rejection-label">Rejection Reason:</span>
                <span className="rejection-text">{vendor.documentRejectMessage}</span>
              </div>
            )}
            {businessDocument ? (
              <div className="document-preview-container">
                <div className="document-preview-header">
                  <span className="document-title">Business Document (PDF)</span>
                  <a
                    href={businessDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-open-link"
                  >
                    Open in New Tab
                  </a>
                </div>
                <div className="pdf-preview-wrapper">
                  <iframe
                    src={`${businessDocument}#toolbar=0`}
                    className="pdf-preview"
                    title="Business Document Preview"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'pdf-error';
                      errorDiv.textContent = 'Unable to load PDF preview. Please use the link above to view the document.';
                      e.currentTarget.parentElement.appendChild(errorDiv);
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="empty-state">No business document uploaded.</p>
            )}
            {!vendor.isBusinessVerified && (
              <div className="section-actions">
                <button
                  className="reject-button"
                  onClick={handleRejectDocument}
                  disabled={rejectingDocument}
                >
                  {rejectingDocument ? 'Rejecting…' : 'Reject Document'}
                </button>
              </div>
            )}
          </section>

          {/* Additional Information */}
          <section className="details-section">
            <h2 className="section-title">
              <Calendar size={20} />
              Additional Information
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Onboarding Step</label>
                <p>{vendor.step || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Onboarding Completed</label>
                <p>{vendor.isOnBoardCompleted ? 'Yes' : 'No'}</p>
              </div>
              <div className="info-item">
                <label>Business Verified</label>
                <p>{vendor.isBusinessVerified ? 'Yes' : 'No'}</p>
              </div>
              {vendor.isBusinessDocumentApproved !== null && (
                <div className="info-item">
                  <label>Document Approved</label>
                  <p>{vendor.isBusinessDocumentApproved ? 'Yes' : 'No'}</p>
                </div>
              )}
              {vendor.isBusinessImageApproved !== null && (
                <div className="info-item">
                  <label>Image Approved</label>
                  <p>{vendor.isBusinessImageApproved ? 'Yes' : 'No'}</p>
                </div>
              )}
              <div className="info-item">
                <label>User ID</label>
                <p>{vendor.userId || 'N/A'}</p>
              </div>
              {vendor.shopId && (
                <div className="info-item">
                  <label>Shop ID</label>
                  <p>{vendor.shopId}</p>
                </div>
              )}
              {vendor.createdAt && (
                <div className="info-item">
                  <label>Created At</label>
                  <p>{formatDate(vendor.createdAt)}</p>
                </div>
              )}
              {vendor.updatedAt && (
                <div className="info-item">
                  <label>Last Updated</label>
                  <p>{formatDate(vendor.updatedAt)}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;

