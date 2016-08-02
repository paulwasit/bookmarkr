'use strict';

/**
 * Module dependencies.
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');

module.exports = function (app) {
	// images loader
	app.route('/api/articles/getSignedUrl').all(articlesPolicy.isAllowed)
		.post(articles.getSignedUrl);
	app.route('/api/articles/uploadImg').all(articlesPolicy.isAllowed)
		.post(articles.uploadImg);
	
  // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(articles.create)
		.put(articles.update)
		.delete(articles.delete);
		
  // Single article routes
  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);
};
