var db = require('../models');

exports.list = function (req, res) {
	db.User.find({}, function(err, users) {
		res.send(users);
	});
}

exports.findOne = function (req, res) {
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
	});
}

// Get data of currently signed in user
exports.me = function(req, res) {
  db.User
    .findOne( { _id: req.user._id }, function(err, user) {
    	if (err) {
        error(res, 'User ' + req.user.id + ' does not exist.');
      } else {
        res.send(user);
      }
    });
};