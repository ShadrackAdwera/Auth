const { check } = require('express-validator');
const express = require('express');

const authController = require('../controllers/auth-controller');

const router = express.Router();

router.post(
  '/sign-up',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  authController.signUp
);

router.post('/login', authController.login)

router.post('/reset-password', check('email').normalizeEmail().isEmail() ,authController.resetPassword)

module.exports = router

