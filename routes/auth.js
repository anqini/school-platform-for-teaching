/*jshint esversion: 8*/
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const config = require('config');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbDebugger = require('debug')('app:db');
const {Login} = require('../models/login');
const _ = require('lodash');


/*
	input json format:
		{
			"school": "",
			"schoolId": "",
			"password": ""
		}
		or
		{
			"phone": "",
			"password": ""
		}
*/


router.post('/', async (req, res) => {
	// login method: phone or schoolId
	if (req.body.schoolId) {
		const { error } = validateWithSchoolId(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		// check if the user exist
		const result = await Login.findOne(_.pick(req.body, ['school', 'schoolId', 'teacher']));
		if (!result) return res.status(400).send('Invalid schoolId or password.\n');

		// check password
		const valid = await bcrypt.compare(req.body.password, result.password);
		if (!valid)  return res.status(400).send('Invalid schoolId or password.\n');

		// correct id and password
		const token = result.generateAuthToken();
		res.header('x-auth-token', token).send(token);
	} else {
		const { error } = validateWithPhone(req.body);
		if (error) return res.status(400).send(error.details[0].message);
		console.log('valide req body.');
		// check if the user exist
		const result = await Login.findOne(_.pick(req.body, ['phone', 'teacher']));
		if (!result) return res.status(400).send('Invalid phone or password.\n');
		console.log('found by phone and teacher.');
		const valid = await bcrypt.compare(req.body.password, result.password);
		if (!valid)  return res.status(400).send('Invalid schoolId or password.\n');

		// correct id and password
		const token = result.generateAuthToken();
		res.header('x-auth-token', token).send(token);

	}
});

function validateWithSchoolId(req) {
	const schema = {
		school: Joi.string().min(4).max(50).required(),
		schoolId: Joi.string().min(5).max(50).required(),
		password: Joi.string().min(6).required(),
		teacher: Joi.boolean()
	};
	return Joi.validate(req, schema);
}

function validateWithPhone(req) {
	const schema = {
		phone: Joi.string().length(11).required(),
		password: Joi.string().min(6).required(),
		teacher: Joi.boolean()
	}
	return Joi.validate(req, schema);
}

module.exports = router;
