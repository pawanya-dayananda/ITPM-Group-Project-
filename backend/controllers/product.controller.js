import Product from '../models/Product.model.js';

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

export {
  getProduct as default
};