'use strict';

angular.module('items').directive('pwItemMenu', ['$injector', 'items',
function($injector, items) {
	
  return {
    restrict: 'E',
    templateUrl: 'modules/items/directives/pw-item-menu/pw-item-menu.html',
		scope: {
			item: '='
		},		
		link: function(scope, element, attrs) {
			
			// inject $injector
			var dbService = $injector.get(attrs.dbservice);
	
			scope.isEditMode = function () {
				return items.isEditMode();
			};
			
			scope.isInEditScope = function () {
				return items.isInEditScope(scope.item._id);
			};
			
			scope.toggle = function (callback) {
				items.toggleId(scope.item._id);
				if (callback !== undefined) {return callback();}
			};

			scope.clientUpdate = function (field) {
				// evalAsync: wait until the end of the current digest cycle to fire, so the previous cancel action has time to be complete
				scope.$evalAsync(function() {
					scope.toggle(function () {
						return items.clientUpdate(field);
					});
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