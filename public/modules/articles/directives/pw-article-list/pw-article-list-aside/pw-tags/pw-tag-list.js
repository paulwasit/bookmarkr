'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwTagList', function($uibModal, Items) {
		return {
			restrict: 'AE',
			template: require('./pw-tag-list.html'),
			scope: {
				tags: '=',
				isAsideCollapsed: '='
			},
			link: function(scope, element, attrs) {
				
				// action on click-outside
				scope.closeThis = function () { scope.isAsideCollapsed = true; };
				
				scope.isEditMode = function () {
					return Items.isEditMode();
				};
				
				/*
				scope.toggleSelectedTag = function (callback) {
					Items.toggleTag(scope.tag.name);
					if (callback !== undefined) {return callback();}
				};
				*/
				
				// Rename Tab
				scope.renameTag = function () {
					var modalInstance = $uibModal.open({
						animation: false,
						//scope: scope,
						template: 
							'<div class="modal-body">' +
								'<div class="form-group">' +
									'<label>Tag Name:</label>' +
									'<input type="text" ng-model="newTitle" class="form-control">' +
								'</div>' +
							'</div>' +
							'<div class="modal-footer">' +
								'<button class="btn btn-primary" type="button" pw-cancel-action="serverUpdate(\'tags\')" pw-cancel="cancelUpdate()" pw-inprog="clientUpdate(\'tags\')">OK</button>' + //pw-cancel-action="serverUpdate(\'tags\')" pw-cancel="cancelUpdate()" pw-inprog="clientUpdate(\'tags\')
								'<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' +
							'</div>',
						controller: function ($scope, $uibModalInstance, title, Items, Articles) {
							$scope.newTitle = title;
							$scope.ok = function () {
								$uibModalInstance.close($scope.newTitle);
							};
							$scope.cancel = function () {
								$uibModalInstance.dismiss('cancel');
							};
							
							$scope.toggleSelectedTag = function (callback) {
								Items.toggleTag($scope.newTitle);
								if (callback !== undefined) {return callback();}
							};
							
							$scope.clientUpdate = function (field) {
								$uibModalInstance.close($scope.newTitle);
								/*
								$scope.tags.push({
									name: $scope.newTitle,
									count: 0
								});
								*/
								console.log('clientNew');
								// evalAsync: wait until the end of the current digest cycle to fire, so the previous cancel action has time to be complete
								
								$scope.$evalAsync(function() {
									$scope.toggleSelectedTag(function () {
										return Items.clientUpdate(field);
									});
								});
								
							};
							
							$scope.serverUpdate = function (field) {
								console.log('server');
								var params = Items.serverUpdateParams(field);
								//dbService.update(params.query, params.body);
								Articles.update(params.query, params.body);
							};
							
							$scope.cancelUpdate = function () {
								return Items.cancelUpdate();
							};
							
						},
						size: 'sm',
						resolve: {
							title: function () {
								//return scope.newTag.name;
								return 'new tag';
							}
						}
					});
					modalInstance.result.then(function (newTitle) {
						//scope.newTag.name = newTitle;
						/*
						scope.tags.push({
							name: newTitle,
							count: 0
						});
						*/
					}, function () {});

				};
				
			}		
		};
	});
	
};