const dbDebugger = require('debug')('app:db');
const mongoose = require('mongoose');
const winston = require('winston');

module.exports = async function() {
	mongoose.connect('mongodb://localhost/platform',  { useNewUrlParser: true })
		.then(() => console.log('Connected to MongoDB...'));
}
