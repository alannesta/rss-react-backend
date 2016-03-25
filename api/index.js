/*
	Mongo DB
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var CONFIG = require('../../config.js');
var db;

db = mongoose.createConnection(CONFIG.prodUrl);

var FeedSchema = require('../models/feeds');
var Feeds = db.model('Feeds', FeedSchema);

router.get('/feeds', function (req, res) {
	Feeds.find({}, function (err, docs) {
		if (!err) {
			res.json(docs);
		}
	});
});

router.post('/feed', function (req, res) {
	console.log(req.body);
	Feeds.create({feedUrl: req.body.feedUrl, name: req.body.name}, function (err, feed) {
		if (err) {
			console.log(err);
			res.status(400).send('failed to create stuff');

		} else {
			console.log('feed successfully created');
			res.status(200).json(feed);		// has to return the model to trigger backbone collection 'sync'
		}
	});
});

router.delete('/feed/:id', function (req, res) {
	Feeds.remove({_id: req.params.id}, function (err) {
		if (!err) {
			res.status(200).send('removed successfully');
		}
	});
});


module.exports = router;
