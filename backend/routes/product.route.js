import express from 'express';
import {
    getProduct,
    getProductsByUser,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

// Get all Products
router.get('/', getProduct);

// Get products by user ID
router.get('/user/:userId', getProductsByUser);

// Add a new Product
router.post('/', addProduct);

// Update a Product by ID
router.put('/:id', updateProduct);

// Delete a Product by ID
router.delete('/:id', deleteProduct);

export default router;