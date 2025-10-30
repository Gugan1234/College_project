const mongoose = require('mongoose');
const leaveSchema = new mongoose.Schema({
  employeeName: String,
  startDate: Date,
  endDate: Date,
  reason: String,
  status: { type: String, default: 'Pending' }
});
module.exports = mongoose.model('Leave', leaveSchema);
