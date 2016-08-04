'use strict';

module.exports = function (ngModule) {
	
	ngModule.config(function ($stateProvider) {
		
		$stateProvider
		
		// view/edit mode
		.state('app.test', {
			url: '/test',
			template: '<testing></testing>'
		});
		
	});
};