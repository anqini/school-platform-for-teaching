const express = require('express');
const error = require('../middleware/error');
const login = require('../routes/login');
const home = require('../routes/home');
const auth = require('../routes/auth');
const user = require('../routes/user');
const course = require('../routes/course');
const annc = require('../routes/annc');
const hw = require('../routes/hw');
const cors = require('cors');

module.exports = function(app) {
	// middleware pipline
	app.use(express.json());
	app.use(cors());
	app.use('/', home);
	app.use('/api/login', login);
	app.use('/api/auth', auth);
	app.use('/api/user', user);
	app.use('/api/course', course);
	app.use('/api/course', annc);
	app.use('/api/course', hw);
	// error middleware
	app.use(error);
}
