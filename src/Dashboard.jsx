import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Store, LogOut } from "lucide-react";
import logoImg from "./assets/logo.png";
import VerifiedVendors from "./pages/VerifiedVendors";
import PendingVendors from "./pages/PendingVendors";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isVendorPage = location.pathname.includes("/vendor");
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(isVendorPage);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setVendorDropdownOpen(isVendorPage);
  }, [isVendorPage]);

  useEffect(() => {
    if (sidebarCollapsed) {
      setVendorDropdownOpen(false);
    } else {
      setVendorDropdownOpen(isVendorPage);
    }
  }, [sidebarCollapsed, isVendorPage]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const getPageTitle = () => {
    if (location.pathname.includes("/onboarding")) return "Verified Vendors";
    if (location.pathname.includes("/pending")) return "Vendor Pending";
    return "Dashboard";
  };

  const getPageContent = () => {
    if (location.pathname.includes("/onboarding")) {
      return {
        title: "Verified Vendors",
        description: "Manage verified vendors here.",
      };
    }
    if (location.pathname.includes("/pending")) {
      return {
        title: "Vendor Pending",
        description: "View and manage pending vendor requests.",
      };
    }
    return {
      title: "Welcome to Dashboard",
      description: "This is your main dashboard page.",
    };
  };

  const content = getPageContent();

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <img src={logoImg} alt="Bookitall logo" className="sidebar-logo" />
          )}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? "▶" : "◀"}
          </button>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${location.pathname === "/dashboard" ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
            title={sidebarCollapsed ? "Dashboard" : ""}
          >
            <LayoutDashboard className="sidebar-icon" size={20} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>
          <div className="sidebar-dropdown">
            <button
              className={`sidebar-item sidebar-item-dropdown ${isVendorPage ? "active" : ""}`}
              onClick={() => !sidebarCollapsed && setVendorDropdownOpen(!vendorDropdownOpen)}
              title={sidebarCollapsed ? "Vendor" : ""}
            >
              <Store className="sidebar-icon" size={20} />
              {!sidebarCollapsed && (
                <>
                  <span>Vendor</span>
                  <span className="dropdown-arrow">
                    {vendorDropdownOpen ? "▼" : "▶"}
                  </span>
                </>
              )}
            </button>
            {vendorDropdownOpen && !sidebarCollapsed && (
              <div className="dropdown-menu">
                <button
                  className={`dropdown-item ${location.pathname.includes("/onboarding") ? "active" : ""}`}
                  onClick={() => navigate("/dashboard/vendor/onboarding")}
                >
                  Verified Vendors
                </button>
                <button
                  className={`dropdown-item ${location.pathname.includes("/pending") ? "active" : ""}`}
                  onClick={() => navigate("/dashboard/vendor/pending")}
                >
                  Pending
                </button>
              </div>
            )}
          </div>
        </nav>
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
            title={sidebarCollapsed ? "Logout" : ""}
          >
            <LogOut className="logout-icon" size={18} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{getPageTitle()}</h1>
        </header>
        <div className="dashboard-content">
          {location.pathname.includes("/onboarding") ? (
            <VerifiedVendors />
          ) : location.pathname.includes("/pending") ? (
            <PendingVendors />
          ) : (
            <div className="dashboard-card">
              <h2>{content.title}</h2>
              <p>{content.description}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

