import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/products"
    : "/api/products";

export const useProductStore = create((set) => ({
  products: [],
  filteredProducts: [],
  userProducts: [],
  loading: false,
  error: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ products: response.data, filteredProducts: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching products", loading: false });
      throw error;
    }
  },

  // Fetch products by user ID
  fetchUserProducts: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      set({ userProducts: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching user products", loading: false });
      throw error;
    }
  },

  // Add new product
  addProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(API_URL, productData);
      set(state => ({ 
        products: [...state.products, response.data],
        filteredProducts: [...state.products, response.data],
        userProducts: [...state.userProducts, response.data],
        loading: false 
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error adding product", loading: false });
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, productData);
      set(state => ({
        products: state.products.map(product => 
          product._id === id ? response.data : product
        ),
        filteredProducts: state.filteredProducts.map(product => 
          product._id === id ? response.data : product
        ),
        userProducts: state.userProducts.map(product => 
          product._id === id ? response.data : product
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error updating product", loading: false });
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set(state => ({
        products: state.products.filter(product => product._id !== id),
        filteredProducts: state.filteredProducts.filter(product => product._id !== id),
        userProducts: state.userProducts.filter(product => product._id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error deleting product", loading: false });
      throw error;
    }
  },

  // Filter products
  filterProducts: (filters) => {
    set(state => {
      let filtered = [...state.products];

      // Apply ProductType filter
      if (filters.ProductType) {
        filtered = filtered.filter(product => product.ProductType === filters.ProductType);
      }

      // Apply price range filters
      if (filters.minPrice || filters.maxPrice) {
        filtered = filtered.filter(product => {
          const price = product.Price;
          const minPrice = parseFloat(filters.minPrice) || 0;
          const maxPrice = parseFloat(filters.maxPrice) || Number.MAX_SAFE_INTEGER;
          return price >= minPrice && price <= maxPrice;
        });
      }

      // Apply status filter
      if (filters.status) {
        filtered = filtered.filter(product => product.status === filters.status);
      }

      return { filteredProducts: filtered };
    });
  }
}));