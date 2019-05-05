/*jshint esversion: 8*/
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbDebugger = require('debug')('app:db');
const {User, validate} = require('../models/user');
const _ = require('lodash');


/*
	input json format:
		{
			name: Joi.string().min(2).max(10).required(),
		    year: Joi.number().min(2000).max(2100).required(),
		    department: Joi.string().min(1).max(30).required(),
		    major: Joi.string().min(1).max(30).required(),"school": "",
		    teachingCourse: Joi.array(),
		    takingCourse: Joi.array(),
		    dashboard: Joi.array()
		}
*/

router.get('/', adminAuth, async (req, res) => {
	const user = await User.find().sort('_id');
	res.send(user);
});

// router.get('/:id', adminAuth, async (req, res) => {
// 	const user = await User.findById(req.params.id);
// 	if (!user) return res.status(404).send('The login with the given ID was not found.');
// 	res.send(user);
// });


// router.post('/:id', adminAuth, async (req, res) => {
// 	const { error } = validate(req.body);
// 	if (error)
// 		return res.status(400).send(error.details[0].message);
// 	// check duplication
// 	let result = await User.findById(req.params.id);
// 	if (result) return res.status(400).send('Your profile has already been registered.\n');
// 	// save the file to Mongodb
// 	req.body.login = req.params.id;
// 	req.body.takingCourse = [];
// 	req.body.teachingCourse = [];
// 	req.body.dashboard = [];
// 	let user = new User(req.body);
// 	await user.save();
// 	res.send(user);
// });

// router.put('/:id', adminAuth, async (req, res) => {
// 	const { error } = validate(req.body);
// 	if (error) return res.status(400).send(error.details[0].message);

// 	const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
// 	if (!user) return res.status(404).send('The User with the given ID was not found.');
// 	res.send(user);
// });


router.delete('/:id', adminAuth, async (req, res) => {
	const user = await User.findByIdAndRemove(req.params.id);
	if (!user) return res.status(404).send('The User with the given ID was not found.');
	res.send(user);
});

router.get('/me', auth, async (req, res) => {
	const user = await User
							.findOne({ login: req.login._id })
							.populate('login', 'school schoolId phone -_id')
							.populate('takingCourse', 'name -_id')
							.populate('teachingCourse', 'name -_id');
	if (!user) return res.status(404).send('Your profile haven\'t been created yet.');
	res.send(user);
});

router.post('/me', auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error)
		return res.status(400).send(error.details[0].message);
	// check duplication
	let result = await User.findOne({ login: req.login._id });
	if (result) return res.status(400).send('Your profile has already been registered.\n');
	// save the file to Mongodb
	req.body.login = req.login._id;
	req.body.takingCourse = [];
	req.body.teachingCourse = [];
	req.body.dashboard = [];
	let user = new User(req.body);
	await user.save();
	res.send(user);
});

router.put('/me', auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findOneAndUpdate({ login: req.login._id }, req.body);
	if (!user) return res.status(404).send('User profile cannot be found.');
	res.send(user);
});




module.exports = router;
