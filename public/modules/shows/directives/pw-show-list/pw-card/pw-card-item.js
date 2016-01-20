'use strict';

angular.module('shows').directive('pwCardItem', ['pwArrayToggle', 'Show', 'Notification', function(pwArrayToggle, Show, Notification) {
	
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
				if (field === 'shows') {
					scope.disabled = !scope.disabled;
					if (scope.disabled) {
						var show = scope.show;
						show.$update(
							function() {
								Notification.success('article successfully updated');
							}, 
							function(errorResponse) {
								scope.error = errorResponse.data.message;
								Notification.error(scope.error);
							});
					}
					return pwArrayToggle(scope.activeShows, value);
				}
			};
			
			scope.isActive = function(field, value) {
				if (field === 'genres') return pwShowListCtrl.activeGenres.indexOf(value) !== -1;
				if (field === 'shows') return scope.activeShows.indexOf(value) !== -1;
			};

			scope.disabled = true;
			scope.availableTags = ['Comedy', 'Crime', 'Drama', 'Mystery', 'Romance', 'Suspense', 'Thriller'];
			
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