const mongoose = require('mongoose')

const { Schema } = mongoose

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  }
)

// Export model
module.exports = mongoose.model('Comment', CommentSchema)
