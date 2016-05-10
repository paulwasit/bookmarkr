'use strict';

module.exports = function (ngModule) {
	
	require('../../../_misc/pw-cancel-action/pw-cancel-action')(ngModule);
	
	ngModule.directive('pwItemMenu', function($injector, Items) {
		
		return {
			restrict: 'E',
			template: require('./pw-item-menu.html'),
			scope: {
				item: '='
			},		
			link: function(scope, element, attrs) {
				
				// inject $injector
				var dbService = $injector.get(attrs.dbservice);
				
				scope.isEditMode = function () {
					return Items.isEditMode();
				};
				
				scope.isInEditScope = function () {
					return Items.isInEditScope(scope.item._id);
				};
				
				scope.toggle = function (callback) {
					Items.toggleId(scope.item._id);
					if (callback !== undefined) {return callback();}
				};

				scope.clientUpdate = function (field) {
					// evalAsync: wait until the end of the current digest cycle to fire, so the previous cancel action has time to be complete
					scope.$evalAsync(function() {
						scope.toggle(function () {
							return Items.clientUpdate(field);
						});
					});
				};
				
				scope.serverUpdate = function (field) {
					var params = Items.serverUpdateParams(field);
					dbService.update(params.query, params.body);
				};
				
				scope.cancelUpdate = function () {
					return Items.cancelUpdate();
				};
				
			}
		};
		
	});
	
	};