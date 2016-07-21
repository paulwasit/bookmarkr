'use strict';

module.exports = function (ngModule) {
	
	require('../../../_misc/pw-cancel-action/pw-cancel-action')(ngModule);
	
	ngModule.directive('pwNavbarMenu', function($injector, Items) {

		return {
			restrict: 'E',
			template: require('./pw-navbar-menu.html'),
			scope: {},		
			link: function(scope, element, attrs) {
				
				// inject $injector
				var dbService = $injector.get(attrs.dbservice);
				
				// collections list
				scope.collections = ["javascript","r","algorithms","datascience", "projects", "misc"];
				
				scope.isEditMode = function () {
					return Items.isEditMode();
				};
				
				// update navbar labels according to query value (archive/unarchive, etc)
				scope.queryValue = function (field) {
					return Items.queryValue(field);
				};
				
				scope.clientUpdate = function (field, newValue) {
					// evalAsync: wait until the end of the current digest cycle to fire, so the previous cancel action has time to be complete
					scope.$evalAsync(function() {
						return Items.clientUpdate(field, newValue);
					});
				};
				
				scope.serverUpdate = function (field, newValue) {
					var params = Items.serverUpdateParams(field, newValue);
					dbService.update(params.query, params.body);
				};
				
				scope.cancelUpdate = function () {
					return Items.cancelUpdate();
				};
				
			}
		};
		
	});
	
};