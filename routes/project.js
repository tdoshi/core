var models = require('../models');

exports.projectInfo = function(req, res) { 
  var projectID = req.params.id;
  console.log('finding project');
  // query for the specific project and
  // call the following callback
  models.Project
    .find( {"_id": projectID} )
    .exec(afterQuery);

  function afterQuery(err, projects) {
    if(err) console.log(err);
    res.json(projects[0]);
  }
}

exports.addProject = function(req, res) {
  var form_data = req.body;
  console.log(form_data);

  var newPost = new models.Project({
    "title": form_data.project_title,
    "date": form_data.date,
    "summary": form_data.summary,
    "image": form_data.image_url
  });
  newPost.save(afterSaving);
  // make a new Project and save it to the DB
  // YOU MUST send an OK response w/ res.send();
  
  function afterSaving(err) { // this is a callback
    if(err) {console.log(err); res.send(500); }
    console.log('successfully saved');
    res.send();
  }
}

exports.deleteProject = function(req, res) {
  var projectID = req.params.id;

  // find the project and remove it
  models.Project
    .find( {"_id": projectID} )
    .remove()
    .exec(afterDelete);

  // YOU MUST send an OK response w/ res.send();
  function afterDelete(err, projects) {
    if(err) console.log(err);
    res.send();
  }
}