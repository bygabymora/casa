import mongoose from 'mongoose';

const mesadaSchema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      name: { type: String, required: true },
    },
    currentAmount: { type: Number, default: 0, required: false },
    latestDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Mesada = mongoose.models.Mesada || mongoose.model('Mesada', mesadaSchema);

export default Mesada;
