'use strict';

module.exports = function (ngModule) {
	
	//var Items = require('../../../items/items.service')(ngModule);
	require('./pw-card/pw-card-list')(ngModule);
	require('./pw-card/pw-card-item')(ngModule);
	
	ngModule.directive('pwArticleList', function($location, Articles, Items) {
		
		return {
			restrict: 'E',
			template: require('./pw-article-list.html'),
			scope: {
				query: '=' // the query is defined in ../config/routes to handle the display options (fav, trash, ...)
			},
			link: function(scope, element, attrs) {},
			controller: ['$scope', function($scope) {
				
				// we get articles based on the query params then build the tags array
				$scope.articles = Articles.query({ fields: JSON.stringify($scope.query) }, function () {
				
					// we store tags in an array of objects {name: tagName, count: tagCount}
					$scope.tags = Items.getUniqueTags ($scope.articles, 'tags');
					return Items.getItems ($scope.articles);
					
				});
				
				// arrays used to filter articles. populated both in the card list & the tag list directives
				this.activeTags = [];
				
				$scope.$on('$destroy', function() {
					return Items.reset();
				});
				
			}],
			controllerAs: 'ctrl'
			
		};
		
	});

};