'use strict';

module.exports = function (ngModule) {
	
	ngModule.factory('Users', function ($resource) {
		return $resource('api/users', {}, {
			update: {
				method: 'PUT'
			}
		});
	});

};
