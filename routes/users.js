var db = require('../models');

exports.list = function (req, res) {
	db.User.find({}, function(err, users) {
		res.send(users);
	});
}

exports.findOne = function (req, res) {
	console.log('hello from server '  + req.params.id);
	// res.send('hello my favortie site');
	db.User.findOne({"_id" : req.params.id}, function(err, user) {
		res.send(user);
	})
}