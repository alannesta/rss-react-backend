var connection = require('../utils/mysql-connector');

var logger = require('../utils/logger');

var blogService = {
	getAllBlogs: function(feedId, callback) {
		connection.query('SELECT blog_url, blog_title, post_date, blog_digest from blogs WHERE feed_id=' + feedId, callback)
	},

	saveBlogs: function(blogs, feedId, callback) {
		logger.debug('BlogService.saveBlogs: ', blogs, feedId);
		var values = generateInsertValues(blogs, ['feed_id', 'blog_url', 'blog_title', 'post_date', 'blog_digest']);

		connection.beginTransaction(function(err) {
			if (err) { throw err; }
			connection.query("INSERT IGNORE INTO blogs (feed_id, blog_url, blog_title, post_date, blog_digest) VALUES ?", [values], function(err, result) {
				if (err) {
					return connection.rollback(function() {
						callback(err);
						throw err;
					});
				}

				// update feed table (last_update)
				connection.query('UPDATE feed SET last_update=? WHERE id = ?', [new Date(), feedId], function(err) {
					if (err) {
						return connection.rollback(function() {
							callback(err);
							throw err;
						});
					}
					connection.commit(function(err) {
						if (err) {
							return connection.rollback(function() {
								callback(err);
								throw err;
							});
						}
						callback();
						console.log('transaction success!');
					});
				});
			});
		});
	}
};

function generateInsertValues(objects, keys) {
	var items = [];
	objects.forEach(function(object) {
		var entry = [];
		keys.forEach(function(key) {
			entry.push(object[key]);
		});
		items.push(entry);
	});
	return items;
}

module.exports = blogService;
