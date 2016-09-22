'use strict';

module.exports = function (ngModule) {
	
	ngModule.config(function ($stateProvider) {
		
		$stateProvider
		
		// view/edit mode
		.state('app.contact', {
			url: '/contact',
			template: '<pw-contact></pw-contact>'
		});
		
	});
};