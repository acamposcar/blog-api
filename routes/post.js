const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')
const isAuth = require('../middleware/auth').isAuth
const isAdmin = require('../middleware/auth').isAdmin

router.route('/').get(postController.getAllPosts).post(isAdmin, postController.addPost)

router.route('/:postid').get(postController.getPost).put(isAdmin, postController.updatePost).delete(isAdmin, postController.deletePost)

router.route('/:postid/comments').get(commentController.getAllComments).post(isAuth, commentController.addComment)

router.route('/:postid/comments/:commentid').get(commentController.getComment).put(isAdmin, commentController.updateComment).delete(isAdmin, commentController.deleteComment)

module.exports = router
