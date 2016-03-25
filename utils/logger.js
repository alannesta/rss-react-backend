var winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)()
		//new (winston.transports.File)({ filename: '/Users/sijin.cao/Desktop/winstonlog.log' })
	]
});

logger.level = 'debug';

module.exports = logger;
