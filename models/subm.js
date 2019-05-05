/*jshint esversion: 8*/

const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const ObjectId = mongoose.Schema.Types.ObjectId;
const Course = required('./course').Course; 
const Login = require('./login').Login;
const Hw = require('./hw').Hw;

const Subm = mongoose.model(new mongoose.Schema({
	cid: {
		type: ObjectId,
		ref: 'Course',
		required: true
	},
	hwid: {
		type: ObjectId,
		ref: 'Hw',
		required: true
	},
	sid: {
		type: ObjectId,
		ref: 'Login',
		required: true
	},
	isSubmitted: {
		type: Boolean,
		required: true,
		default: false
	},
	submDir: String,
	submContent: String,
	latestUpdateTime: {
		type: Date,
		default: Date.now,
		required: true
	}
}));

function validate(subm) {
	const schema = {
		cid: Joi.objectId(),
		hwid: Joi.objectId().required(),
		sid: Joi.objectId().required(),
		isSubmitted: Joi.boolean(),
		submDir: Joi.string().max(100),
		submContent: Joi.string().max(1000)
	};
	return Joi.validate(subm, schema);
}

exports.Subm = Subm;
exports.validate = validate;