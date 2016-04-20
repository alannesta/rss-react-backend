var winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			level: 'debug'
		})
		//new (winston.transports.File)({ filename: '/Users/sijin.cao/Desktop/winstonlog.log' })
	]
});

module.exports = logger;
