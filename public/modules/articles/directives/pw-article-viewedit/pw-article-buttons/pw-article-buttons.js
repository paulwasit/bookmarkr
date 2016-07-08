'use strict';

module.exports = function (ngModule) {

	require('../../../../_misc/pw-in-header')(ngModule);	
	
	ngModule.directive('pwArticleButtons', function(Items, $location, $rootScope) {
		return {
			restrict: 'EA',
			template: require('./pw-article-buttons.html'),
			scope: false,
			link: function(scope, element, attrs) {
				
				// remember the query that was active when the user clicked the link
				scope.listQuery = Items.getListQuery();
				
				// Make an Article Public / Private
				scope.toggleAsideCollapse = function() {
					scope.isAsideCollapsed = !scope.isAsideCollapsed;
				};
				
				// Make an Article Public / Private
				scope.toggleIsPublic = function() {
					scope.article.isPublic = !scope.article.isPublic;
					scope.updateFn();
				};
				
				// Make an Article Slide / Full
				scope.toggleIsSlide = function() {
					scope.article.isSlide = !scope.article.isSlide;
					scope.updateFn();
				};
				
				//scope.toggleSlideFullScreen = function () {	scope.isFullScreen = !scope.isFullScreen; };
				
				// Enter / leave edit mode
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
				
			}
		};
	});
	
};

