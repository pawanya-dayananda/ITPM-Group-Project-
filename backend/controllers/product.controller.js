import Product from '../models/Product.model.js';
import User from '../models/user.model.js';

// Get all Products
export const getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get products by user ID
export const getProductsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await Product.find({ userId });
    res.json(products);
  } catch (error) {
    console.error("Get user products error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const { ProductName, ProductType, Price, Description, image, Quantity, status, Contact, userId } = req.body;

    // Validation
    if (!ProductName || !ProductType || !Price || !Description || !Quantity || !status || !Contact || !userId) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    const newProduct = new Product({
      ProductName,
      ProductType,
      Price,
      Description,
      image,
      Quantity,
      status,
      Contact,
      userId
    });

    await newProduct.save();
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a Product by ID
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a Product by ID
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add a review to a product
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, comment } = req.body;

    console.log('Adding review to product', id, { userId, rating, comment });

    if (!userId || !rating || !comment) {
      return res.status(400).json({ message: "User ID, rating, and comment are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newReview = { 
      reviewId: new mongoose.Types.ObjectId().toString(),
      userId, 
      userName: user.name, 
      rating, 
      comment 
    };
    product.reviews.push(newReview);
    await product.save();

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a product
export const getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).select('reviews');
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product.reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let review = product.reviews.id(reviewId);
    if (!review) {
      // Fallback if reviewId is custom field
      review = product.reviews.find(r => String(r.reviewId) === reviewId || String(r._id) === reviewId);
    }
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns the review
    if (review.userId !== req.body.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    review.rating = rating;
    review.comment = comment;
    await product.save();

    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    console.log('Attempting delete review', { productId, reviewId, body: req.body });

    const product = await Product.findById(productId);
    if (!product) {
      console.log('Delete review: product not found');
      return res.status(404).json({ message: "Product not found" });
    }

    let review = product.reviews.id(reviewId);
    if (!review) {
      review = product.reviews.find(r => String(r.reviewId) === reviewId || String(r._id) === reviewId);
    }

    if (!review) {
      console.log('Delete review: review not found');
      return res.status(404).json({ message: "Review not found" });
    }

    console.log('Delete review found', { reviewId: review._id, matchedReviewId: review.reviewId, userId: review.userId });

    // Check if user owns the review
    if (review.userId !== req.body.userId) {
      console.log('Delete review: not authorized', { reviewUserId: review.userId, requestUserId: req.body.userId });
      return res.status(403).json({ message: "Not authorized" });
    }

    // Remove review from product review array and save
    product.reviews = product.reviews.filter(r => String(r._id) !== String(review._id) && String(r.reviewId) !== String(review.reviewId));
    await product.save();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: error.message });
  }
};

export {
  getProduct as default
};