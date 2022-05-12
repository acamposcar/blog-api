const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const isAuth = require('../middleware/auth').isAuth

router.route('/').get(isAuth, userController.currentUser)
router.route('/avatar').post(isAuth, userController.avatar)
module.exports = router
