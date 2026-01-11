import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaSync, FaEdit } from 'react-icons/fa';
import { Plus, X } from 'lucide-react';
import Loading from '../components/common/Loading';
import { useCachedApi } from '../hooks/useCachedApi';
import { getCategories, uploadCategoryImage, addCategory, updateCategory } from '../api/categories';
import { CACHE_KEYS } from '../utils/cache';
import { formatDate } from '../utils/helpers';
import './Categories.css';

const Categories = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryOrder, setCategoryOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
    setEditingCategory(null);
    setShowAddModal(true);
    setCategoryName('');
    setSelectedImage(null);
    setImagePreview(null);
    setCategoryOrder(0);
    setIsActive(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowAddModal(true);
    setCategoryName(category.name || '');
    setSelectedImage(null);
    setImagePreview(category.image || null);
    setCategoryOrder(category.order !== undefined ? category.order : 0);
    setIsActive(category.isActive !== undefined ? category.isActive : true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setCategoryName('');
    setSelectedImage(null);
    setImagePreview(null);
    setCategoryOrder(0);
    setIsActive(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmAdd = async () => {
    // Validate inputs
    if (!categoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    if (editingCategory) {
      // Edit mode
      try {
        setUploading(true);

        let imageUrl = editingCategory.image; // Use existing image by default

        // If a new image is selected, upload it first
        if (selectedImage) {
          const uploadResponse = await uploadCategoryImage(selectedImage);
          
          if (!uploadResponse.success || !uploadResponse.data?.imageUrl) {
            throw new Error(uploadResponse.message || 'Failed to upload image');
          }

          imageUrl = uploadResponse.data.imageUrl;
        }

        // Prepare update data
        const updateData = {
          name: categoryName.trim(),
          image: imageUrl,
          order: categoryOrder,
          isActive: isActive,
        };

        // Update category
        await updateCategory(editingCategory._id, updateData);

        toast.success('Category updated successfully!');
        
        // Close modal and refresh list
        handleCloseModal();
        await refetch(true);
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.message || 'Failed to update category');
      } finally {
        setUploading(false);
      }
    } else {
      // Add mode
      if (!selectedImage) {
        toast.error('Please select an image');
        return;
      }

      try {
        setUploading(true);

        // Step 1: Upload image
        const uploadResponse = await uploadCategoryImage(selectedImage);
        
        if (!uploadResponse.success || !uploadResponse.data?.imageUrl) {
          throw new Error(uploadResponse.message || 'Failed to upload image');
        }

        const imageUrl = uploadResponse.data.imageUrl;

        // Step 2: Calculate order (count of existing categories)
        const categories = categoriesData || [];
        const order = categories.length;

        // Step 3: Add category
        await addCategory({
          name: categoryName.trim(),
          image: imageUrl,
          order: order,
        });

        toast.success('Category added successfully!');
        
        // Close modal and refresh list
        handleCloseModal();
        await refetch(true);
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.message || 'Failed to add category');
      } finally {
        setUploading(false);
      }
    }
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
                    onClick={() => handleEditCategory(category)}
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

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content add-category-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="add-category-form">
                <div className="form-group">
                  <label htmlFor="category-name" className="form-label">
                    Category Name <span className="required">*</span>
                  </label>
                  <input
                    id="category-name"
                    type="text"
                    className="form-input"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    disabled={uploading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category-image" className="form-label">
                    Category Image {!editingCategory && <span className="required">*</span>}
                  </label>
                  <input
                    id="category-image"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="form-file-input"
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                  {imagePreview && (
                    <div className="image-preview-container">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="category-order" className="form-label">
                    Order
                  </label>
                  <input
                    id="category-order"
                    type="number"
                    className="form-input"
                    placeholder="Enter order"
                    value={categoryOrder}
                    onChange={(e) => setCategoryOrder(parseInt(e.target.value) || 0)}
                    disabled={uploading}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      disabled={uploading}
                      className="form-checkbox"
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div className="modal-actions">
                  <button
                    className="modal-action-btn modal-action-btn-cancel"
                    onClick={handleCloseModal}
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    className="modal-action-btn modal-action-btn-confirm"
                    onClick={handleConfirmAdd}
                    disabled={uploading || !categoryName.trim() || (!editingCategory && !selectedImage)}
                  >
                    {uploading ? (editingCategory ? 'Updating...' : 'Adding...') : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

