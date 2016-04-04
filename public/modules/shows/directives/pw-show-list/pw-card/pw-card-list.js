'use strict';

angular.module('shows')
.directive('pwCardList', ['$state', 'Show', function($state, Show) {
  return {
		restrict: 'E',
		//replace: true,
    templateUrl: 'modules/shows/directives/pw-show-list/pw-card/pw-card-list.html',
		scope: {
			items: '=',
			activeTags: '=',
			search: '='
		},
		controller: 'pwCardListCtrl',
		controllerAs: 'ctrl',
		link: function(scope, element, attrs) {
			scope.$state = $state;
    }
  };
}])

.controller('pwCardListCtrl', ['$scope', '$timeout', 'Show', 'items', function($scope, $timeout, Show, items) {

	$scope.isEditMode = function () {
		return items.isEditMode();
	};
	
	$scope.$on('itemsUpdate', function(event, items) {
		$scope.$evalAsync(function() {
			$scope.items = items;
		});
	});
	
	// delete selected DB item then reload it
	$scope.emptyTrash = function (items) {
		
		var query = {};
		query.inTrash = true; 
		items = items || [];

		Show.delete({ fields: JSON.stringify(query), shows: JSON.stringify(items) })
		.$promise
		.then(function(res){
			$scope.updateShows();
		}).catch(function(e){
			console.log(e);
		});
		
		$scope.activeShows = []; 
		
	};
	
	$scope.emptyPopover = $scope.emptyAllPopover;

	// popover template when no items are selected
	$scope.emptyAllPopover = {
		templateUrl: 'modules/shows/directives/pw-show-list/pw-card/myPopoverTemplate.html',
    content: 'You\'re about to permanently delete all the items in this folder.',
		button: 'Empty',
		fn: function () {
			$scope.emptyTrash();
		}
  };
	
	// popover template when some items are selected
	$scope.emptySelectedPopover = {
		templateUrl: 'modules/shows/directives/pw-show-list/pw-card/myPopoverTemplate.html',
    content: 'You\'re about to permanently delete all the selected items.',
		button: 'Empty',
		fn: function () {
			$scope.emptyTrash($scope.activeShows);
		}
  };
	
	
}]);