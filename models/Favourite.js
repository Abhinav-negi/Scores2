import mongoose from 'mongoose';

const FavouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sport: {
    type: String,
    required: true,
    enum: ['cricket', 'f1', 'basketball', 'tennis', 'chess'],
  },
  type: {
    type: String,
    required: true,
    enum: ['team', 'player', 'league'],
  },
  externalId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure a user can't favourite the exact same item twice
FavouriteSchema.index({ userId: 1, sport: 1, type: 1, externalId: 1 }, { unique: true });

export default mongoose.models.Favourite || mongoose.model('Favourite', FavouriteSchema);
