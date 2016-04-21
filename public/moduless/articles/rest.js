'use strict';

module.exports = function (ngModule) {
	
	ngModule.factory('Articles', function ($resource) {
		return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
	});

};