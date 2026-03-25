import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from '../store/userStore';

const ProductFormModal = ({ setModalOpen, fetchProducts, editingProduct, onProductCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const { userId, initializeUser } = useUserStore();
  
  // Initialize user if not exists and get current userId
  const currentUserId = userId || (() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      const newUserId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", newUserId);
      return newUserId;
    }
    return storedUserId;
  })();

  useEffect(() => { 
    if (!userId) {
      initializeUser();
    }
  }, [userId, initializeUser]);

  const [formData, setFormData] = useState({
    ProductName: '',
    ProductType: 'Books & Stationery',
    Price: '',
    Description: '',
    image: '',
    Quantity: '',
    status: 'Available',
    Contact: '',
    userId: currentUserId,
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const currentUserId = useUserStore.getState().userId;
    if (editingProduct) {
      setFormData({
        ProductName: editingProduct.ProductName,
        ProductType: editingProduct.ProductType,
        Price: editingProduct.Price,
        Description: editingProduct.Description,
        image: editingProduct.image || '',
        Quantity: editingProduct.Quantity,
        status: editingProduct.status,
        Contact: editingProduct.Contact,
        userId: editingProduct.userId || currentUserId,
      });
      setImagePreview(editingProduct.image || '');
    } else {
      setFormData({
        ProductName: '',
        ProductType: 'Books & Stationery',
        Price: '',
        Description: '',
        image: '',
        Quantity: '',
        status: 'Available',
        Contact: '',
        userId: currentUserId,
      });
      setImagePreview('');
    }
    setError('');
    setErrors({});
    setTouched({});
  }, [editingProduct]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // ProductName validation
    if (!formData.ProductName.trim()) {
      newErrors.ProductName = 'Product name is required';
      isValid = false;
    } else if (formData.ProductName.trim().length < 2) {
      newErrors.ProductName = 'Product name must be at least 2 characters';
      isValid = false;
    }

    // Price validation
    if (!formData.Price || formData.Price === '') {
      newErrors.Price = 'Price is required';
      isValid = false;
    } else if (parseFloat(formData.Price) < 0) {
      newErrors.Price = 'Price cannot be negative';
      isValid = false;
    }

    // Quantity validation
    if (!formData.Quantity || formData.Quantity === '') {
      newErrors.Quantity = 'Quantity is required';
      isValid = false;
    } else if (parseInt(formData.Quantity) < 0) {
      newErrors.Quantity = 'Quantity cannot be negative';
      isValid = false;
    } else if (!Number.isInteger(parseFloat(formData.Quantity))) {
      newErrors.Quantity = 'Quantity must be a whole number';
      isValid = false;
    }

    // Description validation
    if (!formData.Description.trim()) {
      newErrors.Description = 'Description is required';
      isValid = false;
    } else if (formData.Description.trim().length < 10) {
      newErrors.Description = 'Description must be at least 10 characters';
      isValid = false;
    }

    // Contact validation
    if (!formData.Contact.trim()) {
      newErrors.Contact = 'Contact is required';
      isValid = false;
    } else {
      // Validate contact format (must be exactly 10 digits)
      const contactRegex = /^\d{10}$/;
      if (!contactRegex.test(formData.Contact.trim())) {
        newErrors.Contact = 'Please enter a valid contact number.';
        isValid = false;
      }
    }

    // Image validation (optional but if provided, must be base64)
    if (formData.image && formData.image.trim() && !formData.image.startsWith('data:image')) {
      newErrors.image = 'Please upload a valid image file';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateField = (name, value) => {
    const fieldErrors = { ...errors };
    
    switch (name) {
      case 'ProductName':
        if (!value.trim()) {
          fieldErrors.ProductName = 'Product name is required';
        } else if (value.trim().length < 2) {
          fieldErrors.ProductName = 'Product name must be at least 2 characters';
        } else {
          delete fieldErrors.ProductName;
        }
        break;
      case 'Price':
        if (!value || value === '') {
          fieldErrors.Price = 'Price is required';
        } else if (parseFloat(value) < 0) {
          fieldErrors.Price = 'Price cannot be negative';
        } else {
          delete fieldErrors.Price;
        }
        break;
      case 'Quantity':
        if (!value || value === '') {
          fieldErrors.Quantity = 'Quantity is required';
        } else if (parseInt(value) < 0) {
          fieldErrors.Quantity = 'Quantity cannot be negative';
        } else if (!Number.isInteger(parseFloat(value))) {
          fieldErrors.Quantity = 'Quantity must be a whole number';
        } else {
          delete fieldErrors.Quantity;
        }
        break;
      case 'Description':
        if (!value.trim()) {
          fieldErrors.Description = 'Description is required';
        } else if (value.trim().length < 10) {
          fieldErrors.Description = 'Description must be at least 10 characters';
        } else {
          delete fieldErrors.Description;
        }
        break;
      case 'Contact':
        if (!value.trim()) {
          fieldErrors.Contact = 'Contact is required';
        } else {
          const contactRegex = /^\d{10}$/;
          if (!contactRegex.test(value.trim())) {
            fieldErrors.Contact = 'Please enter a valid contact number.';
          } else {
            delete fieldErrors.Contact;
          }
        }
        break;
      case 'image':
        if (value && value.trim() && !value.startsWith('data:image')) {
          fieldErrors.image = 'Please upload a valid image file';
        } else {
          delete fieldErrors.image;
        }
        break;
      default:
        break;
    }
    
    setErrors(fieldErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate field on change if it was already touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, image: 'Please upload a JPG or PNG image' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size must be less than 5MB' });
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
        // Clear error if exists
        const newErrors = { ...errors };
        delete newErrors.image;
        setErrors(newErrors);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched for validation display
    const allTouched = {
      ProductName: true,
      Price: true,
      Quantity: true,
      Description: true,
      Contact: true,
      image: true,
      ProductType: true,
      status: true,
    };
    setTouched(allTouched);
    
    if (!validateForm()) {
      setError('Please fix the errors in the form before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      const dataToSend = {
        ...formData,
      };
      
      if (editingProduct) {
        response = await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, dataToSend);
      } else {
        response = await axios.post('http://localhost:5000/api/products', dataToSend);
      }
      
      // Call fetchProducts with userId if it's a function
      if (typeof fetchProducts === 'function') {
        try {
          const userId = formData.userId || useUserStore.getState().userId;
          await fetchProducts(userId);
        } catch (err) {
          console.log('Note: fetchProducts may need user context');
        }
      }
      
      // If onProductCreated callback is provided, pass the new/updated product
      if (onProductCreated) {
        onProductCreated(response.data);
      } else {
        setModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.response?.data?.message || 'Error saving product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setModalOpen(false)} />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:align-middle z-[60]"
          >
            <div className="absolute top-0 right-0 pt-4 pr-4 z-[70]">
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 bg-white rounded-full h-8 w-8 flex items-center justify-center hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  {editingProduct ? "Edit Product Details" : "Add New Product"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ProductName"
                        value={formData.ProductName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`block w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out ${touched.ProductName && errors.ProductName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                        placeholder="Enter product name"
                      />
                      {touched.ProductName && errors.ProductName && (
                        <p className="mt-1 text-sm text-red-600">{errors.ProductName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Product Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="ProductType"
                        value={formData.ProductType}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                      >
                        <option value="Books & Stationery">Books & Stationery</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Sport Items">Sport Items</option>
                        <option value="Music Instruments">Music Instruments</option>
                        <option value="Handmade Creations">Handmade Creations</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Price (Sri Lankan Rs.) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="Price"
                        value={formData.Price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        min="0"
                        step="0.01"
                        className={`block w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out ${touched.Price && errors.Price ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                        placeholder="Enter price"
                      />
                      {touched.Price && errors.Price && (
                        <p className="mt-1 text-sm text-red-600">{errors.Price}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        rows="3"
                        className={`block w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out ${touched.Description && errors.Description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                        placeholder="Enter product description"
                      />
                      {touched.Description && errors.Description && (
                        <p className="mt-1 text-sm text-red-600">{errors.Description}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Product Image (JPG or PNG)
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <p className="text-sm text-gray-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">PNG or JPG (Max 5MB)</p>
                          </div>
                          <input
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {touched.image && errors.image && (
                        <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                      )}
                      {imagePreview && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                          <img 
                            src={imagePreview} 
                            alt="Product preview" 
                            className="h-40 w-full object-cover rounded-lg border border-gray-200 shadow-sm" 
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="Quantity"
                        value={formData.Quantity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        min="0"
                        className={`block w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out ${touched.Quantity && errors.Quantity ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                        placeholder="Enter quantity"
                      />
                      {touched.Quantity && errors.Quantity && (
                        <p className="mt-1 text-sm text-red-600">{errors.Quantity}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                      >
                        <option value="Available">Available</option>
                        <option value="Sold">Sold</option>
                        <option value="Reserved">Reserved</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Contact <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="Contact"
                        value={formData.Contact}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`block w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out ${touched.Contact && errors.Contact ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                        placeholder="Enter contact number"
                      />
                      {touched.Contact && errors.Contact && (
                        <p className="mt-1 text-sm text-red-600">{errors.Contact}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 sm:mt-10 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      disabled={isSubmitting}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingProduct ? "Updating..." : "Adding..."}
                        </>
                      ) : (
                        editingProduct ? "Update Product" : "Add Product"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductFormModal;