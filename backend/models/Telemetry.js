const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  operation: { type: String, required: true }, // e.g., 'FETCH_EMAILS', 'PROCESS_EMAILS'
  count: { type: Number, default: 0 },
  durationMs: { type: Number },
  status: { type: String, enum: ['SUCCESS', 'FAILURE'], required: true },
  error: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Telemetry', telemetrySchema);
