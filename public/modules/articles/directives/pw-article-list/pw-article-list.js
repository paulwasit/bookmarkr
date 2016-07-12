'use strict';

module.exports = function (ngModule) {
	
	//var Items = require('../../../items/items.service')(ngModule);
	require('./pw-card/pw-card-list')(ngModule);
	require('./pw-card/pw-card-item')(ngModule);
	require('./pw-category/pw-category-list')(ngModule);
	require('./pw-category/pw-category-item')(ngModule);
	
	require('./pw-article-list-buttons/pw-article-list-buttons')(ngModule);
	
	var modalTemplate = require('../../../_misc/pw-modal-template');
	
	ngModule.directive('pwArticleList', function($location, $uibModal, Articles, Authentication, Items) {
		
		return {
			restrict: 'E',
			template: require('./pw-article-list.html'),
			scope: {
				articles: '='
			},
			link: function(scope, element, attrs) {
				
				// authentication (show/hide 'create new' button)
				scope.user = Authentication.user;
				
				scope.isAsideCollapsed = true;
				//scope.isEditMode = false;
				
			},
			controller: ['$scope', function($scope) {
				
				Items.setItems( $scope.articles );
				$scope.tags = Items.getUniqueTags();
				
				
				// arrays used to filter articles. populated both in the card list & the tag list directives
				this.activeTags = [];
				
				$scope.$on('itemsUpdate', function(event, items) {
					$scope.$evalAsync(function() {
						$scope.articles = Items.getItems ();
						$scope.tags = Items.getUniqueTags ();
					});
				});
		
				$scope.$on('$destroy', function() {
					return Items.reset();
				});
				
			}],
			controllerAs: 'ctrl'
			
		};
		
	});

};