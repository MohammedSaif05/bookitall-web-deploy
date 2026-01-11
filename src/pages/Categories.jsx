import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaSync, FaEdit } from 'react-icons/fa';
import { Plus } from 'lucide-react';
import Loading from '../components/common/Loading';
import { useCachedApi } from '../hooks/useCachedApi';
import { getCategories } from '../api/categories';
import { CACHE_KEYS } from '../utils/cache';
import { formatDate } from '../utils/helpers';
import './Categories.css';

const Categories = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { data: categoriesData, loading, error, refetch } = useCachedApi(
    getCategories,
    CACHE_KEYS.CATEGORIES_LIST
  );

  // Show error toast if API call fails
  React.useEffect(() => {
    if (error) {
      toast.error(error || 'Failed to load categories');
    }
  }, [error]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch(true);
      toast.success('Categories list refreshed successfully');
    } catch {
      toast.error('Failed to refresh categories list');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddCategory = () => {
    // Functionality to be implemented later
    toast.info('Add category functionality will be implemented soon');
  };

  const handleEditCategory = () => {
    // Functionality to be implemented later
    // category parameter will be used when edit functionality is implemented
    toast.info('Edit category functionality will be implemented soon');
  };

  if (loading && !categoriesData) {
    return (
      <div className="categories-page">
        <Loading fullScreen />
      </div>
    );
  }

  if (error && !categoriesData) {
    return (
      <div className="categories-page">
        <div className="page-header">
          <h2>Categories</h2>
          <p>Manage business categories</p>
        </div>
        <div className="error-message">
          <p>Error loading categories: {error}</p>
        </div>
      </div>
    );
  }

  const categories = categoriesData || [];

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>Categories</h2>
            <p>Manage business categories</p>
          </div>
          <div className="header-actions">
            <button
              className="add-category-button"
              onClick={handleAddCategory}
              title="Add Category"
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
            <button
              className="refresh-button"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              title="Refresh categories list"
            >
              <FaSync className={refreshing ? 'spinning' : ''} size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
          <p>No categories found.</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category._id} className="category-card">
              <div className="category-image-container">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="category-image-placeholder">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className="category-content">
                <div className="category-header">
                  <h3 className="category-name">{category.name || 'N/A'}</h3>
                  <span className={`category-status ${category.isActive ? 'active' : 'inactive'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="category-details">
                  <div className="category-detail-item">
                    <label>Slug:</label>
                    <span>{category.slug || 'N/A'}</span>
                  </div>
                  {category.order !== undefined && (
                    <div className="category-detail-item">
                      <label>Order:</label>
                      <span>{category.order}</span>
                    </div>
                  )}
                  {category.createdAt && (
                    <div className="category-detail-item">
                      <label>Created:</label>
                      <span>{formatDate(category.createdAt)}</span>
                    </div>
                  )}
                </div>
                <div className="category-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditCategory()}
                    title="Edit Category"
                  >
                    <FaEdit size={14} />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

