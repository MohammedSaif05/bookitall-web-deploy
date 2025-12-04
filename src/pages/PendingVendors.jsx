import React from "react";
import Table from "../components/Table";
import "./PendingVendors.css";

const PendingVendors = () => {
  // Sample data - replace with actual data from API
  const vendorsData = [
    {
      id: 1,
      serialNo: 1,
      businessName: "New Restaurant",
      businessType: "Restaurant",
      businessCategory: "Food & Beverage",
      location: "Boston, MA",
      mobileNumber: "+1 234-567-8906",
      status: "Pending",
    },
    {
      id: 2,
      serialNo: 2,
      businessName: "Grand Hotel",
      businessType: "Hotel",
      businessCategory: "Hospitality",
      location: "Seattle, WA",
      mobileNumber: "+1 234-567-8907",
      status: "Pending",
    },
    {
      id: 3,
      serialNo: 3,
      businessName: "Ocean Tours",
      businessType: "Travel Agency",
      businessCategory: "Travel & Tourism",
      location: "San Diego, CA",
      mobileNumber: "+1 234-567-8908",
      status: "Pending",
    },
    {
      id: 4,
      serialNo: 4,
      businessName: "Party Planners",
      businessType: "Event Management",
      businessCategory: "Events",
      location: "Austin, TX",
      mobileNumber: "+1 234-567-8909",
      status: "Pending",
    },
    {
      id: 5,
      serialNo: 5,
      businessName: "Mountain Adventures",
      businessType: "Sports",
      businessCategory: "Recreation",
      location: "Portland, OR",
      mobileNumber: "+1 234-567-8910",
      status: "Pending",
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
        <span className="status-badge status-pending">{value}</span>
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
    <div className="pending-vendors-page">
      <div className="page-header">
        <h2>Pending Vendors</h2>
        <p>Review and manage pending vendor requests</p>
      </div>
      <div className="table-wrapper">
        <Table columns={columns} data={vendorsData} keyField="id" />
      </div>
    </div>
  );
};

export default PendingVendors;

