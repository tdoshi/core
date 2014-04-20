var dbUser = require('../models/user');

exports.list = function (req, res) {
	dbUser.User.find({}, function(err, users) {
		console.log("users", users);
		res.send(users);
	});
}