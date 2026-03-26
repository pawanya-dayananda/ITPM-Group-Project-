import express from 'express';
import {
    getProduct,
    getProductsByUser,
    addProduct,
    updateProduct,
    deleteProduct,
    addReview,
    getReviews,
    updateReview,
    deleteReview
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

// Add a review to a product
router.post('/:id/reviews', addReview);

// Get reviews for a product
router.get('/:id/reviews', getReviews);

// Update a review
router.put('/:productId/reviews/:reviewId', updateReview);

// Delete a review
router.delete('/:productId/reviews/:reviewId', deleteReview);

export default router;