const Comment = require('../models/comment')
const Post = require('../models/post')
const validationMiddleware = require('../middleware/validation')

// @desc    Get all comments for one post
// @route   GET /api/v1/posts/:postid/comments/
// @access  Public
exports.getAllComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postid).populate('comments').sort({ date: -1 })
    const comments = post.comments
    // const comments = await Comments.find().where('_id').in(commentsIDs)
    // const comments = await Comments.find({ _id: commentsIDs })

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    })
  } catch (err) {
    return next(err)
  }
}

// @desc    Add comment
// @route   POST /api/v1/posts/:postid/comments/
// @access  Private
exports.addComment = [
  validationMiddleware.comment(),
  validationMiddleware.validationResult,

  async (req, res, next) => {
    try {
      const comment = await new Comment({
        content: req.body.content,
        author: req.user._id
      }).save()
      // Add comment to post
      await Post.findByIdAndUpdate(req.params.postid, { $push: { comments: comment } }, {})

      return res.status(200).json({
        success: true,
        data: comment
      })
    } catch (err) {
      return next(err)
    }
  }

]

// @desc    Get one comment
// @route   GET /api/v1/posts/:postid/comments/:commentid
// @access  Public
exports.getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentid).populate('author', 'username')

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
    return next(err)
  }
}

// @desc    Delete one comment
// @route   DELETE /api/v1/posts/:postid/comments/:commentid
// @access  Public
exports.deleteComment = async (req, res, next) => {
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
    return next(err)
  }
}

// @desc    Update comment
// @route   UPDATE /api/v1/posts/:postid/comments/:commentid
// @access  Private
exports.updateComment = [
  validationMiddleware.comment(),
  validationMiddleware.validationResult,

  async (req, res, next) => {
    const comment = {
      content: req.body.content
    }
    try {
      // Update comment
      const updatedComment = await Comment.findByIdAndUpdate(req.params.commentid, comment, { new: true })
      if (!updatedComment) {
        return res.status(404).json({
          success: false,
          error: 'No comment found'
        })
      }
      return res.status(200).json({
        success: true,
        data: updatedComment
      })
    } catch (err) {
      return next(err)
    }
  }

]
