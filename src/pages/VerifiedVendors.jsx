import React from 'react';
import Table from '../components/Table';
import Loading from '../components/common/Loading';
import { SkeletonTable } from '../components/common/Skeleton';
import { useApi } from '../hooks/useApi';
import { getVerifiedVendors } from '../api/vendors';
import { VENDOR_STATUS } from '../utils/constants';
import './VerifiedVendors.css';

const VerifiedVendors = () => {
  const { data: vendorsData, loading, error } = useApi(getVerifiedVendors);

  // eslint-disable-next-line no-unused-vars
  const handleView = (row) => {
    // TODO: Implement view modal or navigation to detail page
    // For now, this is a placeholder
    // You can add a modal or navigate to detail page here
    // row parameter will be used when implementing the view functionality
  };

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
      key: 'businessType',
      header: 'Business Type',
    },
    {
      key: 'businessCategory',
      header: 'Business Category',
    },
    {
      key: 'location',
      header: 'Location',
    },
    {
      key: 'mobileNumber',
      header: 'Mobile Number',
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className="status-badge status-verified">{value}</span>
      ),
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
      <div className="verified-vendors-page">
        <div className="page-header">
          <h2>Verified Vendors</h2>
          <p>Manage and view all verified vendors</p>
        </div>
        <div className="table-wrapper">
          <SkeletonTable rows={5} columns={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verified-vendors-page">
        <div className="page-header">
          <h2>Verified Vendors</h2>
          <p>Manage and view all verified vendors</p>
        </div>
        <div className="error-message">
          <p>Error loading vendors: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verified-vendors-page">
      <div className="page-header">
        <h2>Verified Vendors</h2>
        <p>Manage and view all verified vendors</p>
      </div>
      <div className="table-wrapper">
        <Table columns={columns} data={vendorsData || []} keyField="id" />
      </div>
    </div>
  );
};

export default VerifiedVendors;

