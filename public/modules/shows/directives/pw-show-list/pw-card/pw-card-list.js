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
			selectedTags: '=',
			search: '='
		},
		controller: 'pwCardListCtrl',
		controllerAs: 'ctrl',
		link: function(scope, element, attrs) {
			scope.$state = $state;
    }
  };
}])

.controller('pwCardListCtrl', ['$scope', '$timeout', 'Show', 'itemUpdate', function($scope, $timeout, Show, itemUpdate) {

	$scope.tempInfo = {};     // array of items - backup for cancel action
	$scope.selectedIds = [];  // array of items Id selected for bulk edit
	$scope.updateQuery = {};  // query passed to the DB to update the selected items

	$scope.emptyPopover = $scope.emptyAllPopover;

	
	// when we select items for bulk edit, we update the query based on their current state. See the itemUpdate service for more details
	$scope.$watchCollection('selectedIds', function (newVal, oldVal) {

		if (newVal === oldVal) { return; } //fired during ctrl init
		
		if (newVal.length === 0) {
			$scope.updateQuery = {};
			$scope.selectedTags = [];
			$scope.emptyPopover = $scope.emptyAllPopover;
		}
		else {
			$scope.updateQuery = itemUpdate.getNewBooleanState ($scope.items, $scope.selectedIds, '_id', ['archived', 'inTrash', 'favorite']);
			$scope.selectedTags = itemUpdate.getTagsBooleanState($scope.items, $scope.selectedIds, '_id', 'genre');
			$scope.emptyPopover = $scope.emptySelectedPopover;
			console.log($scope.updateQuery.tags);
		}
		
	});	
	
	
	// function that updates data client side
	this.updateSelectedItems = function (field, isUniqueValue) {
		
		// wait until the end of the current digest cycle to fire, so the previous cancel action has time to be complete
		$scope.$evalAsync(
			function() {
				$scope.tempInfo.items = angular.copy ($scope.items);
				if (isUniqueValue) {
					$scope.tempInfo.selected = [isUniqueValue]; 
					$scope.tempInfo.query = itemUpdate.getNewBooleanState ($scope.items, $scope.tempInfo.selected, '_id', ['archived', 'inTrash', 'favorite']);
				}
				else {
					$scope.tempInfo.selected = angular.copy ($scope.selectedIds); 
					$scope.tempInfo.query = angular.copy ($scope.updateQuery);
				}
				$scope.items = itemUpdate.updateItems ($scope.items, $scope.tempInfo.selected, '_id', field, $scope.tempInfo.query[field]);
				$scope.selectedIds = [];
			}
		);

  };

	
	// function that update data server side
	this.saveSelectedItems = function (field) {

		var query = {};
		query [field] = $scope.tempInfo.query[field];
		Show.update({ fields: JSON.stringify(query) }, { shows: JSON.stringify($scope.tempInfo.selected) });

		$scope.tempInfo = {};
		
	};
	
	
	this.cancelSelectedItems = function () {
		$scope.items = $scope.tempInfo.items;
		$scope.tempInfo = {};	
	};
	
	
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