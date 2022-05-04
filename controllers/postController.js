const Post = require('../models/post')
const User = require('../models/user')
const validation = require('../validation/validation')
const { validationResult } = require('express-validator')
const authMiddleware = require('../middleware/auth')

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Public
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author').sort({ date: -1 })
    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    })
  }
}

// @desc    Add post
// @route   POST /api/v1/posts
// @access  Private
exports.addPost = [
  authMiddleware.isAuth,

  validation.post(),

  async (req, res, next) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      // if (err.name === 'ValidationError') {
      //   const messages = Object.values(err.errors).map(val => val.message);

      //   return res.status(400).json({
      //     success: false,
      //     error: messages
      //   });

      return res.status(400).json({
        success: false,
        error: 'Validation error',
        validationErrors: validationErrors.array()
      })
    } else {
      try {
        const post = await new Post({
          title: req.body.title,
          content: req.body.content,
          author: req.user,
          published: req.body.published === 'true'
        }).save()

        return res.status(200).json({
          success: true,
          data: post
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

// @desc    Get one post
// @route   GET /api/v1/post/:postid
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postid).populate('author').populate('comments')
    console.log('hola')

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'No post found'
      })
    }
    return res.status(200).json({
      success: true,
      data: post
    })
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid Post ID'
      })
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    })
  }
}

// @desc    Delete one post
// @route   DELETE /api/v1/post/:postid
// @access  Public
exports.deletePost = [
  authMiddleware.isAuth,
  async (req, res, next) => {
    try {
      const post = await Post.findByIdAndRemove(req.params.postid)
      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'No post found'
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
          error: 'Invalid post ID'
        })
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      })
    }
  }
]

// @desc    Update post
// @route   PUT /api/v1/posts/:postid
// @access  Private
exports.updatePost = [
  authMiddleware.isAuth,

  validation.post(),

  async (req, res, next) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        validationErrors: validationErrors.array()
      })
    } else {
      const post = {
        title: req.body.title,
        content: req.body.content,
        published: req.body.published === 'true'
      }
      try {
        // Update post
        await Post.findByIdAndUpdate(req.params.postid, post, {})
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
