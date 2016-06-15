'use strict';

// exports
module.exports = function (modalTitle, titleVar) {
	return {
		animation: false,
		template: 
			'<div class="modal-body">' +
				'<div class="form-group">' +
					'<label>' + modalTitle + ':</label>' +
					'<input type="text" ng-model="newTitle" class="form-control">' +
				'</div>' +
			'</div>' +
			'<div class="modal-footer">' +
				'<button class="btn btn-primary" type="button" ng-disabled="checkTitle" ng-click="ok()">OK</button>' +
				'<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' +
			'</div>',
		controller: ['$scope','$uibModalInstance','title',function ($scope, $uibModalInstance, title) {
			$scope.newTitle = title;
			$scope.$watch('newTitle', function(newValue, oldValue) {
				$scope.checkTitle = $scope.newTitle === '' ? true : false;
			});
			$scope.ok = function () {
				$uibModalInstance.close($scope.newTitle);
			};
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		}],
		size: 'sm',
		resolve: {
			title: function () {
				return titleVar;
			}
		}
	};
};