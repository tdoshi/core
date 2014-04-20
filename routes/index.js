exports.splash = function(req, res) {
	// var data = {
 //    app_id: process.env.FACEBOOK_APP_ID
 //  };
 	data = {}
  res.render('splash', data);
}

exports.view = function(req, res){
	res.render('index');
};