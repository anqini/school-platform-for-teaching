/*jshint esversion: 8*/

const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const dbDebugger = require('debug')('app:db');
const {User} = require('../models/user');
const {Course, validate} = require('../models/course');
const _ = require('lodash');
const genToken = require('../helper/genToken');

/*
client side input:
{
	name: string
    description: string
}
*/

/*
{
    name: string
    secretToken: string
    description: string
    instructor: oid
    students: array
    annc: array
    hw: array
}
*/

router.get('/', adminAuth, async (req, res) => {
	const course = await Course.find().sort('_id');
	res.send(course);
});

// teacher auth
// get by instructor
router.get('/teacher', auth, async (req, res) => {
	const course = await Course.find({ instructor: req.login._id }).sort('_id');
	if (!course.length) 
		return res.status(404).send('You havn\'t created any courses.');
	res.send(course);
})

//student auth
//get by studentid
router.get('/me', auth, async (req, res) => {
	const course = await Course.find({ students: req.login._id }).sort('_id');
	if (!course.length)
		return res.status(404).send('You haven\'t taken any courses.');
	res.send(course);
});

// student auth
// get course detail
router.get('/:id', auth, async (req, res) => {
	const course = await Course.findById(req.params.id);
	if (!course) return res.status(404).send('Course with given ID cannot be found.');
	res.send(course);
});

// comination logic
// teacher auth
// create course
router.post('/create', auth, async (req, res) => {
	const { error } = validate(req.body); 
	if (error) 
		return res.status(400).send(error.details[0].message);
	req.body.instructor = req.login._id;
	req.body.secretToken = genToken();
	req.body.students = [];
	req.body.annc = [];
	req.body.hw = [];
	const course = new Course(req.body);
	course.fileRoot = './file/' + course._id;
	await course.save();
	const user = await User.findOne({login: req.login._id});
	if (!user) return res.status(404).send('user information ERROR.');
	user.teachingCourse.push(course._id);
	await user.save();
	res.send(course);
	dbDebugger(course);
});

// teacher auth
// modify course information
router.put('/:id', auth, async (req, res) => {
	const { error } = validate(req.body); 
	if (error) 
		return res.status(400).send(error.details[0].message);
	const course = await Course.findByIdAndUpdate(req.params.id, {
		$set: req.body
	});
	if (!course) return res.status(404).send('The Course with the given ID was not found.');
	res.send(course);
});

// combination logic
// student auth
// add course by token
router.put('/:token', auth, async (req, res) => {
	const { error } = validate(req.body); 
	if (error) 
		return res.status(400).send(error.details[0].message);
	const course = await Course.findOne({secretToken: req.params.token});
	if (!course) return res.status(404).send('The Course with the given token was not found.');
	const user = await User.findById(req.login._id);
	if (!user) return res.status(404).send('user information ERROR.');
	user.takingCourse.push(course._id);
	await user.save();
	res.send(course);
});

// teacher auth
// delete course
router.delete('/:id', auth, async (req, res) => {
	const course = await Course.findByIdAndRemove(req.params.id);
	if (!course) return res.status(404).send('The Course with the given token was not found.');
	res.send(course);
});

module.exports = router;