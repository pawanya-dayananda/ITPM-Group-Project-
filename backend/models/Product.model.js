import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  ProductType: { type: String, required: true },
  Price: { type: Number, required: true },
  Description: { type: String, required: true },
  image: { type: String },
  Quantity: { type: Number, required: true },
  status: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  Contact: { type: String, required: true },
  userId: { type: String, required: true },
  reviews: [{
    reviewId: { type: String, default: () => new mongoose.Types.ObjectId() },
    userId: { type: String, required: true },
    userName: { type: String },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);