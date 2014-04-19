var Mongoose = require('mongoose');

var ProjectSchema = new Mongoose.Schema({
	"title": String,
	"date": Date,
	"summary": String,
	"image": String
});

var UserSchema = new Mongoose.Schema({
	"fb_id": String,
	"first_name": String,
	"last_name": String,
	"gender": String,
	"img_path": String,
	"location": String,
	"email": String
});

exports.Project = Mongoose.model('Project', ProjectSchema);
exports.User = Mongoose.model('User', UserSchema);


