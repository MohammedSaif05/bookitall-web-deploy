import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LayoutDashboard, Store, LogOut, ShieldCheck, CheckSquare, Tags, Gift } from 'lucide-react';
import { FaUserCheck, FaClock, FaChevronDown, FaChevronRight, FaChevronLeft, FaRocket, FaInbox } from 'react-icons/fa';
import logoImg from './assets/logo.png';
import sidebarLogo from './assets/sidebarlogo.png';
import VerifiedVendors from './pages/VerifiedVendors';
import PendingVendors from './pages/PendingVendors';
import VendorDetails from './pages/VendorDetails';
import VerifiedVendorDetails from './pages/VerifiedVendorDetails';
import Verification from './pages/Verification';
import ServiceApprovals from './pages/ServiceApprovals';
import Categories from './pages/Categories';
import Production from './pages/Production';
import PromotionRequests from './pages/PromotionRequests';
import { useAuth } from './contexts/AuthContext';
import { ROUTES } from './utils/constants';
import { getPageTitle, isVendorPage, isPromotionPage } from './utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const vendorPage = isVendorPage(location.pathname);
  const promotionPage = isPromotionPage(location.pathname);
  const [isOpen, setIsOpen] = useState(true);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(vendorPage);
  const [promotionDropdownOpen, setPromotionDropdownOpen] = useState(promotionPage);
  const vendorButtonRef = useRef(null);
  const promotionButtonRef = useRef(null);
  const vendorDropdownMenuRef = useRef(null);
  const promotionDropdownMenuRef = useRef(null);
  const [vendorDropdownTop, setVendorDropdownTop] = useState(0);
  const [promotionDropdownTop, setPromotionDropdownTop] = useState(0);

  // Sync dropdown state with page navigation and sidebar state
  // Using useLayoutEffect to sync state before paint to avoid flicker
  React.useLayoutEffect(() => {
    const shouldVendorBeOpen = isOpen && vendorPage;
    const shouldPromotionBeOpen = isOpen && promotionPage;
    
    if (vendorDropdownOpen !== shouldVendorBeOpen) {
      setVendorDropdownOpen(shouldVendorBeOpen);
    }
    if (promotionDropdownOpen !== shouldPromotionBeOpen) {
      setPromotionDropdownOpen(shouldPromotionBeOpen);
    }
  }, [isOpen, vendorPage, promotionPage, vendorDropdownOpen, promotionDropdownOpen]);

  useEffect(() => {
    if (vendorButtonRef.current && !isOpen && vendorDropdownOpen) {
      const rect = vendorButtonRef.current.getBoundingClientRect();
      setVendorDropdownTop(rect.top);
    }
    if (promotionButtonRef.current && !isOpen && promotionDropdownOpen) {
      const rect = promotionButtonRef.current.getBoundingClientRect();
      setPromotionDropdownTop(rect.top);
    }
  }, [vendorDropdownOpen, promotionDropdownOpen, isOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        vendorDropdownOpen &&
        vendorButtonRef.current &&
        vendorDropdownMenuRef.current &&
        !vendorButtonRef.current.contains(event.target) &&
        !vendorDropdownMenuRef.current.contains(event.target)
      ) {
        setVendorDropdownOpen(false);
      }
      if (
        promotionDropdownOpen &&
        promotionButtonRef.current &&
        promotionDropdownMenuRef.current &&
        !promotionButtonRef.current.contains(event.target) &&
        !promotionDropdownMenuRef.current.contains(event.target)
      ) {
        setPromotionDropdownOpen(false);
      }
    };

    if (vendorDropdownOpen || promotionDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [vendorDropdownOpen, promotionDropdownOpen]);

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
    if (location.pathname.includes('/verification')) {
      return {
        title: 'Verification',
        description: 'Verify IFSC codes and account numbers.',
      };
    }
    if (location.pathname.includes('/services/approvals')) {
      return {
        title: 'Services Approvals',
        description: 'Review and approve service requests.',
      };
    }
    if (location.pathname.includes('/promotions/production')) {
      return {
        title: 'Production Promotions',
        description: 'View all active promotions.',
      };
    }
    if (location.pathname.includes('/promotions/requests')) {
      return {
        title: 'Promotion Requests',
        description: 'View and manage promotion requests.',
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
          <button
            className={`sidebar-item ${location.pathname === ROUTES.VERIFICATION ? 'active' : ''}`}
            onClick={() => navigate(ROUTES.VERIFICATION)}
            title={!isOpen ? 'Verification' : ''}
          >
            <ShieldCheck className="sidebar-icon" size={20} />
            {isOpen && <span>Verification</span>}
          </button>
          <button
            className={`sidebar-item ${location.pathname === ROUTES.SERVICE_APPROVALS ? 'active' : ''}`}
            onClick={() => navigate(ROUTES.SERVICE_APPROVALS)}
            title={!isOpen ? 'Services Approvals' : ''}
          >
            <CheckSquare className="sidebar-icon" size={20} />
            {isOpen && <span>Services Approvals</span>}
          </button>
          <button
            className={`sidebar-item ${location.pathname === ROUTES.CATEGORIES ? 'active' : ''}`}
            onClick={() => navigate(ROUTES.CATEGORIES)}
            title={!isOpen ? 'Categories' : ''}
          >
            <Tags className="sidebar-icon" size={20} />
            {isOpen && <span>Categories</span>}
          </button>
          <div className="sidebar-dropdown">
            <button
              ref={promotionButtonRef}
              className={`sidebar-item sidebar-item-dropdown ${promotionPage ? 'active' : ''}`}
              onClick={() => setPromotionDropdownOpen(!promotionDropdownOpen)}
              title={!isOpen ? 'Promotions' : ''}
            >
              <Gift className="sidebar-icon" size={20} />
              {isOpen && (
                <span className="sidebar-item-label">
                  <span>Promotions</span>
                  <span className="dropdown-arrow">
                    {promotionDropdownOpen ? (
                      <FaChevronDown size={12} />
                    ) : (
                      <FaChevronRight size={12} />
                    )}
                  </span>
                </span>
              )}
            </button>
            {promotionDropdownOpen && (
              <div 
                ref={promotionDropdownMenuRef}
                className={`dropdown-menu ${!isOpen ? 'dropdown-menu-collapsed' : ''}`}
                style={!isOpen ? { top: `${promotionDropdownTop}px` } : {}}
              >
                <button
                  className={`dropdown-item ${location.pathname.includes('/promotions/production') ? 'active' : ''}`}
                  onClick={() => {
                    setPromotionDropdownOpen(false);
                    navigate(ROUTES.PROMOTIONS_PRODUCTION);
                  }}
                >
                  <FaRocket size={14} className="dropdown-icon" />
                  <span>Production</span>
                </button>
                <button
                  className={`dropdown-item ${location.pathname.includes('/promotions/requests') ? 'active' : ''}`}
                  onClick={() => {
                    setPromotionDropdownOpen(false);
                    navigate(ROUTES.PROMOTIONS_REQUESTS);
                  }}
                >
                  <FaInbox size={14} className="dropdown-icon" />
                  <span>Requests</span>
                </button>
              </div>
            )}
          </div>
          <div className="sidebar-dropdown">
            <button
              ref={vendorButtonRef}
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
              <div 
                ref={vendorDropdownMenuRef}
                className={`dropdown-menu ${!isOpen ? 'dropdown-menu-collapsed' : ''}`}
                style={!isOpen ? { top: `${vendorDropdownTop}px` } : {}}
              >
                <button
                  className={`dropdown-item ${location.pathname.includes('/onboarding') ? 'active' : ''}`}
                  onClick={() => {
                    setVendorDropdownOpen(false);
                    navigate(ROUTES.VENDOR_ONBOARDING);
                  }}
                >
                  <FaUserCheck size={14} className="dropdown-icon" />
                  <span>Verified Vendors</span>
                </button>
                <button
                  className={`dropdown-item ${location.pathname.includes('/pending') ? 'active' : ''}`}
                  onClick={() => {
                    setVendorDropdownOpen(false);
                    navigate(ROUTES.VENDOR_PENDING);
                  }}
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
          ) : location.pathname.includes('/vendor/verified/') ? (
            <VerifiedVendorDetails />
          ) : location.pathname.includes('/onboarding') ? (
            <VerifiedVendors />
          ) : location.pathname.includes('/pending') ? (
            <PendingVendors />
          ) : location.pathname.includes('/verification') ? (
            <Verification />
          ) : location.pathname.includes('/services/approvals') ? (
            <ServiceApprovals />
          ) : location.pathname.includes('/categories') ? (
            <Categories />
          ) : location.pathname.includes('/promotions/production') ? (
            <Production />
          ) : location.pathname.includes('/promotions/requests') ? (
            <PromotionRequests />
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

