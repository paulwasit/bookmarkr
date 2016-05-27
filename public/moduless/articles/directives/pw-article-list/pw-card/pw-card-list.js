'use strict';

module.exports = function (ngModule) {
	
	require('../../../../_misc/filters')(ngModule);
	require('../../../../items/directives/pw-navbar-menu/pw-navbar-menu')(ngModule);
	
	ngModule.directive('pwCardList', function($state, Articles) {
		return {
			restrict: 'E',
			//replace: true,
			template: require('./pw-card-list.html'),
			scope: {
				items: '=',
				activeTags: '=',
				search: '='
			},
			controller: 'pwCardListCtrl',
			controllerAs: 'ctrl',
			link: function(scope, element, attrs) {
				scope.$state = $state;
				//scope.items = ['item 1', 'item 2'];
			}
		};
	})

	.controller('pwCardListCtrl', function($scope, $timeout, Articles, Items) {
	
		/*
		$scope.$on('itemsUpdate', function(event, items) {
			$scope.$evalAsync(function() {
				$scope.items = items;
			});
		});
		*/
		
		// delete selected DB item then reload it
		$scope.emptyTrash = function (items) {
			
			var query = {};
			query.inTrash = true; 
			items = items || [];

			Articles.delete({ fields: JSON.stringify(query), items: JSON.stringify(items) })
			.$promise
			.then(function(res){
				$scope.updateItems();
			}).catch(function(e){
				console.log(e);
			});
			
			$scope.activeItems = []; 
			
		};
		
		// popover template when no items are selected
		$scope.emptyAllPopover = {
			templateUrl: 'moduless/articles/directives/pw-article-list/pw-card/myPopoverTemplate.html',
			content: 'You\'re about to permanently delete all the items in this folder.',
			button: 'Empty',
			fn: function () {
				$scope.emptyTrash();
			}
		};
		
		// popover template when some items are selected
		$scope.emptySelectedPopover = {
			templateUrl: 'moduless/articles/directives/pw-article-list/pw-card/myPopoverTemplate.html',
			content: 'You\'re about to permanently delete all the selected items.',
			button: 'Empty',
			fn: function () {
				$scope.emptyTrash($scope.activeItems);
			}
		};
		
		$scope.isEditMode = function () {
			var isEditMode = Items.isEditMode();
			$scope.emptyPopover = (isEditMode === true) ? $scope.emptySelectedPopover : $scope.emptyAllPopover;
			return isEditMode;
		};
		
		//$scope.emptyPopover = $scope.emptyAllPopover;
		
	});
	
};
	
	