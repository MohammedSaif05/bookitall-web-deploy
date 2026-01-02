import React, { useState } from 'react';
import { CreditCard, Search, CheckCircle, XCircle } from 'lucide-react';
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
      </div>
    </div>
  );
};

export default Verification;

