var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Created at information is in the _id field which mongod adds
// http://docs.mongodb.org/manual/reference/object-id/#ObjectIDs-TheBSONObjectIdDatatype
// eg. db.users.findOne()._id.getTimestamp()

var UserSchema = new Schema({
	fb_id: String,
	first_name: { type: String, required: true },
	last_name: String,
	gender: String,
	img_path: String,
	location: String,
	email: String,
	access_token: String,
	annotations: [{ type: Schema.Types.ObjectId, ref: 'AnnotationWhole' }]
});
// last: { type: String, trim: true }

var AnnotationSchema = new Schema({
	duration: Number,
	num_votes: Number,
	content: String
});

var AnnotationWholeSchema = new Schema({
	_creator: { type: Schema.Types.ObjectId, ref: 'User' }, // reference to the user who created this 
	privacy: String, 
	title: String,
	video_id: String, // youtube video id
	meta: {
		num_votes: Number,
		favs: Number	
	},
	updated_at: Date,
	annotations: [AnnotationSchema]
});

// assign a function to the "methods" object of our animalSchema
// animalSchema.methods.findSimilarTypes = function (cb) {
//   return this.model('Animal').find({ type: this.type }, cb);
// }

// personSchema.virtual('name.full').get(function () {
//   return this.name.first + ' ' + this.name.last;
// });

exports.User = mongoose.model('User', UserSchema);
exports.Annotation = mongoose.model('Annotation', AnnotationSchema);
exports.AnnotationWhole = mongoose.model('AnnotationWhole', AnnotationWholeSchema);