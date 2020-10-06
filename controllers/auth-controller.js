const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const HttpError = require('../models/http-error');

const signUp = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }
  let foundEmail;
  let hashedPassword;
  let token;
  const { name, email, password } = req.body;

  try {
    foundEmail = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError('Auth failed!'));
  }
  if (foundEmail) {
    return next(new HttpError('Email exists, sign in!', 422));
  }

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError('Password hashing failed!', 500));
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError('Auth failed!', 500));
  }

  try {
    token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      'keepmeasecret',
      { expiresIn: '1h' }
    );
  } catch (error) {
    return next(new HttpError('Unable to generate tokens', 500));
  }

  res
    .status(201)
    .json({
      message: 'Sign up successful',
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        token: token,
      },
    });
};


