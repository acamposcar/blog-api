const Post = require('../models/post')
const User = require('../models/user')
const authMiddleware = require('../middleware/auth')
const validationMiddleware = require('../middleware/validation')

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
    return next(err)
  }
}

// @desc    Add post
// @route   POST /api/v1/posts
// @access  Private
exports.addPost = [
  authMiddleware.isAuth,
  validationMiddleware.post(),
  validationMiddleware.validationResult,

  async (req, res, next) => {
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
      return next(err)
    }
  }
]

// @desc    Get one post
// @route   GET /api/v1/post/:postid
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postid).populate('author').populate('comments')

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
    return next(err)
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
      return next(err)
    }
  }
]

// @desc    Update post
// @route   PUT /api/v1/posts/:postid
// @access  Private
exports.updatePost = [
  authMiddleware.isAuth,
  validationMiddleware.post(),
  validationMiddleware.validationResult,

  async (req, res, next) => {
    const post = {
      title: req.body.title,
      content: req.body.content,
      published: req.body.published === 'true'
    }
    try {
      // Update post
      const updatedPost = await Post.findByIdAndUpdate(req.params.postid, post, { new: true })
      if (!updatedPost) {
        return res.status(404).json({
          success: false,
          error: 'No post found'
        })
      }
      return res.status(200).json({
        success: true,
        data: updatedPost
      })
    } catch (err) {
      return next(err)
    }
  }

]
