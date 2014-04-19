
var models = require('../models');

exports.splash = function(req, res) {
	// var data = {
 //    app_id: process.env.FACEBOOK_APP_ID
 //  };
 	data = {}
  res.render('splash', data);
}

exports.view = function(req, res){

	models.Project
		.find()
		.sort('date')
		.exec(renderProjects);

	function renderProjects(err, projects) {
		res.render('index', { 'projects': projects });
	}

};