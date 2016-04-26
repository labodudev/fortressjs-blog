/*

Copyright (C) 2016  Jimmy LATOUR
http://labodudev.fr

*/

var ROUTER = UTILS.Router;

var models = [];

/** Read all model files */
fs.readdir(__dirname + "/model/", function(err, files) {
	if (err) console.log(err);

	if (files) {
		for(var key in files) {
			var tmp = require(__dirname + "/model/" + files[key]);
			var index = files[key].split('.');
			models[index[0] + "s"] = tmp;
		}
	}
});

function api()
{
	var self = this;
	this.version = "1";
	this.baseRoute = "/api/v" + this.version + "/";

	this.code = function(req, res)
	{
		ROUTER.addRoute('*', 'GET', self.baseRoute + '*', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			self.getData(res, req.splat[1], function(data) {
				res.statusCode = 200;
				res.end(JSON.stringify(data));
			});
		});

		ROUTER.addRoute('*', 'PUT', self.baseRoute + '*', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			self.getData(res, req.splat[1], function(data) {
				try {
					var objectToAdd = new models[req.splat[1]](req.post);
					if (objectToAdd.validate(data)) {
						data.push(objectToAdd.toObject());

						self.writeData(res, req.splat[1], data, function() {
							res.statusCode = 200;
							res.end(JSON.stringify(objectToAdd.toObject()));
						});
					}
					else {
						res.statusCode = 422;
						res.end(JSON.stringify({"error":"Invalid field"}));
					}
				}
				catch (e) {
					res.statusCode = 422;
					res.end(JSON.stringify({"error":"Invalid field"}));
				}
			});
		});

		ROUTER.addRoute('*', 'POST', self.baseRoute + '*', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			self.getData(res, req.splat[1], function(data) {
				try {
					var index = UTILS.arrayUtil.findIndexByField(req.post.where.slug, data, 'slug');
					if (index >= 0) {
						var objectToEdit = new models[req.splat[1]](req.post.set);
						if(objectToEdit.validate(data)) {
							data[index] = objectToEdit.toObject();
							self.writeData(res, req.splat[1], data, function() {
								res.statusCode = 200;
								res.end(JSON.stringify(objectToEdit.toObject()));
							});
						}
						else {
							res.statusCode = 422;
							res.end(JSON.stringify({"error":"Invalid field"}));
						}
					}
					else {
						res.statusCode = 422;
						res.end(JSON.stringify({"error":"Invalid field"}));
					}
				}
				catch (e) {
					res.statusCode = 422;
					res.end(JSON.stringify({"error":"Invalid field"}));
				}
			});
		});

		ROUTER.addRoute('*', 'DELETE', self.baseRoute + '*', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			self.getData(res, req.splat[1], function(data) {
				try {
					var index = UTILS.arrayUtil.findIndexByField(req.post.where.slug, data, 'slug');
					if (index >= 0) {
						var slug = req.post.where.slug;
						data.splice(index, 1);
						self.writeData(res, req.splat[1], data, function() {
							res.statusCode = 200;
							res.end(JSON.stringify({"slug": slug}));
						});
					}
					else {
						res.statusCode = 422;
						res.end(JSON.stringify({"error":"Invalid field"}));
					}
				}
				catch (e) {
					res.statusCode = 422;
					res.end(JSON.stringify({"error":"Invalid field"}));
				}
			});
		});
	};

	this.getData = function(res, file, callback) {
		fs.readFile( __dirname + "/data/" + file + ".json", 'utf8', function (err, data) {
			if (err) {
				res.statusCode = 500;
				res.end(JSON.stringify({"error": "Internal Server Error"}));
			}

			try {
				data = JSON.parse(data);
			}
			catch (e) {
				data = [];
			}
			
			callback(data);
		});
	};

	this.writeData = function(res, file, data, callback) {
		fs.writeFile(__dirname + "/data/" + file + ".json", JSON.stringify(data), function(err) {
			if (err) {
				res.statusCode = 500;
				res.end(JSON.stringify({"error": "Internal Server Error"}));
			}

			callback();
		});
	};
}
module.exports = api;
