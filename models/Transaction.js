import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    slug: { type: String, required: false, unique: true },
    store: { type: String, required: false },
    value: { type: Number, default: 0, required: false },
    paymentType: { type: String, required: false },
    typeOfPurchase: { type: String, required: false },
    notes: { type: String, required: false },
    date: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model('Transaction', transactionSchema);

export default Transaction;
