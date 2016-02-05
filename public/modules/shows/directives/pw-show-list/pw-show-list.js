'use strict';

angular.module('shows')
.directive('pwShowList', ['Show', 'itemUpdate', function(Show, itemUpdate) {
  return {	
		restrict: 'E',
		replace: true,
    templateUrl: 'modules/shows/directives/pw-show-list/pw-show-list.html',
		scope: {
			query: '=' // the query is defined in ../config/routes to handle the display options (fav, trash, ...)
		},
		controller: ['$scope', function($scope) {
			
			// we get shows based on the query params then build the tags array based on the shows genres
			$scope.shows = Show.query({ fields: JSON.stringify($scope.query) }, function () {

				// we store tags in an array of objects {name: tagName, count: tagCount}
				$scope.tags = itemUpdate.getUniqueTags ($scope.shows, 'genre');

			});
			
			// arrays used to filter shows. populated both in the card list & the tag list directives
			this.activeTags = [];
			this.selectedTags = [];
			
		}],
		controllerAs: 'ctrl'
  };
}]);