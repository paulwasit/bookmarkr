'use strict';

/**
 * Module dependencies.
 */
var users = require('../../users/controllers/users.server.controller'),
		shows = require('../controllers/shows.server.controller');

module.exports = function(app) {
	
	app.route('/api/shows')
		.get(shows.list)
		.post(shows.create)
		.put(shows.update)
		.delete(shows.delete);
	
	//app.route('/api/shows/add')	
		
	app.route('/api/shows/:id')
		.get(shows.read)
		.put(shows.update)
		.delete(shows.delete);
	
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
