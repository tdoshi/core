var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
	"fb_id": String,
	"first_name": { type: String, required: true },
	"last_name": String,
	"gender": String,
	"img_path": String,
	"location": String,
	"email": String,
	"access_token": String
});

exports.User = Mongoose.model('User', UserSchema);