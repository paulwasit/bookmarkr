'use strict';

angular.module('users.admin')
.directive('pwUsersList', ['$filter', 'Admin',
function($filter, Admin) {
  return {
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-users-admin/pw-users-list/pw-users-list.html',
		scope: {},
		link: function(scope, element, attrs) {
			
			Admin.query(function (data) {
				scope.users = data;
				scope.buildPager();
			});

			scope.buildPager = function () {
				scope.pagedItems = [];
				scope.itemsPerPage = 15;
				scope.currentPage = 1;
				scope.figureOutItemsToDisplay();
			};

			scope.figureOutItemsToDisplay = function () {
				scope.filteredItems = $filter('filter')(scope.users, {
					$: scope.search
				});
				scope.filterLength = scope.filteredItems.length;
				var begin = ((scope.currentPage - 1) * scope.itemsPerPage);
				var end = begin + scope.itemsPerPage;
				scope.pagedItems = scope.filteredItems.slice(begin, end);
			};

			scope.pageChanged = function () {
				scope.figureOutItemsToDisplay();
			};
			
    }
		
  };
}]);