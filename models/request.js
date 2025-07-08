const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
})

const requestSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  images: [ImageSchema],
  description: String,
  category: {
    type: String,
    enum: ['Medical', 'Education', 'Emergency', 'Other', 'Business', 'Creative', 'Housing'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', requestSchema);
