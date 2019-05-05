/*jshint esversion: 8*/

/*
Annc table summary
{
		cid: oid
		author: oid
		title: string
		details: string
		time: date
}
*/
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const ObjectId = mongoose.Schema.Types.ObjectId;
const Course = require('./course').Course; 
const Login = require('./login').Login;

const Annc = mongoose.model('Annc', new mongoose.Schema({
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
		required: true,
		minlength: 2,
		maxlength: 50
	},
	details: {
		type: String,
		maxlength: 500
	},
	time: {
		type: Date,
		default: Date.now
	}
}));

function validate(annc) {
	const schema = {
		cid: Joi.objectId(),
		author: Joi.objectId(),
		title: Joi.string().min(2).max(50).required(),
		details: Joi.string().max(500),
	};
	return Joi.validate(annc, schema);
}

module.exports.Annc = Annc;
module.exports.validate = validate;