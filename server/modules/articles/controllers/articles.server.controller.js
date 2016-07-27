'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
	_ = require('lodash'),
  errorHandler = require(path.resolve('./server/modules/core/controllers/errors.server.controller'));

/**
 * Create a article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
	
	var updateQuery = [];
	
	// multi update: list page
	if (Object.getOwnPropertyNames(req.query).length > 0) {
		var items = JSON.parse(req.body.items);
		
		if (typeof req.query.set !== 'undefined') updateQuery.push({$set: JSON.parse(req.query.set)}); 
		if (typeof req.query.pull !== 'undefined') updateQuery.push({$pull: JSON.parse(req.query.pull)}); 
		if (typeof req.query.addToSet !== 'undefined') updateQuery.push({$addToSet: JSON.parse(req.query.addToSet)}); 
	}
	
	// single update: article page
	else {

		var items = [];
		items.push(req.body._id);
		
		var set = {
			title: req.body.title,
			imgUrl: req.body.imgUrl,
			content: req.body.content,
			tags: req.body.tags,
			index: req.body.index,
			isPublic: req.body.isPublic,
			isSlide: req.body.isSlide
		};
		
		updateQuery.push({$set: set});

	}
	
	var isError = false;
	for (var i=0, len=updateQuery.length; i<len;i++) {
		console.log(updateQuery[i]);
		Article.update(
			{ _id: { $in: items } }, 
			updateQuery[i],
			{ multi: true },
			function (err, numAffected) {
				//if (err) return next(err);
				if (err) {
					isError = true;
					return console.log(err);
				}
				console.log(numAffected.nModified + ' doc updated');
			}
		);
	}
	if (isError === false) return res.status(200).json(req.body);
	
	/*
  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
	*/
	
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
	
	console.log("in there");
	console.log(req.article);
	console.log(req.query);
	if (req.article) {
		var article = req.article;
		article.remove(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(article);
			}
		});
	}
	else {
		var removeQuery = JSON.parse(req.query.fields),
				selectedItems = JSON.parse(req.query.items);
		if (selectedItems.length > 0) removeQuery._id = { $in: selectedItems };
		console.log(removeQuery);
		Article.remove(
			removeQuery, 
			{justOne: true},
			function (err, numAffected) {
				//if (err) return next(err);
				if (err) {
					isError = true;
					return console.log(err);
				}
				console.log(numAffected.nRemoved + ' doc updated');
			}
		);
	}
	
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
	
	var queryFields = {};
	queryFields = JSON.parse(req.query.fields);
	
	var query = Article
							.find(queryFields)
							.or([{user: req.user}, {isPublic: true}])
							.sort('created')
							.populate('user', 'displayName');
	
  query.exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
	
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }
	
  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
	
};
