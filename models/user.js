const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    username: { type: String, required: true, minlength: 3, maxlength: 20, unique: true },
    password: { type: String, required: true, minlength: 4, maxlength: 50 },
    admin: { type: Boolean, required: true, default: false },
    avatar: { type: String }
  }
)

// Export model
module.exports = mongoose.model('User', UserSchema)
