const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
	// process.on('uncaughtException', (ex) => {
	// 	console.log("WE GOT AN UNCAUGHT EXCEPTION");
	// 	winston.error(ex.message, ex);
	//  process.exit(1);
	// });
	winston.exceptions.handle(
		new winston.transports.Console({ colorize: true, prettyPrint: true }),
		new winston.transports.File(
			{ filename: "uncaughtExceptions.log" }
		));

	process.on('unhandledRejection', (ex) => {
		throw ex;
	});
	winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
	winston.add(new winston.transports.File({ filename: 'logfile.log' }));
	winston.add(new winston.transports.MongoDB({ 
		db: 'mongodb://localhost/platform',
		level: 'info' 
	}));
}