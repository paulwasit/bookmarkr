'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwArticleList', function($location, Articles) {
		
		return {
			restrict: 'E',
			template: require('./pw-article-list.html'),
			scope: {},
			link: function(scope, element, attrs) {
				
				var numberOfArticles = 0;
				
				/* we pull the articles & sort them */
				scope.articles = Articles.query(function () {
					scope.articles.sort(function (a, b) {
						return a.index < b.index;
					});
					numberOfArticles = scope.articles.length;
				});
				
				/* functions */
			
				/* sortable options, including the position update */
				scope.sortableOptions = {
					placeholder: "app-ph",
					disabled: true,
					stop: function(e, ui) {
						/*
						for (var i = 0; i < scope.articles.length; i++) {
							console.log(scope.articles[i]);
						}
						*/
					}
				};
				
				scope.enableSortable = function () {
					scope.sortableOptions.disabled = false;
				};
				
				scope.updateSortable = function () {
					for (var i = 0; i < scope.articles.length; i++) {
						scope.articles[i].index = numberOfArticles - i;
						scope.articles[i].$update(function() {
						});
					}
					scope.sortableOptions.disabled = true;
				};
				
				scope.cancelSortable = function () {
					scope.articles.sort(function (a, b) {
						return a.index < b.index;
					});
					scope.sortableOptions.disabled = true;
				};
				
			}
		};
	});

};