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
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);