var db = require('../models');

exports.list = function (req, res) {
	db.User.find({}, function(err, users) {
		res.send(users);
	});
}