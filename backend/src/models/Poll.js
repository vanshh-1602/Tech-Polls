const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    minlength: [5, 'Question must be at least 5 characters']
  },
  option1: {
    type: String,
    required: [true, 'Option 1 is required'],
    trim: true,
    minlength: [1, 'Option 1 cannot be empty']
  },
  option2: {
    type: String,
    required: [true, 'Option 2 is required'],
    trim: true,
    minlength: [1, 'Option 2 cannot be empty']
  },
  votes1: {
    type: Number,
    default: 0
  },
  votes2: {
    type: Number,
    default: 0
  },
  voters: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    option: {
      type: Number,
      enum: [1, 2]
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Poll', pollSchema);
