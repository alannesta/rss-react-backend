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
		//console.log('save feed: --->', feed);
		logger.info('FeedService.saveFeed: ', feed);
		connection.query(insertQuery, {
			feed_name: feed.feedName,
			feed_url: feed.feedUrl,
			last_update: new Date()
		}, callback);

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
		connection.query(updateQuery, {
			feed_name: feed.feedName,
			feed_url: feed.feedUrl,
			last_update: feed.lastUpdate
		}, callback);
	},

	deleteFeedByID: function(feedId, callback) {
		var deleteQuery = "DELETE from feed WHERE id =" + feedId;
		connection.query(deleteQuery, callback);
	}
};

module.exports = feedService;