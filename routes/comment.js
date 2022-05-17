const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')
const isAdmin = require('../middleware/auth').isAdmin

router.route('/').get(isAdmin, commentController.getAllComments)

module.exports = router
