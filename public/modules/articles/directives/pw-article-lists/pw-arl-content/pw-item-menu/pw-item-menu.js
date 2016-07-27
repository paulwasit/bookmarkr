'use strict';

module.exports = function (ngModule) {
	
	ngModule.component('pwItemMenu', {
		template: require('./pw-item-menu.html'),
		bindings: {
			item: "=",
		},
		controller: [function () {}]		
	});
	
	};