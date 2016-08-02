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
			url: '/summary',
			template: '<pw-article-view article="article" is-project="true"></pw-article-view>',
			resolve: {
				article: ["Articles", function(Articles){
					return Articles.get({ articleId: "5766ddcbeb4fb57c0b89f530" }).$promise.then(function (result) {
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
			url: '/in-depth',
			template: '<pw-article-view article="article" is-project="true"></pw-article-view>',
			resolve: {
				article: ["Articles", function(Articles){
					return Articles.get({ articleId: "57a0b73275b8600300fa4c84" }).$promise.then(function (result) {
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