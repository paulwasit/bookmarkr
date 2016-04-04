'use strict';

angular.module('items').directive('pwNavbarMenu', ['$injector', 'items',
function($injector, items) {

  return {
    restrict: 'E',
    templateUrl: 'modules/items/directives/pw-navbar-menu/pw-navbar-menu.html',
		scope: {},		
		link: function(scope, element, attrs) {
			
			// inject $injector
			var dbService = $injector.get(attrs.dbservice);
	
			scope.isEditMode = function () {
				return items.isEditMode();
			};
			
			// update navbar labels according to query value (archive/unarchive, etc)
			scope.queryValue = function (field) {
				return items.queryValue(field);
			};
			
			scope.clientUpdate = function (field) {
				// evalAsync: wait until the end of the current digest cycle to fire, so the previous cancel action has time to be complete
				scope.$evalAsync(function() {
					return items.clientUpdate(field);
				});
			};
			
			scope.serverUpdate = function (field) {
				var params = items.serverUpdateParams(field);
				dbService.update(params.query, params.body);
			};
			
			scope.cancelUpdate = function () {
				return items.cancelUpdate();
			};
			
    }
  };
	
}]);