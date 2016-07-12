'use strict';

module.exports = function (ngModule) {

	require('../../../../_misc/pw-in-header')(ngModule);	
	
	ngModule.directive('pwArticleListButtons', function(Items, $location, $rootScope) {
		return {
			restrict: 'EA',
			template: require('./pw-article-list-buttons.html'),
			scope: false,
			link: function(scope, element, attrs) {
				
				// show/hide toc on mobile
				scope.toggleAsideCollapse = function() {
					scope.isAsideCollapsed = !scope.isAsideCollapsed;
				};
				
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
				
				// Enter / leave edit mode
				/*
				scope.toggleEditMode = function () {
					scope.isEditMode = !scope.isEditMode;
					scope.sortableConfig.disabled = !scope.sortableConfig.disabled;
					if (scope.isEditMode) {
						scope.StartTimer();
					}
					else {
						scope.updateFn();
						scope.StopTimer();
						// allows the scrollspy to reset when leaving the edit mode
						// this is necessary because the ng-if destroys the scope previously used to spy on elements
						$rootScope.$broadcast('$locationChangeSuccess'); 
					}
				};
				*/
				
			}
		};
	});
	
};

