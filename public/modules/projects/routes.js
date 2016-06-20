'use strict';

module.exports = function (ngModule) {
	
	freqJsonPromise = require("./directives/pw-smart-keyboard/helpers/rest.js");
	
	ngModule.config(function ($stateProvider) {
		
		$stateProvider
		.state('app.projects', {
			abstract: true,
			url: '/projects',
			template: '<ui-view/>'
		})
		
		// view/edit mode
		.state('app.projects.smartKeyboard', {
			url: '/smartKeyboard',
			template: '<pw-smart-keyboard freq-json="freqJson"></pw-smart-keyboard>',
			resolve: {
				freqJson: function($q, $http){
					var promise = freqJsonPromise($q, $http);
					return promise.then (function (results) {
						var resultObj = {};
						results.forEach(function (val, i) {
							resultObj[String(i)] = val.data;
						});
						return resultObj;
					})
				}
			},
			controller: ["$scope", "freqJson", function($scope, freqJson) {
				$scope.freqJson = freqJson;
			}]
		});

	});
	
};