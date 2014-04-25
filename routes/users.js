var db = require('../models');

exports.list = function (req, res) {
	db.User.find({}, function(err, users) {
		res.send(users);
	});
}

exports.findOne = function (req, res) {
	// TODO: check if user is signed in here
	var userid = req.params.id;
	db.User.findOne({ _id: userid }, function(err, user) {
		db.AnnotationWhole.find({ _creator: userid, privacy: 'public' }, 'title video_id updated_at', function(err, annList) {
			console.log("annList", annList);
			var data = {
				'user': user,
				'annList': annList
			};
			res.send(data);
		});
	})
}