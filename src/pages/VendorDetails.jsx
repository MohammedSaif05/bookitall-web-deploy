import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Phone, Mail, User, Clock, Calendar } from 'lucide-react';
import { FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';
import { getVendorDetailsByUserId } from '../api/vendors';
import { useCachedApi } from '../hooks/useCachedApi';
import { CACHE_KEYS } from '../utils/cache';
import { formatPhoneNumber, formatDate } from '../utils/helpers';
import './VendorDetails.css';

const VendorDetails = () => {
  const { id } = useParams(); // This is the userId
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

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

export default VendorDetails;

