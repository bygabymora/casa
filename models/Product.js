import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    store: { type: String, required: true },
    value: { type: Number, default: 0, required: true },
    paymentType: { type: String, required: true },
    typeOfPurchase: { type: String, required: true },
    notes: { type: String, required: false },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
