const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
    default: "63ef9c1d0209c0fa784b9021"
},
  text: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false
  }
},
    {
  timestamps: true
});

const TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = TodoModel;