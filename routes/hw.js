/*jshint esversion: 8*/

const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const dbDebugger = require('debug')('app:db');
const {User} = require('../models/user');
const {Hw, validate} = require('../models/hw');
const _ = require('lodash');

/*
user input
{
	title: string,
	details: string (optional),
	deadline: date
	type: string
}
*/
/*
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

// admin
// view all assignment
router.get('/:cid/hw', adminAuth, async (req, res) => {
	const hw = await Hw.find({ cid: req.params.cid });
	if (!hw.length) return res.status(404).send('This course doesn\'t have any homework yet.');
	res.send(hw);
});

// student
// get hw details
router.get('/:cid/hw/:hid', auth, async (req, res) => {
	const hw = await Hw.findById(req.params.hid);
	if  (!hw) return res.status(404).send('This hw cannot be found.');
	res.send(hw);
});

// teacher
// create new hw
router.post('/:cid/hw', auth, async (req, res) => {
	const { error } = validate(req.body); 
	if (error) return res.status(400).send(error.details[0].message);
	// furnish the detail of the hw structure
	req.body.cid = req.params.cid;
	req.body.author = req.login._id;
	const hw = new Hw(req.body);
	await hw.save();
	// add the hw to course
	const course = await Course.findById(req.params.cid);
	if (!course) return res.status(404).send('The course with the given ID was not found.');
	course.hw.push(hw._id);
	// send to client
	res.send(hw);
});

// teacher auth
// modify the detail of hw
router.put('/:cid/hw/:hid', auth, async (req, res) => {
	const { error } = validate(req.body); 
	if (error) return res.status(400).send(error.details[0].message);
	// update
	const hw = await Hw.findByIdAndUpdate(req.params.hid, {
		$set: req.body
	});
	if (!hw) return res.status(404).send('This homework cannot be found.');
	res.send(hw);
});

// teacher 
// modify the detail 
router.delete('/:cid/hw/:hid', auth, async (req, res) => {
	const hw = await Hw.findByIdAndRemove(req.params.hid);
	if (!hw) return res.status(404).send('This homework cannot be found.');
	res.send(hw);
});

module.exports = router;