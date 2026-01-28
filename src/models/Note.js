const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    content: { type: String, required: true, trim: true, minlength: 2, maxlength: 2000 },

    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    tags: [{ type: String, trim: true, lowercase: true }],
    dueDate: { type: Date, default: null },
    isDone: { type: Boolean, default: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);