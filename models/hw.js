/*jshint esversion: 8*/

/*
homework table summary
{
		cid: oid
		author: oid
		title: string
		details: string
		time: date
		deadline: date
		type: string
}
*/
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const ObjectId = mongoose.Schema.Types.ObjectId;
const Course = require('./course').Course; 
const Login = require('./login').Login;

const Hw = mongoose.model('Hw', new mongoose.Schema({
	cid: {
		type: ObjectId,
		required: true,
		ref: 'Course'
	},
	author: {
		type: ObjectId,
		required: true,
		ref: 'Login'
	},
	title: {
		type: String,
		minlength: 2,
		maxlength: 50,
		required: true
	},
	details: {
		type: String,
		maxlength: 500
	},
	time: {
		type: Date,
		default: Date.now
	},
	deadline: {
		type: Date,
		required: true
	},
	type: {
		type: String,
		default: 'file',
		enum: ['file', 'table'],
		required: true
	} 

}));

function validate(hw) {
	const schema = {
		cid: Joi.objectId(),
		author: Joi.objectId(),
		title: Joi.string().required(),
		details: Joi.string(),
		deadline: Joi.date().required(),
		type: Joi.string().required()
	};
	return Joi.validate(hw, schema);
}

exports.Hw = Hw;
exports.validate = validate;
