var winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			level: process.env.NODE_ENV === 'production'? 'info' : 'debug'
		})
		//new (winston.transports.File)({ filename: '/Users/sijin.cao/Desktop/winstonlog.log' })
	]
});

module.exports = logger;
