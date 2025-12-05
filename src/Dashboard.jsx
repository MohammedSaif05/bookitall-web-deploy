import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Store, LogOut } from "lucide-react";
import { FaUserCheck, FaClock } from "react-icons/fa";
import logoImg from "./assets/logo.png";
import sidebarLogo from "./assets/sidebarlogo.png";
import VerifiedVendors from "./pages/VerifiedVendors";
import PendingVendors from "./pages/PendingVendors";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isVendorPage = location.pathname.includes("/vendor");
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(isVendorPage);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setVendorDropdownOpen(isVendorPage);
  }, [isVendorPage]);

  useEffect(() => {
    if (!isOpen) {
      setVendorDropdownOpen(false);
    } else {
      setVendorDropdownOpen(isVendorPage);
    }
  }, [isOpen, isVendorPage]);

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
      <aside className={`sidebar ${!isOpen ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <img
            src={isOpen ? logoImg : sidebarLogo}
            alt="Bookitall logo"
            className={`sidebar-logo ${isOpen ? "sidebar-logo-open" : "sidebar-logo-closed"}`}
          />
          <button
            className="sidebar-toggle"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            {isOpen ? "◀" : "▶"}
          </button>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${location.pathname === "/dashboard" ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
            title={!isOpen ? "Dashboard" : ""}
          >
            <LayoutDashboard className="sidebar-icon" size={20} />
            {isOpen && <span>Dashboard</span>}
          </button>
          <div className="sidebar-dropdown">
            <button
              className={`sidebar-item sidebar-item-dropdown ${isVendorPage ? "active" : ""}`}
              onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
              title={!isOpen ? "Vendor" : ""}
            >
              <Store className="sidebar-icon" size={20} />
              {isOpen && (
                <>
                  <span className="sidebar-item-label">Vendor</span>
                  <span className="dropdown-arrow">
                    {vendorDropdownOpen ? "▼" : "▶"}
                  </span>
                </>
              )}
            </button>
            {vendorDropdownOpen && (
              <div className={`dropdown-menu ${!isOpen ? "dropdown-menu-collapsed" : ""}`}>
                <button
                  className={`dropdown-item ${location.pathname.includes("/onboarding") ? "active" : ""}`}
                  onClick={() => navigate("/dashboard/vendor/onboarding")}
                >
                  <FaUserCheck size={14} className="dropdown-icon" />
                  <span>Verified Vendors</span>
                </button>
                <button
                  className={`dropdown-item ${location.pathname.includes("/pending") ? "active" : ""}`}
                  onClick={() => navigate("/dashboard/vendor/pending")}
                >
                  <FaClock size={14} className="dropdown-icon" />
                  <span>Pending</span>
                </button>
              </div>
            )}
          </div>
        </nav>
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
            title={!isOpen ? "Logout" : ""}
          >
            <LogOut className="logout-icon" size={18} />
            {isOpen && <span>Logout</span>}
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

