/*

Copyright (C) 2016  Jimmy LATOUR
http://labodudev.fr 

*/

var url = require('url');

var ROUTER = UTILS.Router;

var articleModel = require('./model/article.model.js' );

function article()
{
	this.code = function(req, res)
	{
		ROUTER.addRoute('127.0.0.1', 'GET', '/restapi/article', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			fs.readFile(__dirname + "/data/" + "article.json", 'utf8', function (err, data) {
	  		res.end(data);
	   	});
		});

		ROUTER.addRoute('127.0.0.1', 'PUT', '/restapi/article', function(req, res) {
			res.setHeader('Content-Type', 'application/json');

   		fs.readFile( __dirname + "/data/" + "article.json", 'utf8', function (err, data) {
				try {
					data = JSON.parse(data);
				}
				catch (ex) {
					data = [];
				}

				try {
					var articleToAdd = new articleModel(req.post);
					if(articleToAdd.validate(data)) {
						data.push(articleToAdd.toObject());

						fs.writeFile(__dirname + "/data/article.json", JSON.stringify(data), function(err) {
							if (err) res.end(err);

							res.end(JSON.stringify(data));
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
			res.setHeader('Content-Type', 'application/json');

   		fs.readFile( __dirname + "/data/" + "article.json", 'utf8', function (err, data) {
				try {
					data = JSON.parse(data);
				}
				catch (ex) {
					data = [];
				}

				try {
					var index = UTILS.arrayUtil.findIndexByField(req.post.where.slug, data, 'slug');
					if (index >= 0) {
						var articleToAdd = new articleModel(req.post.set);
						if(articleToAdd.validate(data)) {
							data[index] = articleToAdd.toObject();
							fs.writeFile(__dirname + "/data/article.json", JSON.stringify(data), function(err) {
								if (err) res.end(err);

								res.end(JSON.stringify(data));
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
			res.setHeader('Content-Type', 'application/json');

   		fs.readFile( __dirname + "/data/" + "article.json", 'utf8', function (err, data) {
				try {
					data = JSON.parse(data);
				}
				catch (ex) {
					data = [];
				}

				try {
					var index = UTILS.arrayUtil.findIndexByField(req.post.where.slug, data, 'slug');
					if (index >= 0) {
						data.splice(index, 1);

						fs.writeFile(__dirname + "/data/article.json", JSON.stringify(data), function(err) {
							if (err) res.end(err);

							res.end(JSON.stringify(data));
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
}
module.exports = article;
