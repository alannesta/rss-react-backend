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
			throw error;
		}
		res.json(results);
	})

});

router.get('/feed/:id', function (req, res) {
	FeedService.getFeedByID(req.params.id, function(error, results) {
		if (error) {
			throw error;
		}
		res.json(results[0]);	// only one feed should be get
	})

});

router.post('/feed/:id', function (req, res) {
	FeedService.updateFeed(req.body, function(err, result) {
		if (err) {
			console.log(err)
		} else {
			res.status(200).send('update success');
		}
	})
});

// save blog content
router.post('/feed/:id/blogs', function (req, res) {
	BlogService.saveBlogs(req.body, req.params.id, function(err, result) {
		if (err) {
			logger.error(err);
		} else {
			res.status(200).send('blogs save success');
		}
	})
});

router.get('/feed/:id/blogs', function (req, res) {
	BlogService.getAllBlogs(req.params.id, function(err, result) {
		if (err) {
			console.log(err)
		} else {
			res.status(200).json(result);
		}
	})
});

router.post('/feed', function (req, res) {
	FeedService.saveFeed(req.body, function(err, result) {
		if (err) {
			console.log(err)
		} else {
			// has to return the feed to trigger auto select
			res.status(200).send({
				id: result.insertId,
				feedName: req.body.name,
				feedUrl: req.body.feedUrl
			});
		}
	})
});

router.delete('/feed/:id', function (req, res) {
	FeedService.deleteFeedByID(req.params.id, function(err, results) {
		if (err) {
			console.log(err);
		}
		if (!err) {
			res.status(200).send('removed successfully');
		}
	})

});

module.exports = router;
