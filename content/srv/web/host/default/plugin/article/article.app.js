/*

Copyright (C) 2016  Jimmy LATOUR
http://labodudev.fr

*/

var url = require('url');

var ROUTER = UTILS.Router;

var articleModel = require('./model/article.model.js' );

function article()
{
	var self = this;
	this.version = "1";
	this.baseRoute = "/api/v" + this.version + "/";

	this.code = function(req, res)
	{
		ROUTER.addRoute('127.0.0.1', 'GET', self.baseRoute + 'articles', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			self.getDataArticle(res, function(data) {
				res.statusCode = 200;
				res.end(JSON.stringify(data));
			});
		});

		ROUTER.addRoute('127.0.0.1', 'PUT', self.baseRoute + 'articles', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			self.getDataArticle(res, function(data) {
				try {
					var articleToAdd = new articleModel(req.post);
					if (articleToAdd.validate(data)) {
						data.push(articleToAdd.toObject());

						self.writeDataArticle(res, data, function() {
							res.statusCode = 200;
							res.end(JSON.stringify(articleToAdd.toObject()));
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

		ROUTER.addRoute('127.0.0.1', 'POST', self.baseRoute + 'articles', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			self.getDataArticle(res, function(data) {
				try {
					var index = UTILS.arrayUtil.findIndexByField(req.post.where.slug, data, 'slug');
					if (index >= 0) {
						var articleToEdit = new articleModel(req.post.set);
						if(articleToEdit.validate(data)) {
							data[index] = articleToEdit.toObject();
							self.writeDataArticle(res, data, function() {
								res.statusCode = 200;
								res.end(JSON.stringify(articleToEdit.toObject()));
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

		ROUTER.addRoute('127.0.0.1', 'DELETE', self.baseRoute + 'articles', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			self.getDataArticle(res, function(data) {
				try {
					var index = UTILS.arrayUtil.findIndexByField(req.post.where.slug, data, 'slug');
					if (index >= 0) {
						var slug = req.post.where.slug;
						data.splice(index, 1);
						self.writeDataArticle(res, data, function() {
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

	this.getDataArticle = function(res, callback) {
		fs.readFile( __dirname + "/data/" + "articles.json", 'utf8', function (err, data) {
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

	this.writeDataArticle = function(res, data, callback) {
		fs.writeFile(__dirname + "/data/articles.json", JSON.stringify(data), function(err) {
			if (err) {
				res.statusCode = 500;
				res.end(JSON.stringify({"error": "Internal Server Error"}));
			}

			callback();
		});
	};
}
module.exports = article;
