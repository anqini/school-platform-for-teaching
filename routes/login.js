/*jshint esversion: 8*/
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
// const asyncMiddleWare = require('../middleware/async');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbDebugger = require('debug')('app:db');
const {Login, validate} = require('../models/login');
const _ = require('lodash');


/*
	input json format:
		{
			"school": "",
			"schoolId": "",
			"phone": "",
			"password": "",
			"teacher": ""
		}
*/

router.get('/me', auth, async (req, res) => {
	const login = await Login.findById(req.login._id);
	if (!login) return res.status(404).send('The Login with the given ID was not found.');
	res.send(login);
});

router.get('/', adminAuth, async (req, res) => {
	const login = await Login.find().sort('_id');
	res.send(login);
});

router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if (error)
		return res.status(400).send(error.details[0].message);
	// hash the password
	const salt = await bcrypt.genSalt(10);
	req.body.password = await bcrypt.hash(req.body.password, salt);
	// check duplication
	let result = await Login.findOne(_.pick(req.body, ['schoolId']));
	if (result) return res.status(400).send('该学号已被注册\n');
	// check duplication
	result = await Login.findOne(_.pick(req.body, ['phone']));
	if (result) return res.status(400).send('该手机号已被注册\n');
	// save the file to Mongodb
	let login = new Login(req.body);
	await login.save();
	const token = login.generateAuthToken();
	res.header('x-auth-token', token).send(token);
	dbDebugger(login);
});

router.put('/:id', auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	// hash the
	const salt = await bcrypt.genSalt(10);
	req.body.password = await bcrypt.hash(req.body.password, salt);

	const login = await Login.findByIdAndUpdate(req.params.id, req.body, { new: true });
	if (!login) return res.status(404).send('The Login with the given ID was not found.');
	res.send(login);
});

router.delete('/:id', auth, async (req, res) => {
	const login = await Login.findByIdAndRemove(req.params.id);
	if (!login) return res.status(404).send('The login with the given ID was not found.');
	res.send(login);
});

router.get('/:id', auth, async (req, res) => {
	const login = await Login.findById(req.params.id);
	if (!login) return res.status(404).send('The login with the given ID was not found.');
	res.send(login);
});

module.exports = router;
