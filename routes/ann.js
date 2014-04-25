var db = require('../models');

exports.create = function (req, res) {
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

exports.consume = function(req, res) {
	var annid = req.params.id;
	console.log('server side of consume', annid);
	db.AnnotationWhole.findOne({ _id: annid }, function(err, annWhole) {
		if (err) console.log(err);
		console.log(annWhole);
		res.send(annWhole);
	});	
}