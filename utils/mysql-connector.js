var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : process.env.MYSQL_USER || 'root',
	password : process.env.MYSQL_PWD || 'root',
	database : process.env.DATABASE || 'test'
});

module.exports = connection;
