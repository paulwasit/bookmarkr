'use strict';

angular.module('shows')
.directive('pwCategoryItem', ['pwArrayToggle', function(pwArrayToggle) {
  return {
    restrict: 'E',
    templateUrl: 'modules/shows/directives/pw-show-list/pw-category/pw-category-item.html',
		scope: {
			genre: '='
		},
		require: '^pwShowList',
		link: function(scope, element, attrs, pwShowListCtrl) { 
      
			scope.toggleGenre = function() { 
        pwArrayToggle(pwShowListCtrl.activeGenres, scope.genre._id);
      };
			
			scope.inActiveGenres = function() { 
				return pwShowListCtrl.activeGenres.indexOf(scope.genre._id) !== -1;
      };
			
    }

  };
}]);