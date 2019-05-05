/*jshint esversion: 8*/

const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('config');

const LoginSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  schoolId: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 60,
    maxlength: 60
  },
  teacher: Boolean
});

LoginSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(_.pick(this, ['_id', "teacher"]), config.get('jwtPrivateKey'));
  return token;
}


const Login = mongoose.model('Login', LoginSchema);

function validate(login) {
  const schema = {
    school: Joi.string().min(4).max(50).required(),
    schoolId: Joi.string().min(5).max(50).required(),
    phone: Joi.string().length(11).required(),
    password: Joi.string().min(6).required(),
    teacher: Joi.boolean()
  };

  return Joi.validate(login, schema);
}

exports.Login = Login;
exports.validate = validate;
