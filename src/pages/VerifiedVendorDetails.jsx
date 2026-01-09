import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Phone, Mail, User, Clock, Calendar, Image as ImageIcon, FileText, Scissors, CreditCard, Users, CheckCircle, XCircle } from 'lucide-react';
import { FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';
import { getVerifiedVendorDetailsByUserId } from '../api/vendors';
import { ROUTES } from '../utils/constants';
import { useCachedApi } from '../hooks/useCachedApi';
import { CACHE_KEYS } from '../utils/cache';
import { formatPhoneNumber, formatDate } from '../utils/helpers';
import './VendorDetails.css';

const VerifiedVendorDetails = () => {
  const { id } = useParams(); // This is the userId
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = React.useState(false);

  // Create API function wrapper
  const fetchVendorDetails = React.useCallback(async () => {
    const response = await getVerifiedVendorDetailsByUserId(id);
    return response;
  }, [id]);

  const { data: vendor, loading, error, refetch } = useCachedApi(
    fetchVendorDetails,
    CACHE_KEYS.VERIFIED_VENDOR_DETAILS(id),
    [id],
    true,
    true
  );

  const shopImages = useMemo(() => {
    if (Array.isArray(vendor?.businessImages) && vendor.businessImages.length > 0) {
      return vendor.businessImages;
    }
    return [];
  }, [vendor]);

  const businessDocument = useMemo(() => {
    return vendor?.businessDocument || null;
  }, [vendor]);

  // Get day name from dayOfWeek (0 = Sunday, 1 = Monday, etc.)
  const getDayName = (dayOfWeek) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || 'Unknown';
  };

  // Show error toast if API call fails
  React.useEffect(() => {
    if (error) {
      toast.error(error || 'Failed to load vendor details');
    }
  }, [error]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch(true);
      toast.success('Vendor details refreshed successfully');
    } catch {
      toast.error('Failed to refresh vendor details');
    } finally {
      setRefreshing(false);
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
          <button className="back-button" onClick={() => navigate(ROUTES.VENDOR_ONBOARDING)}>
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="header-content">
            <h1>{vendor.businessName || 'N/A'}</h1>
            <div className="header-actions">
              <span className="status-badge status-verified">Verified</span>
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
                <label>Owner Name</label>
                <p>{vendor.ownerName || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Status</label>
                <p>
                  <span className={`status-badge ${vendor.isActive ? 'status-active' : 'status-inactive'}`}>
                    {vendor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
              <div className="info-item">
                <label>Discoverable</label>
                <p>
                  {vendor.isDiscoverable ? (
                    <CheckCircle size={18} className="text-green-600" />
                  ) : (
                    <XCircle size={18} className="text-red-600" />
                  )}
                  <span style={{ marginLeft: '8px' }}>
                    {vendor.isDiscoverable ? 'Yes' : 'No'}
                  </span>
                </p>
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
                <label>Mobile Number</label>
                <p>{formatPhoneNumber(vendor.mobileNo || vendor.contact?.mobileNo) || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Alternate Phone</label>
                <p>{formatPhoneNumber(vendor.alternatePhoneNumber || vendor.contact?.alternatePhone) || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Business Email</label>
                <p>{vendor.businessEmail || vendor.contact?.email || 'N/A'}</p>
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
                <label>Landmark</label>
                <p>{vendor.landmark || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Pincode</label>
                <p>{vendor.pincode || 'N/A'}</p>
              </div>
              {(vendor.latitude && vendor.longitude) && (
                <>
                  <div className="info-item">
                    <label>Latitude</label>
                    <p>{vendor.latitude}</p>
                  </div>
                  <div className="info-item">
                    <label>Longitude</label>
                    <p>{vendor.longitude}</p>
                  </div>
                </>
              )}
              {vendor.location?.coordinates && (
                <div className="info-item full-width">
                  <label>Coordinates</label>
                  <p>{vendor.location.coordinates[0]}, {vendor.location.coordinates[1]}</p>
                </div>
              )}
            </div>
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
                  <div key={service.serviceId || index} className="service-card">
                    {service.serviceImage && (
                      <div className="service-image-container">
                        <img
                          src={service.serviceImage}
                          alt={service.serviceName || 'Service image'}
                          className="service-image"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="service-header">
                      <h3 className="service-name">{service.serviceName || 'N/A'}</h3>
                      <span className="service-cost">₹{service.serviceCost || '0'}</span>
                    </div>
                    <div className="service-details">
                      {service.serviceId && (
                        <div className="service-detail-item">
                          <label>Service ID</label>
                          <span>{service.serviceId}</span>
                        </div>
                      )}
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
                      {service.category && (
                        <div className="service-detail-item">
                          <label>Category</label>
                          <span>{service.category}</span>
                        </div>
                      )}
                      {service.description && (
                        <div className="service-detail-item full-width">
                          <label>Description</label>
                          <span>{service.description}</span>
                        </div>
                      )}
                      {service.bufferTime !== null && service.bufferTime !== undefined && (
                        <div className="service-detail-item">
                          <label>Buffer Time</label>
                          <span>{service.bufferTime} minutes</span>
                        </div>
                      )}
                      {service.maximumNo && (
                        <div className="service-detail-item">
                          <label>Maximum Number</label>
                          <span>{service.maximumNo}</span>
                        </div>
                      )}
                      <div className="service-detail-item">
                        <label>Status</label>
                        <span className={`status-badge ${service.isActive ? 'status-active' : 'status-inactive'}`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {service.availability && service.availability.length > 0 && (
                        <div className="service-detail-item full-width">
                          <label>Availability</label>
                          <div className="availability-list">
                            {service.availability.map((avail, availIndex) => (
                              <div key={availIndex} className="availability-item">
                                <div className="availability-header">
                                  <strong>{getDayName(avail.dayOfWeek)}</strong>
                                  <span className="availability-time">
                                    {avail.startTime} - {avail.endTime}
                                  </span>
                                </div>
                                {avail.breaks && avail.breaks.length > 0 && (
                                  <div className="breaks-list">
                                    <span className="breaks-label">Breaks:</span>
                                    {avail.breaks.map((breakItem, breakIndex) => (
                                      <span key={breakIndex} className="break-badge">
                                        {breakItem.start} - {breakItem.end}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Staff */}
          {vendor.staff && vendor.staff.length > 0 && (
            <section className="details-section">
              <h2 className="section-title">
                <Users size={20} />
                Staff
              </h2>
              <div className="staff-grid">
                {vendor.staff.map((staffMember, index) => (
                  <div key={index} className="staff-card">
                    <div className="staff-name">{staffMember.name || 'N/A'}</div>
                    <div className="staff-status">
                      <span className={`status-badge ${staffMember.isActive ? 'status-active' : 'status-inactive'}`}>
                        {staffMember.isActive ? 'Active' : 'Inactive'}
                      </span>
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
              Business Images
            </h2>
            <div className="shop-images-grid">
              {shopImages.length > 0 ? (
                shopImages.map((src, index) => (
                  <div key={index} className="shop-image-card">
                    <img
                      src={src}
                      alt={`Business image ${index + 1}`}
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
                <p className="empty-state">No business images uploaded.</p>
              )}
            </div>
          </section>

          {/* Business Document */}
          <section className="details-section">
            <h2 className="section-title">
              <FileText size={20} />
              Business Document
            </h2>
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
          </section>

          {/* Additional Information */}
          <section className="details-section">
            <h2 className="section-title">
              <Calendar size={20} />
              Additional Information
            </h2>
            <div className="info-grid">
              {vendor._id && (
                <div className="info-item">
                  <label>ID</label>
                  <p>{vendor._id}</p>
                </div>
              )}
              <div className="info-item">
                <label>User ID</label>
                <p>{vendor.userId || 'N/A'}</p>
              </div>
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

export default VerifiedVendorDetails;

