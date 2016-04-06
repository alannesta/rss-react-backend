var connection = require('../utils/mysql-connector');

var logger = require('../utils/logger');

var feedService = {
	getAllFeeds: function(callback) {
		connection.query('SELECT * from feed', callback);
	},

	saveFeed: function(feed, callback) {
		var service = this;
		var insertQuery = "INSERT IGNORE INTO feed SET ?";
		logger.info('FeedService.saveFeed: ', feed);
		connection.query(insertQuery, {
			feed_name: feed.feedName,
			feed_url: feed.feedUrl
		}, function (err, result) {
			if (result.affectedRows == 0) {
				// which means there could be a duplicate, and not inserted successfully
				callback("Insertion Failed, Duplicate!");
			}else {
				service.getFeedByUrl(feed.feedUrl, callback);
			}
		});

	},

	updateFeed: function(feed, callback) {
		var service = this;
		var updateQuery = "UPDATE feed SET feed_name='"+feed.feedName+"', feed_url='"+feed.feedUrl+ "', last_update=FROM_UNIXTIME("+feed.lastUpdate+") WHERE id=" + feed.id;

		connection.query(updateQuery, function(err) {
			if (err) {
				logger.error('SQL_ERROR::update feed: ', err);
				callback(err);
			} else {
				service.getFeedById(feed.id, callback);
			}
		});
	},

	deleteFeedByID: function(feedId, callback) {
		var deleteQuery = "DELETE from feed WHERE id =" + feedId;
		connection.query(deleteQuery, callback);
	},

	getFeedById: function(feedId, callback) {
		connection.query("SELECT * from feed WHERE id =" + feedId, function(err, result) {
			if (err) {
				callback(err);
			} else {
				callback(err, result[0]);
			}
		});
	},

	getFeedByUrl: function(feedUrl, callback) {
		var query = "SELECT * from feed WHERE feed_url ='" + feedUrl + "'";
		connection.query(query, function(err, result) {
			if (err) {
				logger.error("SQL_ERROR::getFeedByID: ", err);
				callback(err);
			}else{
				console.log('getfeedbyid', result[0]);
				callback(err, result[0]);
			}

		});
	}
};

module.exports = feedService;
