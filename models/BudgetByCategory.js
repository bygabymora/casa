import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    category: { type: String, required: false },
    budget: { type: Number, default: 0, required: false },
    spent: { type: Number, default: 0, required: false },
    transactions: [
      {
        transactionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: 'Transaction',
        },
        value: { type: Number, default: 0, required: false },
        date: { type: Date, required: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const BudgetByCategory =
  mongoose.models.BudgetByCategory ||
  mongoose.model('BudgetByCategory', budgetSchema);

export default BudgetByCategory;
