var connection = require('../utils/mysql-connector');

var logger = require('../utils/logger');

var feedService = {
	getAllFeeds: function(callback) {
		connection.query('SELECT * from feed', callback);
	},

	getFeedByID: function(feedId, callback) {
		var query = "SELECT * from feed WHERE id =" + feedId;
		connection.query(query, callback);
	},

	saveFeed: function(feed, callback) {
		var insertQuery = "INSERT IGNORE INTO feed SET ?";
		logger.info('FeedService.saveFeed: ', feed);
		connection.query(insertQuery, {
			feed_name: feed.feedName,
			feed_url: feed.feedUrl,
			last_update: new Date()
		}, function (err, result) {
			if (result.affectedRows == 0) {
				// which means there could be a duplicate, and not inserted successfully
				return callback("Insertion Failed, Duplicate!");
			}
			callback(err, result);
		});

		//inspection
		//var statement = "INSERT IGNORE INTO feed VALUES ?";
		//var insert = {
		//	feed_name: feed.feedName,
		//	feed_url: feed.feedUrl,
		//	last_update: new Date()
		//};
		//console.log(mysql.format(statement,insert));

	},

	updateFeed: function(feed, callback) {
		var updateQuery = "UPDATE feed SET ? WHERE id=" + feed.id;
		var updatePayload = {
			feed_name: feed.feedName,
			feed_url: feed.feedUrl,
			last_update: feed.lastUpdate
		};

		connection.query(updateQuery, updatePayload, function(err) {
			if (err) {
				logger.error('SQL_ERROR::update feed: ', err);
				callback(err);
			} else {
				connection.query("SELECT * from feed WHERE id =" + feed.id, function(err, result) {
					if (err) {
						callback(err);
					} else {
						callback(err, result);
					}
				});
			}
		});
	},

	deleteFeedByID: function(feedId, callback) {
		var deleteQuery = "DELETE from feed WHERE id =" + feedId;
		connection.query(deleteQuery, callback);
	}
};

module.exports = feedService;
