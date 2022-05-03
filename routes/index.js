const express = require('express')
const router = express.Router()
const indexController = require('../controllers/postController')

/* GET home page. */
router.post('/login', indexController.login)
router.post('/register', indexController.register)

module.exports = router
