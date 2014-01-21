
/*
 * GET home page.
 */

module.exports = function(app) {

  var fs = require('fs');
  var routes = {};

  routes.index = function(req, res) {
    console.log ("ind"+req.query.s);
    if (req.query.s && req.query.a) {
      app.login({accessKey: req.query.a, secretKey: req.query.s});
    }
    if (!app.isLoggedIn()) res.render('login', { title: 'LOGIN' });
    else res.render('index', { title: 'HCV' });
  };

  routes.confirm = function(req, res) {
    if (!app.isLoggedIn()) res.render('login', { title: 'LOGIN' });
    else {
      app.addTask({'title':req.query.q});
      res.render('confirm', { query: req.query.q });
    }
  };

  routes.remove = function(req, res) {
    if (!app.isLoggedIn()) res.render('login', { title: 'LOGIN' });
    else {
      app.removeTask(req.query.hit)
      res.render('manage', { tasks: app.getTasks() }); //pend
    }
  };

  routes.manage = function(req, res) {
    if (!app.isLoggedIn()) res.render('login', { title: 'LOGIN' });
    else res.render('manage', { tasks: app.getTasks() }); //pend
  };

  routes.login = function(req, res) {
    res.render('login', { title: 'LOGIN' });
  };

  routes.upload = function(req, res) {
    console.log('upload');
    fs.readFile(req.files.image.path, function (err, data) {

      var imageName = req.files.image.name

      /// If there's an error
      if(!imageName){

        console.log("There was an error")
        res.redirect("/");
        res.end();

      } else {

        var newPath = "../"+__dirname + "/uploads/" + imageName;

        /// write file to uploads/fullsize folder
        fs.writeFile(newPath, data, function (err) {

          /// let's see it
          res.redirect("../uploads/" + imageName);

        });
      }
    });
  };

  routes.uploads = function(req, res) {
    file = req.params.file;
    var img = fs.readFileSync("../"+__dirname + "/uploads/" + file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
  };

  return routes;
};