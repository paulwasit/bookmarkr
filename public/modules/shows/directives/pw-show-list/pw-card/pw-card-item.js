'use strict';

angular.module('shows').directive('pwCardItem', ['pwArrayToggle', 'Show', 'Notification', function(pwArrayToggle, Show, Notification) {
	
  return {
    restrict: 'E',
    templateUrl: 'modules/shows/directives/pw-show-list/pw-card/pw-card-item.html',
		scope: {
			selectedIds: '=',
      show: '='
    },
		require: ['^pwShowList', '^pwCardList'],
		link: function(scope, element, attrs, ctrls) { 
			
			scope.inProg = false;
			
			var pwShowListCtrl = ctrls[0],
					pwCardListCtrl = ctrls[1];
			
			scope.toggle = function(field, value) {
				if (field === 'genres') return pwArrayToggle(pwShowListCtrl.activeTags, value);
				if (field === 'shows') {
					/*
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
					*/
					
					return pwArrayToggle(scope.selectedIds, value);
				}
			};
			
			scope.isActive = function(field, value) {
				if (field === 'genres') return pwShowListCtrl.activeTags.indexOf(value) !== -1;
				if (field === 'shows') return scope.selectedIds.indexOf(value) !== -1;
			};
			
			scope.updateItem = function (field) {
				if (scope.selectedIds.length === 0) {
					pwCardListCtrl.updateSelectedItems(field, scope.show._id);
				}
				else {
					pwCardListCtrl.updateSelectedItems(field);
				}
			};
			
			scope.cancelUpdateItem = function () {
				pwCardListCtrl.cancelSelectedItems();
			};
			
			scope.saveUpdateItem = function (field) {
				pwCardListCtrl.saveSelectedItems(field);
			};
			
    }
  };
	
}]);