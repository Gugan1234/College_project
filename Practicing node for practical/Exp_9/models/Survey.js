// models/Survey.js
const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  responses: { type: Map, of: Number, default: {} } // stores votes
});

module.exports = mongoose.model('Survey', surveySchema);
