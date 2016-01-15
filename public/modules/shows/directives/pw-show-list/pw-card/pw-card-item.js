'use strict';

angular.module('shows').directive('pwCardItem', ['pwArrayToggle', function(pwArrayToggle) {
	
  return {
    restrict: 'E',
    templateUrl: 'modules/shows/directives/pw-show-list/pw-card/pw-card-item.html',
		scope: {
			activeShows: '=',
      show: '='
    },
		require: ['^pwShowList', '^pwCardList'],
		link: function(scope, element, attrs, ctrls) { 
			
			var pwShowListCtrl = ctrls[0],
					pwCardListCtrl = ctrls[1];
			
			scope.toggle = function(field, value) {
				if (field === 'genres') return pwArrayToggle(pwShowListCtrl.activeGenres, value);
				if (field === 'shows') return pwArrayToggle(scope.activeShows, value);
			};
			
			scope.isActive = function(field, value) {
				if (field === 'genres') return pwShowListCtrl.activeGenres.indexOf(value) !== -1;
				if (field === 'shows') return scope.activeShows.indexOf(value) !== -1;
			};
			
			// actions on click
			scope.updateItem = function(field) {
				if (scope.activeShows.length === 0) {
					scope.activeShows.push(scope.show._id);
				}
				pwCardListCtrl.updateSelectedItems(field);
			};
			
    }
  };
	
}]);
