'use strict';

angular.module('shows')
.directive('pwTagItem', ['pwArrayToggle', function(pwArrayToggle) {
  return {
    restrict: 'E',
    templateUrl: 'modules/shows/directives/pw-show-list/pw-category/pw-category-item.html',
		scope: {
			tag: '=',
		},
		require: '^pwShowList',
		link: function(scope, element, attrs, pwShowListCtrl) { 
      
			scope.toggleTag = function() { 
        pwArrayToggle(pwShowListCtrl.activeTags, scope.tag.name);
      };
			
			scope.inActiveTags = function() { 
				return pwShowListCtrl.activeTags.indexOf(scope.tag.name) !== -1;
      };
			
			scope.isEditMode = function () {
				if (pwShowListCtrl.selectedTags.length > 0) {return true;}
				return false;
			};
			
			scope.inSelectedTags = function () {
				for (var i=0, len=pwShowListCtrl.selectedTags.length; i<len;i++) {
					if (pwShowListCtrl.selectedTags[i].name === scope.tag.name) {
						return pwShowListCtrl.selectedTags[i].count;
					}
				}
				return false;
			};
			
    }

  };
}]);