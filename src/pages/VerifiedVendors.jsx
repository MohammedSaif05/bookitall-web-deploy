import React from "react";
import Table from "../components/Table";
import "./VerifiedVendors.css";

const VerifiedVendors = () => {
  // Sample data - replace with actual data from API
  const vendorsData = [
    {
      id: 1,
      serialNo: 1,
      businessName: "ABC Restaurant",
      businessType: "Restaurant",
      businessCategory: "Food & Beverage",
      location: "New York, NY",
      mobileNumber: "+1 234-567-8901",
      status: "Verified",
    },
    {
      id: 2,
      serialNo: 2,
      businessName: "XYZ Hotel",
      businessType: "Hotel",
      businessCategory: "Hospitality",
      location: "Los Angeles, CA",
      mobileNumber: "+1 234-567-8902",
      status: "Verified",
    },
    {
      id: 3,
      serialNo: 3,
      businessName: "Sunset Tours",
      businessType: "Travel Agency",
      businessCategory: "Travel & Tourism",
      location: "Miami, FL",
      mobileNumber: "+1 234-567-8903",
      status: "Verified",
    },
    {
      id: 4,
      serialNo: 4,
      businessName: "City Events",
      businessType: "Event Management",
      businessCategory: "Events",
      location: "Chicago, IL",
      mobileNumber: "+1 234-567-8904",
      status: "Verified",
    },
    {
      id: 5,
      serialNo: 5,
      businessName: "Adventure Sports",
      businessType: "Sports",
      businessCategory: "Recreation",
      location: "Denver, CO",
      mobileNumber: "+1 234-567-8905",
      status: "Verified",
    },
  ];

  const handleView = (row) => {
    console.log("View:", row);
    // Add view logic here
  };

  const columns = [
    {
      key: "serialNo",
      header: "Serial No",
      className: "text-center",
    },
    {
      key: "businessName",
      header: "Business Name",
    },
    {
      key: "businessType",
      header: "Business Type",
    },
    {
      key: "businessCategory",
      header: "Business Category",
    },
    {
      key: "location",
      header: "Location",
    },
    {
      key: "mobileNumber",
      header: "Mobile Number",
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <span className="status-badge status-verified">{value}</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "text-center",
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

  return (
    <div className="verified-vendors-page">
      <div className="page-header">
        <h2>Verified Vendors</h2>
        <p>Manage and view all verified vendors</p>
      </div>
      <div className="table-wrapper">
        <Table columns={columns} data={vendorsData} keyField="id" />
      </div>
    </div>
  );
};

export default VerifiedVendors;

