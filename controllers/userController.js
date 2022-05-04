const User = require('../models/user')
const validation = require('../validation/validation')
const { validationResult } = require('express-validator')
const authMiddleware = require('../middleware/auth')
const passport = require('passport')
const bcrypt = require('bcryptjs')

exports.login = async (req, res, next) => {
  res.send('To Be done')
}
exports.register = async (req, res, next) => {
  res.send('To Be done')
}

// exports.register = [
//   authMiddleware.isNotAuth,
//   validation.register(),
//   async (req, res, next) => {
//     const formErrors = validationResult(req)
//     if (!formErrors.isEmpty()) {
//       res.render('register', { errors: formErrors.array() })
//     } else {
//       // Check if username already exists
//       const usernameCount = await User.countDocuments({ username: req.body.username })
//       if (usernameCount > 0) {
//         res.render('register', { errors: [{ msg: 'There is already a user with that username' }] })
//       } else {
//         try {
//           const hasedPassword = await bcrypt.hash(req.body.password, 10)
//           await new User({
//             name: req.body.username,
//             username: req.body.username,
//             password: hasedPassword
//           }).save()
//           next()
//         } catch (err) {
//           return next(err)
//         }
//       }
//     }
//   },
//   // Authenticate after register
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
//   })]

// exports.login = [
//   authMiddleware.isNotAuth,
//   validation.login(),
//   (req, res, next) => {
//     const formErrors = validationResult(req)
//     if (!formErrors.isEmpty()) {
//       res.render('login', { errors: formErrors.array(), loginErrors: '' })
//     } else {
//       next()
//     }
//   },
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
//   })
// ]
