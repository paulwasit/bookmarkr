'use strict';

angular.module('shows')
.directive('pwCardList', ['$state', 'Show', function($state, Show) {
  return {
		restrict: 'E',
		//replace: true,
    templateUrl: 'modules/shows/directives/pw-show-list/pw-card/pw-card-list.html',
		scope: {
			activeGenres: '=',
			search: '=',
			query: '='
		},
		controller: 'pwCardListCtrl',
		controllerAs: 'ctrl',
		link: function(scope, element, attrs) {
      scope.shows = Show.query({ fields: JSON.stringify(scope.query) });
			scope.$state = $state;
    }
  };
}])

.controller('pwCardListCtrl', ['$scope', 'Show', function($scope, Show) {

	$scope.activeShows = [];
	$scope.activeShowsUpdate = {};
	
	$scope.$watch('activeShows', function (newVal, oldVal) {
		if (newVal === oldVal) { return; } //fired during ctrl init
		if (newVal.length === 0) {
			$scope.activeShowsUpdate = {};
			$scope.emptyPopover = $scope.emptyAllPopover;
		}
		else {
			$scope.activeShowsUpdate.archived = $scope.updateValue('archived');
			$scope.activeShowsUpdate.inTrash = $scope.updateValue('inTrash');
			$scope.activeShowsUpdate.favorite = $scope.updateValue('favorite');
			$scope.emptyPopover = $scope.emptySelectedPopover;
		}
	}, true);	
	
	/* if we select items that are not all favorites, we favorite the ones that are not */
	$scope.updateValue = function(field) {

		var len = $scope.shows.length, tmpValue;
		for (var i=0; i < len; i++) {
			if ($scope.activeShows.indexOf($scope.shows[i]._id)!==-1) {
				if (tmpValue === undefined) {
					tmpValue = $scope.shows[i][field];
				}
				else if ($scope.shows[i][field] !== tmpValue) {
					return true;
				}
			}
		}
		return !tmpValue;
		
	};
	
	// update DB then reload it
	this.updateSelectedItems = function (field) {
		
		/* when direct click on an item button, the watch event is not fired so we have to manually evaluate the proper update value */
		var query = {};
		query[field] = $scope.activeShowsUpdate[field] || $scope.updateValue(field); 
		
		Show.update({ fields: JSON.stringify(query) }, { shows: JSON.stringify($scope.activeShows) })
		.$promise
		.then(function(res){
			$scope.updateShows();
		}).catch(function(e){
			console.log(e);
		});
		
		$scope.activeShows = []; 
		
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
	
	$scope.emptyAllPopover = {
		templateUrl: 'modules/shows/directives/pw-show-list/pw-card/myPopoverTemplate.html',
    content: 'You\'re about to permanently delete all the items in this folder.',
		button: 'Empty',
		fn: function () {
			$scope.togglePop();
		}
  };
	
	$scope.emptySelectedPopover = {
		templateUrl: 'modules/shows/directives/pw-show-list/pw-card/myPopoverTemplate.html',
    content: 'You\'re about to permanently delete all the selected items.',
		button: 'Empty',
		fn: function () {
			$scope.emptyTrash($scope.activeShows);
		}
  };
		
	$scope.emptyPopover = $scope.emptyAllPopover;
	
	$scope.updateShows = function () {
    Show.query({ fields: JSON.stringify($scope.query) }, function(data) {
      $scope.shows = data;
    });
  };
	
}]);