'use strict';

module.exports = function (ngModule) {
	
	freqJsonPromise = require("./directives/pw-smart-keyboard/helpers/rest.js");
	
	ngModule.config(function ($stateProvider) {
		
		$stateProvider
		
		// view/edit mode
		.state('app.projects', {
			url: '/projects',
			template: require("./projects.html")
		})
		
		.state('app.smartKeyboard', {
			abstract: true,
			url: '/smartKeyboard',
			template: '<ui-view/>'
		})
		
		// view/edit mode
		.state('app.smartKeyboard.demo', {
			url: '/demo',
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
		})
		
		// view/edit mode
		.state('app.smartKeyboard.overview', {
			url: '/overview',
			template: '<pw-article-view-edit article="article"></pw-article-view-edit>',
			resolve: {
				article: ["Articles", function(Articles){
					return Articles.get({ articleId: "57629df0dfbea0f80f2d9be2" }).$promise.then(function (result) {
						return result;
					});
				}]
			},
			controller: ["$scope", "article", function($scope, article) {
				$scope.article = article;
			}]
		})
		
		// view/edit mode
		.state('app.smartKeyboard.article', {
			url: '/article',
			template: '<pw-article-view-edit article="article"></pw-article-view-edit>',
			resolve: {
				article: ["Articles", function(Articles){
					return Articles.get({ articleId: "57629df0dfbea0f80f2d9be2" }).$promise.then(function (result) {
						return result;
					});
				}]
			},
			controller: ["$scope", "article", function($scope, article) {
				$scope.article = article;
			}]
		});
		
	});
};