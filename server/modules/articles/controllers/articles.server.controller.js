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
	
	/*
	if (Object.getOwnPropertyNames(req.query).length > 0) {
		var query = JSON.parse(req.query.fields);
		var shows = JSON.parse(req.body.items);
	}
	else {
		var shows = [];
		shows.push(req.body._id);
		var query = {genre: req.body.genre};
	}
	
	Show.update(
		{ _id: { $in: shows } }, 
		{ $set: query }, 
		{ multi: true },
		function (err, numAffected) {
			if (err) return next(err);
			console.log(numAffected + ' doc updated');
			return res.status(200).json(req.body);
		}
	);
	*/
	
	
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;
	article.tags = req.body.tags;
	article.index = req.body.index;
	article.isPublic = req.body.isPublic;
	
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
 * Delete an article
 */
exports.delete = function (req, res) {
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
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
	
	var queryFields = {};
	queryFields = JSON.parse(req.query.fields);
	//queryFields.user = req.user._id;
	
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
