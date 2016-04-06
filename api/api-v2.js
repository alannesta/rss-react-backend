/*
 	MySQL
 */
var express = require('express');
var router = express.Router();

var FeedService = require('../services/feedService');
var BlogService = require('../services/blogService');

var logger = require('../utils/logger');


router.get('/feeds', function (req, res) {
	FeedService.getAllFeeds(function(error, results) {
		if (error) {
			res.status(500).send(error);
		}
		res.json(results);
	})

});

router.get('/feed/:id', function (req, res) {
	FeedService.getFeedByID(req.params.id, function(error, results) {
		if (error) {
			res.status(500).send(error);
		}
		res.json(results[0]);	// only one feed should be get
	})

});

//update feed (timestamp etc.)
router.post('/feed/:id', function (req, res) {
	FeedService.updateFeed(req.body, function(err, result) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).json(result);
		}
	})
});

// save blog content
router.post('/feed/:id/blogs', function (req, res) {
	BlogService.saveBlogs(req.body, req.params.id, function(err, result) {
		if (err) {
			res.status(500).send(err);
		} else {
			logger.debug('update blogs result: ', result);
			res.status(200).json(result);
		}
	})
});

router.get('/feed/:id/blogs', function (req, res) {
	BlogService.getBlogs(req.params.id, req.query.count, function(err, result) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).json(result);
		}
	})
});

router.post('/feed', function (req, res) {
	FeedService.saveFeed(req.body, function(err, result) {
		if (err) {
			res.status(500).send(err);
		} else {
			// has to return the feed to trigger auto select
			res.status(200).send({
				id: result.insertId,
				feedName: req.body.feedName,
				feedUrl: req.body.feedUrl
			});
		}
	})
});

router.delete('/feed/:id', function (req, res) {
	FeedService.deleteFeedByID(req.params.id, function(err, results) {
		if (err) {
			res.status(500).send(err);
		}
		if (!err) {
			res.status(200).send('removed successfully');
		}
	})

});

module.exports = router;
