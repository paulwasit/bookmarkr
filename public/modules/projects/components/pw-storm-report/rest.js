'use strict';

module.exports = function (ngModule) {
	
	ngModule.factory('StormReport', function ($resource) {
		/*
		return $resource('api/stormReport/:harmTypeSwitch', {
			harmTypeSwitch: '@harmTypeSwitch'
		});
		*/
		return $resource('api/stormReport/');
	});

};