const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional
  bloodType: { type: String, required: true },
  unitsNeeded: { type: Number, default: 1, min: 1 },
  urgency: { 
    type: String, 
    enum: ['emergency', 'urgent', 'normal'], 
    default: 'normal' 
  },
  message: { type: String, default: '' },
  patientName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'completed', 'expired'],
    default: 'pending' 
  },
  contactPhone: { type: String, required: true },
  acceptedAt: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DonationRequest', donationRequestSchema);
