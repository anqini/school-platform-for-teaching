/*jshint esversion: 8*/

/*
course table summary
{
    name: string
    description: string
    instructor: oid
    students: array
    annc: array
    assignment: array
}
*/
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const ObjectId = mongoose.Schema.Types.ObjectId;
const Login = require('./login').Login;

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    unique: true
  },
  secretToken: {
    type: String,
    required: true
  },
  instructor: {
    type: ObjectId,
    ref: 'Login',
    required: true
  },
  description: {
    type: String,
    maxlength: 200
  },
  students: [{
    type: ObjectId,
    ref: 'Login'
  }],
  annc: [{ ObjectId }],
  hw:[{ ObjectId }],
  fileRoot: {
    type: String,
    minlength: 3,
    maxlength: 50
  }


});

const Course = mongoose.model('Course', courseSchema);

function validate(course) {
  const schema = {
    name: Joi.string().min(2).max(30).required(),
    description: Joi.string().max(200),
    instructor: Joi.objectId(),
    students: Joi.array(),
    annc: Joi.array(),
    hw: Joi.array()
  };

  return Joi.validate(course, schema);
}

exports.Course = Course; 
exports.validate = validate;