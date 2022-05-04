const Comment = require('../models/comment')
const Post = require('../models/post')

const User = require('../models/user')
const validation = require('../validation/validation')
const { validationResult } = require('express-validator')
const authMiddleware = require('../middleware/auth')

// @desc    Get all comments
// @route   GET /api/v1/posts/:postid/comments/
// @access  Public
exports.getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find().populate('author').sort({ date: -1 })
    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    })
  }
}

// @desc    Add comment
// @route   POST /api/v1/posts/:postid/comments/
// @access  Private
exports.addComment = [
  authMiddleware.isAuth,

  validation.comment(),

  async (req, res, next) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        validationErrors: validationErrors.array()
      })
    } else {
      try {
        const comment = await new Comment({
          content: req.body.content,
          author: req.user
        }).save()
        // Add comment to post
        await Post.findByIdAndUpdate(req.params.postid, { $push: { comments: comment } }, {})

        return res.status(200).json({
          success: true,
          data: comment
        })
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: 'Server Error'
        })
      }
    }
  }
]

// @desc    Get one comment
// @route   GET /api/v1/posts/:postid/comments/:commentid
// @access  Public
exports.getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentid).populate('author')

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'No comment found'
      })
    }
    return res.status(200).json({
      success: true,
      data: comment
    })
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid Comment ID'
      })
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    })
  }
}

// @desc    Delete one comment
// @route   DELETE /api/v1/posts/:postid/comments/:commentid
// @access  Public
exports.deleteComment = [
  authMiddleware.isAuth,
  async (req, res, next) => {
    try {
      const comment = await Comment.findByIdAndRemove(req.params.commentid)
      if (!comment) {
        return res.status(404).json({
          success: false,
          error: 'No comment found'
        })
      }
      return res.status(200).json({
        success: true,
        data: {}
      })
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid comment ID'
        })
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      })
    }
  }
]

// @desc    Update comment
// @route   UPDATE /api/v1/posts/:postid/comments/:commentid
// @access  Private
exports.updateComment = [
  authMiddleware.isAuth,

  validation.comment(),

  async (req, res, next) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        validationErrors: validationErrors.array()
      })
    } else {
      const comment = {
        content: req.body.content
      }
      try {
        // Update comment
        await Comment.findByIdAndUpdate(req.params.commentid, comment, {})
        return res.status(200).json({
          success: true,
          data: {}
        })
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: 'Server Error'
        })
      }
    }
  }
]
