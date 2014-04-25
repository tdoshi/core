var db = require('../models');

exports.create = function (req, res) {
	console.log('we got into the create server side!');
	console.log("auth?", req.user);
	var annWholeData = req.body.annotationWhole;
	console.log("annotationWhole", annWholeData);
	if (req.user == undefined) {
		res.send(500, "User is not signed in!");
	}
	var annWhole = new db.AnnotationWhole({
		_creator: req.user._id,
		privacy: annWholeData.privacy,
		title: annWholeData.title,
		video_id: annWholeData.video_id,
		updated_at: Date(),
		annotations: annWholeData.annotations
	});
	annWhole.save(function(err) {
		if (err) console.log('there was an error while saving');
	});
	res.send("saved video to profile");
}