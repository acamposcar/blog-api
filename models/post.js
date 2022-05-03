const mongoose = require('mongoose')
const formatDistanceToNow = require('date-fns/formatDistanceToNow')

const { Schema } = mongoose

const PostSchema = new Schema(
  {
    title: { type: String, required: true, maxLength: 1000 },
    content: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    published: { type: Boolean, required: true }
  }
)

PostSchema
  .virtual('formatDate')
  .get(function () {
    return formatDistanceToNow(this.date, { addSuffix: true })
  })

// Export model
module.exports = mongoose.model('Post', PostSchema)
