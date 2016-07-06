'use strict';

module.exports = function (ngModule) {
	
	//var Items = require('../../../items/items.service')(ngModule);
	require('./pw-card/pw-card-list')(ngModule);
	require('./pw-card/pw-card-item')(ngModule);
	require('./pw-category/pw-category-list')(ngModule);
	require('./pw-category/pw-category-item')(ngModule);
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
				
				scope.createItem = function() {
					var article = new Articles({
						title: "Untitled",
						content: [{body: 'start typing here'}]
					});

					article.$save(
						function(response) {
							$location.path('articles/' + response._id);
						},
						function(errorResponse) {
							scope.error = errorResponse.data.message;
						}
					);
				};
				
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