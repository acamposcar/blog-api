const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')

router.route('/posts').get(postController.getAllPosts).post(postController.addPost)
router.route('/posts/:postid').get(postController.getPost).put(postController.updatePost).delete(postController.deletePost)
router.route('/posts/:postid/comments').get(commentController.getAllComments).post(commentController.addComment)
router.route('/posts/:postid/comments/:commentid').get(commentController.getComment).put(commentController.updateComment).delete(commentController.deleteComment)

module.exports = router
