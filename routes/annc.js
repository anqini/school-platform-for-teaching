/*jshint esversion: 8*/

const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const dbDebugger = require('debug')('app:db');
const {User} = require('../models/user');
const {Annc, validate} = require('../models/annc');
const _ = require('lodash');

/*
user input:
{
	title: 
	details
}
*/

/*
data structure:
{
	cid
	author
	title
	details
	time
}
*/

// admin auth
// get all annc
// router.get('/', adminAuth, async (req, res) => {
// 	const annc = await Annc.find().sort('_id');
// 	res.send(annc);
// });

// student & teacher
// get annc by course
router.get('/:cid/annc', auth, async (req, res) => {
	const annc = await Annc.find({ cid: req.params.cid });
	if (!annc.length) return res.status(404).send('This course doesn\'t have any announcement yet.');
	res.send(annc);
})
// student auth
// get annc details
router.get('/:cid/annc/:aid', auth, async (req, res) => {
	const annc = await Annc.findById(req.params.aid);
	if (!annc) return res.status(404).send('This course doesn\'t have any announcement yet.');
	res.send(annc);
});

// combination logic
// teacher auth ??? maybe some students should also have the right to do this
// create announcement
router.post('/:cid/annc', auth, async (req, res) => {
	const { error } = validate(req.body); 
	if (error) return res.status(400).send(error.details[0].message);
	// furnish the content & save
	req.body.cid = req.params.cid;
	req.body.author = req.login._id;
	const annc = new Annc(req.body);
	await annc.save();
	// add the annoucement to course
	const course = await Course.findById(req.params.cid);
	if (!course) return res.status(404).send('The course with the given ID was not found.');
	course.annc.push(annc._id);
	// send the announcement to the client side.
	res.send(annc);
});

// teacher auth ???
// modify annoucement
router.put('/:cid/annc/:aid', auth, async (req, res) => {
	const { error } = validate(req.body); 
	if (error) return res.status(400).send(error.details[0].message);
	const annc = await Annc.findByIdAndUpdate(req.params.aid, {
		$set: req.body
	});
	if (!annc) return res.status(404).send('This announcement cannot be found.');
	res.send(annc);
});

// teacher auth & admin
router.delete('/:cid/annc/:aid', auth, async (req, res) => {
	const annc = await Annc.findByIdAndRemove(req.params.aid);
	if (!annc) return res.status(404).send('This announcement cannot be found.');
	res.send(annc);
});

module.exports = router;