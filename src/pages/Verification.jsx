import React, { useState } from 'react';
import { CreditCard, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import './Verification.css';

const Verification = () => {
  const [ifscCode, setIfscCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleIfscVerify = async () => {
    if (!ifscCode.trim()) {
      toast.error('Please enter an IFSC code');
      return;
    }

    try {
      setVerifying(true);
      // TODO: Implement IFSC verification API call
      // const response = await verifyIfsc(ifscCode);
      
      // Mock implementation for now
      setTimeout(() => {
        toast.success(`IFSC Code ${ifscCode} verified successfully`);
        setVerifying(false);
      }, 1000);
    } catch (error) {
      toast.error(error?.message || 'Failed to verify IFSC code');
      setVerifying(false);
    }
  };

  const handleAccountNumberVerify = async () => {
    if (!accountNumber.trim()) {
      toast.error('Please enter an account number');
      return;
    }

    try {
      setVerifying(true);
      // TODO: Implement Account Number verification API call
      // const response = await verifyAccountNumber(accountNumber);
      
      // Mock implementation for now
      setTimeout(() => {
        toast.success(`Account Number ${accountNumber} verified successfully`);
        setVerifying(false);
      }, 1000);
    } catch (error) {
      toast.error(error?.message || 'Failed to verify account number');
      setVerifying(false);
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
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    maxLength={11}
                    disabled={verifying}
                  />
                  <button
                    className="verification-button"
                    onClick={handleIfscVerify}
                    disabled={verifying || !ifscCode.trim()}
                  >
                    <Search size={16} />
                    {verifying ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                <p className="verification-hint">
                  Enter 11-character IFSC code to verify bank details
                </p>
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
                    disabled={verifying}
                  />
                  <button
                    className="verification-button"
                    onClick={handleAccountNumberVerify}
                    disabled={verifying || !accountNumber.trim()}
                  >
                    <Search size={16} />
                    {verifying ? 'Verifying...' : 'Verify'}
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

