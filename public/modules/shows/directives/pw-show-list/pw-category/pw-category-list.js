'use strict';

angular.module('shows')
.directive('pwCategoryList', ['Category', function(Category) {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/shows/directives/pw-show-list/pw-category/pw-category-list.html',
		scope: {
			query: '='
		},
		link: function(scope, element, attrs) {
      scope.genres = Category.query({ fields: JSON.stringify(scope.query) });
    }		
  };
}]);