var connection = require('../utils/mysql-connector');

var logger = require('../utils/logger');

var blogService = {
	getBlogs: function(feedId, count, callback) {

		var resultSet = {
			blogs: [],
			feedId: feedId,
			blogCount: -1
		};

		var blogQuery = "SELECT blog_url, blog_title, post_date, blog_digest from blogs WHERE feed_id=" + feedId +
				" ORDER BY post_date DESC LIMIT " + count;

		var totalQuery = "SELECT count(*) from blogs WHERE feed_id=" + feedId;

		connection.query(blogQuery, function(err, result) {
			if (err) {
				logger.error(err);
				callback(err);
			}
			resultSet.blogs = result;
			connection.query(totalQuery, function(err, result) {
				var key = "count(*)";	// dan teng
				logger.debug('total query result: ', result);
				resultSet.blogCount = result[0][key];
				callback(err, resultSet);
			})
		})
	},

	/*
	 This operation is an 3-step transaction:
	 1. save blogs to the feed
	 2. update feed last update time
	 3. return the feed that is updated
	 */
	saveBlogs: function(blogs, feedId, callback) {
		//logger.debug('BlogService.saveBlogs: ', blogs, feedId);
		var values = generateInsertValues(blogs, ['feed_id', 'blog_url', 'blog_title', 'post_date', 'blog_digest']);

		connection.beginTransaction(function(err) {
			if (err) {
				throw err;
			}
			connection.query("INSERT IGNORE INTO blogs (feed_id, blog_url, blog_title, post_date, blog_digest) VALUES ?", [values], function(err, result) {
				if (err) {
					return connection.rollback(function() {
						callback(err);
						throw err;
					});
				}

				// update feed table (last_update)
				connection.query('UPDATE feed SET last_update=? WHERE id = ?', [new Date(), feedId], function(err, result) {
					if (err) {
						return connection.rollback(function() {
							callback(err);
							throw err;
						});
					}
					connection.query('SELECT * from feed WHERE id=' + feedId, function(err, result) {
						if (err) {
							return connection.rollback(function() {
								callback(err);
								throw err;
							});
						}

						logger.debug('BlogService saveBlogs transaction result: ', result);

						connection.commit(function(err) {
							if (err) {
								return connection.rollback(function() {
									callback(err);
									throw err;
								});
							}
							callback(err, result);
							logger.info('BlogService saveBlogs transaction success!');
						});
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
