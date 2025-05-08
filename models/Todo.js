const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],  
    default: 'pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;
