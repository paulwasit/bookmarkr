'use strict';

/**
 * Module dependencies.
 */
var users = require('../../users/controllers/users.server.controller'),
		categories = require('../controllers/categories.server.controller');

module.exports = function(app) {
	
	app.route('/api/categories')
		.get(categories.list);

	/*app.route('/articles')
		.get(articles.list)
		.post(users.requiresLogin, articles.create);

	app.route('/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);*/
	
};
