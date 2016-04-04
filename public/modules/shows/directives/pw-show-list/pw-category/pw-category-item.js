'use strict';

angular.module('shows')
.directive('pwTagItem', ['pwArrayToggle', 'items', function(pwArrayToggle, items) {
  return {
    restrict: 'E',
    templateUrl: 'modules/shows/directives/pw-show-list/pw-category/pw-category-item.html',
		scope: {
			tag: '=',
		},
		require: '^pwShowList',
		link: function(scope, element, attrs, pwShowListCtrl) { 
			
			// we check if the user has selected items for edit
			scope.isEditMode = function () {
				return items.isEditMode();
			};
			
			
			// if no item is selected for edit, the user can toggle tags
			// for filtering items (inActiveTags is used for CSS)
			
			scope.toggleActiveTag = function() { 
        pwArrayToggle(pwShowListCtrl.activeTags, scope.tag.name);
      };
			
			scope.inActiveTags = function() { 
				return pwShowListCtrl.activeTags.indexOf(scope.tag.name) !== -1;
      };
			
			
			// if items are selected for edit, the user can add/remove tags
			// to all the selected items (inSelectedTags is used for CSS)
			
			scope.toggleSelectedTag = function () {
				return items.toggleTag(scope.tag.name);
			};
			
			scope.inSelectedTags = function () {
				return items.isInEditTags(scope.tag.name);
			};
			
    }

  };
}]);