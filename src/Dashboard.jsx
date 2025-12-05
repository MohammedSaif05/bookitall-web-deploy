import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LayoutDashboard, Store, LogOut } from 'lucide-react';
import { FaUserCheck, FaClock, FaChevronDown, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import logoImg from './assets/logo.png';
import sidebarLogo from './assets/sidebarlogo.png';
import VerifiedVendors from './pages/VerifiedVendors';
import PendingVendors from './pages/PendingVendors';
import VendorDetails from './pages/VendorDetails';
import { useAuth } from './contexts/AuthContext';
import { ROUTES } from './utils/constants';
import { getPageTitle, isVendorPage } from './utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const vendorPage = isVendorPage(location.pathname);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(vendorPage);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setVendorDropdownOpen(vendorPage);
  }, [vendorPage]);

  useEffect(() => {
    if (!isOpen) {
      setVendorDropdownOpen(false);
    } else {
      setVendorDropdownOpen(vendorPage);
    }
  }, [isOpen, vendorPage]);

  const handleLogout = () => {
    // Show success toast
    toast.success('Logged out successfully!');
    
    // Clear auth state
    logout();
    
    // Navigate to login page after a short delay
    setTimeout(() => {
      navigate(ROUTES.LOGIN);
    }, 500);
  };

  const getPageContent = () => {
    if (location.pathname.includes('/onboarding')) {
      return {
        title: 'Verified Vendors',
        description: 'Manage verified vendors here.',
      };
    }
    if (location.pathname.includes('/pending')) {
      return {
        title: 'Vendor Pending',
        description: 'View and manage pending vendor requests.',
      };
    }
    return {
      title: 'Welcome to Dashboard',
      description: 'This is your main dashboard page.',
    };
  };

  const content = getPageContent();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className={`dashboard-container ${!isOpen ? "sidebar-collapsed" : ""}`}>
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
            {isOpen ? (
              <FaChevronLeft size={14} />
            ) : (
              <FaChevronRight size={14} />
            )}
          </button>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${location.pathname === ROUTES.DASHBOARD ? 'active' : ''}`}
            onClick={() => navigate(ROUTES.DASHBOARD)}
            title={!isOpen ? 'Dashboard' : ''}
          >
            <LayoutDashboard className="sidebar-icon" size={20} />
            {isOpen && <span>Dashboard</span>}
          </button>
          <div className="sidebar-dropdown">
            <button
              className={`sidebar-item sidebar-item-dropdown ${vendorPage ? 'active' : ''}`}
              onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
              title={!isOpen ? 'Vendor' : ''}
            >
              <Store className="sidebar-icon" size={20} />
              {isOpen && (
                <span className="sidebar-item-label">
                  <span>Vendor</span>
                  <span className="dropdown-arrow">
                    {vendorDropdownOpen ? (
                      <FaChevronDown size={12} />
                    ) : (
                      <FaChevronRight size={12} />
                    )}
                  </span>
                </span>
              )}
            </button>
            {vendorDropdownOpen && (
              <div className={`dropdown-menu ${!isOpen ? 'dropdown-menu-collapsed' : ''}`}>
                <button
                  className={`dropdown-item ${location.pathname.includes('/onboarding') ? 'active' : ''}`}
                  onClick={() => navigate(ROUTES.VENDOR_ONBOARDING)}
                >
                  <FaUserCheck size={14} className="dropdown-icon" />
                  <span>Verified Vendors</span>
                </button>
                <button
                  className={`dropdown-item ${location.pathname.includes('/pending') ? 'active' : ''}`}
                  onClick={() => navigate(ROUTES.VENDOR_PENDING)}
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
          <h1>{pageTitle}</h1>
        </header>
        <div className="dashboard-content">
          {location.pathname.includes('/vendor/details/') ? (
            <VendorDetails />
          ) : location.pathname.includes('/onboarding') ? (
            <VerifiedVendors />
          ) : location.pathname.includes('/pending') ? (
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

