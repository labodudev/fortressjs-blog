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
		for (var key in files) {
			if (files[key] != "object.model.js") {
				var tmp = require(__dirname + "/model/" + files[key]);
				var index = files[key].split('.');
				models[index[0] + "s"] = tmp;
			}
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
				var dataModel = [];
				var params = UTILS.dataUtil.isEmpty(req.post) ? req.get : req.post;
				// Vérifie les données
				for(var key in data) {
					var objectToView = new models[req.splat[1]]('GET', data[key]);
					if (objectToView.validate(data, params))
						dataModel.push(objectToView.toObject());
				}

				res.statusCode = 200;
				res.end(JSON.stringify(dataModel));
			});
		});

		ROUTER.addRoute('*', 'PUT', self.baseRoute + '*', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			self.getData(res, req.splat[1], function(data) {
				try {
					var params = UTILS.dataUtil.isEmpty(req.post) ? req.get : req.post;
					var objectToAdd = new models[req.splat[1]]('PUT', params);
					if (objectToAdd.validate(data, {})) {
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
					var params = UTILS.dataUtil.isEmpty(req.post) ? req.get : req.post;
					for(var key in data) {
						var objectToEdit = new models[req.splat[1]]('GET', params.set);
						if(objectToEdit.validate(data, params.where)) {
							data[key] = objectToEdit.toObject();
						}
					}

					self.writeData(res, req.splat[1], data, function() {
						res.statusCode = 200;
						res.end(JSON.stringify(objectToEdit.toObject()));
					});
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
					var params = UTILS.dataUtil.isEmpty(req.post) ? req.get : req.post;
					for(var key in data) {
						var objectToEdit = new models[req.splat[1]]('GET', data[key]);
						if(objectToEdit.validate(data, params)) {
							data.splice(key, 1);
						}

						self.writeData(res, req.splat[1], data, function() {
							res.statusCode = 200;
							res.end(JSON.stringify(objectToEdit.toObject()));
						});
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
