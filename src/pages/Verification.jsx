import React, { useState } from 'react';
import { CreditCard, Search, CheckCircle, XCircle, MapPin, Navigation } from 'lucide-react';
import { toast } from 'react-toastify';
import { verifyIfsc } from '../api/verification';
import './Verification.css';

const Verification = () => {
  const [ifscCode, setIfscCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [verifyingIfsc, setVerifyingIfsc] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [ifscResult, setIfscResult] = useState(null);
  const [ifscError, setIfscError] = useState(null);
  const [location, setLocation] = useState('adhiyamaan college of en');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  const handleIfscVerify = async () => {
    if (!ifscCode.trim()) {
      toast.error('Please enter an IFSC code');
      return;
    }

    // Validate IFSC format (should be 11 characters)
    if (ifscCode.trim().length !== 11) {
      toast.error('IFSC code must be 11 characters');
      return;
    }

    try {
      setVerifyingIfsc(true);
      setIfscError(null);
      setIfscResult(null);
      
      const response = await verifyIfsc(ifscCode);
      
      if (response.status && response.data && response.data.valid) {
        setIfscResult(response.data);
        toast.success(response.message || 'IFSC code verified successfully');
      } else {
        throw new Error(response.message || 'IFSC code not found or invalid');
      }
    } catch (error) {
      const errorMessage = error?.message || 'Failed to verify IFSC code';
      setIfscError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setVerifyingIfsc(false);
    }
  };

  const handleAccountNumberVerify = async () => {
    if (!accountNumber.trim()) {
      toast.error('Please enter an account number');
      return;
    }

    try {
      setVerifyingAccount(true);
      // TODO: Implement Account Number verification API call
      // const response = await verifyAccountNumber(accountNumber);
      
      // Mock implementation for now
      setTimeout(() => {
        toast.success(`Account Number ${accountNumber} verified successfully`);
        setVerifyingAccount(false);
      }, 1000);
    } catch (error) {
      toast.error(error?.message || 'Failed to verify account number');
      setVerifyingAccount(false);
    }
  };

  const handleGetCoordinates = () => {
    if (!googleMapsLink.trim()) {
      toast.error('Please enter a Google Maps link');
      return;
    }

    try {
      const url = new URL(googleMapsLink);
      const llParam = url.searchParams.get('ll');
      
      if (!llParam) {
        toast.error('No coordinates found in the link. Please check the URL format.');
        setCoordinates(null);
        return;
      }

      const [latitude, longitude] = llParam.split(',');
      
      if (!latitude || !longitude || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
        toast.error('Invalid coordinates format in the link.');
        setCoordinates(null);
        return;
      }

      setCoordinates({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      
      toast.success('Coordinates extracted successfully');
    } catch (error) {
      if (error instanceof TypeError) {
        toast.error('Invalid URL format. Please enter a valid Google Maps link.');
      } else {
        toast.error('Failed to parse coordinates from the link');
      }
      setCoordinates(null);
    }
  };

  return (
    <div className="verification-page">
      <div className="verification-container">
        <div className="verification-header">
          <h2 className="verification-title">
            <CreditCard size={24} />
            Bank Verification
          </h2>
          <p className="verification-description">
            Verify IFSC codes and account numbers for bank details validation.
          </p>
        </div>

        <div className="verification-content">
          {/* IFSC Verification */}
          <div className="verification-card">
            <div className="verification-card-header">
              <h3 className="verification-card-title">IFSC Code Verification</h3>
            </div>
            <div className="verification-card-body">
              <div className="verification-input-group">
                <label htmlFor="ifsc-code" className="verification-label">
                  IFSC Code
                </label>
                <div className="verification-input-wrapper">
                  <input
                    id="ifsc-code"
                    type="text"
                    className="verification-input"
                    placeholder="Enter IFSC code (e.g., HDFC0001234)"
                    value={ifscCode}
                    onChange={(e) => {
                      setIfscCode(e.target.value.toUpperCase());
                      setIfscResult(null);
                      setIfscError(null);
                    }}
                    maxLength={11}
                    disabled={verifyingIfsc}
                  />
                  <button
                    className="verification-button"
                    onClick={handleIfscVerify}
                    disabled={verifyingIfsc || !ifscCode.trim()}
                  >
                    <Search size={16} />
                    {verifyingIfsc ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                <p className="verification-hint">
                  Enter 11-character IFSC code to verify bank details
                </p>
                
                {/* IFSC Verification Result */}
                {ifscResult && (
                  <div className="verification-result">
                    <div className="verification-result-header">
                      <CheckCircle size={18} className="verification-success-icon" />
                      <span className="verification-result-title">Verification Successful</span>
                    </div>
                    <div className="verification-result-content">
                      <div className="verification-result-row">
                        <span className="verification-result-label">IFSC Code:</span>
                        <span className="verification-result-value">{ifscResult.ifsc}</span>
                      </div>
                      <div className="verification-result-row">
                        <span className="verification-result-label">Bank Name:</span>
                        <span className="verification-result-value">{ifscResult.bank_name}</span>
                      </div>
                      <div className="verification-result-row">
                        <span className="verification-result-label">Branch Name:</span>
                        <span className="verification-result-value">{ifscResult.branch_name}</span>
                      </div>
                      <div className="verification-result-row">
                        <span className="verification-result-label">City:</span>
                        <span className="verification-result-value">{ifscResult.city}</span>
                      </div>
                      <div className="verification-result-row">
                        <span className="verification-result-label">State:</span>
                        <span className="verification-result-value">{ifscResult.state}</span>
                      </div>
                      <div className="verification-result-row">
                        <span className="verification-result-label">Status:</span>
                        <span className="verification-result-value">
                          {ifscResult.valid ? (
                            <span className="verification-valid-badge">Valid</span>
                          ) : (
                            <span className="verification-invalid-badge">Invalid</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* IFSC Error */}
                {ifscError && (
                  <div className="verification-error">
                    <XCircle size={18} className="verification-error-icon" />
                    <span>{ifscError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Number Verification */}
          <div className="verification-card">
            <div className="verification-card-header">
              <h3 className="verification-card-title">Account Number Verification</h3>
            </div>
            <div className="verification-card-body">
              <div className="verification-input-group">
                <label htmlFor="account-number" className="verification-label">
                  Account Number
                </label>
                <div className="verification-input-wrapper">
                  <input
                    id="account-number"
                    type="text"
                    className="verification-input"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    disabled={verifyingAccount}
                  />
                  <button
                    className="verification-button"
                    onClick={handleAccountNumberVerify}
                    disabled={verifyingAccount || !accountNumber.trim()}
                  >
                    <Search size={16} />
                    {verifyingAccount ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                <p className="verification-hint">
                  Enter account number to verify bank account details
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Verification Section */}
        <div className="location-verification-section">
          <div className="verification-header">
            <h2 className="verification-title">
              <MapPin size={24} />
              Location Verification
            </h2>
            <p className="verification-description">
              View and verify location on Google Maps.
            </p>
          </div>

          <div className="verification-card location-verification-card">
            <div className="location-input-container">
              <div className="verification-input-group">
                <label htmlFor="location-input" className="verification-label">
                  Enter Location
                </label>
                <div className="verification-input-wrapper">
                  <input
                    id="location-input"
                    type="text"
                    className="verification-input"
                    placeholder="Enter location to verify"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="location-link-container">
              <div className="verification-input-group">
                <label htmlFor="maps-link-input" className="verification-label">
                  Google Maps Link
                </label>
                <div className="verification-input-wrapper">
                  <input
                    id="maps-link-input"
                    type="text"
                    className="verification-input"
                    placeholder="Enter Google Maps link to extract coordinates"
                    value={googleMapsLink}
                    onChange={(e) => {
                      setGoogleMapsLink(e.target.value);
                      setCoordinates(null);
                    }}
                  />
                  <button
                    className="verification-button"
                    onClick={handleGetCoordinates}
                    disabled={!googleMapsLink.trim()}
                  >
                    <Navigation size={16} />
                    Get Coordinates
                  </button>
                </div>
                <p className="verification-hint">
                  Paste a Google Maps link to extract latitude and longitude coordinates
                </p>
              </div>

              {/* Coordinates Result */}
              {coordinates && (
                <div className="verification-result">
                  <div className="verification-result-header">
                    <CheckCircle size={18} className="verification-success-icon" />
                    <span className="verification-result-title">Coordinates Extracted</span>
                  </div>
                  <div className="verification-result-content">
                    <div className="verification-result-row">
                      <span className="verification-result-label">Latitude:</span>
                      <span className="verification-result-value">{coordinates.latitude}</span>
                    </div>
                    <div className="verification-result-row">
                      <span className="verification-result-label">Longitude:</span>
                      <span className="verification-result-value">{coordinates.longitude}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="embed-map-fixed">
              <div className="embed-map-container">
                <iframe
                  className="embed-map-frame"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://maps.google.com/maps?width=600&height=400&hl=en&q=${encodeURIComponent(location || 'adhiyamaan college of en')}&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
                  title="Location Verification Map"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;

