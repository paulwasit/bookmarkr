'use strict';

module.exports = function (ngModule) {
	
	smartKeyboardPromise = require("./components/pw-smart-keyboard/helpers/rest.js");
	//stormReportPromise = require("./components/pw-storm-report/helpers/rest.js");
	
	
	ngModule.config(function ($stateProvider) {
		
		$stateProvider
		
		// view/edit mode
		.state('app.projects', {
			url: '/projects',
			template: require("./projects.html")
		})
		
		// ------------------------------ SMART KEYBOARD ------------------------------ //
		
		.state('app.smartKeyboard', {
			abstract: true,
			url: '/smartKeyboard',
			template: '<ui-view/>'
		})
		
		// view/edit mode
		.state('app.smartKeyboard.demo', {
			url: '/demo',
			template: '<pw-smart-keyboard json-data="jsonData"></pw-smart-keyboard>',
			resolve: {
				jsonData: function($q, $http){
					var promise = smartKeyboardPromise($q, $http);
					return promise.then (function (results) {
						var resultObj = {};
						results.forEach(function (val, i) {
							resultObj[String(i)] = val.data;
						});
						return resultObj;
					})
				}
			},
			controller: ["$scope", "jsonData", function($scope, jsonData) {
				$scope.jsonData = jsonData;
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
		})
		
		
		
		// ------------------------------ STORM REPORT ------------------------------ //
		
		.state('app.stormReport', {
			abstract: true,
			url: '/stormReport',
			template: '<ui-view/>'
		})
		
		// view/edit mode
		.state('app.stormReport.demos', {
			url: '/demo',
			template: '<pw-storm-report></pw-storm-report>'
		})
		
		// view/edit mode
		.state('app.stormReport.overview', {
			url: '/summary',
			template: '<pw-article-view article="article" is-project="true"></pw-article-view>',
			resolve: {
				article: ["Articles", function(Articles){
					return Articles.get({ articleId: "57c6a5be58d0d90300b53e37" }).$promise.then(function (result) {
						return result;
					});
				}]
			},
			controller: ["$scope", "article", function($scope, article) {
				$scope.article = article;
			}]
		})
		
		// view/edit mode
		.state('app.stormReport.article', {
			url: '/in-depth',
			template: '<pw-article-view article="article" is-project="true"></pw-article-view>',
			resolve: {
				article: ["Articles", function(Articles){
					return Articles.get({ articleId: "57c6a66458d0d90300b53e39" }).$promise.then(function (result) {
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