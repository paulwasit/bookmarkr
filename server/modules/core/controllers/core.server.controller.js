'use strict';

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('server/modules/core/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
	console.log("500");
  res.status(500).render('server/modules/core/views/500.server.view', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {
  res.status(404).format({
    'text/html': function () {
      res.render('server/modules/core/views/404.server.view', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
