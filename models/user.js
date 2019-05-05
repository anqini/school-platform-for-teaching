/*jshint esversion: 8*/

const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const ObjectId = mongoose.Schema.Types.ObjectId;
const Login = require('./login').Login;
const Course = require('./course').Course;

const userSchema = new mongoose.Schema({
  login: {
    type: ObjectId,
    ref: 'Login',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 10
  },
  year: {
    type: Number,
    default: Date.now
  },
  department: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  major: {
    type: String,
    minlength: 2,
    maxlength: 30
  },
  teachingCourse: [{
    type: ObjectId,
    ref: 'Course'
  }],
  takingCourse: [{
    type: ObjectId,
    ref: 'Course'
  }],
  dashboard: [{
    type: ObjectId
  }]
});

const User = mongoose.model('User', userSchema);

function validate(user) {
  const schema = {
    name: Joi.string().min(2).max(10).required(),
    year: Joi.number().min(2000).max(2100).required(),
    department: Joi.string().min(1).max(30).required(),
    major: Joi.string().min(1).max(30).required(),
    teachingCourse: Joi.array(),
    takingCourse: Joi.array(),
    dashboard: Joi.array()
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validate;