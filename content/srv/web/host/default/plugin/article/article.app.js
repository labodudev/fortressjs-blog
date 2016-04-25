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
	this.code = function(req, res)
	{
		ROUTER.addRoute('127.0.0.1', 'GET', '/restapi/article', function(req, res) {
			self.getDataArticle(res, function(data) {
				res.end(JSON.stringify(data));
			});
		});

		ROUTER.addRoute('127.0.0.1', 'PUT', '/restapi/article', function(req, res) {
			self.getDataArticle(res, function(data) {
				try {
					var articleToAdd = new articleModel(req.post);
					if(articleToAdd.validate(data)) {
						data.push(articleToAdd.toObject());

						self.writeDataArticle(data, function() {
							res.end('Put');
						});
					}
					else {
						res.end('Invalid data');
					}
				}
				catch (e) {
					res.end('Invalid JSON');
				}
			});
		});

		ROUTER.addRoute('127.0.0.1', 'POST', '/restapi/article', function(req, res) {
			self.getDataArticle(res, function(data) {
				try {
					var index = UTILS.arrayUtil.findIndexByField(req.post.where.slug, data, 'slug');
					if (index >= 0) {
						var articleToAdd = new articleModel(req.post.set);
						if(articleToAdd.validate(data)) {
							data[index] = articleToAdd.toObject();
							self.writeDataArticle(data, function() {
								res.end('Edit');
							});

						}
						else {
							res.end('Invalid data');
						}
					}
					else {
						res.end('Not found');
					}
				}
				catch (e) {
					res.end('Invalid JSON');
				}
			});
		});

		ROUTER.addRoute('127.0.0.1', 'DELETE', '/restapi/article', function(req, res) {
			self.getDataArticle(res, function(data) {
				try {
					var index = UTILS.arrayUtil.findIndexByField(req.post.where.slug, data, 'slug');
					if (index >= 0) {
						data.splice(index, 1);
						self.writeDataArticle(data, function() {
							res.end('Delete');
						});
					}
					else {
						res.end('Not found');
					}
				}
				catch (e) {
					res.end('Invalid JSON');
				}
			});
		});
	};

	this.getDataArticle = function(res, callback) {
		try {
			fs.readFile( __dirname + "/data/" + "article.json", 'utf8', function (err, data) {
				if (err) res.end(err);
				try {
					data = JSON.parse(data);
				}
				catch (e) {
					data = [];
				}

				res.setHeader('Content-Type', 'application/json');
				callback(data);
			});
		}
		catch (e) {
			res.end('Invalid file');
		}
	};

	this.writeDataArticle = function(data) {
		fs.writeFile(__dirname + "/data/article.json", JSON.stringify(data), function(err) {
			if (err) res.end(err);
		});
	}
}
module.exports = article;
